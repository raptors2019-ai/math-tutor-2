import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-kid-blue-50 to-kid-purple-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-kid-blue-700">Math Tutor 🎓</h1>
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-gray-700">
            {user?.firstName}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
