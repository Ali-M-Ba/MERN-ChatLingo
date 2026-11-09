import { rejectFriendRequest } from "@/api/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

export const RejectFriendRequestButton = ({ user, friendRequestId }) => {
  const queryClient = useQueryClient();

  const { mutate: reject, isPending } = useMutation({
    mutationFn: () => rejectFriendRequest(friendRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["relationshipStatus", user._id],
      });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error rejecting friend request",
      );
      console.error("Error rejecting friend request:", error);
    },
  });

  return (
    <Button
      variant="destructive"
      onClick={() => reject()}
      disabled={isPending || !friendRequestId}
    >
      {isPending ? "Rejecting..." : "Reject"}
    </Button>
  );
};
