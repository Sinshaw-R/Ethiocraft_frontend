"use client";
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

type Step = 'EMAIL' | 'VERIFY_RESET' | 'SUCCESS';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [step, setStep] = useState<Step>('EMAIL');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Data
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => { setIsReady(true); }, []);

  // Step 1: Request Reset (Sends OTP to Email)
  const handleRequestReset = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.message || 'We couldn’t find an account with that email.');
      }

      setStep('VERIFY_RESET');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and Set New Password
  const handleFinalReset = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword: password }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.message || 'Invalid or expired code.');
      }

      setStep('SUCCESS');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1C1C] font-inter flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div
          className="w-full max-w-[440px]"
          style={{
            opacity: isReady ? 1 : 0,
            transform: isReady ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 600ms ease, transform 600ms ease',
          }}
        >
          {/* Brand Mark */}
          <div className="font-aeonik mx-auto mb-8 flex h-12 w-12 items-center justify-center border border-[#d9d2c7] text-lg">
            E
          </div>

          {step === 'EMAIL' && (
            <div className="text-center">
              <h2 className="font-druk-medium text-3xl uppercase tracking-[0.04em] md:text-4xl">
                Reset Access
              </h2>
              <p className="mt-4 text-sm text-[#5d564b]">
                Enter your registered email address and we&apos;ll send you a verification code.
              </p>

              <form className="mt-10 space-y-8 text-left" onSubmit={handleRequestReset}>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-widest text-[#6a645a]">Email Address</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-0 border-b border-[#ddd6c9] bg-transparent px-0 py-3 text-[15px] outline-none transition-colors duration-300 placeholder:text-[#b3ab9f] focus:border-[#C6A75E]"
                    placeholder="name@example.com"
                  />
                </label>

                {errorMessage && (
                  <p className="font-aeonik text-sm text-[#9e4a45] bg-[#fff3f2] p-3 border border-[#f5c6c4]">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="font-aeonik w-full bg-[#1C1C1C] py-4 text-sm text-[#FAFAF9] transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? 'Sending Code…' : 'Send Reset Code'}
                </button>
              </form>
            </div>
          )}

          {step === 'VERIFY_RESET' && (
            <div className="text-center">
              <h2 className="font-druk-medium text-3xl uppercase tracking-[0.04em]">
                Verify Identity
              </h2>
              <p className="mt-4 text-sm text-[#5d564b]">
                We sent a 6-digit code to <span className="text-[#1C1C1C] font-medium">{email}</span>
              </p>

              <form className="mt-10 space-y-6 text-left" onSubmit={handleFinalReset}>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-widest text-[#6a645a]">Verification Code</span>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border-0 border-b border-[#ddd6c9] bg-transparent px-0 py-3 text-[18px] tracking-[0.8em] outline-none focus:border-[#C6A75E]"
                    placeholder="000000"
                  />
                </label>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-widest text-[#6a645a]">New Password</span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-0 border-b border-[#ddd6c9] bg-transparent px-0 py-3 text-[15px] outline-none focus:border-[#C6A75E]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-widest text-[#6a645a]">Confirm</span>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border-0 border-b border-[#ddd6c9] bg-transparent px-0 py-3 text-[15px] outline-none focus:border-[#C6A75E]"
                    />
                  </label>
                </div>

                {errorMessage && (
                  <p className="font-aeonik text-sm text-[#9e4a45] bg-[#fff3f2] p-3 border border-[#f5c6c4]">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="font-aeonik w-full bg-[#1C1C1C] py-4 text-sm text-[#FAFAF9] transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? 'Resetting…' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f8fcf9] text-green-600 border border-green-100">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-druk-medium text-3xl uppercase tracking-[0.04em]">
                Password Updated
              </h2>
              <p className="mt-4 text-sm text-[#5d564b]">
                Your account is secure again. You can now use your new password to sign in.
              </p>
              <button
                onClick={() => router.push('/auth/login')}
                className="font-aeonik mt-10 w-full bg-[#1C1C1C] py-4 text-sm text-[#FAFAF9] transition-all hover:opacity-90"
              >
                Sign In Now
              </button>
            </div>
          )}

          <div className="mt-12 text-center">
            <a 
              href="/auth/login" 
              className="text-xs uppercase tracking-widest text-[#8a847a] transition-colors hover:text-[#1C1C1C]"
            >
              ← Back to login
            </a>
          </div>
        </div>
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