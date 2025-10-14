import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  //   const isAuthenticated = true;
  return (
    <>
      {isAuthenticated ? (
        <div>I'm here because I am logged in.</div>
      ) : (
        <div>I'm here because I am not logged in.</div>
      )}
    </>
  );
}
