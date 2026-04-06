"use client";
import { cn } from '@/lib/utils';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { FormEvent, useEffect, useState } from 'react';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setIsReady(true);
  }, []); 

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder action for demo usage.
    console.log('Create account', { fullName, email, password });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1C1C] font-inter">
      <Header />
      <main className="grid min-h-[calc(100vh-80px)] grid-cols-1 md:grid-cols-2 pt-20 md:pt-24 items-start">
        <section className="sticky top-24 hidden h-[calc(100vh-6rem)] overflow-hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1400&q=80"
            alt="Ethiopian artisan weaving textile"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="absolute bottom-10 left-10 max-w-[30ch] text-[#FAFAF9]">
            <h1
              className="font-druk-medium text-4xl uppercase tracking-[0.04em]"
            >
              Crafted for You
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#f1eee8]">
              Discover authentic handmade pieces rooted in Ethiopian tradition
            </p>
          </div>
        </section>

        <section className="flex items-center px-6 py-12 sm:px-10 md:px-14 lg:px-20">
          <div
            className="w-full max-w-[460px]"
            style={{
              opacity: isReady ? 1 : 0,
              transform: isReady ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 450ms ease, transform 450ms ease',
            }}
          >
            <p
              className="font-aeonik text-xs uppercase tracking-[0.14em] text-[#7a7368]"
            >
              Ethiopian Crafted Marketplace
            </p>
            <h2
              className="font-druk-medium mt-4 text-3xl uppercase tracking-[0.04em] md:text-4xl"
            >
              Create Your Account
            </h2>
            <p className="mt-3 text-sm text-[#5d564b]">Start exploring handcrafted pieces</p>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <label className="block text-sm">
                <span className="mb-2 block text-[#6a645a]">Full Name</span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full border-0 border-b border-[#ddd6c9] bg-transparent px-0 py-2 text-[15px] outline-none transition-colors duration-300 placeholder:text-[#b3ab9f] focus:border-[#C6A75E]"
                  placeholder="Alemayehu Bekele"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block text-[#6a645a]">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border-0 border-b border-[#ddd6c9] bg-transparent px-0 py-2 text-[15px] outline-none transition-colors duration-300 placeholder:text-[#b3ab9f] focus:border-[#C6A75E]"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block text-[#6a645a]">Password</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full border-0 border-b border-[#ddd6c9] bg-transparent px-0 py-2 text-[15px] outline-none transition-colors duration-300 placeholder:text-[#b3ab9f] focus:border-[#C6A75E]"
                  placeholder="At least 8 characters"
                />
              </label>

              <button
                type="submit"
                className="mt-2 w-full bg-[#1C1C1C] px-4 py-3 text-sm text-[#FAFAF9] transition-opacity duration-300 hover:opacity-90"
                // Removed inline style, font-aeonik is applied via global layout
              >
                Create Account
              </button>
            </form>

            <p className="mt-6 text-sm text-[#5d564b]">
              Already have an account?{' '}
              <a href="#" className="underline decoration-[#d2c7b5] underline-offset-4 hover:text-[#1C1C1C]">
                Sign in
              </a>
            </p>

            <div className="mt-10 border-t border-[#e8e1d4] pt-6 text-sm text-[#6a645a]">
              Are you an artisan?{' '}
              <a
                href="/auth/register/artisan"
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
        .font-druk-medium {
          font-family: var(--font-druk-medium), sans-serif;
        }
        .font-aeonik {
          font-family: var(--font-aeonik), sans-serif;
        }
        .font-inter {
          font-family: var(--font-inter), sans-serif;
        }
      `}</style>
    </div>
  );
}