import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Header component displayed at the top of dashboard pages.
 * Shows the app title and user information.
 *
 * @returns JSX element with header content
 */
export async function Header() {
  const user = await currentUser();

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-kid-blue-700">Math Tutor 🎓</h1>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-lg font-medium text-gray-700">
            {user.firstName}
          </span>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
