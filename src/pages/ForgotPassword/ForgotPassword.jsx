import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail, MailCheck, RefreshCw, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Input from "../../components/Input/Input";
import { useAuth } from "../../context/AuthContext";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrors";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

const RESEND_COOLDOWN_SECONDS = 60;

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState("");

  const location = useLocation();
  const timerRef = useRef(null);
  const { resetPassword } = useAuth();

  const initialEmail = location.state?.email || "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      email: initialEmail,
    },
  });

  const currentEmail = watch("email");

  // Handle resend countdown timer
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

  const handleSendResetEmail = async (data) => {
    try {
      setIsSubmitting(true);
      setAuthError("");
      setResendStatus("");

      await resetPassword(data.email);

      setSentEmail(data.email);
      setIsSubmitted(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      console.error("Password reset error:", error);
      setAuthError(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !sentEmail || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setAuthError("");
      setResendStatus("");

      await resetPassword(sentEmail);

      setResendStatus("Reset link resent successfully. Please check your inbox.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      console.error("Resend error:", error);
      setAuthError(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setResendStatus("");
    setAuthError("");
    setValue("email", sentEmail || "");
  };

  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-176px)] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Back link */}
          <div className="mb-6">
            <Link
              to="/login"
              state={{ email: sentEmail || currentEmail }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft size={14} />
              <span>Back to sign in</span>
            </Link>
          </div>

          {!isSubmitted ? (
            /* Reset Request Form */
            <>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Mail size={22} />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Reset your password
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Enter your registered email address and we'll send you a link to reset your password.
                </p>
              </div>

              {authError && (
                <div
                  role="alert"
                  className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  <p>{authError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(handleSendResetEmail)} className="space-y-5">
                <Input
                  id="email"
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  icon={Mail}
                  autoComplete="email"
                  error={errors.email?.message}
                  disabled={isSubmitting}
                  {...register("email")}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Sending reset link...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send reset link</span>
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Remember your password?{" "}
                <Link
                  to="/login"
                  state={{ email: currentEmail }}
                  className="font-medium text-slate-900 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            /* Success confirmation screen */
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <MailCheck size={28} />
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Check your email
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                We've sent a password reset link to:
              </p>

              <div className="mt-2 inline-block rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800">
                {sentEmail}
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Click the link in the email to set a new password. If you don't see it within a minute or two, please check your spam folder.
              </p>

              {resendStatus && (
                <div
                  role="status"
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2.5 text-xs font-medium text-teal-800"
                >
                  <CheckCircle2 size={15} className="shrink-0 text-teal-600" />
                  <span>{resendStatus}</span>
                </div>
              )}

              {authError && (
                <div
                  role="alert"
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                >
                  <p>{authError}</p>
                </div>
              )}

              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || isSubmitting}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Resending...</span>
                    </>
                  ) : cooldown > 0 ? (
                    <span>Resend email in {cooldown}s</span>
                  ) : (
                    <>
                      <RefreshCw size={15} />
                      <span>Resend email</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="h-10 w-full rounded-lg text-xs font-medium text-slate-500 transition hover:text-slate-800"
                >
                  Use a different email
                </button>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <Link
                  to="/login"
                  state={{ email: sentEmail }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  <ArrowLeft size={16} />
                  <span>Return to login</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
