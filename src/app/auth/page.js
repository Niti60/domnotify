'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  Building,
  Loader2,
  AlertCircle,
  Briefcase,
  Eye,
  EyeOff,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '../../components/ui/Logo';
import { cn } from '@/lib/cn';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['student', 'developer', 'entrepreneur', 'company']),
  companyName: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).superRefine((data, ctx) => {
  if (['entrepreneur', 'company'].includes(data.role) && (!data.companyName || data.companyName.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['companyName'],
      message: 'Company name is required'
    });
  }
});

function AuthInput({ label, icon: Icon, error, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === 'password';

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground ml-1" htmlFor={props.id}>
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-500 transition-colors duration-200">
          <Icon size={16} />
        </div>
        <input
          {...props}
          type={isPassword ? (showPassword ? 'text' : 'password') : props.type}
          className={cn(
            "w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200",
            "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5",
            "placeholder:text-muted-foreground/50",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/5",
            isPassword && "pr-10"
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-[11px] text-red-500 ml-1 mt-1 flex items-center gap-1 font-medium italic">
          <AlertCircle size={10} />
          {error}
        </p>
      )}
    </div>
  );
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const getSafeNextPath = () => {
    const nextPath = searchParams.get('next');
    if (!nextPath || !nextPath.startsWith('/')) {
      return '/dashboard';
    }

    return nextPath;
  };

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  // Handle redirection messages
  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'expired') {
      setApiError('Your session has expired. Please sign in again.');
      toast.info('Session expired', { description: 'Please log in to continue.' });
    } else if (reason === 'unauthorized') {
      setApiError('Please sign in to access this page.');
    } else if (reason === 'logout/') {
      // Just in case logout redirects here
      toast.success('You have been logged out.');
    }
  }, [searchParams]);

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    watch,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'student',
      companyName: '',
      password: '',
      confirmPassword: ''
    }
  });

  const selectedRole = watch('role');

  const onLogin = async (data) => {
    setApiError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        // Detailed classification of errors
        if (res.status === 401) {
          setApiError('Incorrect email or password. Please try again.');
        } else if (res.status === 500) {
          setApiError('Something went wrong on our end. Please try again later.');
        } else {
          setApiError(json?.message || 'Unable to sign in. Please check your credentials.');
        }
        setLoading(false);
        return;
      }

      // Update Auth Context IMMEDIATELY
      if (json.user) {
        setUser(json.user);
      }

      // Store token as a fallback
      if (json.token) {
        localStorage.setItem('token', json.token);
      }

      toast.success('Welcome back! Logging you in...', {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
      });

      const destination = json?.user?.isAdmin ? '/admin' : getSafeNextPath();
      router.replace(destination);
    } catch (err) {
      setApiError('Unable to connect to the server. Please check your internet connection.');
      setLoading(false);
    }
  };

  const onRegister = async (data) => {
    setApiError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setApiError('An account already exists with this email. Try signing in instead.');
        } else if (res.status === 400) {
          setApiError(json?.message || 'Please check your registration details.');
        } else {
          setApiError('Something went wrong. Please try again later.');
        }
        setLoading(false);
        return;
      }

      // Update Auth Context IMMEDIATELY
      if (json.user) {
        setUser(json.user);
      }

      // Store token as a fallback
      if (json.token) {
        localStorage.setItem('token', json.token);
      }

      toast.success('Account created! Welcome to DomNotify.', {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
      });

      const destination = json?.user?.isAdmin ? '/admin' : getSafeNextPath();
      router.replace(destination);
    } catch (err) {
      setApiError('Network error. Check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        {/* Header section */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <Logo className="mb-4" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">Monitor your domains smarter.</p>
        </div>

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden p-8 transition-all duration-300">

          {/* Custom Tabs Switcher - More Compact */}
          <div className="flex p-1 bg-muted/50 rounded-xl mb-6 relative">
            <div className="flex w-full relative z-10">
              <button
                onClick={() => { setActiveTab('login'); setApiError(''); }}
                className={cn(
                  "cursor-pointer flex-1 py-1.5 text-sm font-semibold transition-colors duration-200",
                  activeTab === 'login' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Login
              </button>
              <button
                onClick={() => { setActiveTab('register'); setApiError(''); }}
                className={cn(
                  "cursor-pointer flex-1 py-1.5 text-sm font-semibold transition-colors duration-200",
                  activeTab === 'register' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Register
              </button>
            </div>
            {/* Animated Slider */}
            <motion.div
              layoutId="tab-slider"
              className="absolute inset-y-1 bg-card rounded-lg shadow-sm border border-border/50"
              initial={false}
              animate={{
                x: activeTab === 'login' ? '0%' : '100%',
                width: '50%'
              }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3.5 text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5 font-medium"
              >
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLoginSubmit(onLogin)}
                  className="space-y-4"
                >
                  <AuthInput
                    id="login-email"
                    label="Email Address"
                    type="email"
                    placeholder="name@gmail.com"
                    icon={Mail}
                    error={loginErrors.email?.message}
                    {...registerLogin('email')}
                  />

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      {/* Placeholder for future Forgot Password link */}
                    </div>
                    <AuthInput
                      id="login-password"
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      icon={Lock}
                      error={loginErrors.password?.message}
                      {...registerLogin('password')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "group w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]",
                      loading && "animate-pulse"
                    )}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        Sign in
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="register-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegisterSubmit(onRegister)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <AuthInput
                      id="reg-name"
                      label="Full Name"
                      type="text"
                      placeholder="Ratan Das"
                      icon={User}
                      error={registerErrors.name?.message}
                      {...registerRegister('name')}
                    />
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground ml-1" htmlFor="reg-role">
                        Your Role
                      </label>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-500 transition-colors duration-200">
                          <Briefcase size={16} />
                        </div>
                        <select
                          id="reg-role"
                          {...registerRegister('role')}
                          className={cn(
                            "w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 appearance-none",
                            "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5",
                            registerErrors.role && "border-red-500 focus:border-red-500 focus:ring-red-500/5"
                          )}
                        >
                          <option value="student">Student</option>
                          <option value="developer">Developer</option>
                          <option value="entrepreneur">Entrepreneur</option>
                          <option value="company">Company</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <AuthInput
                    id="reg-email"
                    label="Email"
                    type="email"
                    placeholder="ratan@gmail.com"
                    icon={Mail}
                    error={registerErrors.email?.message}
                    {...registerRegister('email')}
                  />

                  <AnimatePresence mode="popLayout">
                    {(selectedRole === 'entrepreneur' || selectedRole === 'company') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AuthInput
                          id="reg-company"
                          label="Company Name"
                          type="text"
                          placeholder="Acme Inc."
                          icon={Building}
                          error={registerErrors.companyName?.message}
                          {...registerRegister('companyName')}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-2 gap-4">
                    <AuthInput
                      id="reg-password"
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      icon={Lock}
                      error={registerErrors.password?.message}
                      {...registerRegister('password')}
                    />
                    <AuthInput
                      id="reg-confirm"
                      label="Confirm"
                      type="password"
                      placeholder="••••••••"
                      icon={Lock}
                      error={registerErrors.confirmPassword?.message}
                      {...registerRegister('confirmPassword')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "cursor-pointer group w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]",
                      loading && "animate-pulse"
                    )}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        Create Account
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-muted-foreground/60 leading-relaxed px-8">
          By signing up, you agree to our <span className="underline underline-offset-4 hover:text-foreground cursor-pointer transition-colors">Terms of Service</span> and <span className="underline underline-offset-4 hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthPageContent />
    </Suspense>
  );
}
