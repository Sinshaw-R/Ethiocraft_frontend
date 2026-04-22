"use client"
import React, { lazy, Suspense } from 'react';
import ApprovalsPanel from '@/components/ui/ApprovalsPanel';
import RecentOrders from '@/components/ui/RecentOrders';
import UsersSnapshot from '@/components/ui/UsersSnapshot';
import PlatformHealth from '@/components/ui/PlatformHealth';
import ActivityFeed from '@/components/ui/ActivityFeed';

const AdminCharts = lazy(() => import('@/components/AdminCharts'));

type Props = {
  kpiCards?: any[];
  quickActions?: any[];
  usersSnapshot?: any[];
  activityFeed?: any[];
  approvalItems?: any[];
  handleApprovalAction?: any;
  rowHeight?: number;
  containerHeight?: number;
  setDetailsOrder?: (o: any) => void;
  setActiveNav?: (s: string) => void;
  showFeedback?: (m: string) => void;
  orders?: any[];
  baseUrl?: string;
  bearerToken?: string;
};

export default function DashboardSection({ kpiCards = [], quickActions = [], usersSnapshot = [], activityFeed = [], approvalItems = [], handleApprovalAction, rowHeight = 56, containerHeight = 336, setDetailsOrder, setActiveNav, showFeedback, orders = [], baseUrl, bearerToken }: Props) {
  return (
    <main className="space-y-8 px-6 py-8 lg:px-8">
      <section className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-[#e8dece] bg-white p-6 shadow-[0_8px_28px_rgba(62,39,35,0.06)]">
        <div>
          <h1 className="text-3xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-[#6d645e]">Monitor and manage the marketplace</p>
        </div>
        <div className="flex items-center gap-3" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
          <select
            className="rounded-xl border border-[#e1d7c7] bg-white px-3 py-2 text-sm text-[#5f5750] outline-none"
            onChange={(e) => showFeedback?.(`Date range changed: ${e.target.value}`)}
          >
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button
            className="rounded-xl border border-[#e1d7c7] px-4 py-2 text-sm transition hover:bg-[#f5f0e7]"
            onClick={() => showFeedback?.('Export started with placeholder dataset')}
          >
            Export
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpiCards.map((card: any, index: number) => (
          <article
            key={card.title}
            className="rounded-3xl border border-[#e8dece] bg-white p-5 shadow-[0_8px_20px_rgba(62,39,35,0.05)] transition duration-300 hover:-translate-y-1"
            style={{ animation: `kpiIn 360ms ease ${index * 60}ms both` }}
          >
            <p className="text-xs uppercase tracking-[0.08em] text-[#81756b]" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
              {card.title}
            </p>
            <p className="mt-2 text-3xl font-semibold">{card.value}</p>
            <p className="mt-2 text-xs text-emerald-700">{card.trend} vs last period</p>
            <div className="mt-4 h-8 w-full rounded-lg bg-[linear-gradient(90deg,#f3ead8_0%,#eadab8_45%,#d7c08f_100%)] opacity-60" />
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action: any) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              className="rounded-3xl border border-[#e8dece] bg-white p-5 text-left shadow-[0_6px_20px_rgba(62,39,35,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(198,167,94,0.2)]"
              onClick={() => showFeedback?.(`Placeholder action: ${action.title}`)}
            >
              <Icon className="h-5 w-5 text-[#3E2723]" />
              <p className="mt-3 text-sm font-medium" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
                {action.title}
              </p>
              <p className="mt-1 text-xs text-[#7e7268]">{action.subtitle}</p>
            </button>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <ApprovalsPanel approvalItems={approvalItems} handleApprovalAction={handleApprovalAction} />

          <RecentOrders
            containerHeight={containerHeight}
            rowHeight={rowHeight}
            setDetailsOrder={setDetailsOrder}
            setActiveNav={setActiveNav}
            showFeedback={showFeedback}
            baseUrl={baseUrl || (process.env.NEXT_PUBLIC_ORDERS_BASE_URL || 'http://localhost:4000/api/v1')}
            bearerToken={bearerToken || (process.env.NEXT_PUBLIC_ADMIN_BEARER_TOKEN || process.env.NEXT_PUBLIC_ADMIN_API_KEY || '')}
            initialOrders={orders}
            fetchFromApi={true}
          />
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <UsersSnapshot usersSnapshot={usersSnapshot} setActiveNav={setActiveNav} showFeedback={showFeedback} />
          <PlatformHealth />
          <ActivityFeed activityFeed={activityFeed} />
        </aside>
      </section>

      <section className="rounded-3xl border border-[#e8dece] bg-white p-5 shadow-[0_8px_24px_rgba(62,39,35,0.04)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
            Analytics
          </h2>
        </div>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-[#f5efe2]" />}>
          <AdminCharts />
        </Suspense>
      </section>
    </main>
  );
}
