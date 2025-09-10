'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { GoogleSignInButton } from '@/components/ui/GoogleSignInButton';
import { useLoading } from '@/lib/LoadingContext';
import { useAuth } from '@/lib/AuthContext';
import { signIn, signInWithGoogle } from '@/lib/auth';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Show loading when page loads
    startLoading();
    
    const timer = setTimeout(() => {
      stopLoading();
    }, 100);

    return () => clearTimeout(timer);
  }, [startLoading, stopLoading]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { user, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        setErrors({ general: error });
      } else if (user) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        setErrors({ general: error });
      } else if (user) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-slate-900 relative overflow-hidden">
      {/* Animated background elements matching landing page */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-transparent to-teal-100/30 dark:from-emerald-900/20 dark:to-teal-900/20 animate-gradient-xy"></div>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-radial from-emerald-400/20 to-transparent animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-teal-400/20 to-amber-400/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-tr from-emerald-300/10 to-teal-300/10 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="w-full glass-effect border-slate-200/50 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/60 shadow-2xl hover:shadow-3xl shadow-emerald-500/10 transition-all duration-500">
            <div className="text-center mb-8">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center animate-pulse-glow shadow-lg shadow-emerald-500/25">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Welcome
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 bg-clip-text text-transparent">
                  Back
                </span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
                Sign in to your account to continue your journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                  {errors.general}
                </div>
              )}
              
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  leftIcon={<Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                  placeholder="Enter your email"
                  required
                  className="border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20"
                />

                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  leftIcon={<Lock className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  placeholder="Enter your password"
                  required
                  className="border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-300">
                    Remember me
                  </label>
                </div>

                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:scale-105 transition-all duration-300"
                loading={loading}
                disabled={loading}
              >
                <span className="flex items-center justify-center">
                  Sign In
                  <ArrowRight className="h-4 w-4 ml-2" />
                </span>
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <GoogleSignInButton
                  onClick={handleGoogleSignIn}
                  loading={googleLoading}
                  disabled={googleLoading || loading}
                  className="w-full border-2 border-slate-200 dark:border-slate-700 glass-effect hover:bg-slate-50 dark:hover:bg-slate-700/20 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300"
                >
                  Continue with Google
                </GoogleSignInButton>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
