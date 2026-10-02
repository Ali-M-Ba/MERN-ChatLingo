import { Toaster } from "react-hot-toast";
import AppRoutes from "./components/AppRoutes";
import PageLoader from "./components/PageLoader";
import useUserAuth from "./hooks/useUserAuth";

function App() {
  const { user, isAuthenticated, isLoading, error } = useUserAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {error?.response?.data?.message ||
          "An error occurred. Please try again."}
      </div>
    );
  }

  return (
    <>
      <AppRoutes user={user} isAuthenticated={isAuthenticated} />
      <Toaster />
    </>
  );
}

export default App;
