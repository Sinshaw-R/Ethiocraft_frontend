'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu, X, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useHeader } from '@/lib/header-context'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth-context'
import MegaMenu from '../MegaMenu'

/** Returns the dashboard URL for the currently logged-in role. */
function dashboardForRole(role: string | null): string {
  switch (role?.toUpperCase()) {
    case 'ADMIN':   return '/admin/dashboard'
    case 'AGENT':   return '/agent/dashboard'
    case 'ARTISAN': return '/artisan/dashboard'
    default:        return '/customer/dashboard'
  }
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isOverHero, setIsOverHero] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { setIsHovered: setGlobalIsHovered } = useHeader()
  const { token, role } = useAuth()
  const isLoggedIn = Boolean(token)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) {
      setIsOverHero(false)
      return
    }

    const handleScroll = () => {
      const heroText = hero.querySelector('h1')
      let overHero = true

      if (heroText) {
        const rect = heroText.getBoundingClientRect()
        const headerHeight = headerRef.current?.offsetHeight || 0
        overHero = rect.top > headerHeight
      } else {
        overHero = window.scrollY < hero.offsetHeight
      }

      setIsOverHero(overHero)

      // If we leave the hero section, force-clear hover state to keep background stable
      if (!overHero) {
        setIsHovered(false)
        setGlobalIsHovered(false)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      let bgColor = '#FAFAF9'
      let borderColor = 'rgba(0, 0, 0, 0.1)' // Subtle bottom border

      if (isOverHero) {
        bgColor = isHovered ? '#FAFAF9' : 'transparent'
        borderColor = 'transparent'
      }

      gsap.to(headerRef.current, {
        backgroundColor: bgColor,
        borderBottom: `1px solid ${borderColor}`,
        duration: 0.3,
        ease: 'power2.inOut'
      })
    }, headerRef)

    return () => ctx.revert() // Important: Clean up GSAP context on unmount/re-render
  }, [isOverHero, isHovered])

  const handleSearchClick = () => {
    setIsSearchOpen(true)
    // Wait for render
    setTimeout(() => {
      if (searchBarRef.current) {
        gsap.set(searchBarRef.current, { y: '-100%' })
        gsap.to(searchBarRef.current, { y: '0%', duration: 0.5, ease: 'power2.out' })
        setTimeout(() => searchInputRef.current?.focus(), 300)
      }
    }, 0)
  }

  const handleCloseSearch = () => {
    if (searchBarRef.current) {
      gsap.to(searchBarRef.current, {
        y: '-100%',
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => setIsSearchOpen(false)
      })
    }
  }

  useEffect(() => {
    if (isSearchOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
          handleCloseSearch()
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen])

  const textColor = isOverHero && !isHovered ? 'text-white' : 'text-[#1C1C1C]'

  return (
    <div className="header-wrapper">
      <header 
        ref={headerRef}
        className="fixed top-0 w-full z-50"
        onMouseEnter={() => {
          // Hover background effect only active when on Hero section
          if (isOverHero) {
            setIsHovered(true)
            setGlobalIsHovered(true)
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false)
          setGlobalIsHovered(false)
        }}
      >
        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center justify-between relative">
            {/* Logo */}
            <Link href="/" className={`flex items-center gap-2 font-bold text-xl transition-colors font-logo ${textColor}`}>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center weight-light">
                <span className="text-primary font-bold">E</span>
              </div>
              <span className="hidden  text-sm uppercase tracking-wider sm:inline">EthioCraft</span>
            </Link>

            {/* Center Navigation */}
            
            <nav className="hidden md:flex items-center gap-8 relative">
              <MegaMenu textColor={textColor}/>
              <button
                onClick={handleSearchClick}
                className={`font-aeonik text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:text-secondary ${textColor}`}
              >
                Search
              </button>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Menu Toggle - Mobile */}
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                <Link 
                  href="/about" 
                  className={`font-aeonik px-3 text-xs font-bold uppercase tracking-widest transition-colors hover:text-secondary ${textColor}`}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className={`font-aeonik px-3 text-xs font-bold uppercase tracking-widest transition-colors hover:text-secondary ${textColor}`}
                >
                  Contact
                </Link>
                {isLoggedIn ? (
                  <Link
                    href={dashboardForRole(role)}
                    aria-label="My account"
                    className={`transition-colors ${textColor} hover:text-secondary`}
                  >
                    <UserCircle className="w-6 h-6" />
                  </Link>
                ) : (
                  <Link href="/auth/login">
                    <Button variant="outline" className={`font-aeonik transition-colors border-current ${textColor} uppercase tracking-widest bg-transparent hover:bg-[#FAFAF9]/20`}>
                      sign in
                    </Button>
                  </Link>
                )}
                <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`transition-colors ${textColor} hover:bg-[#FAFAF9]/20`}
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </Link>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden transition-colors ${textColor}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Wrapper - Provides a stable DOM node for React */}
          <div className="md:hidden">
            {isMenuOpen && (
              <div className="mt-4 pb-4 transition-colors">
                <div className="flex flex-col gap-4 mt-4 px-2">
                  <Link 
                    href="/products" 
                    className={`text-xs font-bold uppercase tracking-widest ${textColor}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Category
                  </Link>
                  <Link 
                    href="#" 
                    className={`text-xs font-bold uppercase tracking-widest ${textColor}`}
                    onClick={() => { setIsMenuOpen(false); handleSearchClick(); }}
                  >
                    Search
                  </Link>
                  <Link 
                    href="/about" 
                    className={`text-xs font-bold uppercase tracking-widest ${textColor}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/contact" 
                    className={`text-xs font-bold uppercase tracking-widest ${textColor}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <Separator className="bg-current opacity-10" />
                  {isLoggedIn ? (
                    <Link
                      href={dashboardForRole(role)}
                      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${textColor}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserCircle className="w-5 h-5" />
                      My Account
                    </Link>
                  ) : (
                    <Link href="/auth/login" className="w-full">
                      <Button
                        variant="outline"
                        className={`w-full transition-colors border-current ${textColor} bg-transparent hover:bg-[#FAFAF9]/20`}
                      >
                        sign in
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Overlay Wrapper - Prevents removeChild failure on navigation */}
      <div className="search-overlay-container">
        {isSearchOpen && (
          <div className="search-overlay-root">
            <div 
              className="fixed inset-0 bg-black/50 z-50"
              onClick={handleCloseSearch}
            />
            <div 
              ref={searchBarRef}
              className="fixed top-0 left-0 w-full bg-[#FAFAF9] z-[60] shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container mx-auto px-4 py-4">
                <div className="relative w-full max-w-2xl mx-auto">
                  <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search products..."
                    className="pl-10 pr-10 text-[#1C1C1C] placeholder:text-muted-foreground bg-white border border-gray-300"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#1C1C1C]"
                    onClick={handleCloseSearch}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
