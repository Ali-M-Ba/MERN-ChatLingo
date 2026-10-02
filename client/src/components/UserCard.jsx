import React from "react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import { sendFriendRequest } from "@/api/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const UserCard = ({ user, isSent }) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, data, isSuccess, isError, error } =
    useMutation({
      mutationFn: () => sendFriendRequest(user._id),
      onSuccess: ({ friendRequest, message }) => {
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
        queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Error sending friend request",
        );
        console.error("Error sending friend request:", error);
      },
    });

  return (
    <Card className="w-full max-w-sm p-3">
      <div className="flex items-start justify-between gap-3">
        {/* User Info */}
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage
              src={user.avatar}
              alt={user.name}
              className="grayscale"
            />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h3 className="truncate font-semibold leading-tight">
              {user.name}
            </h3>
            <p className="text-xs text-muted-foreground">{user.location}</p>
          </div>
        </div>

        {/* Language Badges */}
        <div className="flex flex-col items-end gap-1 pt-1">
          <Badge className="px-1.5 py-0.5 text-[9px] leading-none">
            Native: {user.nativeLanguage}
          </Badge>
          <Badge
            className="px-1.5 py-0.5 text-[9px] leading-none"
            variant="secondary"
          >
            Learning: {user.learningLanguage}
          </Badge>
        </div>
      </div>

      <Button
        className="mt-3 w-full"
        onClick={() => mutateAsync()}
        disabled={isPending || isSent || isSuccess}
      >
        <UserRoundPlus />
        {isSent || isSuccess ? "Request Sent" : "Send A Friend Request"}
      </Button>
    </Card>
  );
};

export default UserCard;
