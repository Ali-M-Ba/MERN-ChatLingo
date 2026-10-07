import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Button } from "./ui/button";
import { sendFriendRequest } from "@/api/user.api";
import toast from "react-hot-toast";

export const SendFriendRequestButton = ({ user, onSent }) => {
  const {
    mutateAsync: sendFriendRequestMutation,
    isPending: isSendingFriendRequest,
    isSuccess: isFriendRequestSent,
  } = useMutation({
    mutationFn: () => sendFriendRequest(user._id),
    onSuccess: () => onSent(),
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error sending friend request",
      );
      console.error("Error sending friend request:", error);
    },
  });
  return (
    <Button
      variant=""
      onClick={() => sendFriendRequestMutation()}
      disabled={isSendingFriendRequest}
    >
      Send Friend Request
    </Button>
  );
};
