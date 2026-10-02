import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { signupSchema } from "../schemas/auth.schema";
import { signupUser } from "../api/auth.api";
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

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data) => ({ data: await signupUser(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userAuth"] }),
  });

  const errorMessageMap = useMemo(
    () => ({
      name: errors.name?.[0],
      email: errors.email?.[0],
      password: errors.password?.[0],
    }),
    [errors],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setErrors({});

    try {
      const { data } = await mutateAsync(result.data);
      console.log(data);
      toast.success(
        data.message || "Account created successfully. Please sign in.",
      );
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to create account.";
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
          Create your account
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Join ChatLingo and start connecting with people instantly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Alex Morgan"
              value={formData.name}
              onChange={handleChange("name")}
              aria-invalid={Boolean(errorMessageMap.name)}
              aria-describedby={errorMessageMap.name ? "name-error" : undefined}
            />
            {errorMessageMap.name && (
              <p id="name-error" role="alert" className="text-sm text-rose-400">
                {errorMessageMap.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
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
              placeholder="Enter a strong password"
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
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary underline-offset-4 transition hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
