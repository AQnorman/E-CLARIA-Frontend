'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, ArrowLeft, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-success/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
        <div className="text-center space-y-8 animate-slide-left">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-3xl font-bold text-gradient">E-CLARIA-AI</span>
          </div>
          
          <h1 className="text-heading max-w-md">
            Welcome Back to the
            <span className="text-gradient block">Future of Non-Profits</span>
          </h1>
          
          <p className="text-body text-secondary max-w-md">
            Continue your journey of transforming non-profit impact through AI-powered solutions.
          </p>

          <div className="flex items-center gap-4 justify-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-small text-secondary">AI-Powered</span>
            </div>
            <div className="w-1 h-1 bg-border rounded-full" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-success" />
              <span className="text-small text-secondary">Secure</span>
            </div>
            <div className="w-1 h-1 bg-border rounded-full" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-small text-secondary">Innovative</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-slide-right">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-2xl font-bold text-gradient">E-CLARIA-AI</span>
            </div>
          </div>

          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-small text-secondary hover:text-primary transition-all duration-300 group cursor-pointer hover:bg-surface/50 px-3 py-2 rounded-lg relative z-10 no-underline"
            style={{ textDecoration: 'none' }}
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to home</span>
          </Link>

          {/* Form Header */}
          <div className="space-y-2">
            <h2 className="text-heading">Sign In</h2>
            <p className="text-body text-secondary">Access your AI-powered dashboard</p>
          </div>

          {/* Login Form */}
          <div className="glass-card p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-small font-medium text-primary">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="password" className="text-small font-medium text-primary">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
            
            <div className="text-center pt-4 border-t border-border/50">
              <p className="text-small text-secondary">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-primary hover:text-accent transition-colors font-medium">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}