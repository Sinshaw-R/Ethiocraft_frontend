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

  const categories: MenuCategory[] = [
    {
      name: 'Pottery & Ceramics',
      items: ['Handmade Pots', 'Decorative Plates', 'Vases', 'Functional Ware'],
    },
    {
      name: 'Weaving & Textiles',
      items: ['Hand-Woven Fabric', 'Traditional Shawls', 'Scarves', 'Rugs'],
    },
    {
      name: 'Leatherwork',
      items: ['Leather Bags', 'Shoes', 'Belts', 'Leather Accessories'],
    },
    {
      name: 'Metalwork',
      items: ['Silver Jewelry', 'Copper Items', 'Bronze Art', 'Metal Crafts'],
    },
    {
      name: 'Basketry',
      items: ['Storage Baskets', 'Decorative Baskets', 'Food Baskets', 'Woven Art'],
    },
    {
      name: 'Jewelry & Beadwork',
      items: ['Traditional Necklaces', 'Beaded Bracelets', 'Earrings', 'Rings'],
    },
  ]

  const regions = ['Addis Ababa', 'Hawassa', 'Gondar', 'Lalibela', 'Dire Dawa', 'Axum']

  const priceRanges = ['0-500 ETB', '500-1000 ETB', '1000-2000 ETB', '2000+ ETB']

  const culturalTags = ['Religious', 'Ceremonial', 'Daily Use', 'Decorative', 'Gifts']

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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <div key={category.name}>
                        <p className="font-medium text-foreground mb-2">{category.name}</p>
                        <ul className="space-y-1">
                          {category.items.map((item) => (
                            <li key={item}>
                              <Link
                                href={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(item)}`}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
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
                    {priceRanges.map((range) => (
                      <li key={range}>
                        <Link
                          href={`/products?priceRange=${encodeURIComponent(range)}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                        >
                          {range}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cultural Tags Column */}
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-4 text-lg">Cultural Tags</h3>
                  <ul className="space-y-2 mb-6">
                    {culturalTags.map((tag) => (
                      <li key={tag}>
                        <Link
                          href={`/products?tag=${encodeURIComponent(tag)}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                        >
                          {tag}
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