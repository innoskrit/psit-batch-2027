import { signInAPI } from "@/apis/apis";
import type { SignInRequest, UserSession } from "@/types/type";
import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
  userSession: UserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (signInRequest: SignInRequest) => Promise<boolean>;
  logout: () => void;
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
        const { message, userDetails } = response.data;
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
    // we will try to logout the user;
  };

  const value = {
    userSession,
    isAuthenticated: !!userSession,
    isAdmin: false,
    login,
    logout,
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
