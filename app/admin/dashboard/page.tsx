import { lazy, Suspense, useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  GanttChartSquare,
  Home,
  Menu,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  UserCog,
  Users,
  X,
} from 'lucide-react';

const AdminCharts = lazy(() => import('./components/AdminCharts'));

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type ApprovalItem = {
  id: string;
  type: 'Artisan' | 'Product' | 'Verification';
  name: string;
  date: string;
  priority: 'high' | 'medium';
};

type Order = {
  id: string;
  customer: string;
  amount: string;
  status: 'Completed' | 'Processing' | 'Shipped';
  date: string;
};

const navigation: NavItem[] = [
  { label: 'Dashboard', icon: Home },
  { label: 'Users', icon: Users },
  { label: 'Artisans', icon: UserCog },
  { label: 'Products', icon: Package },
  { label: 'Orders', icon: ShoppingCart },
  { label: 'Approvals', icon: ShieldCheck },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Reports', icon: FileText },
  { label: 'Settings', icon: Settings },
];

const kpiCards = [
  { title: 'Total Users', value: '12,480', trend: '+12.4%' },
  { title: 'Revenue', value: '$245,900', trend: '+18.1%' },
  { title: 'Orders', value: '1,842', trend: '+6.9%' },
  { title: 'Pending Approvals', value: '27', trend: '-8.0%' },
  { title: 'Active Artisans', value: '403', trend: '+9.7%' },
  { title: 'Conversion Rate', value: '4.2%', trend: '+0.8%' },
];

const approvalItems: ApprovalItem[] = [
  { id: 'A-201', type: 'Artisan', name: 'Selam Woven Studio', date: 'Today', priority: 'high' },
  { id: 'P-894', type: 'Product', name: 'Hand-etched Coffee Pot Set', date: '2h ago', priority: 'medium' },
  { id: 'V-102', type: 'Verification', name: 'Mulu Leather House', date: '5h ago', priority: 'high' },
  { id: 'P-900', type: 'Product', name: 'Amhara Cotton Throw', date: 'Yesterday', priority: 'medium' },
];

const quickActions = [
  { title: 'Approve Artisans', subtitle: '9 applications waiting', icon: ShieldCheck },
  { title: 'Review Products', subtitle: '11 listings pending', icon: Package },
  { title: 'Manage Orders', subtitle: '32 in processing', icon: ShoppingCart },
  { title: 'Handle Reports', subtitle: '4 flagged incidents', icon: AlertCircle },
];

const usersSnapshot = [
  { name: 'Meklit Abebe', role: 'Artisan' },
  { name: 'Samuel Bekele', role: 'Customer' },
  { name: 'Rahel Tsegaye', role: 'Agent' },
  { name: 'Dawit Kebede', role: 'Artisan' },
];

const activityFeed = [
  'New artisan registered: Taitu Pottery House',
  'Order #ORD-4124 completed',
  'Product flagged for review: Filigree Ring Set',
  'Verification approved: Hanan Textile Studio',
];

const baseOrders: Order[] = [
  { id: 'ORD-4102', customer: 'Marta T.', amount: '$189.00', status: 'Completed', date: 'Dec 12' },
  { id: 'ORD-4103', customer: 'Helen A.', amount: '$78.00', status: 'Processing', date: 'Dec 12' },
  { id: 'ORD-4104', customer: 'Yonas B.', amount: '$246.00', status: 'Shipped', date: 'Dec 11' },
  { id: 'ORD-4105', customer: 'Ruth S.', amount: '$112.00', status: 'Processing', date: 'Dec 11' },
  { id: 'ORD-4106', customer: 'Nati G.', amount: '$91.00', status: 'Completed', date: 'Dec 10' },
  { id: 'ORD-4107', customer: 'Semhal D.', amount: '$165.00', status: 'Shipped', date: 'Dec 10' },
];

const orders: Order[] = Array.from({ length: 120 }, (_, index) => {
  const seed = baseOrders[index % baseOrders.length];
  return { ...seed, id: `ORD-${4102 + index}` };
});

