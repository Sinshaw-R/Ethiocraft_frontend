'use client'

import Link from 'next/link'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Users, Lock, ArrowRight } from 'lucide-react'

export default function AuthChoicePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col font-inter">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-foreground font-bold text-2xl">E</span>
            </div>
            <h1 className="font-druk-medium text-3xl md:text-4xl uppercase tracking-tight mb-3">Authentication</h1>
            <p className="font-aeonik text-sm uppercase tracking-widest text-muted-foreground">Choose your portal to continue</p>
          </div>

          {/* Login Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer & Artisan Login */}
            <Link href="/auth/login">
              <Card className="h-full p-8 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Users className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <h2 className="font-druk-medium text-xl uppercase mb-2">Customer & Artisan</h2>
                    <p className="text-muted-foreground mb-4">
                      Shop handcrafted products or sell your creations
                    </p>
                  </div>
                  <div className="w-full pt-4 border-t border-border">
                    <Button className="font-aeonik uppercase tracking-widest w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
                      Login <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Staff & Admin Login */}
            <Link href="/auth/admin">
              <Card className="h-full p-8 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer border-primary/20">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                    <Lock className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-druk-medium text-xl uppercase mb-2">Staff & Admin</h2>
                    <p className="text-muted-foreground mb-4">
                      Manage platform, verify sellers, handle support
                    </p>
                  </div>
                  <div className="w-full pt-4 border-t border-border">
                    <Button className="font-aeonik uppercase tracking-widest w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                      Login <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          {/* Registration Link */}
          <div className="mt-8 text-center font-aeonik text-xs uppercase tracking-widest">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-[#C6A75E] font-bold hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <style jsx>{`
        .font-druk-medium { font-family: var(--font-druk-medium), sans-serif; }
        .font-aeonik { font-family: var(--font-aeonik), sans-serif; }
        .font-inter { font-family: var(--font-inter), sans-serif; }
      `}</style>
    </div>
  )
}
