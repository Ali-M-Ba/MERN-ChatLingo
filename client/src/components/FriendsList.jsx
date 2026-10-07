import { getFriends } from "@/api/user.api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import UserCard from "./UserCard";

export const FriendsList = () => {
  const { data: friends, isLoading: isFriendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const friendsList = friends?.friends ?? [];
  return (
    <div className="flex flex-col gap-3">
      {isFriendsLoading ? (
        <p>Loading friends...</p>
      ) : friendsList.length ? (
        <div className="grid grid-cols-3 gap-3">
          {friendsList.map((friend) => (
            <UserCard key={friend._id} user={friend} />
          ))}
        </div>
      ) : (
        <p className="m-auto">No friends yet.</p>
      )}
    </div>
  );
};
