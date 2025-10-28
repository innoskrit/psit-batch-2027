import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useGoogleLogin, type CodeResponse } from "@react-oauth/google";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, googleLogin } = useAuth();

  const handleLogin = async () => {
    try {
      const success = await login({ email, password });
      if (success) {
        console.log("Login Successfull");
      } else {
        console.log("Login Failed");
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Some error occured", error);
      navigate("/signin");
    }
  };

  const handleGoogleLoginSuccess = async (codeResponse: CodeResponse) => {
    try {
      const success = await googleLogin(codeResponse);
      if (success) {
        navigate("/dashboard");
      } else {
        console.error("Failed to login by Google. Please try again.");
        navigate("/signin");
      }
    } catch (error) {
      console.error("Failed to login by Google. Please try again.");
      navigate("/signin");
    }
  };

  const handleGoogleLoginError = (
    errorResponse: Pick<
      CodeResponse,
      "error" | "error_description" | "error_uri"
    >
  ) => {
    console.error(errorResponse);
    navigate("/signin");
  };

  const handleGoogleAuthentication = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
    flow: "auth-code",
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            <Field>
              <Button onClick={handleLogin} type="submit">
                Login
              </Button>
              <Button
                onClick={handleGoogleAuthentication}
                variant="outline"
                type="button"
              >
                Continue with Google
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="#">Sign up</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
