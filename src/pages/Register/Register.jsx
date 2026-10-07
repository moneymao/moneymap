import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Input from "../../components/Input/Input";
import GoogleButton from "../../components/GoogleButton/GoogleButton";
import { useAuth } from "../../context/AuthContext";
import { getFirebaseErrorMessage } from "../../utils/firebaseErrors";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  const navigate = useNavigate();
  const { register: registerWithFirebase, isAuthenticated, isEmailVerified } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (isAuthenticated && isEmailVerified) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [isAuthenticated, isEmailVerified, navigate]);

  const handleRegister = async (data) => {
    try {
      setIsSubmitting(true);
      setAuthError("");

      await registerWithFirebase(data.name, data.email, data.password);

      navigate("/verify-email", {
        state: { email: data.email },
      });
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-176px)] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Start tracking your income, expenses, budgets,
              and savings.
            </p>
          </div>

          {authError && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {authError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(handleRegister)}
            className="space-y-5"
          >
            <Input
              id="name"
              label="Full name"
              type="text"
              placeholder="Enter your full name"
              icon={UserRound}
              autoComplete="name"
              error={errors.name?.message}
              disabled={isSubmitting}
              {...register("name")}
            />

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
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  autoComplete="new-password"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700"
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(
                    errors.confirmPassword
                  )}
                  aria-describedby={
                    errors.confirmPassword
                      ? "confirm-password-error"
                      : undefined
                  }
                  className={`h-11 w-full rounded-lg border bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                      : "border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  }`}
                  {...register("confirmPassword")}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={isSubmitting}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700"
                >
                  {showConfirmPassword ? (
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

              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  role="alert"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <p className="text-xs leading-5 text-slate-500">
              By creating an account, you agree to the
              MoneyMap terms and privacy practices.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              {isSubmitting
                ? "Creating account..."
                : "Create account"}
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
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-slate-900 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;