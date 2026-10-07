import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { UsersRound } from "lucide-react";
import UserCard from "@/components/UserCard";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests, getFriends } from "@/api/user.api";
import { RecommendedUsersList } from "@/components/RecommendedUsersList";
import { useNavigate } from "react-router-dom";
import { FriendsList } from "@/components/FriendsList";

const HomePage = () => {
  const Navigate = useNavigate();

  return (
    <main className="flex flex-col gap-8">
      <section
        className="flex flex-col gap-4"
        aria-labelledby="friends-heading"
      >
        <header className="flex w-full items-center justify-between gap-3">
          <h2 id="friends-heading" className="text-2xl font-bold">
            Your friends
          </h2>
          <Button onClick={() => Navigate("/notifications")} size="sm">
            <UsersRound aria-hidden="true" />
            <span>Friend Requests</span>
          </Button>
        </header>

        <FriendsList />
      </section>

      <section
        className="flex flex-col gap-3"
        aria-labelledby="learners-heading"
      >
        <header className="flex flex-col gap-1">
          <h2 id="learners-heading" className="text-xl font-semibold">
            Meet New Learners
          </h2>
          <p className="text-sm text-muted-foreground">
            Discover and connect with new learners!
          </p>
        </header>
        <RecommendedUsersList />
      </section>
    </main>
  );
};

export default HomePage;
