import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/api/auth.api";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(["userAuth"], null);
      navigate("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => mutate()}
      disabled={isPending}
      aria-label="Log out"
    >
      <LogOut />
    </Button>
  );
};

export default LogoutButton;
