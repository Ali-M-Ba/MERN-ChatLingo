const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-foreground"
          aria-hidden="true"
        />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;
