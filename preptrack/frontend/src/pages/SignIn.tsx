import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function SignIn() {
  const navigate = useNavigate();

  //   const { isAuthenticated } = useAuth();
  //   if (isAuthenticated) {
  //     navigate("/dashboard");
  //     return;
  //   }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
