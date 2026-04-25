"use client";
import { cn } from '@/lib/utils';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import CheckoutPage from '@/components/CheckoutPage';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import ChatSupport from '@/components/ChatSupport';



export default function CheckoutPageRoute() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <CheckoutPage />
      <ChatSupport />
      <Footer />
    </main>
  )
}