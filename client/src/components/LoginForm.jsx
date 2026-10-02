import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loginSchema } from "../schemas/auth.schema";
import { loginUser } from "../api/auth.api";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data) => ({ data: await loginUser(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userAuth"] }),
  });

  const errorMessageMap = useMemo(
    () => ({
      email: errors.email?.[0],
      password: errors.password?.[0],
    }),
    [errors],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setErrors({});

    try {
      const { data } = await mutateAsync(result.data);
      toast.success(data.message || "Welcome back!");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to sign in. Please try again.";
      toast.error(message);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <Card className="w-full max-w-md border border-border/60 bg-card/95 shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Sign in to ChatLingo
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Continue your conversations and stay connected with your circle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="text"
              placeholder="chatlover"
              value={formData.email}
              onChange={handleChange("email")}
              aria-invalid={Boolean(errorMessageMap.email)}
              aria-describedby={
                errorMessageMap.email ? "email-error" : undefined
              }
            />
            {errorMessageMap.email && (
              <p
                id="email-error"
                role="alert"
                className="text-sm text-rose-400"
              >
                {errorMessageMap.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange("password")}
              aria-invalid={Boolean(errorMessageMap.password)}
              aria-describedby={
                errorMessageMap.password ? "password-error" : undefined
              }
            />
            {errorMessageMap.password && (
              <p
                id="password-error"
                role="alert"
                className="text-sm text-rose-400"
              >
                {errorMessageMap.password}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary underline-offset-4 transition hover:underline"
          >
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
