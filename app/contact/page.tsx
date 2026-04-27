'use client'

import { useState } from 'react'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle } from 'lucide-react'

const contactDetails = [
  { label: 'Email', value: 'support@ethiocraft.com' },
  { label: 'Phone', value: '+251 900 000 000' },
  { label: 'Location', value: 'Addis Ababa, Ethiopia' },
  { label: 'Hours', value: 'Mon - Fri, 9:00 AM - 6:00 PM EAT' },
]

const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = async (_values: ContactFormData) => {
    setIsSubmitted(false)
    await new Promise((resolve) => window.setTimeout(resolve, 800)) // slightly longer for smoother UX
    setIsSubmitted(true)
    reset()
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1C1C] font-inter selection:bg-[#1C1C1C] selection:text-[#FAFAF9]">
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 pb-24 pt-32 md:px-12 md:pt-48">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center border-b border-[#e8e3d9] pb-20 md:pb-32">
          <p className="font-aeonik text-xs md:text-sm uppercase tracking-[0.2em] text-[#7a746d] mb-6">
            Contact
          </p>
          <h1 className="font-druk-medium max-w-[20ch] text-4xl uppercase leading-[1.1] tracking-[0.02em] md:text-6xl lg:text-7xl">
            Let&apos;s Talk
          </h1>
          <p className="mt-8 max-w-[65ch] text-base md:text-lg leading-relaxed text-[#4f4b45]">
            Reach out for product questions, order support, artisan partnerships, or collaboration requests.
            Our team is here to help you connect with Ethiopian craft in a meaningful way.
          </p>
        </section>

        {/* MAIN CONTENT SECTION */}
        <section className="grid gap-12 py-20 md:grid-cols-5 lg:gap-20 lg:py-32">
          
          {/* CONTACT INFO */}
          <div className="md:col-span-2">
            <h2 className="font-druk-medium text-3xl uppercase tracking-[0.04em] md:text-4xl">Get In Touch</h2>
            <div className="mt-10 space-y-5">
              {contactDetails.map((item) => (
                <div 
                  key={item.label} 
                  className="group rounded-2xl border border-[#e3dccf] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)]"
                >
                  <p className="font-aeonik text-[11px] uppercase tracking-[0.16em] text-[#7a746d] transition-colors group-hover:text-[#1C1C1C]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-base md:text-lg text-[#3f3a34]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FORM */}
          <div className="md:col-span-3">
            <form 
              className="space-y-6 rounded-3xl border border-[#e3dccf] bg-white p-8 md:p-12 shadow-sm" 
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-aeonik block text-[11px] uppercase tracking-[0.14em] text-[#7a746d] ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-[#dcd4c6] bg-[#FAFAF9] px-5 py-4 text-sm outline-none transition-all duration-300 focus:border-[#C6A75E] focus:bg-white focus:ring-4 focus:ring-[#C6A75E]/10"
                  />
                  {errors.fullName && <p className="ml-1 mt-2 text-xs text-red-500">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="font-aeonik block text-[11px] uppercase tracking-[0.14em] text-[#7a746d] ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#dcd4c6] bg-[#FAFAF9] px-5 py-4 text-sm outline-none transition-all duration-300 focus:border-[#C6A75E] focus:bg-white focus:ring-4 focus:ring-[#C6A75E]/10"
                  />
                  {errors.email && <p className="ml-1 mt-2 text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-aeonik block text-[11px] uppercase tracking-[0.14em] text-[#7a746d] ml-1">
                  Subject
                </label>
                <input
                  type="text"
                  {...register('subject')}
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-[#dcd4c6] bg-[#FAFAF9] px-5 py-4 text-sm outline-none transition-all duration-300 focus:border-[#C6A75E] focus:bg-white focus:ring-4 focus:ring-[#C6A75E]/10"
                />
                {errors.subject && <p className="ml-1 mt-2 text-xs text-red-500">{errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-aeonik block text-[11px] uppercase tracking-[0.14em] text-[#7a746d] ml-1">
                  Message
                </label>
                <textarea
                  rows={6}
                  {...register('message')}
                  placeholder="Write your message here..."
                  className="w-full resize-y rounded-xl border border-[#dcd4c6] bg-[#FAFAF9] px-5 py-4 text-sm outline-none transition-all duration-300 focus:border-[#C6A75E] focus:bg-white focus:ring-4 focus:ring-[#C6A75E]/10"
                />
                {errors.message && <p className="ml-1 mt-2 text-xs text-red-500">{errors.message.message}</p>}
              </div>

              {isSubmitted && (
                <div className="flex items-center gap-3 rounded-xl border border-[#dcd4c6] bg-[#efeae0] p-4 text-sm text-[#4f4b45]">
                  <CheckCircle className="h-5 w-5 text-[#C6A75E]" />
                  <p>Your message has been sent successfully. We&apos;ll be in touch soon.</p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group font-aeonik inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#1C1C1C] bg-[#1C1C1C] px-8 py-4 text-xs uppercase tracking-[0.14em] text-[#FAFAF9] transition-all duration-300 hover:bg-transparent hover:text-[#1C1C1C] disabled:opacity-70 disabled:hover:bg-[#1C1C1C] disabled:hover:text-[#FAFAF9] md:w-auto"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {!isSubmitting && <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
                </button>
              </div>
            </form>
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