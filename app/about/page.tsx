'use client'

import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const values = [
  {
    title: 'Authenticity First',
    description:
      'Every listed piece is rooted in genuine Ethiopian craft traditions and reviewed with care.',
  },
  {
    title: 'Artisan Dignity',
    description:
      'We center fair opportunity, direct visibility, and long-term growth for makers across regions.',
  },
  {
    title: 'Cultural Continuity',
    description:
      'Our platform helps preserve techniques, motifs, and stories that are passed down through generations.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1C1C] font-inter selection:bg-[#1C1C1C] selection:text-[#FAFAF9]">
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 pb-24 pt-32 md:px-12 md:pt-48">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center border-b border-[#e8e3d9] pb-20 md:pb-32">
          <p className="font-aeonik text-xs md:text-sm uppercase tracking-[0.2em] text-[#7a746d] mb-6">
            About EthioCraft
          </p>
          <h1 className="font-druk-medium max-w-[20ch] text-4xl uppercase leading-[1.1] tracking-[0.02em] md:text-6xl lg:text-7xl">
            Connecting Heritage Craft With Modern Commerce
          </h1>
          <p className="mt-8 max-w-[65ch] text-base md:text-lg leading-relaxed text-[#4f4b45]">
            EthioCraft is a digital marketplace built to honor Ethiopian makers, celebrate authentic handwork,
            and bring meaningful products to homes around the world. We believe each object carries a story, and
            each story deserves fair recognition.
          </p>
        </section>

        {/* MISSION SECTION */}
        <section className="grid items-center gap-12 py-20 md:grid-cols-2 md:gap-20 lg:py-32">
          <div className="flex flex-col justify-center space-y-8 order-2 md:order-1">
            <h2 className="font-druk-medium text-3xl uppercase tracking-[0.04em] md:text-5xl">Our Mission</h2>
            <div className="space-y-6 text-base md:text-lg leading-relaxed text-[#4f4b45]">
              <p>
                We empower Ethiopian artisans by providing a trusted space to showcase handcrafted products,
                access broader markets, and sustain their livelihoods while protecting the cultural identity
                embedded in their work.
              </p>
              <p>
                From woven textiles and jewelry to traditional homeware, we curate with respect for quality,
                provenance, and the people behind each piece.
              </p>
            </div>
          </div>

          <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-[#e5dfd2] bg-[#efeae0] order-1 md:order-2 shadow-sm">
            <img
              src="/Images/colorful_handcraft.jpg"
              alt="Ethiopian artisan weaving colorful handcrafts"
              className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
            {/* Subtle overlay to give the image a more premium feel */}
            <div className="absolute inset-0 bg-[#1C1C1C]/[0.02] pointer-events-none" />
          </div>
        </section>

        {/* VALUES SECTION */}
        <section className="border-t border-[#e8e3d9] py-20 lg:py-32">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-druk-medium text-3xl uppercase tracking-[0.04em] md:text-5xl">What Guides Us</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value, index) => (
              <article 
                key={value.title} 
                className="group relative overflow-hidden rounded-2xl border border-[#e3dccf] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)]"
              >
                {/* Decorative Numbering */}
                <span className="absolute top-6 right-8 font-druk-medium text-[#e8e3d9] text-3xl opacity-50 transition-opacity group-hover:opacity-100">
                  0{index + 1}
                </span>
                
                <h3 className="font-aeonik mt-4 text-[13px] uppercase tracking-[0.16em] text-[#7a746d] transition-colors group-hover:text-[#1C1C1C]">
                  {value.title}
                </h3>
                <p className="mt-5 text-sm md:text-base leading-relaxed text-[#4f4b45]">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="mb-10 overflow-hidden rounded-3xl bg-[#efeae0] px-6 py-16 md:px-16 md:py-24 border border-[#e5dfd2]">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center gap-8">
            <h2 className="font-druk-medium text-3xl uppercase tracking-[0.04em] md:text-5xl">Meet Our Marketplace</h2>
            <p className="max-w-[50ch] text-base md:text-lg leading-relaxed text-[#4f4b45]">
              Explore artisan stories, discover authentic pieces, and support a craft economy built with purpose.
            </p>
            <Link
              href="/products"
              className="group font-aeonik mt-4 inline-flex items-center gap-3 rounded-full border border-[#1C1C1C] bg-[#1C1C1C] px-8 py-4 text-xs uppercase tracking-[0.14em] text-[#FAFAF9] transition-all duration-300 hover:bg-transparent hover:text-[#1C1C1C]"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
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
  )
}