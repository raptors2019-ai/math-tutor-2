import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma, disconnectPrisma } from "@/lib/prisma";

/**
 * GET /api/admin/analytics
 *
 * Fetch aggregated analytics data for admin dashboard
 * Only accessible to the admin user (checked via Clerk ID)
 */

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get admin Clerk ID from env - if set and doesn't match, deny access
    const adminClerkId = process.env.NEXT_PUBLIC_ADMIN_CLERK_ID;
    if (adminClerkId && userId !== adminClerkId) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // If no admin ID set in env, only allow if user is authenticated
    // (for development - set NEXT_PUBLIC_ADMIN_CLERK_ID in production)
    if (!adminClerkId) {
      console.warn(
        "[Analytics] NEXT_PUBLIC_ADMIN_CLERK_ID not set - allowing all authenticated users"
      );
    }

    // Get date ranges
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all page views for aggregation
    const allPageViews = await prisma.pageView.findMany({
      select: { page: true, userId: true, timestamp: true },
    });

    // Get page views by date range
    const last7Days = allPageViews.filter((pv) => pv.timestamp >= sevenDaysAgo);
    const last30Days = allPageViews.filter((pv) => pv.timestamp >= thirtyDaysAgo);

    // Calculate metrics
    const totalViews = allPageViews.length;
    const views7Days = last7Days.length;
    const views30Days = last30Days.length;

    // Unique users
    const uniqueUsersAllTime = new Set(allPageViews.map((pv) => pv.userId))
      .size;
    const uniqueUsers7Days = new Set(last7Days.map((pv) => pv.userId)).size;
    const uniqueUsers30Days = new Set(last30Days.map((pv) => pv.userId)).size;

    // Top pages (all time)
    const pageViewsMap = new Map<string, number>();
    allPageViews.forEach((pv) => {
      pageViewsMap.set(pv.page, (pageViewsMap.get(pv.page) || 0) + 1);
    });

    const topPages = Array.from(pageViewsMap.entries())
      .map(([page, views]) => ({
        page,
        views,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Views by date (last 30 days)
    const viewsByDate = new Map<string, number>();
    last30Days.forEach((pv) => {
      const dateKey = pv.timestamp.toISOString().split("T")[0];
      viewsByDate.set(dateKey, (viewsByDate.get(dateKey) || 0) + 1);
    });

    const chartData = Array.from(viewsByDate.entries())
      .map(([date, views]) => ({
        date,
        views,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Recent activity (last 50)
    const recentViews = await prisma.pageView.findMany({
      take: 50,
      orderBy: { timestamp: "desc" },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        metrics: {
          totalViews,
          views7Days,
          views30Days,
          uniqueUsersAllTime,
          uniqueUsers7Days,
          uniqueUsers30Days,
        },
        topPages,
        chartData,
        recentActivity: recentViews.map((view) => ({
          id: view.id,
          page: view.page,
          user: view.user.email,
          userName:
            view.user.firstName || view.user.email.split("@")[0],
          timestamp: view.timestamp,
          duration: view.sessionDuration,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/admin/analytics]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await disconnectPrisma();
  }
}