function statusClass(status: Order['status']) {
  if (status === 'Completed') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Processing') return 'bg-amber-50 text-amber-700';
  return 'bg-sky-50 text-sky-700';
}

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);
  const [visibleStart, setVisibleStart] = useState(0);

  const rowHeight = 56;
  const containerHeight = 336;
  const visibleCount = Math.ceil(containerHeight / rowHeight) + 2;

  const visibleOrders = useMemo(
    () => orders.slice(visibleStart, Math.min(visibleStart + visibleCount, orders.length)),
    [visibleStart, visibleCount],
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <aside
        className={`fixed inset-y-0 left-0 z-40 border-r border-[#e8e0d2] bg-[#fdfbf7] px-3 py-5 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[#3E2723] text-[#FAFAF9]">E</div>
            {!collapsed && (
              <p className="text-sm uppercase tracking-[0.14em]" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
                Curated Admin
              </p>
            )}
          </div>
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-[#74685f] transition-colors hover:text-[#3E2723]"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`group flex w-full items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition ${
                  active
                    ? 'border-l-[#C6A75E] bg-[#f6f0e3] text-[#3E2723]'
                    : 'border-l-transparent text-[#6d645e] hover:bg-[#f5f0e7] hover:text-[#2f2623]'
                }`}
                style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-72'}`}>
        <header className="sticky top-0 z-30 border-b border-[#ece3d5] bg-[#FAFAF9]/90 backdrop-blur">
          <div className="flex items-center gap-4 px-6 py-4 lg:px-8">
            <button className="rounded-lg border border-[#e4dacb] p-2 text-[#6d645e] lg:hidden" aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex flex-1 items-center gap-3 border border-[#e4dacb] bg-white/70 px-3 py-2">
              <Search className="h-4 w-4 text-[#9b8f83]" />
              <input
                placeholder="Search users, products, orders"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#b0a497]"
              />
            </div>
            <button className="relative rounded-xl border border-[#e4dacb] p-2 text-[#5f5750] transition hover:bg-[#f3ede2]">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C6A75E] px-1 text-[10px] text-[#1C1C1C]">
                7
              </span>
            </button>
            <button
              className="hidden rounded-xl border border-[#3E2723] bg-[#3E2723] px-3 py-2 text-sm text-[#FAFAF9] transition hover:opacity-90 md:inline-flex"
              style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}
            >
              + Quick Actions
            </button>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#d6c6b3]" />
              <div className="hidden md:block">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-[#83786f]">Marketplace Ops</p>
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-8 px-6 py-8 lg:px-8">
          <section className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-[#e8dece] bg-white p-6 shadow-[0_8px_28px_rgba(62,39,35,0.06)]">
            <div>
              <h1 className="text-3xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                Admin Dashboard
              </h1>
              <p className="mt-2 text-sm text-[#6d645e]">Monitor and manage the marketplace</p>
            </div>
            <div className="flex items-center gap-3" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
              <select className="rounded-xl border border-[#e1d7c7] bg-white px-3 py-2 text-sm text-[#5f5750] outline-none">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
              <button className="rounded-xl border border-[#e1d7c7] px-4 py-2 text-sm transition hover:bg-[#f5f0e7]">Export</button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {kpiCards.map((card, index) => (
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
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  className="rounded-3xl border border-[#e8dece] bg-white p-5 text-left shadow-[0_6px_20px_rgba(62,39,35,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(198,167,94,0.2)]"
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
              <article className="rounded-3xl border border-[#e8dece] bg-white p-5 shadow-[0_8px_24px_rgba(62,39,35,0.05)]">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                    Pending Approvals
                  </h2>
                  <span className="text-xs text-[#7a6f67]">Needs attention</span>
                </div>
                <div className="space-y-3">
                  {approvalItems.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-[#ece2d3] px-4 py-3 transition hover:bg-[#f9f5ed]">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-2 w-2 rounded-full ${item.priority === 'high' ? 'bg-rose-500' : 'bg-amber-500'}`}
                          />
                          <span
                            className="rounded-full bg-[#f1e9da] px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[#594b37]"
                            style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}
                          >
                            {item.type}
                          </span>
                          <p className="text-sm font-medium">{item.name}</p>
                        </div>
                        <p className="text-xs text-[#7e7268]">{item.date}</p>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="inline-flex items-center gap-1 rounded-lg bg-[#3E2723] px-3 py-1.5 text-xs text-[#FAFAF9] transition hover:opacity-90">
                          <Check className="h-3 w-3" /> Approve
                        </button>
                        <button className="inline-flex items-center gap-1 rounded-lg border border-[#d4c8b6] px-3 py-1.5 text-xs text-[#6c6056] transition hover:bg-[#f8f3ea]">
                          <X className="h-3 w-3" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-[#e8dece] bg-white p-5 shadow-[0_8px_24px_rgba(62,39,35,0.05)]">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                    Recent Orders
                  </h2>
                  <button className="text-sm text-[#6c6157] transition hover:text-[#3E2723]">View all</button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#ebe1d2]">
                  <div className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr_0.8fr] bg-[#f8f4ec] px-4 py-3 text-xs uppercase tracking-[0.08em] text-[#7e7268]">
                    <span>Order ID</span>
                    <span>Customer</span>
                    <span>Amount</span>
                    <span>Status</span>
                    <span>Date</span>
                    <span>Action</span>
                  </div>
                  <div
                    className="relative overflow-y-auto"
                    style={{ height: `${containerHeight}px` }}
                    onScroll={(event) => {
                      const next = Math.floor(event.currentTarget.scrollTop / rowHeight);
                      if (next !== visibleStart) setVisibleStart(next);
                    }}
                  >
                    <div style={{ height: `${orders.length * rowHeight}px`, position: 'relative' }}>
                      {visibleOrders.map((order, idx) => {
                        const index = visibleStart + idx;
                        return (
                          <div
                            key={order.id}
                            className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr_0.8fr] items-center px-4 text-sm transition hover:bg-[#fcf8f0]"
                            style={{
                              position: 'absolute',
                              top: `${index * rowHeight}px`,
                              left: 0,
                              right: 0,
                              height: `${rowHeight}px`,
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            <span className="font-medium text-[#3E2723]">{order.id}</span>
                            <span>{order.customer}</span>
                            <span>{order.amount}</span>
                            <span>
                              <span className={`rounded-full px-2 py-1 text-xs ${statusClass(order.status)}`}>{order.status}</span>
                            </span>
                            <span className="text-[#72665d]">{order.date}</span>
                            <button
                              className="text-left text-xs text-[#3E2723] underline underline-offset-4"
                              onClick={() => setDetailsOrder(order)}
                            >
                              View
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <aside className="space-y-6 xl:col-span-4">
              <article className="rounded-3xl border border-[#e8dece] bg-white p-5 shadow-[0_6px_20px_rgba(62,39,35,0.04)]">
                <h3 className="text-lg uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                  Users Snapshot
                </h3>
                <div className="mt-4 space-y-3">
                  {usersSnapshot.map((user) => (
                    <div key={user.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#dccfbd]" />
                        <p className="text-sm">{user.name}</p>
                      </div>
                      <span className="rounded-full bg-[#f5efe2] px-2 py-1 text-[11px] text-[#6f6257]">{user.role}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-[#3E2723] underline underline-offset-4">Manage All</button>
              </article>

              <article className="rounded-3xl border border-[#e8dece] bg-white p-5 shadow-[0_6px_20px_rgba(62,39,35,0.04)]">
                <h3 className="text-lg uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                  Platform Health
                </h3>
                <div className="mt-4 space-y-4">
                  {[
                    { label: 'Active artisans', value: 82 },
                    { label: 'Total products', value: 74 },
                    { label: 'Growth', value: 63 },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="mb-1 flex justify-between text-xs text-[#776b62]">
                        <span>{metric.label}</span>
                        <span>{metric.value}%</span>
                      </div>
                      <div className="h-2 bg-[#f2ebdf]">
                        <div className="h-full bg-[#C6A75E] transition-all duration-500" style={{ width: `${metric.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-[#e8dece] bg-white p-5 shadow-[0_6px_20px_rgba(62,39,35,0.04)]">
                <h3 className="text-lg uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                  Activity Feed
                </h3>
                <ol className="mt-4 space-y-3 border-l border-[#eadfce] pl-4">
                  {activityFeed.map((item) => (
                    <li key={item} className="relative text-sm text-[#61584f]">
                      <span className="absolute -left-[21px] top-2 h-2 w-2 rounded-full bg-[#C6A75E]" />
                      {item}
                    </li>
                  ))}
                </ol>
              </article>
            </aside>
          </section>

          <section className="rounded-3xl border border-[#e8dece] bg-white p-5 shadow-[0_8px_24px_rgba(62,39,35,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                Analytics
              </h2>
              <GanttChartSquare className="h-5 w-5 text-[#8a7f73]" />
            </div>
            <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-[#f5efe2]" />}>
              <AdminCharts />
            </Suspense>
          </section>
        </main>
      </div>

      {detailsOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#1c1c1c]/30" onClick={() => setDetailsOrder(null)}>
          <aside
            className="h-full w-full max-w-md bg-[#fffdf9] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
                Order Details
              </h3>
              <button className="text-[#6f6258]" onClick={() => setDetailsOrder(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Order ID</p>
                <p className="mt-1 font-medium">{detailsOrder.id}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Customer</p>
                <p className="mt-1 font-medium">{detailsOrder.customer}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Amount</p>
                <p className="mt-1 font-medium">{detailsOrder.amount}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Status</p>
                <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs ${statusClass(detailsOrder.status)}`}>
                  {detailsOrder.status}
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Date</p>
                <p className="mt-1 font-medium">{detailsOrder.date}</p>
              </div>
            </div>
            <button
              className="mt-8 w-full rounded-xl bg-[#3E2723] py-3 text-sm text-[#FAFAF9] transition hover:opacity-90"
              style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}
            >
              Open Full Record
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}