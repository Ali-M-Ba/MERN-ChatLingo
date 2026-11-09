import { cancelFriendRequest } from "@/api/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

export const CancelFriendRequestButton = ({ user }) => {
  const queryClient = useQueryClient();

  const {
    mutate: cancelFriendRequestMutation,
    isPending: isCancellingFriendRequest,
  } = useMutation({
    mutationFn: () => cancelFriendRequest(user._id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["relationshipStatus", user._id],
      });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
    },
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
