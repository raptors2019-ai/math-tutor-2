"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  metrics: {
    totalViews: number;
    views7Days: number;
    views30Days: number;
    uniqueUsersAllTime: number;
    uniqueUsers7Days: number;
    uniqueUsers30Days: number;
  };
  topPages: Array<{ page: string; views: number }>;
  chartData: Array<{ date: string; views: number }>;
  recentActivity: Array<{
    id: string;
    page: string;
    user: string;
    userName: string;
    timestamp: string;
    duration: number | null;
  }>;
}

/**
 * Admin Analytics Dashboard
 *
 * Displays key metrics about user activity:
 * - Total views and unique users
 * - Views over time (last 30 days)
 * - Most visited pages
 * - Recent user activity
 */
export default function AnalyticsDashboard() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      router.push("/");
      return;
    }

    fetchAnalytics();
  }, [isLoaded, userId, router]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");

      if (!res.ok) {
        if (res.status === 403) {
          setError("Admin access required");
          router.push("/");
          return;
        }
        throw new Error(`Failed to fetch analytics: ${res.status}`);
      }

      const analyticsData = await res.json();
      setData(analyticsData);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl"
        >
          📊
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-xl font-bold text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl font-bold">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-600">View user activity and engagement metrics</p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Total Views",
              value: data.metrics.totalViews,
              icon: "👁️",
            },
            {
              label: "Unique Users (All Time)",
              value: data.metrics.uniqueUsersAllTime,
              icon: "👥",
            },
            {
              label: "Views (Last 7 Days)",
              value: data.metrics.views7Days,
              icon: "📈",
            },
            {
              label: "Users (Last 7 Days)",
              value: data.metrics.uniqueUsers7Days,
              icon: "👤",
            },
            {
              label: "Views (Last 30 Days)",
              value: data.metrics.views30Days,
              icon: "📊",
            },
            {
              label: "Users (Last 30 Days)",
              value: data.metrics.uniqueUsers30Days,
              icon: "👨",
            },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md border-2 border-purple-200"
            >
              <div className="text-4xl mb-2">{metric.icon}</div>
              <p className="text-gray-600 text-sm font-semibold mb-2">
                {metric.label}
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {metric.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Views Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-md border-2 border-blue-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Views Over Time (Last 30 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-md border-2 border-green-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Top Pages
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topPages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-md border-2 border-yellow-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">User</th>
                  <th className="text-left py-3 px-4 font-semibold">Page</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Timestamp
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Duration (s)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.map((activity) => (
                  <tr
                    key={activity.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{activity.userName}</td>
                    <td className="py-3 px-4 font-mono text-xs text-purple-600">
                      {activity.page}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(activity.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {activity.duration
                        ? (activity.duration / 1000).toFixed(1)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchAnalytics}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}
