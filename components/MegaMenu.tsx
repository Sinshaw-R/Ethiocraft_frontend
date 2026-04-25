'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

interface MenuCategory {
  name: string
  items: string[]
}

interface MenuSection {
  title: string
  items: string[]
}

export default function MegaMenu({ textColor }: { textColor: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [menuTop, setMenuTop] = useState(0)

  // Calculate the button's bottom position when the menu opens
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuTop(rect.bottom)
    }
  }, [isOpen])

  const categories: string[] = ['Textiles', 'Jewelry', 'Home', 'Accessories']

  const regions = ['Addis Ababa', 'Oromia', 'SNNPR', 'Amhara', 'Tigray']

  const priceRanges = ['0-500 ETB', '500-1000 ETB', '1000-2000 ETB', '2000+ ETB']

  const materials = ['Clay', 'Cotton', 'Silver', 'Straw', 'Leather']

  return (
    <div className="inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-4 py-2 font-aeonik text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:text-secondary ${textColor}`}
      >
        Shop
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Mega Menu – fixed positioning aligned to left edge */}
          <div
            className="fixed left-0 w-screen bg-white border-t border-border shadow-lg z-50"
            style={{ top: `${menuTop}px` }}
          >
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Categories Column */}
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-4 text-lg">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category}>
                        <Link
                          href={`/products?category=${encodeURIComponent(category)}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Regions Column */}
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-4 text-lg">Regions</h3>
                  <ul className="space-y-2">
                    {regions.map((region) => (
                      <li key={region}>
                        <Link
                          href={`/products?region=${encodeURIComponent(region)}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                        >
                          {region}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <h3 className="font-serif font-bold text-foreground mb-4 text-lg mt-6">Price Range</h3>
                  <ul className="space-y-2">
                    {priceRanges.map((range) => {
                      const [min, max] = range === '2000+ ETB' 
                        ? [2000, 10000] 
                        : range.split('-').map(r => parseInt(r.replace(' ETB', '')));
                      return (
                        <li key={range}>
                          <Link
                            href={`/products?minPrice=${min}&maxPrice=${max}`}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                          >
                            {range}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Materials Column */}
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-4 text-lg">Materials</h3>
                  <ul className="space-y-2 mb-6">
                    {materials.map((material) => (
                      <li key={material}>
                        <Link
                          href={`/products?material=${encodeURIComponent(material)}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                        >
                          {material}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Promotional Banner */}
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-8">
                    <p className="text-sm font-medium text-primary mb-2">
                      New Artisans Weekly
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Discover fresh collections from newly verified Ethiopian artisans.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}