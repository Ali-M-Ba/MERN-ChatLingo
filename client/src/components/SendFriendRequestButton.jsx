import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { sendFriendRequest } from "@/api/user.api";
import toast from "react-hot-toast";

export const SendFriendRequestButton = ({ user }) => {
  const queryClient = useQueryClient();

  const {
    mutate: sendFriendRequestMutation,
    isPending: isSendingFriendRequest,
  } = useMutation({
    mutationFn: () => sendFriendRequest(user._id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["relationshipStatus", user._id],
      });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error sending friend request",
      );
      console.error("Error sending friend request:", error);
    },
  });
  return (
    <Button
      onClick={() => sendFriendRequestMutation()}
      disabled={isSendingFriendRequest}
    >
      Send Friend Request
    </Button>
  );
};
