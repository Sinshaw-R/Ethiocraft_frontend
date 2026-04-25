"use client";
import {Header} from "@/components/shared/header";
import {Footer} from "@/components/shared/footer";
import {Button} from "@/components/ui/button";
import { cn } from '@/lib/utils'
import React from 'react'
import { createElement, useEffect, useState } from 'react';
import Link from 'next/link';
import ChatSupport from "@/components/ChatSupport";

type DetailProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  shortDescription: string;
  story: string;
  material: string;
  dimensions: string;
  care: string;
  badge?: 'Handmade' | 'New';
  images: string[];
  artisan: {
    name: string;
    title: string;
    portrait: string;
    story: string;
  };
};

const product: DetailProduct = {
  id: 1,
  name: 'Habesha Loomed Cotton Dress',
  category: 'Textiles',
  price: 168,
  shortDescription:
    'A refined hand-loomed silhouette finished with traditional tibeb embroidery from northern Ethiopia.',
  story:
    'This piece is crafted by hand using techniques preserved across generations of Ethiopian weavers. Each thread is chosen for texture and durability, then finished with deliberate embroidery details that carry regional identity and care.',
  material: 'Hand-loomed Ethiopian cotton with hand-finished tibeb embroidery',
  dimensions: 'Made to measure. Standard length: 136 cm',
  care: 'Cold hand wash. Line dry in shade. Steam lightly inside-out.',
  badge: 'Handmade',
  images: [
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1300&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1300&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1300&q=80',
  ],
  artisan: {
    name: 'Almaz Tekle',
    title: 'Master Weaver, Addis Ababa',
    portrait:
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=900&q=80',
    story:
      'Almaz has spent more than two decades preserving hand-loom traditions through contemporary forms. Her studio works in small batches, ensuring every piece keeps the hand, rhythm, and character of true craft.',
  },
};

