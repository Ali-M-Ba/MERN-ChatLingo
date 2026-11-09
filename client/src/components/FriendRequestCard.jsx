import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AcceptFriendRequestButton } from "./AcceptFriendRequestButton";
import { CancelFriendRequestButton } from "./CancelFriendRequestButton";
import { Card } from "./ui/card";
import { RejectFriendRequestButton } from "./RejectFriendRequestButton";

export const FriendRequestCard = ({ request, direction }) => {
  const isIncoming = direction === "incoming";
  const user = isIncoming ? request.sender : request.recipient;

  return (
    <Card className="w-full gap-4 p-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold leading-tight">{user.name}</h3>
          {user.username && (
            <p className="truncate text-xs text-muted-foreground">
              @{user.username}
            </p>
          )}
          {user.location && (
            <p className="truncate text-xs text-muted-foreground">
              {user.location}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {user.nativeLanguage && (
          <Badge className="px-1.5 py-0.5 text-[9px] leading-none">
            Native: {user.nativeLanguage}
          </Badge>
        )}
        {user.learningLanguage && (
          <Badge
            className="px-1.5 py-0.5 text-[9px] leading-none"
            variant="secondary"
          >
            Learning: {user.learningLanguage}
          </Badge>
        )}
      </div>

      {isIncoming ? (
        <div className="flex flex-wrap gap-2">
          <AcceptFriendRequestButton
            user={user}
            friendRequestId={request._id}
          />
          <RejectFriendRequestButton
            user={user}
            friendRequestId={request._id}
          />
        </div>
      ) : (
        <CancelFriendRequestButton user={user} />
      )}
    </Card>
  );
};
