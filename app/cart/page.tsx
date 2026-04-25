

"use client";
import { cn } from '@/lib/utils';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
};

const initialItems: CartItem[] = [
  {
    id: 1,
    name: 'Habesha Loomed Cotton Dress',
    category: 'Textiles',
    price: 168,
    image:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=720&q=80',
    quantity: 1,
  },
  {
    id: 2,
    name: 'Lalibela Filigree Earrings',
    category: 'Jewelry',
    price: 124,
    image:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=720&q=80',
    quantity: 1,
  },
  {
    id: 3,
    name: 'Harar Palm Tote',
    category: 'Accessories',
    price: 86,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=720&q=80',
    quantity: 2,
  },
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [leavingIds, setLeavingIds] = useState<number[]>([]);
  const [quantityPulseId, setQuantityPulseId] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const shipping = subtotal > 180 || subtotal === 0 ? 0 : 12;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  const updateQuantity = (id: number, nextQuantity: number) => {
    if (nextQuantity < 1) return;
    setCartItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item)),
    );
    setQuantityPulseId(id);
    window.setTimeout(() => setQuantityPulseId((active) => (active === id ? null : active)), 220);
  };

  const removeItem = (id: number) => {
    setLeavingIds((current) => (current.includes(id) ? current : [...current, id]));
    window.setTimeout(() => {
      setCartItems((current) => current.filter((item) => item.id !== id));
      setLeavingIds((current) => current.filter((itemId) => itemId !== id));
    }, 360);
  };

  const applyPromoCode = () => {
    if (couponCode.trim().toUpperCase() !== 'WELCOME10') return;
    setAppliedCoupon('WELCOME10');
    setCouponCode('');
  };

  const emptyState = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1C1C] font-inter">
      <Header />
      <main className="mx-auto max-w-[1260px] px-5 pb-20 pt-32 md:px-10 md:pt-40">
        <Link
          href="/products"
          className="font-aeonik inline-flex items-center gap-2 text-sm text-[#565046] transition-colors hover:text-[#C6A75E]"
        >
          <span aria-hidden="true">←</span>
          Continue Shopping
        </Link>

        <header className="mt-6 border-b border-[#e7e1d6] pb-7">
          <h1
           className="font-druk-medium text-2xl uppercase tracking-[0.05em] md:text-5xl"
          >
            Your Selection
          </h1>
          <p className="mt-2 text-[15px] text-[#5e584f] font-inter">Crafted pieces chosen with intention</p>
        </header>

        {emptyState ? (
          <section className="flex min-h-[58vh] flex-col items-center justify-center text-center">
            <div className="text-6xl text-[#c7c0b2]">🧺</div>
            <h2
              className="font-druk-medium mt-5 text-2xl uppercase tracking-[0.05em]"
            >
              Your selection is empty
            </h2>
            <p className="mt-3 max-w-[54ch] text-[#5e584f]">
              Discover handcrafted pieces rooted in Ethiopian tradition.
            </p>
            <Link
              href="/products"
              className="font-aeonik mt-7 border border-[#1C1C1C] bg-[#1C1C1C] px-6 py-3 text-sm text-[#FAFAF9] transition-colors hover:bg-transparent hover:text-[#1C1C1C]"
            >
              Explore Collection
            </Link>
          </section>
        ) : (
          <section className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-8">
              <ul className="divide-y divide-[#ece6da]">
                {cartItems.map((item) => {
                  const isLeaving = leavingIds.includes(item.id);
                  return (
                    <li
                      key={item.id}
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        opacity: isLeaving ? 0 : 1,
                        maxHeight: isLeaving ? 0 : 220,
                        transform: isLeaving ? 'translateY(-6px)' : 'translateY(0)',
                      }}
                    >
                      <article className="group grid grid-cols-[124px_1fr_auto] gap-5 py-6 md:grid-cols-[150px_1fr_auto] md:gap-7">
                        <Link href={`/products/${item.id}`} className="overflow-hidden bg-[#efeae0]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] md:h-36"
                          />
                        </Link>

                        <div className="flex min-w-0 flex-col justify-between">
                          <div>
                            <p className="font-aeonik text-xs uppercase tracking-[0.12em] text-[#7f796f]">{item.category}</p>
                            <Link href={`/products/${item.id}`} className="font-aeonik mt-1 inline-block text-[15px] transition-colors hover:text-[#C6A75E] md:text-lg">
                              {item.name}
                            </Link>
                          </div>

                          <div
                            className="font-aeonik mt-5 inline-flex w-fit items-center border-b border-[#d8d1c3] pb-1"
                          >
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 text-base text-[#5c564c] transition-colors hover:text-[#C6A75E]"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span
                              className="w-7 text-center text-sm transition-transform duration-200"
                              style={{ transform: quantityPulseId === item.id ? 'scale(1.13)' : 'scale(1)' }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 text-base text-[#5c564c] transition-colors hover:text-[#C6A75E]"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <p className="text-lg font-semibold md:text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="font-aeonik text-xs uppercase tracking-[0.08em] text-[#9f3b3b] opacity-0 transition-opacity duration-300 hover:text-[#7f2e2e] group-hover:opacity-100"
                          >
                            Remove
                          </button>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            </div>

            <aside className="lg:col-span-4 lg:pl-2">
              <div className="lg:sticky lg:top-8">
                <h2
                  className="font-druk-medium text-xl uppercase tracking-[0.1em]"
                >
                  Order Summary
                </h2>

                <div className="font-aeonik mt-7 border-t border-[#e7e1d6] pt-6">
                  <label htmlFor="promo" className="text-xs uppercase tracking-[0.1em] text-[#6d665c]">
                    Promo Code
                  </label>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      id="promo"
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value)}
                      placeholder="Enter code"
                      className="h-11 w-full border-b border-[#d8d1c3] bg-transparent px-1 text-sm outline-none placeholder:text-[#9f998f] focus:border-[#C6A75E]"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="h-11 px-3 text-xs uppercase tracking-[0.08em] text-[#1C1C1C] transition-colors hover:text-[#C6A75E]"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon ? <p className="mt-2 text-xs text-[#5d7e4a]">WELCOME10 applied</p> : null}
                </div>

                <dl className="font-aeonik mt-7 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-[#656056]">Subtotal</dt>
                    <dd>${subtotal.toFixed(2)}</dd>
                  </div>
                  {discount > 0 ? (
                    <div className="flex items-center justify-between text-[#5d7e4a]">
                      <dt>Discount</dt>
                      <dd>- ${discount.toFixed(2)}</dd>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between">
                    <dt className="text-[#656056]">Shipping</dt>
                    <dd>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-[#656056]">Tax</dt>
                    <dd>${tax.toFixed(2)}</dd>
                  </div>
                </dl>

                <div className="mt-6 border-t border-[#e7e1d6] pt-6">
                  <div className="flex items-end justify-between">
                    <p className="font-aeonik text-sm uppercase tracking-[0.1em] text-[#666055]">
                      Total
                    </p>
                    <p className="font-aeonik text-2xl font-semibold">${total.toFixed(2)}</p>
                  </div>

                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-medium">
                  <Link href="/cart/checkout">
                  Proceed to Checkout
                  </Link>
                </Button>
                
                  <Link
                    href="/products"
                    className="font-aeonik mt-3 flex h-11 w-full items-center justify-center border border-[#cfc8bb] bg-transparent text-xs uppercase tracking-[0.08em] text-[#1C1C1C] transition-colors hover:border-[#C6A75E] hover:text-[#C6A75E]"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </aside>

            <div className="border-t border-[#e7e1d6] pt-6 lg:col-span-12">
              <div
                className="font-aeonik flex flex-wrap gap-x-8 gap-y-3 text-[10px] uppercase tracking-widest text-[#5d574d]"
              >
                <span>Free Shipping</span>
                <span>Easy Returns</span>
                <span>Secure Checkout</span>
              </div>
            </div>
          </section>
        )}
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