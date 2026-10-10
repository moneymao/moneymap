import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/Hero/Hero";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import Features from "../../components/Features/Features";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isEmailVerified, loading } = useAuth();

  const isStandalone =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true);

  useEffect(() => {
    // When running inside an installed PWA, direct user to dashboard if logged in, or login if not
    if (!loading && isStandalone) {
      if (isAuthenticated && isEmailVerified) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, isEmailVerified, loading, isStandalone, navigate]);

  if (isStandalone && loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50">
        <div
          role="status"
          aria-label="Loading"
          className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
        />
      </div>
    );
  }

  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
    </>
  );
};

export default Home;