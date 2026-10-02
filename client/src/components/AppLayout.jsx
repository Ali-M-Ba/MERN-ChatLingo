import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";

function AppLayout({ isAuthenticated, user }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader isAuthenticated={isAuthenticated} user={user} />

      <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
