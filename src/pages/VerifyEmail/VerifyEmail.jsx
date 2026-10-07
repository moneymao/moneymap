import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MailCheck,
  RefreshCw,
  Send,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../config/firebase";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrors";

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyEmail = () => {
  const [cooldown, setCooldown] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const timerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { refreshUser, resendVerificationEmail, isEmailVerified } = useAuth();

  // Email from Firebase currentUser or navigation state
  const displayedEmail =
    auth.currentUser?.email || location.state?.email || "your email address";

  // If already verified, redirect directly to dashboard
  useEffect(() => {
    if (isEmailVerified) {
      navigate("/dashboard", { replace: true });
    }
  }, [isEmailVerified, navigate]);

  // Show warning if user arrived here from unverified login attempt
  useEffect(() => {
    if (location.state?.unverifiedWarning) {
      setErrorMessage("Please verify your email before continuing.");
    }
  }, [location.state]);

  // Handle countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [cooldown]);

  /**
   * Check verification status via Firebase reload() and verify auth.currentUser.emailVerified
   */
  const handleCheckVerification = async () => {
    try {
      setIsChecking(true);
      setErrorMessage("");
      setStatusMessage("");

      const user = await refreshUser();

      if (!user) {
        setErrorMessage(
          "No active session found. Please sign in with your email and password."
        );
        return;
      }

      // Check the actual Firebase emailVerified property
      if (user.emailVerified) {
        setStatusMessage("Email verified! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1200);
      } else {
        setErrorMessage(
          "Your email is not verified yet. Please check your inbox and click the verification link."
        );
      }
    } catch (error) {
      console.error("Verification check error:", error);
      setErrorMessage(getFirebaseErrorMessage(error));
    } finally {
      setIsChecking(false);
    }
  };

  /**
   * Resend Firebase verification email with a 60-second cooldown
   */
  const handleResendVerification = async () => {
    if (cooldown > 0 || isResending) return;

    try {
      setIsResending(true);
      setErrorMessage("");
      setStatusMessage("");

      if (!auth.currentUser) {
        setErrorMessage(
          "Session expired. Please sign in to resend the verification email."
        );
        return;
      }

      await resendVerificationEmail();
      setStatusMessage("Verification email sent.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      console.error("Resend error:", error);
      setErrorMessage(getFirebaseErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-176px)] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          
          {/* Header Icon */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-teal-400">
            <MailCheck size={28} aria-hidden="true" />
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Verify your email
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              We've sent a verification link to
            </p>

            <p className="mt-2 inline-flex items-center gap-1.5 font-medium text-slate-900 text-sm bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 max-w-full break-all">
              <Mail size={14} className="shrink-0 text-slate-500" aria-hidden="true" />
              <span className="truncate">{displayedEmail}</span>
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Please check your inbox and click the verification link to activate your MoneyMap account.
            </p>
          </div>

          {/* Success Status Banner */}
          {statusMessage && (
            <div
              role="status"
              className="mb-5 flex items-center gap-2.5 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800"
            >
              <CheckCircle2 size={18} className="shrink-0 text-teal-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Check Verification Button */}
            <button
              type="button"
              onClick={handleCheckVerification}
              disabled={isChecking}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              {isChecking ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Checking verification...
                </>
              ) : (
                "Check Verification"
              )}
            </button>

            {/* Resend Verification Email Button */}
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={cooldown > 0 || isResending}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              {isResending ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Sending email...
                </>
              ) : cooldown > 0 ? (
                `Resend available in ${cooldown}s`
              ) : (
                <>
                  <Send size={15} />
                  Resend Verification Email
                </>
              )}
            </button>
          </div>

          {/* Back to Login link */}
          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Back to Login
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;
