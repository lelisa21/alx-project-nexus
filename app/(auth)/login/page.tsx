'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/features/auth/authSlice';
import GoHome from '@/components/ui/GoHome';
import { Eye, EyeOff, Mail, Lock, Github, Chrome } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/lib/schemas/auth';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    console.log("Log in Attempt : " , data);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const user = await response.json();
        dispatch(setUser(user));
        router.push('/dashboard');
         router.refresh();
      } else {
        const error = await response.json();
        setError('root', { message: error.message || 'Login failed' });
      }
    } catch (error) {
      setError('root', { message: 'An error occurred during login' });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center  p-4 w-full">
      <div className="max-w-[60%] w-full">
      
        {/* Back to Home */}
        <GoHome />

        {/* Login Card */}
        <div className="card p-10 w-full">
          <div className="text-center mb-8 dark:text-white">
            <div className="w-16 h-16 bg-linear-to-r from-indigo-500/80 to-black rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">Welcome back!</h1>
            <p className="text-gray-700 dark:text-gray-300">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  className="input-primary pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-primary pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600 text-center">{errors.root.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
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
                <span className="px-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 text-md ">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuth('google')}
                className="w-full btn-secondary py-3 flex items-center justify-center"
              >
                <Chrome className="h-5 w-5 mr-2" />
                Google
              </button>
              <button
                onClick={() => handleOAuth('github')}
                className="w-full btn-secondary py-3 flex items-center justify-center"
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className=" hover:text-teal-400 text-teal-600 font-medium transform-transition duration-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
