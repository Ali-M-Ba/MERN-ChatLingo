import { FriendRequestsList } from "@/components/FriendRequestsList";

const NotificationsPage = () => {
  return (
    <main className="mx-auto w-full max-w-6xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Friend requests</h1>
        <p className="text-sm text-muted-foreground">
          Manage the requests you have received and sent.
        </p>
      </header>
      <FriendRequestsList />
    </main>
  );
};

export default NotificationsPage;
