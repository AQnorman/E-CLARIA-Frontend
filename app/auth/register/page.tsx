'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, ArrowLeft, Loader2, Eye, EyeOff, CheckCircle, Sparkles, Shield } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { text: "Contains number", met: /\d/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!passwordRequirements.every(req => req.met)) {
      toast({
        title: "Password requirements not met",
        description: "Please ensure your password meets all requirements.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      toast({
        title: "Welcome to E-CLARIA-AI!",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again or contact support if the problem persists.",
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
        <div className="absolute top-20 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-success/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-slide-left">
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
            <h2 className="text-heading">Create Account</h2>
            <p className="text-body text-secondary">Join the AI revolution for non-profits</p>
          </div>

          {/* Registration Form */}
          <div className="glass-card p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-small font-medium text-primary">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input"
                />
              </div>
              
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
                
                {/* Password Requirements */}
                {password && (
                  <div className="space-y-2 p-4 bg-surface/50 rounded-lg border border-border/50">
                    <div className="text-small font-medium text-primary mb-2">Password Requirements:</div>
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle 
                          className={`h-4 w-4 transition-colors ${req.met ? 'text-success' : 'text-muted'}`}
                        />
                        <span className={`text-small transition-colors ${req.met ? 'text-success' : 'text-muted'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-small font-medium text-primary">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="input pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-small text-error flex items-center gap-2">
                    <span className="w-1 h-1 bg-error rounded-full" />
                    Passwords do not match
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
            
            <div className="text-center pt-4 border-t border-border/50">
              <p className="text-small text-secondary">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary hover:text-accent transition-colors font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
        <div className="text-center space-y-8 animate-slide-right">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-3xl font-bold text-gradient">E-CLARIA-AI</span>
          </div>
          
          <h1 className="text-heading max-w-md">
            Join the
            <span className="text-gradient block">AI Revolution</span>
            for Non-Profits
          </h1>
          
          <p className="text-body text-secondary max-w-md">
            Transform your organization's impact with cutting-edge AI tools designed specifically for non-profit success.
          </p>

          <div className="grid grid-cols-1 gap-4 max-w-sm">
            <div className="flex items-center gap-3 p-4 glass-card">
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="text-small">AI-Powered Strategies</span>
            </div>
            <div className="flex items-center gap-3 p-4 glass-card">
              <Shield className="h-5 w-5 text-success" />
              <span className="text-small">Secure & Private</span>
            </div>
            <div className="flex items-center gap-3 p-4 glass-card">
              <Brain className="h-5 w-5 text-primary" />
              <span className="text-small">Smart Insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}