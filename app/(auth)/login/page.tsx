"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/features/auth/authSlice";
import { Eye, EyeOff, Mail, Lock, Github, Chrome } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";
import { signIn } from "next-auth/react";
import GoHome from "@/components/ui/GoHome";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Save user in Redux
        dispatch(setUser(responseData.user || responseData));
        
        // Redirect to dashboard or previous page
        const redirectTo = localStorage.getItem("redirectAfterLogin") || "/dashboard";
        localStorage.removeItem("redirectAfterLogin");
        
        router.push(redirectTo);
        router.refresh();
      } else {
        // FIX: Use responseData.error instead of responseData.message
        setError("root", { 
          message: responseData.error || "Login failed. Please check your credentials." 
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("root", { 
        message: "Network error. Please check your connection." 
      });
    } finally {
      setLoading(false);
    }
  };

  // OAuth Handler
  const handleOAuth = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  // Demo login handler
  const handleDemoLogin = () => {
    reset({
      email: "demo@example.com",
      password: "demo123",
    });
    
    // Auto-submit after a short delay
    setTimeout(() => {
      const form = document.querySelector("form");
      if (form) {
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
          submitButton.click();
        }
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 w-full">
      <div className="w-full lg:max-w-[60%]">
        {/* Back to Home */}
        <GoHome />

        {/* Login Card */}
        <div className="card p-10 w-full shadow-xl rounded-xl bg-white dark:bg-gray-800">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-linear-to-r from-indigo-500/80 to-black rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
              Welcome back!
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              Sign in to your account to continue
            </p>
          </div>

          {/* Demo Account */}
          <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 font-medium">
                  Demo Account Available
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  Email: <span className="font-semibold">demo@example.com</span> 
                  {" "} | Password: <span className="font-semibold">demo123</span>
                </p>
              </div>
              <button
                onClick={handleDemoLogin}
                className="text-xs bg-emerald-700 hover:bg-emerald-900 text-white px-3 py-1.5 rounded-md transition"
              >
                Use Demo
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 flex justify-between items-center flex-col xl:flex-row"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                  className="input-primary pl-10 pr-10"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input-primary pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Form error */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 col-span-full">
                <p className="text-sm text-red-600 text-center">
                  {errors.root.message}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 px-8 text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* OAuth Section */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 lg:gap-10">
              <button
                onClick={() => handleOAuth("google")}
                className="w-full btn-secondary py-3 flex items-center justify-center"
              >
                <Chrome className="h-5 w-5 mr-2" />
                Google
              </button>
              <button
                onClick={() => handleOAuth("github")}
                className="w-full btn-secondary py-3 flex items-center justify-center"
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </button>
            </div>
          </div>

          {/* Signup link */}
          <p className="mt-8 text-center text-sm text-gray-700 dark:text-white">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="hover:text-teal-400 text-teal-600 font-medium transition-colors duration-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
