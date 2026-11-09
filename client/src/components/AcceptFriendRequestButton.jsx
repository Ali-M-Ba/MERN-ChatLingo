import { acceptFriendRequest } from "@/api/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

export const AcceptFriendRequestButton = ({ user, friendRequestId }) => {
  const queryClient = useQueryClient();

  const { mutate: accept, isPending } = useMutation({
    mutationFn: () => acceptFriendRequest(friendRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["relationshipStatus", user._id],
      });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error accepting friend request",
      );
      console.error("Error accepting friend request:", error);
    },
  });

  return (
    <Button
      variant="secondary"
      onClick={() => accept()}
      disabled={isPending || !friendRequestId}
    >
      {isPending ? "Accepting..." : "Accept Friend Request"}
    </Button>
  );
};
