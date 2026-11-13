import { useQuery } from "@tanstack/react-query";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStreamToken } from "@/api/stream.api";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/PageLoader";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./stream-overrides.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallContent = ({ onLeave }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState === CallingState.JOINED) {
    return (
      <div className="flex h-full flex-col">
        <StreamTheme>
          <div className="flex-1 overflow-hidden">
            <SpeakerLayout />
          </div>
          <div className="border-t border-border bg-card/80 p-3">
            <CallControls onLeave={onLeave} />
          </div>
        </StreamTheme>
      </div>
    );
  }

  return (
    <div className="flex min-h-[360px] items-center justify-center px-6 text-center">
      <div>
        <p className="text-lg font-medium text-foreground">
          Connecting to the call...
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Setting up your audio and video.
        </p>
      </div>
    </div>
  );
};

const CallPage = ({ user }) => {
  const navigate = useNavigate();
  const { id: targetUserId } = useParams();
  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const [callError, setCallError] = useState(null);

  const currentUserId = user?._id?.toString() ?? user?.id?.toString();

  // Stream video also needs a token for the signed-in user before it can create a client.
  // This query is cached by user so a new user gets a fresh token automatically.
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

  useEffect(() => {
    if (
      !STREAM_API_KEY ||
      !currentUserId ||
      !tokenData?.token ||
      !targetUserId
    ) {
      setVideoClient(null);
      setCall(null);
      setCallError(null);
      return;
    }

    if (currentUserId === targetUserId) {
      setCallError(new Error("You cannot start a call with yourself."));
      return;
    }

    // A StreamVideoClient holds the authenticated user session. Once it exists, we create
    // a single DM room for the two users. `create: true` makes the room appear if it does not
    // already exist, which is exactly what we want for a first video call.
    const nextClient = new StreamVideoClient({
      apiKey: STREAM_API_KEY,
      user: {
        id: currentUserId,
        name: user?.name ?? "ChatLingo user",
      },
      token: tokenData.token,
    });

    const members = [currentUserId, targetUserId].sort();
    const callId = `dm-call-${members.join("-")}`;
    const nextCall = nextClient.call("default", callId);

    setVideoClient(nextClient);
    setCall(nextCall);
    setCallError(null);

    let cancelled = false;

    // We join the DM room immediately and create it if needed. Once the room exists,
    // the UI shows the live video layout and controls.
    nextCall.join({ create: true }).catch((error) => {
      if (!cancelled) {
        console.error("Could not join video call", error);
        setCallError(error);
      }
    });

    return () => {
      cancelled = true;
      if (nextCall) {
        nextCall.leave().catch((error) => {
          console.error("Could not leave video call", error);
        });
      }
      if (nextClient) {
        nextClient.disconnectUser().catch((error) => {
          console.error("Could not disconnect Stream video client", error);
        });
      }
    };
  }, [currentUserId, targetUserId, tokenData?.token, user?.name]);

  const handleLeave = () => {
    navigate(-1);
  };

  if (!STREAM_API_KEY) {
    return (
      <div role="alert">
        Video calling is not configured. Please try again later.
      </div>
    );
  }

  if (!currentUserId) {
    return <div role="alert">You must be signed in to start a call.</div>;
  }

  if (isTokenLoading) {
    return <PageLoader message="Getting your call ready..." />;
  }

  if (isTokenError) {
    return (
      <div role="alert">
        Could not get call credentials: {tokenError?.message ?? "Unknown error"}
        <Button
          type="button"
          variant="outline"
          onClick={() => refetchToken()}
          className="ml-3"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!tokenData?.token) {
    return <div role="alert">The server did not return a video token.</div>;
  }

  if (callError) {
    return (
      <div role="alert" className="space-y-3">
        <p>Could not start this call: {callError.message}</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          Go back
        </Button>
      </div>
    );
  }

  if (!videoClient || !call) {
    return <PageLoader message="Preparing your call..." />;
  }

  return (
    <section className="chatlingo-call-page flex min-h-[70vh] flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl shadow-black/10">
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Video call
          </p>
          <h1 className="mt-1 text-xl font-semibold text-foreground">
            Call with {targetUserId}
          </h1>
        </div>

        <Button type="button" variant="outline" onClick={handleLeave}>
          Leave
        </Button>
      </header>

      <div className="flex-1 bg-background">
        <StreamVideo client={videoClient}>
          <StreamCall call={call}>
            <CallContent onLeave={handleLeave} />
          </StreamCall>
        </StreamVideo>
      </div>
    </section>
  );
};

export default CallPage;
