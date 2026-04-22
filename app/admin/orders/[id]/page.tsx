"use client"
import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleDollarSign,
  ExternalLink,
  MapPin,
  MessageSquare,
  PackageCheck,
  Send,
  Truck,
  Wallet,
} from 'lucide-react';

type TabKey = 'Payments' | 'Customer' | 'Address' | 'Activity';
type OrderStatus = 'PAID' | 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

type Payment = {
  id: string;
  provider: 'CHAPA';
  status: 'SUCCESS' | 'PENDING';
  amount: number;
  txRef: string;
  paidAt: string;
  checkoutReference: string;
  failureReason?: string;
  payload: Record<string, string | number | boolean | null>;
};

const tabs: TabKey[] = ['Payments', 'Customer', 'Address', 'Activity'];

const order = {
  id: 'cmnbjwngt0000wsktk7kfta3i',
  currency: 'ETB',
  createdAt: '2026-02-06 09:15',
  paidAt: '2026-02-06 09:22',
  updatedAt: '2026-02-06 11:04',
  status: 'PAID' as OrderStatus,
  total: 1600,
  subtotal: 1450,
  shipping: 150,
  tax: 0,
};

const items = [
  {
    id: 'IT-1',
    name: 'Handwoven Mesob Basket',
    slug: 'handwoven-mesob-basket',
    artisanName: 'Marta Woven Craft',
    unitPrice: 1450,
    quantity: 1,
    thumbnail:
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=900&q=80',
  },
];

const paymentsInitial: Payment[] = [
  {
    id: 'PMT-1',
    provider: 'CHAPA',
    status: 'SUCCESS',
    amount: 1600,
    txRef: 'CHAPA-X8SK-001',
    paidAt: '2026-02-06 09:22',
    checkoutReference: 'CHK-2418-AB9',
    payload: {
      amount: 1600,
      currency: 'ETB',
      method: 'card',
      processorStatus: 'success',
      customerEmail: 'samuel.kassa@mail.com',
    },
  },
  {
    id: 'PMT-2',
    provider: 'CHAPA',
    status: 'PENDING',
    amount: 1600,
    txRef: 'CHAPA-X8SK-000',
    paidAt: '2026-02-06 09:18',
    checkoutReference: 'CHK-2418-AB1',
    failureReason: 'Customer left checkout before authentication.',
    payload: {
      amount: 1600,
      currency: 'ETB',
      method: 'card',
      processorStatus: 'pending',
      retryAllowed: true,
    },
  },
];

const customer = {
  name: 'Samuel Kassa',
  email: 'samuel.kassa@mail.com',
  phone: '+251 91 334 9087',
  role: 'CUSTOMER',
  status: 'ACTIVE',
  joinedAt: '2025-07-12',
  totalOrders: 18,
};

const shippingAddress = {
  recipient: 'Samuel Kassa',
  phone: '+251 91 334 9087',
  region: 'Addis Ababa',
  city: 'Bole',
  woreda: '03',
  lines: ['Bole Medhanialem', 'Near Edna Mall'],
};

const activityLog = [
  'Order created at 2026-02-06 09:15',
  'Payment SUCCESS via CHAPA at 2026-02-06 09:22',
  'Order marked as PAID',
  'Pending payment attempt detected and tracked for risk review',
];

