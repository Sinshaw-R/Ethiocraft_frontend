"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

type Customer = {
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: any;
};

type Order = {
  id: string;
  customer?: Customer | string;
  amount?: string;
  status?: string;
  date?: string;
  [key: string]: any;
};

interface Props {
  containerHeight: number;
  rowHeight: number;
  setDetailsOrder: (o: Order | null) => void;
  setActiveNav: (s: string) => void;
  showFeedback: (m: string) => void;
  baseUrl?: string;
  bearerToken?: string;
  initialOrders?: Order[];
  fetchFromApi?: boolean;
}

function statusClass(status?: string) {
  if (!status) return 'bg-sky-50 text-sky-700';
  const s = String(status).toLowerCase();
  if (/paid|success|complete|deliv|fulfilled/.test(s)) return 'bg-emerald-50 text-emerald-700';
  if (/process|pending|waiting/.test(s)) return 'bg-amber-50 text-amber-700';
  return 'bg-sky-50 text-sky-700';
}

export default function RecentOrders({ containerHeight, rowHeight, setDetailsOrder, setActiveNav, showFeedback, baseUrl = 'http://localhost:4000/api/v1', bearerToken = '', initialOrders = [], fetchFromApi = true, }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders || []);
  const [visibleStart, setVisibleStart] = useState(0);

  // Sync with props when they change (e.g., after the parent fetch completes)
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const visibleCount = useMemo(() => Math.ceil(containerHeight / rowHeight) + 2, [containerHeight, rowHeight]);
  const visibleOrders = useMemo(() => orders.slice(visibleStart, Math.min(visibleStart + visibleCount, orders.length)), [orders, visibleStart, visibleCount]);

  return (
    <article className="rounded-3xl border border-[#e8dece] bg-white p-5 shadow-[0_8px_24px_rgba(62,39,35,0.05)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
          Recent Orders
        </h2>
        <button className="text-sm text-[#6c6157] transition hover:text-[#3E2723]" onClick={() => { setActiveNav('Orders'); showFeedback('Opened Orders section'); }}>
          View all
        </button>
      </div>
     
      <div className="overflow-hidden rounded-2xl border border-[#ece2d3]">
        <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_0.7fr] gap-4 bg-[#f8f4ec] px-4 py-3 text-xs uppercase tracking-[0.08em] text-[#7e7268]">
          <span className="truncate">Order ID</span>
          <span className="truncate">Customer</span>
          <span className="truncate">Amount</span>
          <span className="truncate">Status</span>
          <span className="truncate">Date</span>
          <span className="truncate text-center">Action</span>
        </div>
        <div className="relative overflow-y-auto divide-y divide-[#f1e8da]" style={{ height: `${containerHeight}px` }} onScroll={(event) => {
          const next = Math.floor(event.currentTarget.scrollTop / rowHeight);
          if (next !== visibleStart) setVisibleStart(next);
        }}>
          <div style={{ height: `${orders.length * rowHeight}px`, position: 'relative' }}>
            {visibleOrders.map((order: any, idx: number) => {
              const index = visibleStart + idx;
              return (
                <div key={order.id} className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_0.7fr] gap-4 items-center px-4 text-sm transition hover:bg-[#fcf8f0]" style={{ position: 'absolute', top: `${index * rowHeight}px`, left: 0, right: 0, height: `${rowHeight}px`, fontFamily: 'Inter, sans-serif' }}>
                  <span className="min-w-0 truncate font-medium text-[#3E2723]">{order.id}</span>
                  <span className="min-w-0 truncate" title={typeof order.customer === 'string' ? order.customer : (order.customer ? `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || order.customer?.email || '' : '')}>
                    {typeof order.customer === 'string' ? order.customer : (order.customer ? `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || order.customer?.email || order.customerId || '' : '')}
                  </span>
                  <span className="min-w-0 truncate">{order.totalAmount ?? order.amount ?? order.subtotalAmount ?? ''}{order.currency ? ` ${order.currency}` : ''}</span>
                  <span className="min-w-0">
                    <span className={`inline-block max-w-full truncate rounded-full px-2 py-1 text-xs ${statusClass(order.status)}`}>{order.status}</span>
                  </span>
                  <span className="min-w-0 truncate text-[#72665d]">{order.createdAt ?? order.paidAt ?? order.date ?? ''}</span>
                  <Button variant="ghost" size="sm" onClick={() => setDetailsOrder(order)}>View</Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
