'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/features/auth/authSlice';
import { Eye, EyeOff, Mail, Lock, User,Github, Chrome } from 'lucide-react';
import { registerSchema, type RegisterInput } from '@/lib/schemas/auth';
import GoHome from '@/components/ui/GoHome';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    console.log('Registration attempt:', data); 
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log('Registration response status:', response.status); 

      if (response.ok) {
        const user = await response.json();
        console.log('Registration successful, user:', user); 
        dispatch(setUser(user));
        router.push('/dashboard');
        router.refresh();
      } else {
        const errorData = await response.json();
        console.log('Registration error response:', errorData);
        setError('root', { 
          message: errorData.error || `Registration failed (${response.status})` 
        });
      }
    } catch (error) {
      console.error('Registration network error:', error); 
      setError('root', { 
        message: 'Network error. Please check your connection.' 
      });
    } finally {
      setLoading(false);
    }
  };


  const useDemoAccount = () => {
    const demoData = {
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123'
    };
    
 
    console.log('Using demo account:', demoData);
    
  };

  const handleOAuth = (provider: string) => {
    console.log('OAuth attempt:', provider); 
    setError('root', { 
      message: `OAuth with ${provider} is not configured yet. Use email registration.` 
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-[60%] w-full">
        {/* Back to Home */}
        <GoHome />

        {/* Register Card */}
        <div className="card p-8 ">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600">Get started with Pollify today</p>
            
            {/* Demo credentials hint */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Demo:</strong> Use any email/password to test
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('name')}
                  type="text"
                  className="input-primary pl-10"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-primary pl-10 pr-10"
                  placeholder="Create a password"
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
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* OAuth Section - Temporarily disabled with message */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuth('google')}
                className="w-full btn-secondary py-3 flex items-center justify-center opacity-50 cursor-not-allowed"
                disabled
              >
                <Chrome className="h-5 w-5 mr-2" />
                Google
              </button>
              <button
                onClick={() => handleOAuth('github')}
                className="w-full btn-secondary py-3 flex items-center justify-center opacity-50 cursor-not-allowed"
                disabled
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                OAuth providers not configured in demo
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
