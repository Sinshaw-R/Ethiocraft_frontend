"use client";
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  category: 'Textiles' | 'Jewelry' | 'Home' | 'Accessories';
  price: number;
  image: string;
  badge?: 'Handmade' | 'New';
  region?: string;
  material?: string;
  rating: number; 
};

const products: Product[] = [
  {
    id: 1,
    name: 'Habesha Cotton Dress',
    category: 'Textiles',
    price: 168,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    badge: 'Handmade',
    region: 'Amhara',
    material: 'Cotton',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Lalibela Filigree Earrings',
    category: 'Jewelry',
    price: 124,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    badge: 'New',
    region: 'Amhara',
    material: 'Silver',
    rating: 4.5,
  },
  {
    id: 3,
    name: 'Sidama Coffee Ceremony Set',
    category: 'Home',
    price: 210,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    badge: 'Handmade',
    region: 'SNNPR',
    material: 'Clay',
    rating: 5.0,
  },
  {
    id: 4,
    name: 'Woven Mesob Basket',
    category: 'Home',
    price: 96,
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=900&q=80',
    region: 'Oromia',
    material: 'Straw',
    rating: 4.2,
  },
  {
    id: 5,
    name: 'Addis Leather Weekender',
    category: 'Accessories',
    price: 182,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    badge: 'New',
    region: 'Addis Ababa',
    material: 'Leather',
    rating: 4.9,
  },
  {
    id: 6,
    name: 'Hand-Loomed Gabi Shawl',
    category: 'Textiles',
    price: 88,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    badge: 'Handmade',
    region: 'Addis Ababa',
    material: 'Cotton',
    rating: 4.7,
  },
  {
    id: 7,
    name: 'Axum Cross Pendant',
    category: 'Jewelry',
    price: 116,
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80',
    region: 'Tigray',
    material: 'Silver',
    rating: 4.6,
  },
  {
    id: 8,
    name: 'Harar Palm Tote',
    category: 'Accessories',
    price: 74,
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80',
    badge: 'Handmade',
    region: 'Oromia',
    material: 'Straw',
    rating: 4.4,
  },
];

const categories = ['All', 'Textiles', 'Jewelry', 'Home', 'Accessories'] as const;
const regionsList = ['Addis Ababa', 'Oromia', 'SNNPR', 'Amhara', 'Tigray'];
const materialsList = ['Clay', 'Cotton', 'Silver', 'Straw', 'Leather'];

