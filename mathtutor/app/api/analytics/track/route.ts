import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma, disconnectPrisma } from "@/lib/prisma";

/**
 * POST /api/analytics/track
 *
 * Track a page view for analytics
 * Only accessible to authenticated users (Clerk)
 */

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { page, sessionDuration } = body;

    if (!page || typeof page !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid page parameter" },
        { status: 400 }
      );
    }

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@clerk.local`,
        },
      });
    }

    // Record the page view
    await prisma.pageView.create({
      data: {
        userId: user.id,
        page,
        sessionDuration: sessionDuration || null,
      },
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/analytics/track]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await disconnectPrisma();
  }
}
