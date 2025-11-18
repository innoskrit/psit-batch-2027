import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AppLayout from "./components/layout/AppLayout";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "./components/ui/sonner";
import TrackDetailPage from "./pages/TrackDetailPage";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const GoogleAuthWrapperSignInPage = () => {
    return (
      <>
        <GoogleOAuthProvider clientId="181529662565-84akn71fqvqnrst9uog8c5gtcpp0ks23.apps.googleusercontent.com">
          <SignIn />
        </GoogleOAuthProvider>
      </>
    );
  };
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <AppLayout>
                    <Home />
                  </AppLayout>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                }
              />
              <Route
                path="/tracks/:slug"
                element={
                  <AppLayout>
                    <TrackDetailPage />
                  </AppLayout>
                }
              />
              <Route path="/signin" element={<GoogleAuthWrapperSignInPage />} />
              <Route
                path="/about"
                element={
                  <AppLayout>
                    <About />
                  </AppLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <AppLayout>
                    <Contact />
                  </AppLayout>
                }
              />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
