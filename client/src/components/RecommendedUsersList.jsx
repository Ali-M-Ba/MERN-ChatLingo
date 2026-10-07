import { getRecommendedUsers } from "@/api/user.api";
import { useQuery } from "@tanstack/react-query";
import UserCard from "./UserCard";

export const RecommendedUsersList = () => {
  const {
    data,
    isLoading: isRecommendedUsersLoading,
  } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const recommendedUsers = data?.recommendedUsers ?? [];

  return (
    <div className="flex flex-col gap-3">
      {isRecommendedUsersLoading ? (
        <p>Loading learners...</p>
      ) : recommendedUsers?.length ? (
        <div className="grid grid-cols-3 gap-3">
          {recommendedUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
            />
          ))}
        </div>
      ) : (
        <p className="m-auto">No recommended users at the moment.</p>
      )}
    </div>
  );
};
