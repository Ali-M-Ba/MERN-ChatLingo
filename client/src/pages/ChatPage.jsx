import { getStreamToken } from "@/api/stream.api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Thread } from "stream-chat";
import PageLoader from "@/components/PageLoader";
import {
  Chat,
  useCreateChatClient,
  Channel,
  MessageList,
  MessageComposer,
  ChannelHeader,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import "./stream-overrides.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = ({ user }) => {
  const { id: targetUserId } = useParams();
  const [channel, setChannel] = useState(null);
  const [channelError, setChannelError] = useState(null);
  const currentUserId = user?._id?.toString() ?? user?.id?.toString();

  // Stream chat requires a signed token for the current user before we can connect.
  // The query key includes the user so we refetch if the logged-in user changes.
  const {
    data: tokenData,
    isLoading: isTokenLoading,
    isError: isTokenError,
    error: tokenError,
    refetch: refetchToken,
  } = useQuery({
    queryKey: ["streamToken", currentUserId],
    queryFn: getStreamToken,
    enabled: !!currentUserId,
  });

  // `useCreateChatClient` creates the chat client once we have the token. This is how
  // the app connects to Stream chat in a user-scoped way.
  const client = useCreateChatClient({
    apiKey: STREAM_API_KEY,
    tokenOrProvider: tokenData?.token,
    config: { client: { axiosRequestConfig: { timeout: 15000 } } },
    userData: currentUserId
      ? { id: currentUserId, name: user.name }
      : undefined,
  });

  useEffect(() => {
    if (!client || !currentUserId || !targetUserId) return;

    // This effect is responsible for opening the 1:1 DM channel for the selected user.
    // `cancelled` prevents stale async work from setting state after the route/user changes.
    let cancelled = false;
    let activeChannel;
    setChannel(null);
    setChannelError(null);

    if (currentUserId === targetUserId) {
      setChannelError(new Error("You cannot start a chat with yourself."));
      return () => {
        cancelled = true;
      };
    }

    // We sort the two IDs so both users end up with the same channel ID regardless of
    // who opened the chat first. This makes the DM room deterministic.
    const members = [currentUserId, targetUserId].sort();
    const channelId = `dm-${members.join("-")}`;
    const directChannel = client.channel("messaging", channelId, { members });

    // `watch()` subscribes to the DM channel and loads its messages. This is the moment the
    // app starts showing the live conversation for the selected user.
    directChannel
      .watch()
      .then((watchedChannel) => {
        activeChannel = watchedChannel;
        if (cancelled) {
          return watchedChannel
            .stopWatching()
            .catch((error) =>
              console.error("Could not stop watching the channel", error),
            );
        }
        setChannel(watchedChannel);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Could not watch the channel", error);
        setChannelError(error);
      });

    return () => {
      cancelled = true;
      if (activeChannel) {
        activeChannel.stopWatching().catch((error) => {
          console.error("Could not stop watching the channel", error);
        });
      }
    };
  }, [client, currentUserId, targetUserId]);

  if (!STREAM_API_KEY) {
    return (
      <div role="alert">Chat is not configured. Please try again later.</div>
    );
  }
  if (!currentUserId) {
    return <div role="alert">You must be signed in to start a chat.</div>;
  }
  if (isTokenLoading) {
    return <PageLoader message="Getting your chat ready..." />;
  }
  if (isTokenError) {
    return (
      <div role="alert">
        Could not get chat credentials: {tokenError.message}{" "}
        <button type="button" onClick={() => refetchToken()}>
          Retry
        </button>
      </div>
    );
  }
  if (!tokenData?.token) {
    return <div role="alert">The server did not return a chat token.</div>;
  }
  if (!client) return <PageLoader message="Connecting to chat..." />;
  if (channelError) {
    return (
      <div role="alert">
        Could not open this conversation: {channelError.message}
      </div>
    );
  }
  if (!channel) {
    return <PageLoader message="Loading your conversation..." />;
  }

  return (
    <div className="chatlingo-chat-page">
      <Chat client={client}>
        <Channel channel={channel}>
          <ChannelHeader />
          <MessageList />
          <MessageComposer />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
