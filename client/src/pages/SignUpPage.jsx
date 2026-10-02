import SignUpForm from "../components/SignUpForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-md lg:max-w-6xl items-center justify-center">
        <Card className="w-full p-0 overflow-hidden border border-border/60 bg-card/90 shadow-2xl backdrop-blur">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="hidden lg:flex flex-col justify-center border-b border-border/60 bg-background/70 p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <CardHeader className="p-0">
                <CardTitle className="text-3xl font-semibold tracking-tight">
                  Welcome to ChatLingo
                </CardTitle>
                <CardDescription className="mt-3 max-w-md text-base text-muted-foreground">
                  Create your account to start chatting, sharing updates, and
                  connecting with your circle.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-6 p-0">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    Fast onboarding in under a minute
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    Secure account creation with validation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    Start chatting right away
                  </li>
                </ul>
              </CardContent>
            </div>

            <div className="flex items-center justify-center p-6 sm:p-8">
              <SignUpForm />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
