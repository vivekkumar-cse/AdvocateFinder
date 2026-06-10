import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Mail, Lock, User, ArrowRight, Eye, EyeOff, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const nameSchema = z.string().min(2, 'Name must be at least 2 characters');

type Role = 'public' | 'advocate';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<Role>('public');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});

  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Auto-redirect only if user manually navigates here while already signed in
    // (the submit handler handles its own post-auth routing)
    if (!loading && user && !isSubmitting) {
      // do nothing here — let user choose; but if they're already signed in, send them home
    }
  }, [user, loading, isSubmitting]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0].message;
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0].message;
    if (!isLogin) {
      const nameResult = nameSchema.safeParse(fullName);
      if (!nameResult.success) newErrors.fullName = nameResult.error.errors[0].message;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const routeAfterAuth = async (userId: string) => {
    if (role === 'advocate') {
      // Check if an advocate profile already exists
      const { data } = await supabase
        .from('advocates')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (data) {
        navigate('/advocate-dashboard');
      } else {
        toast({
          title: 'Complete Your Advocate Profile',
          description: 'Please fill in your professional details to get listed.',
        });
        navigate('/register-advocate');
      }
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Login Failed',
            description: error.message.includes('Invalid login credentials')
              ? 'Invalid email or password. Please try again.'
              : error.message,
            variant: 'destructive',
          });
        } else {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            // For advocate sign-in, verify they actually have an advocate profile
            if (role === 'advocate') {
              const { data: adv } = await supabase
                .from('advocates')
                .select('id')
                .eq('user_id', currentUser.id)
                .maybeSingle();
              if (!adv) {
                toast({
                  title: 'No Advocate Profile',
                  description: 'Complete your advocate registration to continue.',
                });
                navigate('/register-advocate');
                return;
              }
            }
            toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
            await routeAfterAuth(currentUser.id);
          }
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered') || error.message.includes('already been registered')) {
            toast({
              title: 'Account Exists',
              description: 'This email is already registered. Please login instead.',
              variant: 'destructive',
            });
            setIsLogin(true);
          } else {
            toast({ title: 'Sign Up Failed', description: error.message, variant: 'destructive' });
          }
        } else {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          toast({
            title: 'Account Created!',
            description: role === 'advocate'
              ? 'Now complete your advocate profile.'
              : 'Welcome to AdvocateFinder!',
          });
          if (currentUser) {
            await routeAfterAuth(currentUser.id);
          } else {
            // Email confirmation may be required
            navigate(role === 'advocate' ? '/register-advocate' : '/');
          }
        }
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-left">
              <h1 className="font-serif font-bold text-xl text-foreground">AdvocateFinder</h1>
              <p className="text-xs text-muted-foreground">Find Legal Help</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            {isLogin ? 'Welcome back! Please sign in.' : 'Create an account to get started.'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl border border-border shadow-xl p-8">
          {/* Role Selector */}
          <div className="mb-6">
            <Label className="mb-2 block text-sm">
              {isLogin ? 'Sign in as' : 'Sign up as'}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('public')}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg border text-sm font-medium transition-all ${
                  role === 'public'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                <Users className="w-4 h-4" />
                Public User
              </button>
              <button
                type="button"
                onClick={() => setRole('advocate')}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg border text-sm font-medium transition-all ${
                  role === 'advocate'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Advocate
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              {role === 'advocate'
                ? isLogin
                  ? 'Access your advocate dashboard and manage consultations.'
                  : "You'll complete your professional profile after sign up."
                : 'Find and book consultations with verified advocates.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-destructive">{errors.fullName}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin
                    ? role === 'advocate' ? 'Sign In as Advocate' : 'Sign In'
                    : role === 'advocate' ? 'Sign Up as Advocate' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="ml-1 text-primary hover:underline font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-center text-muted-foreground mt-6">
          ⚠️ This is a conceptual prototype for learning purposes only.
        </p>
      </div>
    </div>
  );
};

export default Auth;
