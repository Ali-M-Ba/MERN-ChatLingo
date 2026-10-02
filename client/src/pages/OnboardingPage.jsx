import { onboardingUser } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LANGUAGES } from "@/constants/languages";
import { onboardingSchema } from "@/schemas/auth.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShipWheel, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const OnboardingPage = ({ user }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    avatar: user?.avatar || "",
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    nativeLanguage: user?.nativeLanguage || LANGUAGES[0],
    learningLanguage: user?.learningLanguage || LANGUAGES[0],
    location: user?.location || "",
  });

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data) => ({ data: await onboardingUser(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userAuth"] }),
  });

  const [errors, setErrors] = useState({});

  const errorMessageMap = useMemo(
    () => ({
      name: errors.name?.[0],
      username: errors.username?.[0],
      bio: errors.bio?.[0],
      nativeLanguage: errors.nativeLanguage?.[0],
      learningLanguage: errors.learningLanguage?.[0],
      location: errors.location?.[0],
    }),
    [errors],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = onboardingSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setErrors({});

    try {
      const { data } = await mutateAsync(result.data);
      toast.success(data.message || "Profile setup completed successfully.");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to complete profile setup.";
      toast.error(message);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Continue Your Profile Setup</CardTitle>
            <CardDescription>
              Complete your profile information to get started
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="space-y-4">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange("name")}
                    aria-invalid={Boolean(errorMessageMap.name)}
                    aria-describedby={
                      errorMessageMap.name ? "name-error" : undefined
                    }
                    type="text"
                    placeholder="Ali Mohammed"
                    required
                  />
                  {errorMessageMap.name && (
                    <p
                      id="name-error"
                      role="alert"
                      className="text-sm text-rose-400"
                    >
                      {errorMessageMap.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="chatlover"
                    value={formData.username}
                    onChange={handleChange("username")}
                    aria-invalid={Boolean(errorMessageMap.username)}
                    aria-describedby={
                      errorMessageMap.username ? "username-error" : undefined
                    }
                  />
                  {errorMessageMap.username && (
                    <p
                      id="username-error"
                      role="alert"
                      className="text-sm text-rose-400"
                    >
                      {errorMessageMap.username}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange("bio")}
                    aria-invalid={Boolean(errorMessageMap.bio)}
                    aria-describedby={
                      errorMessageMap.bio ? "bio-error" : undefined
                    }
                    rows={3}
                    placeholder="Tell us about yourself"
                  />
                  {errorMessageMap.bio && (
                    <p
                      id="bio-error"
                      role="alert"
                      className="text-sm text-rose-400"
                    >
                      {errorMessageMap.bio}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="username">Native Language</Label>

                    <Select
                      items={LANGUAGES}
                      value={formData.nativeLanguage}
                      onValueChange={(val) =>
                        setFormData((p) => ({ ...p, nativeLanguage: val }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Your Native Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {LANGUAGES.map((language) => (
                            <SelectItem key={language} value={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="username">Learning Language</Label>

                    <Select
                      items={LANGUAGES}
                      value={formData.learningLanguage}
                      onValueChange={(val) =>
                        setFormData((p) => ({ ...p, learningLanguage: val }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Your Learning Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {LANGUAGES.map((language) => (
                            <SelectItem key={language} value={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange("location")}
                      aria-invalid={Boolean(errorMessageMap.location)}
                      aria-describedby={
                        errorMessageMap.location ? "location-error" : undefined
                      }
                      type="text"
                      placeholder="Riyadh, Saudi Arabia"
                      required
                      className="pl-10"
                    />
                    {errorMessageMap.location && (
                      <p
                        id="location-error"
                        className="text-sm text-destructive"
                      >
                        {errorMessageMap.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                <ShipWheel className="mr-2" />
                {isPending ? "Completing..." : "Complete Profile Setup"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
