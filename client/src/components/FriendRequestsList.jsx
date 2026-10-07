import { getFriendRequests } from "@/api/user.api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import UserCard from "./UserCard";

export const FriendRequestsList = () => {
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return <div>
    {friendRequests?.incomingFriendRequests?.length ? (
      <div className="grid grid-cols-3 gap-3">
        {friendRequests.incomingFriendRequests.map((request) => (
          <UserCard key={request._id} user={request} />
        ))}
      </div>
    ) : (
      <p className="m-auto">No friend requests yet.</p>
    )}
  </div>;
};
