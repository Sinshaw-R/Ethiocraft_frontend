
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { useAuth } from '@/lib/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/** Maps a server role string to its dashboard path. */
function dashboardForRole(role: string): string {
  switch (role.toUpperCase()) {
    case 'ADMIN':   return '/admin/dashboard';
    case 'AGENT':   return '/agent/dashboard';
    case 'ARTISAN': return '/artisan/dashboard';
    default:        return '/customer/dashboard';
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [isReady, setIsReady]           = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => { setIsReady(true); }, []);

  const onSubmit = async (values: LoginFormData) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg =
          json?.message ??
          json?.error ??
          'Invalid credentials. Please try again.';
        setErrorMessage(msg);
        return;
      }

      // ── Extract token & role ──────────────────────────────────────────────
      // Handles both flat { token, role } and nested { data: { token, role } }
      const payload = json?.data ?? json;
      const token: string | undefined = payload?.token ?? payload?.accessToken;
      const role: string = (
        payload?.role ?? payload?.user?.role ?? 'CUSTOMER'
      ).toUpperCase();

      if (!token) {
        setErrorMessage('Login succeeded but no token was returned. Contact support.');
        return;
      }

      // ── Persist & update global auth state ────────────────────────────────
      login(token, role as any);

      // ── Redirect by role ──────────────────────────────────────────────────
      router.push(dashboardForRole(role));
    } catch {
      setErrorMessage('Unable to reach the server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1C1C] font-inter">
      <Header />
      <main className="grid min-h-[calc(100vh-80px)] grid-cols-1 md:grid-cols-2 pt-20 md:pt-24 items-start">
        <section className="sticky top-24 hidden h-[calc(100vh-6rem)] overflow-hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1600&q=80"
            alt="Ethiopian artisan crafting textiles"
            className="h-full w-full object-cover auth-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute bottom-10 left-10 max-w-[32ch] text-[#FAFAF9]">
            <h1 className="font-druk-medium text-4xl uppercase tracking-[0.03em]">
              Craft Meets Modern Living
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#ece7de]">
              Authentic Ethiopian pieces, thoughtfully crafted
            </p>
          </div>
        </section>

        <section className="flex items-center px-6 py-12 sm:px-10 md:px-14 lg:px-20">
          <div
            className="w-full max-w-[440px]"
            style={{
              opacity: isReady ? 1 : 0,
              transform: isReady ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 450ms ease, transform 450ms ease',
            }}
          >
            <div className="font-aeonik inline-flex h-9 w-9 items-center justify-center border border-[#d9d2c7] text-sm">
              E
            </div>

            <h2 className="font-druk-medium mt-6 text-3xl uppercase tracking-[0.04em] md:text-4xl">
              Welcome Back
            </h2>
            <p className="mt-3 text-sm text-[#5d564b]">Sign in to continue</p>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <label
                className="block text-sm"
                style={{
                  opacity: isReady ? 1 : 0,
                  transform: isReady ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 420ms ease 70ms, transform 420ms ease 70ms',
                }}
              >
                <span className="mb-2 block text-[#6a645a]">Email</span>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full border-0 border-b border-[#ddd6c9] bg-transparent px-0 py-2 text-[15px] outline-none transition-colors duration-300 placeholder:text-[#b3ab9f] focus:border-[#C6A75E]"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-[#9e4a45]">{errors.email.message}</p>}
              </label>

              <div
                style={{
                  opacity: isReady ? 1 : 0,
                  transform: isReady ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 420ms ease 130ms, transform 420ms ease 130ms',
                }}
              >
                <div className="mb-2 flex items-center justify-between text-sm">
                  <label htmlFor="password" className="text-[#6a645a]">
                    Password
                  </label>
                  <a href="/auth/forgot-password" className="text-xs text-[#7a7368] transition-colors hover:text-[#C6A75E]">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="w-full border-0 border-b border-[#ddd6c9] bg-transparent px-0 py-2 text-[15px] outline-none transition-colors duration-300 placeholder:text-[#b3ab9f] focus:border-[#C6A75E]"
                  placeholder="Enter your password"
                />
                {errors.password && <p className="mt-1 text-xs text-[#9e4a45]">{errors.password.message}</p>}
              </div>

              {errorMessage && (
                <p
                  role="alert"
                  className="font-aeonik rounded bg-[#fff3f2] px-3 py-2 text-sm text-[#9e4a45] border border-[#f5c6c4]"
                >
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="font-aeonik mt-2 w-full bg-[#1C1C1C] px-4 py-3 text-sm text-[#FAFAF9] transition-all duration-300 hover:-translate-y-[1px] hover:opacity-90 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {isLoading ? 'Signing in…' : 'Sign In'}
              </button>

              <button
                type="button"
                className="font-aeonik w-full border border-[#dfd8cb] px-4 py-3 text-sm transition-colors duration-300 hover:bg-[#f2eee6]"
              >
                Continue with Google
              </button>
            </form>

            <p className="mt-6 text-sm text-[#5d564b]">
              Don&apos;t have an account?{' '}
              <a href="/auth/register" className="underline decoration-[#d2c7b5] underline-offset-4 hover:text-[#1C1C1C]">
                Sign up
              </a>
            </p>

            <div className="mt-10 border-t border-[#e8e1d4] pt-6 text-sm text-[#6a645a]">
              Are you an artisan?{' '}
              <a
                href="/artisan/landing"
                className="font-aeonik group inline-flex items-center gap-1 text-[#C6A75E] transition-colors hover:text-[#b1924e]"
              >
                Start selling your craft
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        .font-druk-medium { font-family: var(--font-druk-medium), sans-serif; }
        .font-aeonik      { font-family: var(--font-aeonik), sans-serif; }
        .font-inter       { font-family: var(--font-inter), sans-serif; }
      `}</style>
    </div>
  );
}