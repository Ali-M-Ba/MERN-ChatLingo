import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { UsersRound } from "lucide-react";
import UserCard from "@/components/UserCard";
import { useQuery } from "@tanstack/react-query";
import {
  getFriendRequests,
  getFriends,
  getRecommendedUsers,
} from "@/api/user.api";

const HomePage = () => {
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const outgoingFriendRequests = friendRequests?.outgoingFriendRequests ?? [];

  const { data: recommendedUsers, isLoading: isRecommendedUsersLoading } =
    useQuery({
      queryKey: ["recommendedUsers"],
      queryFn: getRecommendedUsers,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  const { data: friends, isLoading: isFriendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const friendsList = friends?.friends ?? [];

  return (
    <main className="flex flex-col gap-8">
      <section
        className="flex flex-col gap-4"
        aria-labelledby="friends-heading"
      >
        <header className="flex w-full items-center justify-between gap-3">
          <h2 id="friends-heading" className="text-2xl font-bold">
            Your friends
          </h2>
          <Button onClick={() => toast("Feature coming soon!")}>
            <UsersRound aria-hidden="true" />
            <span>Friend Requests</span>
          </Button>
        </header>

        {isFriendsLoading ? (
          <p>Loading friends...</p>
        ) : friendsList.length ? (
          <div className="grid grid-cols-3 gap-3">
            {friendsList.map((friend) => (
              <UserCard key={friend._id} user={friend} />
            ))}
          </div>
        ) : (
          <p>No friends yet.</p>
        )}
      </section>

      <section
        className="flex flex-col gap-3"
        aria-labelledby="learners-heading"
      >
        <header className="flex flex-col gap-1">
          <h2 id="learners-heading" className="text-xl font-semibold">
            Meet New Learners
          </h2>
          <p className="text-sm text-muted-foreground">
            Discover and connect with new learners!
          </p>
        </header>
      </section>

      {isRecommendedUsersLoading ? (
        <p>Loading learners...</p>
      ) : recommendedUsers?.length ? (
        <div className="grid grid-cols-3 gap-3">
          {recommendedUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              isSent={outgoingFriendRequests.some(
                (request) => request.recipient?._id === user._id,
              )}
            />
          ))}
        </div>
      ) : (
        <p>No recommended users at the moment.</p>
      )}
    </main>
  );
};

export default HomePage;
