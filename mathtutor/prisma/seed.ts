import { PrismaClient } from "@prisma/client";
import curriculum from "../lib/content.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding curriculum data...");

  // When DB is connected, this will load curriculum from content.json
  // For now, just template to show structure
  console.log("📚 Curriculum structure:", {
    numLessons: curriculum.lessons.length,
    lessons: curriculum.lessons.map((l) => ({
      title: l.title,
      itemCount: l.items.length,
    })),
  });

  console.log("✅ Seed template ready for database integration");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
