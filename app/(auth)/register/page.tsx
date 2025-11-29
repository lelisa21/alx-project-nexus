'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth";
import { Mail, User, Lock, Eye, EyeOff, Github, Chrome } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError("root", { message: err.message });
        return;
      }

      router.push("/login");
      router.refresh();

    } catch (error) {
      setError("root", { message: "Registration failed" });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 to-blue-200 flex items-center justify-center p-4">
      <div className="card p-10 max-w-[60%] w-full">

        <h1 className="text-3xl font-bold text-center mb-6">
          Create your account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register("name")}
                type="text"
                className="input-primary pl-10"
                placeholder="Your name"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register("email")}
                type="email"
                className="input-primary pl-10"
                placeholder="example@mail.com"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="input-primary pl-10 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register("confirmPassword")}
                type={showPassword ? "text" : "password"}
                className="input-primary pl-10"
                placeholder="Confirm password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* ROOT ERRORS */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">
              {errors.root.message}
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-3 text-lg">
            Create Account
          </button>
        </form>

        {/* OAuth Section */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => signIn("google")}
              className="btn-secondary flex items-center justify-center py-3"
            >
              <Chrome className="w-5 h-5 mr-2" /> Google
            </button>

            <button
              onClick={() => signIn("github")}
              className="btn-secondary flex items-center justify-center py-3"
            >
              <Github className="w-5 h-5 mr-2" /> GitHub
            </button>
          </div>
        </div>

        <p className="mt-6 text-center">
          Already have an account?
          <Link href="/login" className="text-teal-600 ml-1 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
