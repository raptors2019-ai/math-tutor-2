import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Helper function for retries (use this in API routes before queries)
export async function connectWithRetry() {
  const maxRetries = 5;
  const retryDelay = 2000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prismaClient.$connect();
      console.log(`Prisma connected successfully on attempt ${attempt}`);
      return; // Success!
    } catch (error) {
      console.error(`Prisma connection attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw error; // Rethrow after last retry
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
  throw new Error("Failed to connect after retries");
}

export const prisma = prismaClient;

/**
 * Disconnect Prisma client only in production environments.
 * In development, connections are reused for performance.
 * In production (Vercel/Netlify), connections are properly cleaned up.
 */
export async function disconnectPrisma() {
  if (process.env.NODE_ENV === "production") {
    await prisma.$disconnect().catch(() => {});
  }
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