export default function productPage() {
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<'curated' | 'price-low' | 'price-high' | 'newest' | 'rating-high' | 'rating-low'>('curated');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleIds, setVisibleIds] = useState<number[]>([]);

  // Filter States
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All');
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showHandmadeOnly, setShowHandmadeOnly] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categories.includes(category as any)) {
      setActiveCategory(category as any);
    }

    const region = searchParams.get('region');
    if (region && regionsList.includes(region)) {
      setSelectedRegions([region]);
    }

    const material = searchParams.get('material');
    if (material && materialsList.includes(material)) {
      setSelectedMaterials([material]);
    }

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice && maxPrice) {
      setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    // 1. Apply Filters
    let base = products
      .filter((product) => activeCategory === 'All' || product.category === activeCategory)
      .filter((product) => (showNewOnly ? product.badge === 'New' : true))
      .filter((product) => (showHandmadeOnly ? product.badge === 'Handmade' : true))
      .filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])
      .filter((product) => selectedRegions.length === 0 || (product.region && selectedRegions.includes(product.region)))
      .filter((product) => selectedMaterials.length === 0 || (product.material && selectedMaterials.includes(product.material)));

    // 2. Apply Sorting
    if (sortBy === 'price-low') return [...base].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') return [...base].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating-high') return [...base].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'rating-low') return [...base].sort((a, b) => a.rating - b.rating);
    if (sortBy === 'newest') {
      return [...base].sort((a, b) => {
        if (a.badge === 'New' && b.badge !== 'New') return -1;
        if (a.badge !== 'New' && b.badge === 'New') return 1;
        return 0;
      });
    }
    
    return base; // 'curated' default
  }, [activeCategory, showHandmadeOnly, showNewOnly, sortBy, priceRange, selectedRegions, selectedMaterials]);

  useEffect(() => {
    setVisibleIds([]);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = Number(entry.target.getAttribute('data-product-id'));
            setVisibleIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
          }
        });
      },
      { threshold: 0.18 },
    );

    const items = document.querySelectorAll('[data-product-id]');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [filteredProducts]);

  const resetFilters = () => {
    setActiveCategory('All');
    setShowNewOnly(false);
    setShowHandmadeOnly(false);
    setSelectedRegions([]);
    setSelectedMaterials([]);
    setPriceRange([0, 500]);
  };

  const toggleArrayFilter = (item: string, state: string[], setState: (val: string[]) => void) => {
    setState(state.includes(item) ? state.filter((i) => i !== item) : [...state, item]);
  };

  const hasActiveFilters = activeCategory !== 'All' || showNewOnly || showHandmadeOnly || selectedRegions.length > 0 || selectedMaterials.length > 0 || priceRange[0] > 0 || priceRange[1] < 500;

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1C1C]">
      <Header />
      <main className="mx-auto max-w-[1400px] px-5 pt-28 pb-8 md:px-10 md:pt-36 md:py-12">
        <section className="mb-10 flex flex-col justify-between gap-5 border-b border-[#e8e5df] pb-8 md:flex-row md:items-end">
          <div>
            <p
              className="text-3xl uppercase tracking-[0.08em] md:text-4xl"
              style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}
            >
              Collection
            </p>
            <p className="mt-2 text-sm text-[#5f5b55]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Authentic handcrafted pieces from Ethiopia
            </p>
          </div>

          <div className="flex items-center gap-3" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-11 rounded-none border border-[#ddd8cf] bg-transparent px-4 text-sm outline-none transition-colors focus:border-[#C6A75E]"
            >
              <option value="curated">Curated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating-high">Rating: High to Low</option>
              <option value="rating-low">Rating: Low to High</option>
              <option value="newest">Newest Arrivals</option>
            </select>

            <button
              onClick={() => setDrawerOpen(true)}
              className="relative h-11 border border-[#ddd8cf] px-5 text-sm transition-colors hover:border-[#C6A75E] hover:text-[#C6A75E]"
            >
              Filters
              {hasActiveFilters && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#C6A75E]" />
              )}
            </button>
          </div>
        </section>

        {filteredProducts.length === 0 ? (
          <section className="py-20 text-center">
            <p className="text-lg">No pieces found for this selection.</p>
            <button
              onClick={resetFilters}
              className="mt-6 border border-[#ddd8cf] px-6 py-3 text-sm transition-colors hover:border-[#C6A75E] hover:text-[#C6A75E]"
              style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}
            >
              Reset Filters
            </button>
          </section>
        ) : (
          <section className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-9 md:gap-y-16 xl:grid-cols-4">
            {filteredProducts.map((product, index) => {
              const isVisible = visibleIds.includes(product.id);
              return (
                <article
                  key={product.id}
                  data-product-id={product.id}
                  className="group"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(26px)',
                    transition: `opacity 700ms ease ${index * 70}ms, transform 700ms ease ${index * 70}ms`,
                  }}
                >
                  <Link href={`/products/${product.id}`} className="group block">
                    <div className="relative overflow-hidden bg-[#f1eee8]">
                      {product.badge && (
                        <span
                          className="absolute left-3 top-3 z-10 border border-[#d8c28a] bg-[#fafaf9cc] px-2 py-1 text-[10px] uppercase tracking-[0.1em]"
                          style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}
                        >
                          {product.badge}
                        </span>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-[240px] w-full object-cover transition duration-500 ease-out group-hover:scale-105 md:h-[320px]"
                      />
                      <div
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 border border-[#e6dfd2] bg-[#fafaf9f0] px-4 py-2 text-xs opacity-0 transition duration-300 group-hover:opacity-100"
                        style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}
                      >
                        Quick View
                      </div>
                    </div>
                  </Link>

                  <div className="pt-4">
                    {/* ADDED RATING HERE */}
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#7a746d]">{product.category}</p>
                      <div className="flex items-center gap-1 text-[11px] text-[#C6A75E]">
                        <span>★</span>
                        <span style={{ fontFamily: 'Inter, sans-serif' }}>{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <Link href={`/products/${product.id}`}>
                      <h3
                        className="mt-2 text-sm uppercase tracking-[0.05em] transition-colors duration-300 hover:text-[#C6A75E] md:text-base"
                        style={{ fontFamily: '"Druk Wide", Aeonik, Inter, sans-serif' }}
                      >
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="mt-4 flex items-center justify-between border-t border-[#e8e5df] pt-4">
                      <p className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        ${product.price}
                      </p>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart logic can be triggered here
                        }}
                        variant="outline"
                        className="h-9 rounded-none border-[#ddd8cf] bg-transparent px-4 text-[10px] uppercase tracking-widest transition-colors hover:border-[#C6A75E] hover:bg-[#C6A75E] hover:text-white"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      <div
        className={`fixed inset-0 z-40 bg-black/25 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[320px] overflow-y-auto border-l border-[#e8e0d1] bg-[#FAFAF9] px-6 py-8 transition-transform duration-[400ms] ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
            Filters
          </h2>
          <button className="text-sm" onClick={() => setDrawerOpen(false)} style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
            Close
          </button>
        </div>

        <div className="space-y-8" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.1em] text-[#7a746d]">Category</p>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`block w-full border px-3 py-2 text-left text-sm transition-colors ${
                    activeCategory === category
                      ? 'border-[#C6A75E] text-[#C6A75E]'
                      : 'border-[#ddd8cf] hover:border-[#C6A75E]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.1em] text-[#7a746d]">Price Range</p>
            <Slider
              defaultValue={[0, 500]}
              min={0}
              max={500}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-3 w-full"
            />
            <div className="flex items-center justify-between text-sm text-[#1c1c1c]">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.1em] text-[#7a746d]">Region of Origin</p>
            <div className="space-y-2">
              {regionsList.map((region) => (
                <label key={region} className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedRegions.includes(region)}
                    onChange={() => toggleArrayFilter(region, selectedRegions, setSelectedRegions)}
                  />
                  {region}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.1em] text-[#7a746d]">Material</p>
            <div className="space-y-2">
              {materialsList.map((mat) => (
                <label key={mat} className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(mat)}
                    onChange={() => toggleArrayFilter(mat, selectedMaterials, setSelectedMaterials)}
                  />
                  {mat}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.1em] text-[#7a746d]">Refine</p>
            <label className="mb-2 flex cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" checked={showHandmadeOnly} onChange={(e) => setShowHandmadeOnly(e.target.checked)} />
              Handmade only
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" checked={showNewOnly} onChange={(e) => setShowNewOnly(e.target.checked)} />
              New arrivals only
            </label>
          </div>

          <button
            onClick={resetFilters}
            className="w-full border border-[#ddd8cf] py-3 text-sm transition-colors hover:border-[#C6A75E] hover:text-[#C6A75E]"
          >
            Reset Filters
          </button>
        </div>
      </aside>
      <Footer />
    </div>
  );
}