function statusBadge(status: OrderStatus) {
  if (status === 'PAID') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'PENDING') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (status === 'SHIPPED') return 'bg-sky-50 text-sky-700 border-sky-200';
  if (status === 'DELIVERED') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  return 'bg-rose-50 text-rose-700 border-rose-200';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('Payments');
  const params = useParams();
  const orderId = params?.id as string | undefined;

  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [payments, setPayments] = useState<Payment[]>(paymentsInitial);
  const [expandedPaymentId, setExpandedPaymentId] = useState<string | null>(paymentsInitial[0].id ?? null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [toast, setToast] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const hasPendingAfterSuccess = useMemo(
    () => payments.some((p) => p.status === 'SUCCESS') && payments.some((p) => p.status === 'PENDING'),
    [payments],
  );

  const paymentAttempts = payments.length;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2300);
  };

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      setLoading(true);
      setError(null);
      try {
        const base = (process.env.NEXT_PUBLIC_BASE_URL ?? '').replace(/\/$/, '') || 'http://localhost:4000/api/v1';
        const token = typeof window !== 'undefined' ? (localStorage.getItem('token') ?? sessionStorage.getItem('token') ?? '') : '';
        const res = await fetch(`${base}/orders/${orderId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          const text = await res.text().catch(() => res.statusText);
          throw new Error(`Fetch failed (${res.status}): ${text}`);
        }
        const json = await res.json();
        const payload = json?.data ?? json;
        setOrderData(payload);
        if (payload?.payments) setPayments(payload.payments as Payment[]);
        if (payload?.status) setStatus(payload.status as OrderStatus);
        setExpandedPaymentId((payload?.payments && payload.payments[0]?.id) ?? paymentsInitial[0]?.id ?? null);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load order');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const markShipped = () => {
    if (status === 'CANCELLED' || status === 'DELIVERED') return showToast('Invalid state transition');
    setStatus('SHIPPED');
    showToast('Order marked as shipped');
  };

  const markDelivered = () => {
    if (status !== 'SHIPPED') return showToast('Order must be shipped before delivery');
    setStatus('DELIVERED');
    showToast('Order marked as delivered');
  };

  const riskAlerts = [
    paymentAttempts > 1 ? 'Multiple payment attempts detected' : '',
    hasPendingAfterSuccess ? 'Pending payment exists after successful transaction' : '',
    status === 'PAID' ? 'Shipment update missing for paid order' : '',
  ].filter(Boolean);

  const currentOrder = orderData ?? order;
  const currentItems = orderData?.items ?? items;
  const currentCustomer = orderData?.customer ?? customer;
  const currentShipping = orderData?.shippingAddress ?? shippingAddress;
  const currentActivity = orderData?.activityLog ?? activityLog;

  return (
    <div className="min-h-screen bg-[#FAFAF9] px-4 py-6 text-[#1C1C1C] md:px-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#7a7068]" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
                Order Detail
              </p>
              <h1 className="mt-1 text-3xl uppercase tracking-[0.04em] md:text-4xl" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                {currentOrder.id}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs ${statusBadge(status)}`}>{status}</span>
                <span className="rounded-full bg-[#f6f2ea] px-3 py-1 text-xs text-[#6f614f]">{currentOrder.currency}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#786e66]">
                <span>Created: {currentOrder.createdAt}</span>
                <span>Paid: {currentOrder.paidAt}</span>
                <span>Last updated: {currentOrder.updatedAt}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
              <p className="mr-2 text-3xl font-semibold text-[#1C1C1C]">{currentOrder.total} ETB</p>
              <button onClick={markShipped} className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 transition duration-300 hover:-translate-y-1 hover:shadow-md">Mark as Shipped</button>
              <button onClick={markDelivered} className="rounded-xl border border-emerald-300 bg-emerald-100 px-3 py-2 text-xs text-emerald-800 transition duration-300 hover:-translate-y-1 hover:shadow-md">Mark as Delivered</button>
              <button onClick={() => setShowCancelConfirm(true)} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 transition duration-300 hover:-translate-y-1 hover:shadow-md">Cancel Order</button>
              <button onClick={() => setShowRefundConfirm(true)} className="rounded-xl border border-[#e6d9bd] bg-[#f9f3e8] px-3 py-2 text-xs text-[#7a6338] transition duration-300 hover:-translate-y-1 hover:shadow-md">Refund Payment</button>
              <button onClick={() => showToast('Customer contact panel opened')} className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 px-3 py-2 text-xs transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <MessageSquare className="h-3.5 w-3.5" /> Contact Customer
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <section className="space-y-6 xl:col-span-7">
            <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-300 hover:shadow-md">
              <h2 className="text-xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                Order Items
              </h2>
              <div className="mt-4 space-y-3">
                {currentItems.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-neutral-200 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-sm">
                    <div className="flex items-start gap-4">
                      <img src={item.thumbnail} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="text-lg font-semibold">{item.name}</p>
                        <p className="mt-1 text-sm text-[#6f655d]">Artisan: Artisan: {item.artisan?.firstName ? `${item.artisan.firstName} ${item.artisan.lastName ?? ''}` : item.artisanName}</p>
                        <p className="mt-1 text-sm text-[#6f655d]">Unit price: {item.unitPrice} ETB</p>
                        <p className="text-sm text-[#6f655d]">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#6f655d]">Line Total</p>
                        <p className="text-lg font-semibold text-[#C6A75E]">{item.unitPrice * item.quantity} ETB</p>
                        <a href={`/products/${item.slug}`} className="mt-2 inline-flex items-center gap-1 text-xs text-[#3E2723] underline underline-offset-4">
                          View Product <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-300 hover:shadow-md">
              <h2 className="text-xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                Fulfillment Timeline
              </h2>
              <div className="mt-5 grid gap-3 md:grid-cols-4">
                {[
                  { label: 'Order Created', time: currentOrder.createdAt, done: true, icon: CircleDollarSign },
                  { label: 'Payment Completed', time: currentOrder.paidAt, done: true, icon: Wallet },
                  { label: 'Shipped', time: status === 'SHIPPED' || status === 'DELIVERED' ? '2026-02-06 11:05' : 'Pending', done: status === 'SHIPPED' || status === 'DELIVERED', icon: Truck },
                  { label: 'Delivered', time: status === 'DELIVERED' ? '2026-02-07 14:40' : 'Pending', done: status === 'DELIVERED', icon: PackageCheck },
                ].map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="rounded-2xl border border-neutral-200 p-3">
                      <div className="flex items-center gap-2">
                        {step.done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Circle className="h-4 w-4 text-neutral-400" />}
                        <p className="text-sm font-medium">{step.label}</p>
                      </div>
                      <p className="mt-2 text-xs text-[#756a61]">{step.time}</p>
                      <Icon className="mt-3 h-4 w-4 text-[#8a7f73]" />
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-300 hover:shadow-md">
              <div className="mb-4 flex flex-wrap gap-5 border-b border-neutral-200 pb-3" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`relative pb-2 text-sm ${activeTab === tab ? 'text-[#3E2723]' : 'text-[#7a6f65] hover:text-[#3E2723]'}`}>
                    {tab}
                    {activeTab === tab && <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-[#C6A75E]" />}
                  </button>
                ))}
              </div>

              {activeTab === 'Payments' && (
                <div className="space-y-3">
                  {hasPendingAfterSuccess && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                      <p className="font-medium">Multiple payment attempts detected</p>
                      <p className="text-xs">Pending payment exists after successful transaction.</p>
                    </div>
                  )}

                  <div className="overflow-hidden rounded-2xl border border-neutral-200">
                    <div className="grid grid-cols-[1fr_1fr_1fr_1.3fr_1fr_0.6fr] bg-[#f8f5ef] px-4 py-3 text-xs uppercase tracking-[0.08em] text-[#7f746a]">
                      <span>Provider</span>
                      <span>Status</span>
                      <span>Amount</span>
                      <span>txRef</span>
                      <span>Paid At</span>
                      <span />
                    </div>
                    {payments.map((payment) => (
                      <div key={payment.id} className="border-t border-neutral-200">
                        <button
                          className="grid w-full grid-cols-[1fr_1fr_1fr_1.3fr_1fr_0.6fr] items-center px-4 py-3 text-left text-sm hover:bg-[#fdfaf4]"
                          onClick={() => setExpandedPaymentId((prev) => (prev === payment.id ? null : payment.id))}
                        >
                          <span>{payment.provider}</span>
                          <span>
                            <span className={`rounded-full px-2 py-1 text-xs ${payment.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              {payment.status}
                            </span>
                          </span>
                          <span>{payment.amount} ETB</span>
                          <span>{payment.txRef}</span>
                          <span>{payment.paidAt}</span>
                          <ChevronDown className={`h-4 w-4 transition ${expandedPaymentId === payment.id ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedPaymentId === payment.id && (
                          <div className="bg-[#fcfaf6] px-4 pb-4 text-sm">
                            <p className="text-xs text-[#776b61]">Checkout Reference: {payment.checkoutReference}</p>
                            {payment.failureReason && <p className="mt-1 text-xs text-amber-700">Failure reason: {payment.failureReason}</p>}
                            <pre className="mt-3 overflow-auto rounded-xl border border-neutral-200 bg-white p-3 text-xs text-[#5f554b]">{JSON.stringify(payment.payload, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Customer' && (
                <div className="rounded-2xl border border-neutral-200 p-4 text-sm">
                  <div className="grid gap-2 md:grid-cols-2">
                    <p><span className="text-[#7a6f65]">Name:</span> {currentCustomer.firstName} {currentCustomer.lastName}</p>
                    <p><span className="text-[#7a6f65]">Email:</span> {currentCustomer.email}</p>
                    <p><span className="text-[#7a6f65]">Phone:</span> {currentCustomer.phone}</p>
                    <p><span className="text-[#7a6f65]">Role:</span> {currentCustomer.role}</p>
                    <p><span className="text-[#7a6f65]">Status:</span> {currentCustomer.status}</p>
                    <p><span className="text-[#7a6f65]">Joined:</span> {currentCustomer.createdAt}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
                    <button className="rounded-lg border border-neutral-200 px-3 py-2" onClick={() => showToast('Customer profile opened')}>View full profile</button>
                    <button className="rounded-lg border border-neutral-200 px-3 py-2" onClick={() => showToast('Message panel opened')}>Message customer</button>
                    <button className="rounded-lg border border-neutral-200 px-3 py-2" onClick={() => showToast('Order history opened')}>View order history</button>
                  </div>
                </div>
              )}

              {activeTab === 'Address' && (
                <div className="rounded-2xl border border-neutral-200 p-4 text-sm">
                  <p className="font-medium">{currentShipping.recipient}</p>
                  <p className="mt-1 text-[#6f655d]">{currentShipping.phone}</p>
                  <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                    <p><span className="text-[#7a6f65]">Region:</span> {currentShipping.region}</p>
                    <p><span className="text-[#7a6f65]">City:</span> {currentShipping.city}</p>
                    <p><span className="text-[#7a6f65]">Woreda:</span> {currentShipping.woreda}</p>
                  </div>
                  <div className="mt-3 rounded-xl bg-[#faf7f1] p-3">
                    {currentShipping.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  <button className="mt-3 inline-flex items-center gap-1 text-xs text-[#3E2723] underline underline-offset-4" onClick={() => showToast('Map integration placeholder')}>
                    <MapPin className="h-3.5 w-3.5" /> View on map
                  </button>
                </div>
              )}

              {activeTab === 'Activity' && (
                <ol className="space-y-3 border-l border-neutral-200 pl-4 text-sm">
                  {currentActivity.map((entry) => (
                    <li key={entry} className="relative text-[#61584f]">
                      <span className="absolute -left-[21px] top-2 h-2 w-2 rounded-full bg-[#C6A75E]" />
                      {entry}
                    </li>
                  ))}
                </ol>
              )}
            </article>
          </section>

          <aside className="space-y-6 xl:col-span-5">
            <div className="space-y-6 xl:sticky xl:top-6">
              <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.08em] text-[#85796d]" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>Status & Actions</p>
                <div className="mt-3 space-y-2 text-xs" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
                  <button onClick={markShipped} className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-left text-emerald-700 transition duration-300 hover:-translate-y-1 hover:shadow-sm">Mark as Shipped</button>
                  <button onClick={markDelivered} className="w-full rounded-xl border border-emerald-300 bg-emerald-100 px-3 py-2 text-left text-emerald-800 transition duration-300 hover:-translate-y-1 hover:shadow-sm">Mark as Delivered</button>
                  <button onClick={() => setShowRefundConfirm(true)} className="w-full rounded-xl border border-[#e6d9bd] bg-[#f9f3e8] px-3 py-2 text-left text-[#7a6338] transition duration-300 hover:-translate-y-1 hover:shadow-sm">Issue Refund</button>
                  <button onClick={() => setShowCancelConfirm(true)} className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-left text-rose-700 transition duration-300 hover:-translate-y-1 hover:shadow-sm">Cancel Order</button>
                </div>
              </article>

              <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.08em] text-[#85796d]" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>Payment Summary</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{currentOrder.subtotalAmount} ETB</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{currentOrder.shippingFee} ETB</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>{currentOrder.taxAmount} ETB</span></div>
                  <div className="mt-3 flex justify-between border-t border-neutral-200 pt-3 text-base font-semibold"><span>Total</span><span className="text-[#C6A75E]">{currentOrder.totalAmount} ETB</span></div>
                </div>
              </article>

              <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.08em] text-[#85796d]" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>Customer Quick Card</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9ded0] text-sm font-semibold">SK</div>
                  <div>
                    <p className="font-medium">{currentCustomer.firstName} {currentCustomer.lastName}</p>
                    <p className="text-xs text-[#6f655d]">{currentCustomer.email}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#6f655d]">{currentCustomer.phone}</p>
                <p className="text-sm text-[#6f655d]">Total orders: {currentCustomer.totalOrders}</p>
                <div className="mt-3 flex gap-2 text-xs" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
                  <button onClick={() => showToast('Profile opened')} className="rounded-lg border border-neutral-200 px-3 py-1.5">View Profile</button>
                  <button onClick={() => showToast('Message sent')} className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5"><Send className="h-3 w-3" /> Message</button>
                </div>
              </article>

              {riskAlerts.length > 0 && (
                <article className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.08em] text-amber-700" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>Risk Indicators</p>
                  <div className="mt-3 space-y-2 text-xs text-amber-800">
                    {riskAlerts.map((alert) => (
                      <p key={alert} className="rounded-lg bg-white/70 px-3 py-2">{alert}</p>
                    ))}
                  </div>
                </article>
              )}

              <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.08em] text-[#85796d]" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>Quick Insights</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl border border-neutral-200 p-2"><p className="text-xs text-[#7b7067]">Total items</p><p className="font-semibold">1</p></div>
                  <div className="rounded-xl border border-neutral-200 p-2"><p className="text-xs text-[#7b7067]">Total artisans</p><p className="font-semibold">1</p></div>
                  <div className="rounded-xl border border-neutral-200 p-2"><p className="text-xs text-[#7b7067]">Payment attempts</p><p className="font-semibold">2</p></div>
                  <div className="rounded-xl border border-neutral-200 p-2"><p className="text-xs text-[#7b7067]">Order value</p><p className="font-semibold">1600 ETB</p></div>
                </div>
              </article>
            </div>
          </aside>
        </div>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowCancelConfirm(false)}>
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-5 shadow-md" onClick={(event) => event.stopPropagation()}>
            <h3 className="text-lg uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>Cancel Order</h3>
            <p className="mt-2 text-sm text-[#61584f]">This will mark the order as cancelled and stop fulfillment workflow.</p>
            <div className="mt-4 flex justify-end gap-2 text-sm" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
              <button className="rounded-xl border border-neutral-200 px-3 py-2" onClick={() => setShowCancelConfirm(false)}>Back</button>
              <button className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700" onClick={() => { setStatus('CANCELLED'); setShowCancelConfirm(false); showToast('Order cancelled'); }}>
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showRefundConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowRefundConfirm(false)}>
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-5 shadow-md" onClick={(event) => event.stopPropagation()}>
            <h3 className="text-lg uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>Issue Refund</h3>
            <p className="mt-2 text-sm text-[#61584f]">Refund {currentOrder.total} ETB to {currentCustomer.name} via CHAPA?</p>
            <div className="mt-4 flex justify-end gap-2 text-sm" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
              <button className="rounded-xl border border-neutral-200 px-3 py-2" onClick={() => setShowRefundConfirm(false)}>Back</button>
              <button className="rounded-xl border border-[#e6d9bd] bg-[#f9f3e8] px-3 py-2 text-[#7a6338]" onClick={() => { setShowRefundConfirm(false); showToast('Refund request submitted'); }}>
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm shadow-md">{toast}</div>
      )}
    </div>
  );
}