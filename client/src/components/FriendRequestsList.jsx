import { getFriendRequests } from "@/api/user.api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { FriendRequestCard } from "./FriendRequestCard";

export const FriendRequestsList = () => {
  const {
    data: friendRequests,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return <p role="status">Loading friend requests...</p>;
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3" role="alert">
        <p>Unable to load friend requests.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          Retry
        </Button>
      </div>
    );
  }

  const incomingRequests = friendRequests?.incomingFriendRequests ?? [];
  const outgoingRequests = friendRequests?.outgoingFriendRequests ?? [];

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3" aria-labelledby="incoming-heading">
        <h2 id="incoming-heading" className="text-xl font-semibold">
          Incoming requests
        </h2>
        {incomingRequests.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {incomingRequests.map((request) => (
              <FriendRequestCard
                key={request._id}
                request={request}
                direction="incoming"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No incoming friend requests.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="outgoing-heading">
        <h2 id="outgoing-heading" className="text-xl font-semibold">
          Sent requests
        </h2>
        {outgoingRequests.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {outgoingRequests.map((request) => (
              <FriendRequestCard
                key={request._id}
                request={request}
                direction="outgoing"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No outgoing friend requests.
          </p>
        )}
      </section>
    </div>
  );
};
