import { cancelFriendRequest } from "@/api/user.api";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

export const CancelFriendRequestButton = ({ user, onCancelled }) => {
  const {
    mutateAsync: cancelFriendRequestMutation,
    isPending: isCancellingFriendRequest,
    isSuccess: isFriendRequestCancelled,
  } = useMutation({
    mutationFn: () => cancelFriendRequest(user._id),
    onSuccess: () => onCancelled(),
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error cancelling friend request",
      );
      console.error("Error cancelling friend request:", error);
    },
  });

  return (
    <Button
      variant="outline"
      onClick={() => cancelFriendRequestMutation()}
      disabled={isCancellingFriendRequest}
    >
      Cancel Friend Request
    </Button>
  );
};
