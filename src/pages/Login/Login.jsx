import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Input from "../../components/Input/Input";
import GoogleButton from "../../components/GoogleButton/GoogleButton";
import { useAuth } from "../../context/AuthContext";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrors";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginWithFirebase, isAuthenticated, isEmailVerified, loading } = useAuth();

  const verifiedEmail = location.state?.verifiedEmail;
  const initialEmail = location.state?.email || verifiedEmail || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: initialEmail,
      password: "",
    },
  });

  useEffect(() => {
    if (!loading && isAuthenticated && isEmailVerified) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [loading, isAuthenticated, isEmailVerified, navigate]);

  if (loading || (isAuthenticated && isEmailVerified)) {
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

  const handleLogin = async (data) => {
    try {
      setIsSubmitting(true);
      setAuthError("");

      const user = await loginWithFirebase(data.email, data.password);

      // Check if email has been verified
      if (!user.emailVerified) {
        navigate("/verify-email", {
          state: {
            email: data.email,
            unverifiedWarning: true,
          },
        });
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-176px)] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue managing your money.
            </p>
          </div>

          {verifiedEmail && !authError && (
            <div
              role="status"
              className="mb-5 flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800"
            >
              <CheckCircle2 size={18} className="shrink-0 text-teal-600" />
              <span>Email verified successfully. You can now sign in.</span>
            </div>
          )}

          {authError && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <p>{authError}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(handleLogin)}
            className="space-y-5"
          >
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

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  state={{ email: watch("email") }}
                  className="text-xs font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password
                      ? "password-error"
                      : undefined
                  }
                  className={`h-11 w-full rounded-lg border bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                      : "border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  }`}
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={isSubmitting}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      aria-hidden="true"
                    />
                  ) : (
                    <Eye
                      size={18}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>

              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Or continue with
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <GoogleButton onError={(msg) => setAuthError(msg)} />

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-slate-900 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;