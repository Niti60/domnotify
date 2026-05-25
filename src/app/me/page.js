'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Briefcase,
  Building,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { ProfilePictureUpload } from '@/components/auth/ProfilePictureUpload';
import { cn } from '@/lib/cn';
import AuthRequiredState from '@/components/auth/AuthRequiredState';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['student', 'developer', 'entrepreneur', 'company']),
  companyName: z.string().optional(),
  profilePic: z.string().optional(),
}).superRefine((data, ctx) => {
  if (['entrepreneur', 'company'].includes(data.role) && (!data.companyName || data.companyName.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['companyName'],
      message: 'Company name is required for your role'
    });
  }
});

function SettingsInput({ label, icon: Icon, error, readOnly, ...props }) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[13px] font-semibold text-muted-foreground ml-1" htmlFor={props.id}>
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-blue-500 transition-colors duration-200">
          <Icon size={18} />
        </div>
        <input
          {...props}
          readOnly={readOnly}
          className={cn(
            "w-full bg-background border border-border rounded-xl py-3 pl-11 pr-4 text-[14px] outline-none transition-all duration-200",
            readOnly ? "opacity-60 cursor-not-allowed bg-muted/20" : "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 hover:border-muted-foreground/30",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/5"
          )}
        />
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


export default function MePage() {
  const { user, loading: authLoading, logout, refreshUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      role: 'student',
      companyName: '',
      profilePic: ''
    }
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        role: user.role || 'student',
        companyName: user.companyName || '',
        profilePic: user.profilePic || ''
      });
    }
  }, [user, reset]);

  const onUpdateProfile = async (data) => {
    setIsSaving(true);
    setApiError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setApiError(json.message || 'Failed to update profile');
        return;
      }

      setSuccessMsg('Profile updated successfully');
      await refreshUser();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setApiError('Network error. Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <AuthRequiredState
        title="Session Expired"
        description="Please login again to access your profile and account settings."
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-[2rem] shadow-xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="relative h-32 bg-blue-600/10 border-b border-border/50">
            <div className="absolute -bottom-12 left-8">
              <Controller
                name="profilePic"
                control={control}
                render={({ field }) => (
                  <ProfilePictureUpload
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.profilePic?.message}
                    className="large !mb-0"
                  />
                )}
              />
            </div>
            <div className="absolute right-8 top-8">
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background/50 backdrop-blur-sm border border-border hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all duration-200 text-xs font-semibold text-muted-foreground"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>

          <div className="pt-16 pb-10 px-8">
            <div className="mb-10">
              <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Mail size={14} />
                {user.email}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/50 ml-2">
                  {user.role}
                </span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingsInput
                  id="profile-name"
                  label="Display Name"
                  icon={User}
                  placeholder="Your name"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-muted-foreground ml-1" htmlFor="profile-role">
                    Your Role
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-blue-500 transition-colors duration-200">
                      <Briefcase size={18} />
                    </div>
                    <select
                      id="profile-role"
                      {...register('role')}
                      className={cn(
                        "w-full bg-background border border-border rounded-xl py-3 pl-11 pr-4 text-[14px] outline-none transition-all duration-200 appearance-none",
                        "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 hover:border-muted-foreground/30",
                        errors.role && "border-red-500"
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

              {['entrepreneur', 'company'].includes(selectedRole) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  <SettingsInput
                    id="profile-company"
                    label="Company Name"
                    icon={Building}
                    placeholder="Acme Inc."
                    error={errors.companyName?.message}
                    {...register('companyName')}
                  />
                </motion.div>
              )}

              <SettingsInput
                id="profile-email"
                label="Email Address (Linked to Account)"
                icon={Mail}
                value={user.email}
                readOnly
              />

              <div className="pt-6 border-t border-border flex flex-col gap-4">
                {apiError && (
                  <div className="flex items-center gap-2 text-red-500 text-xs font-medium bg-red-500/5 p-3 rounded-xl border border-red-500/20">
                    <AlertCircle size={14} />
                    {apiError}
                  </div>
                )}

                {successMsg && (
                  <div className="flex items-center gap-2 text-emerald-500 text-xs font-medium bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20 animate-in fade-in slide-in-from-top-1">
                    <CheckCircle2 size={14} />
                    {successMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="group w-full md:w-fit min-w-[160px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-sm font-bold transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-[11px] text-muted-foreground/60 leading-relaxed uppercase tracking-widest font-bold">
          Account Settings &bull; DomNotify v1.0
        </p>
      </div>
    </div>
  );
}
