import { signInAPI, signInByGoogleAPI } from "@/apis/apis";
import type { SignInRequest, UserSession } from "@/types/type";
import type { CodeResponse } from "@react-oauth/google";
import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";

interface AuthContextType {
  userSession: UserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (signInRequest: SignInRequest) => Promise<boolean>;
  logout: () => void;
  googleLogin: (codeResponse: CodeResponse) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    const userDetails = localStorage.getItem("userSession");
    return userDetails ? JSON.parse(userDetails) : null;
  });

  const login = async (signInRequest: SignInRequest): Promise<boolean> => {
    try {
      const response = await signInAPI(signInRequest);

      if (response) {
        const { userDetails } = response.data;
        setUserSession(userDetails);
        localStorage.setItem("userSession", JSON.stringify(userDetails));
        toast.success("Logged in successfully.");
        return true;
      }
      toast.error("Incorrect email and password. Please try again.");
      return false;
    } catch (error) {
      toast.error("Internal server error, login failed. Please try again.");
      console.log(error);
    }
    return false;
  };

  const googleLogin = async (codeResponse: CodeResponse): Promise<boolean> => {
    try {
      if (!codeResponse?.code) {
        console.warn("Google OAuth 'code' missing in response");
        return false;
      }
      const response = await signInByGoogleAPI(codeResponse.code);
      console.log("Response from google API", response);
      if (response) {
        const { userDetails } = response.data;
        setUserSession(userDetails);
        localStorage.setItem("userSession", JSON.stringify(userDetails));
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("userSession");
    setUserSession(null);
  };

  const value = {
    userSession,
    isAuthenticated: !!userSession,
    isAdmin: false,
    login,
    logout,
    googleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  } else {
    return context;
  }
};