const relatedProducts = [
  {
    id: 2,
    name: 'Lalibela Filigree Earrings',
    category: 'Jewelry',
    price: 124,
    image:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80',
    badge: 'New',
  },
  {
    id: 3,
    name: 'Sidama Coffee Ceremony Set',
    category: 'Home',
    price: 210,
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
    badge: 'Handmade',
  },
  {
    id: 4,
    name: 'Harar Palm Tote',
    category: 'Accessories',
    price: 86,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
];

export default function App() {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mediaMode, setMediaMode] = useState<'image' | '3d'>('image');
  const [is3DActivated, setIs3DActivated] = useState(false);
  const [isModelViewerReady, setIsModelViewerReady] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [revealedSections, setRevealedSections] = useState<string[]>([]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    setRevealedSections([]);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const sectionId = entry.target.getAttribute('data-reveal-id');
          if (!sectionId) return;
          setRevealedSections((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]));
        });
      },
      { threshold: 0.2 },
    );

    const elements = document.querySelectorAll('[data-reveal-id]');
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!is3DActivated) return;

    if (customElements.get('model-viewer')) {
      setIsModelViewerReady(true);
      return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.onload = () => setIsModelViewerReady(true);
    document.head.appendChild(script);
  }, [is3DActivated]);

  const isSectionVisible = (id: string) => revealedSections.includes(id);

  const showImageMode = () => setMediaMode('image');

  const show3DMode = () => {
    setMediaMode('3d');
    setIs3DActivated(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1C1C] font-inter">
      <Header />
      <main
        className="mx-auto max-w-[1320px] px-5 pb-20 pt-32 md:px-10 md:pt-40"
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0px)' : 'translateY(14px)',
          transition: 'opacity 500ms ease, transform 500ms ease',
        }}
      >
        <a
          href="#"
          className="font-aeonik inline-flex items-center gap-2 text-sm text-[#4f4b45] transition-colors hover:text-[#C6A75E]"
        >
          <span aria-hidden="true">←</span>
          Back to Collection
        </a>

        <section className="mt-7 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14" data-reveal-id="showcase">
          <div
            className="lg:col-span-7"
            style={{
              opacity: isSectionVisible('showcase') ? 1 : 0,
              transform: isSectionVisible('showcase') ? 'translateY(0)' : 'translateY(22px)',
              transition: 'opacity 600ms ease, transform 600ms ease',
            }}
          >
            <div className="group relative overflow-hidden bg-[#efeae0]">
              <div
                className="font-aeonik absolute right-4 top-4 z-20 inline-flex border border-[#dad2c4] bg-[#fafaf9f2] p-1"
              >
                <button
                  onClick={showImageMode}
                  className={`px-3 py-1 text-[10px] uppercase tracking-[0.1em] transition-colors ${
                    mediaMode === 'image' ? 'bg-[#1C1C1C] text-[#FAFAF9]' : 'text-[#4f4b45] hover:text-[#1C1C1C]'
                  }`}
                >
                  Image
                </button>
                <button
                  onClick={show3DMode}
                  className={`px-3 py-1 text-[10px] uppercase tracking-[0.1em] transition-colors ${
                    mediaMode === '3d' ? 'bg-[#1C1C1C] text-[#FAFAF9]' : 'text-[#4f4b45] hover:text-[#1C1C1C]'
                  }`}
                >
                  3D View
                </button>
              </div>
              {product.badge && (
                <span
                  className="font-aeonik absolute left-4 top-4 z-10 border border-[#d4bc7a] bg-[#fafaf9de] px-2 py-1 text-[10px] uppercase tracking-[0.12em]"
                >
                  {product.badge}
                </span>
              )}

              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  mediaMode === 'image' ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="h-[62vh] min-h-[420px] w-full animate-[imageFade_420ms_ease] object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              <div
                className={`h-[62vh] min-h-[420px] w-full transition-opacity duration-500 ${
                  mediaMode === '3d' ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                {is3DActivated ? (
                  isModelViewerReady ? (
                    createElement('model-viewer', {
                      src: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
                      poster: product.images[selectedImage],
                      style: { width: '100%', height: '100%', backgroundColor: '#efeae0' },
                      'camera-controls': '',
                      'auto-rotate': '',
                      'auto-rotate-delay': '0',
                      'rotation-per-second': '8deg',
                      'interaction-prompt': 'none',
                      'shadow-intensity': '0.6',
                      'exposure': '1',
                    })
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#5a554d]">
                      Loading 3D experience...
                    </div>
                  )
                ) : null}
              </div>

              {mediaMode === '3d' ? (
                <p
                  className="font-aeonik pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 bg-[#fafaf9e6] px-3 py-1 text-[10px] tracking-[0.08em] text-[#4f4b45]"
                >
                  Drag to explore
                </p>
              ) : null}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden border transition ${
                    selectedImage === index ? 'border-[#C6A75E]' : 'border-[#ddd8cf] hover:border-[#C6A75E]'
                  }`}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div
            className="lg:col-span-5"
            style={{
              opacity: isSectionVisible('showcase') ? 1 : 0,
              transform: isSectionVisible('showcase') ? 'translateY(0)' : 'translateY(22px)',
              transition: 'opacity 600ms ease 90ms, transform 600ms ease 90ms',
            }}
          >
            <p className="font-aeonik text-[10px] uppercase tracking-[0.12em] text-[#767068]">{product.category}</p>
            <h1
              className="font-druk-medium mt-3 text-lg uppercase tracking-[0.04em] md:text-5xl"
            >
              {product.name}
            </h1>
            <p className="mt-5 text-3xl font-semibold">${product.price}</p>
            <p className="mt-5 max-w-[44ch] text-[15px] leading-relaxed text-[#4f4b45]">{product.shortDescription}</p>

            <div className="font-aeonik mt-9 flex items-center gap-6">
              <div className="inline-flex items-center border-b border-[#d8d2c8] pb-2 text-sm">
                <button
                  className="px-3 text-xl text-[#4f4b45] transition-colors hover:text-[#C6A75E]"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="w-7 text-center">{quantity}</span>
                <button
                  className="px-3 text-xl text-[#4f4b45] transition-colors hover:text-[#C6A75E]"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>

              <button className="h-12 border border-[#C6A75E] bg-[#C6A75E] px-8 text-[10px] uppercase tracking-widest text-white transition-colors hover:bg-transparent hover:text-[#C6A75E]">
                Add to Cart
              </button>

              <button
                className="text-xl text-[#4f4b45] transition-colors hover:text-[#C6A75E]"
                onClick={() => setIsWishlisted((prev) => !prev)}
                aria-label="Toggle wishlist"
                title="Wishlist"
              >
                {isWishlisted ? '♥' : '♡'}
              </button>
              <button
                className="text-lg text-[#4f4b45] transition-colors hover:text-[#C6A75E]"
                aria-label="Share product"
                title="Share"
              >
                ↗
              </button>
            </div>

            <div className="font-aeonik mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[10px] uppercase tracking-widest text-[#4f4b45]">
              <p>Free Shipping</p>
              <p>Handmade</p>
              <p>Easy Returns</p>
            </div>
          </div>
        </section>

        <section
          className="mt-24"
          data-reveal-id="story"
          style={{
            opacity: isSectionVisible('story') ? 1 : 0,
            transform: isSectionVisible('story') ? 'translateY(0)' : 'translateY(22px)',
            transition: 'opacity 600ms ease, transform 600ms ease',
          }}
        >
          <h2 className="font-druk-medium text-2xl uppercase tracking-[0.06em]">
            Product Story
          </h2>
          <p className="mt-6 max-w-[72ch] text-lg leading-relaxed text-[#45413b]">{product.story}</p>
        </section>

        <section
          className="mt-24 grid grid-cols-1 items-start gap-8 md:grid-cols-12"
          data-reveal-id="artisan"
          style={{
            opacity: isSectionVisible('artisan') ? 1 : 0,
            transform: isSectionVisible('artisan') ? 'translateY(0)' : 'translateY(22px)',
            transition: 'opacity 600ms ease, transform 600ms ease',
          }}
        >
          <img
            src={product.artisan.portrait}
            alt={product.artisan.name}
            className="h-[360px] w-full object-cover md:col-span-4"
          />
          <div className="md:col-span-8">
            <h2 className="font-druk-medium text-2xl uppercase tracking-[0.06em]">
              Artisan Highlight
            </h2>
            <p className="font-aeonik mt-5 text-xl">
              {product.artisan.name}
            </p>
            <p className="font-aeonik mt-1 text-[10px] uppercase tracking-[0.1em] text-[#767068]">{product.artisan.title}</p>
            <p className="mt-5 max-w-[64ch] leading-relaxed text-[#45413b]">{product.artisan.story}</p>
            <a
              href="#"
              className="font-aeonik mt-6 inline-block text-xs uppercase tracking-widest text-[#1C1C1C] underline underline-offset-4 transition-colors hover:text-[#C6A75E]"
            >
              View more from this artisan
            </a>
          </div>
        </section>

        <section
          className="mt-24"
          data-reveal-id="details"
          style={{
            opacity: isSectionVisible('details') ? 1 : 0,
            transform: isSectionVisible('details') ? 'translateY(0)' : 'translateY(22px)',
            transition: 'opacity 600ms ease, transform 600ms ease',
          }}
        >
          <h2 className="font-druk-medium text-2xl uppercase tracking-[0.06em]">
            Details
          </h2>
          <div className="mt-7 max-w-[800px] space-y-5">
            <div className="flex flex-col gap-1 border-b border-[#e4dfd5] pb-4 md:flex-row md:items-baseline md:gap-10">
              <p className="font-aeonik w-40 text-[10px] uppercase tracking-[0.12em] text-[#767068]">Dimensions</p>
              <p>{product.dimensions}</p>
            </div>
            <div className="flex flex-col gap-1 border-b border-[#e4dfd5] pb-4 md:flex-row md:items-baseline md:gap-10">
              <p className="font-aeonik w-40 text-[10px] uppercase tracking-[0.12em] text-[#767068]">Material</p>
              <p>{product.material}</p>
            </div>
            <div className="flex flex-col gap-1 border-b border-[#e4dfd5] pb-4 md:flex-row md:items-baseline md:gap-10">
              <p className="font-aeonik w-40 text-[10px] uppercase tracking-[0.12em] text-[#767068]">Care</p>
              <p>{product.care}</p>
            </div>
          </div>
        </section>

        <section
          className="mt-24"
          data-reveal-id="related"
          style={{
            opacity: isSectionVisible('related') ? 1 : 0,
            transform: isSectionVisible('related') ? 'translateY(0)' : 'translateY(22px)',
            transition: 'opacity 600ms ease, transform 600ms ease',
          }}
        >
          <h2 className="font-druk-medium text-2xl uppercase tracking-[0.06em]">
            Related Pieces
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-12">
            {relatedProducts.map((item, index) => (
              <article
                key={item.id}
                className="group"
                style={{
                  opacity: isSectionVisible('related') ? 1 : 0,
                  transform: isSectionVisible('related') ? 'translateY(0)' : 'translateY(18px)',
                  transition: `opacity 650ms ease ${index * 90}ms, transform 650ms ease ${index * 90}ms`,
                }}
              >
                <div className="relative overflow-hidden bg-[#f1eee8]">
                  {item.badge && (
                    <span
                      className="font-aeonik absolute left-3 top-3 z-10 border border-[#d4bc7a] bg-[#fafaf9de] px-2 py-1 text-[10px] uppercase tracking-[0.12em]"
                    >
                      {item.badge}
                    </span>
                  )}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-60 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="pt-4">
                  <p className="font-druk-medium text-[10px] uppercase tracking-[0.1em] text-[#7a746d]">{item.category}</p>
                  <h3
                    className=" mt-2 text-sm uppercase tracking-[0.05em] transition-colors duration-300 group-hover:text-[#C6A75E] md:text-base"
                  >
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm">${item.price}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <ChatSupport />
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
