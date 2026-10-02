import { getAuthUser } from "@/api/auth.api";
import { useQuery } from "@tanstack/react-query";

const useUserAuth = () => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["userAuth"],
    queryFn: async () => {
      try {
        const user = await getAuthUser();
        return user ?? null;
      } catch (err) {
        const status = err?.response?.status;

        if (status === 401 || status === 403) {
          return null;
        }

        throw err;
      }
    },
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    isLoading,
    data,
    isError,
    error,
    user: data?.user ?? null,
    isAuthenticated: !!data?.user,
  };
};

export default useUserAuth;
