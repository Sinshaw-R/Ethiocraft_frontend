"use client"
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
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

const AdminCharts = lazy(() => import('@/components/AdminCharts'));
import ActivNavs from '@/components/ui/activnavs';
import ApprovalsPanel from '@/components/ui/ApprovalsPanel';
import RecentOrders from '@/components/ui/RecentOrders';
import UsersSnapshot from '@/components/ui/UsersSnapshot';
import PlatformHealth from '@/components/ui/PlatformHealth';
import ActivityFeed from '@/components/ui/ActivityFeed';
import DashboardSection from '@/components/ui/navSections/DashboardSection';
import UsersSection from '@/components/ui/navSections/UsersSection';
import ArtisansSection from '@/components/ui/navSections/ArtisansSection';
import ProductsSection from '@/components/ui/navSections/ProductsSection';
import OrdersSection from '@/components/ui/navSections/OrdersSection';
import ApprovalsSection from '@/components/ui/navSections/ApprovalsSection';
import AnalyticsSection from '@/components/ui/navSections/AnalyticsSection';
import ReportsSection from '@/components/ui/navSections/ReportsSection';
import SettingsSection from '@/components/ui/navSections/SettingsSection';
import GenericSection from '@/components/ui/navSections/GenericSection';
/* Admin Dashboard Overview
 - This component composes the main admin interface and several panels.
 - Mapping of admin responsibilities to UI areas in this file:
   • Manage Users and Roles: sidebar 'Users' and 'Users Snapshot' panel.
   • Review Samples / Approvals: 'Approvals' sidebar + 'Pending Approvals' panel.
   • Create Draft from Sample, Review Drafts, Publish Product: 'Products' section + approvals workflow.
   • Assign/Monitor Verification Agents: 'Work Queue' + approval actions (placeholders).
   • Order Oversight: 'Orders' section and 'Recent Orders' panel.
   • Reports / Analytics / System Health: 'Analytics' and 'Platform Health' panels.
 - Notes: many buttons and quick actions are currently placeholders and should be wired
   to real API endpoints (see TODO comments where present).
*/

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

type NotificationItem = {
  id: string;
  title: string;
  time: string;
  read: boolean;
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
// KPI cards: sample metrics shown on the dashboard.
// In production these should be backed by real analytics / reporting APIs.

const initialApprovalItems: ApprovalItem[] = [
  { id: 'A-201', type: 'Artisan', name: 'Selam Woven Studio', date: 'Today', priority: 'high' },
  { id: 'P-894', type: 'Product', name: 'Hand-etched Coffee Pot Set', date: '2h ago', priority: 'medium' },
  { id: 'V-102', type: 'Verification', name: 'Mulu Leather House', date: '5h ago', priority: 'high' },
  { id: 'P-900', type: 'Product', name: 'Amhara Cotton Throw', date: 'Yesterday', priority: 'medium' },
];
// Sample pending approvals used to populate the 'Pending Approvals' panel.
// Replace with a real approval queue fetched from the server; wire approve/reject actions.

const initialNotifications: NotificationItem[] = [
  { id: 'N-1', title: '9 artisan applications waiting for review', time: '5m ago', read: false },
  { id: 'N-2', title: 'Order ORD-4190 was marked shipped', time: '18m ago', read: false },
  { id: 'N-3', title: '1 product report needs moderation', time: '1h ago', read: true },
  { id: 'N-4', title: 'Weekly marketplace snapshot is ready', time: '3h ago', read: true },
];
// Notification sample data. In production, pull notifications from server and support actions.

const quickActions = [
  { title: 'Approve Artisans', subtitle: '9 applications waiting', icon: ShieldCheck },
  { title: 'Review Products', subtitle: '11 listings pending', icon: Package },
  { title: 'Manage Orders', subtitle: '32 in processing', icon: ShoppingCart },
  { title: 'Handle Reports', subtitle: '4 flagged incidents', icon: AlertCircle },
];
// Quick action cards: dashboard shortcuts shown on the main page.
// They are visual shortcuts and currently trigger placeholder handlers.

const usersSnapshot = [
  { name: 'Meklit Abebe', role: 'Artisan' },
  { name: 'Samuel Bekele', role: 'Customer' },
  { name: 'Rahel Tsegaye', role: 'Agent' },
  { name: 'Dawit Kebede', role: 'Artisan' },
];
// Users snapshot: temporary demo data for quick glance. Replace with server data.

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

function statusClass(status: any) {
  if (!status) return 'bg-sky-50 text-sky-700';
  const s = String(status).toLowerCase();
  if (/paid|success|complete|deliv|fulfilled/.test(s)) return 'bg-emerald-50 text-emerald-700';
  if (/process|pending|waiting/.test(s)) return 'bg-amber-50 text-amber-700';
  return 'bg-sky-50 text-sky-700';
}

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState('Last 30 days');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);
  
  // Centralized Orders State
  const [globalOrders, setGlobalOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>(initialApprovalItems);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  
  useEffect(() => {
    const fetchGlobalOrders = async () => {
      try {
        const base = (process.env.NEXT_PUBLIC_BASE_URL ?? '').replace(/\/$/, '') || 'http://localhost:4000/api/v1';
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${base}/orders`, { headers });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();

        let items: any[] = [];
        if (Array.isArray(json?.data?.items)) items = json.data.items;
        else if (Array.isArray(json)) items = json;
        else if (Array.isArray(json?.items)) items = json.items;
        else if (Array.isArray(json?.data)) items = json.data;
        else if (json && typeof json === 'object') {
          items = Object.values(json).flat().filter(Boolean);
        }
        setGlobalOrders(items);
      } catch (err) {
        console.error('Failed to fetch global orders', err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchGlobalOrders();
  }, []);

  const rowHeight = 56;
  const containerHeight = 336;

  const unreadNotifications = notifications.filter((item) => !item.read).length;

  const quickActionCommands = [
    { label: 'Add Product', note: 'Create a placeholder listing draft' },
    { label: 'Verify Artisan', note: 'Open artisan verification queue' },
    { label: 'Export Orders', note: 'Prepare a CSV export job' },
  ];
  // Quick action commands: these drive the '+ Quick Actions' popover.
  // Currently they are UI stubs that show an ephemeral feedback message.
  // Replace handlers in `runQuickAction` with real API-driven behavior.

  const searchResults = useMemo(() => {
    const source = [
      ...navigation.map((item) => ({ type: 'Section', name: item.label })),
      ...globalOrders.slice(0, 8).map((order) => ({ type: 'Order', name: order.id })),
      ...usersSnapshot.map((user) => ({ type: 'User', name: user.name })),
    ];

    if (!searchQuery.trim()) return [];
    const needle = searchQuery.toLowerCase();
    return source.filter((entry) => entry.name.toLowerCase().includes(needle)).slice(0, 6);
  }, [searchQuery]);

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    window.setTimeout(() => setFeedbackMessage(''), 2100);
  };

  const handleApprovalAction = (id: string, action: 'approve' | 'reject') => {
    const item = approvalItems.find((entry) => entry.id === id);
    if (!item) return;
    setApprovalItems((current) => current.filter((entry) => entry.id !== id));
    showFeedback(`${item.type} ${action === 'approve' ? 'approved' : 'rejected'}: ${item.name}`);
  };

  const runQuickAction = (label: string) => {
    // NOTE: quick actions currently perform local navigation / feedback only.
    // Replace with backend calls to perform real admin tasks (create product draft,
    // enqueue verification, start export jobs, etc.) and show progress status.
    if (label === 'Verify Artisan') {
      setActiveNav('Approvals');
    }
    if (label === 'Add Product') {
      setActiveNav('Products');
    }
    setQuickActionsOpen(false);
    showFeedback(`Placeholder action executed: ${label}`);
  };

  const sectionDescriptions: Record<string, string> = {
    Users: 'Manage customer and agent accounts, activity, and access.',
    Artisans: 'Review artisan profiles, onboarding progress, and verification.',
    Products: 'Oversee listings, quality checks, and marketplace assortment.',
    Orders: 'Track fulfillment performance and delivery pipeline.',
    Approvals: 'Process pending artisan, product, and verification requests.',
    Analytics: 'Inspect growth, conversion, and category performance.',
    Reports: 'Resolve reports, moderation flags, and policy incidents.',
    Settings: 'Configure platform rules, permissions, and integrations.',
  };

  const placeholderRows = Array.from({ length: 6 }, (_, index) => ({
    id: `${activeNav.slice(0, 3).toUpperCase()}-${100 + index}`,
    name: `${activeNav} record ${index + 1}`,
    owner: ['Meklit A.', 'Dawit K.', 'Rahel T.', 'Marta S.'][index % 4],
    status: ['Active', 'Pending', 'In Review'][index % 3],
    updated: ['2h ago', 'Today', 'Yesterday'][index % 3],
  }));
  // Placeholder rows for the Work Queue table. Replace with API-driven queue:
  // - filter by status/agent/region
  // - support assignment and escalation actions

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <aside
        className={`fixed inset-y-0 left-0 z-40 border-r border-[#e8e0d2] bg-[#fdfbf7] px-3 py-5 transition-all duration-300 ${
          collapsed ? 'lg:w-20' : 'lg:w-72'
        } w-72 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
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

        <ActivNavs
          navigation={navigation}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          collapsed={collapsed}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
      </aside>

      {mobileSidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-[#1c1c1c]/20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <header className="sticky top-0 z-30 border-b border-[#ece3d5] bg-[#FAFAF9]/90 backdrop-blur">
          <div className="relative flex items-center gap-4 px-6 py-4 lg:px-8">
            <button
              className="rounded-lg border border-[#e4dacb] p-2 text-[#6d645e] lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex flex-1 items-center gap-3 border border-[#e4dacb] bg-white/70 px-3 py-2">
              <Search className="h-4 w-4 text-[#9b8f83]" />
              <input
                placeholder="Search users, products, orders"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#b0a497]"
                value={searchQuery}
                onFocus={() => {
                  setNotificationsOpen(false);
                  setQuickActionsOpen(false);
                }}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <button
              className="relative rounded-xl border border-[#e4dacb] p-2 text-[#5f5750] transition hover:bg-[#f3ede2]"
              onClick={() => {
                setNotificationsOpen((prev) => !prev);
                setQuickActionsOpen(false);
                setProfileMenuOpen(false);
              }}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C6A75E] px-1 text-[10px] text-[#1C1C1C]">
                {unreadNotifications}
              </span>
            </button>
            <button
              className="hidden rounded-xl border border-[#3E2723] bg-[#3E2723] px-3 py-2 text-sm text-[#FAFAF9] transition hover:opacity-90 md:inline-flex"
              style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}
              onClick={() => {
                setQuickActionsOpen((prev) => !prev);
                setNotificationsOpen(false);
                setProfileMenuOpen(false);
              }}
            >
              + Quick Actions
            </button>
            <button
              className="flex items-center gap-3"
              onClick={() => {
                setProfileMenuOpen((prev) => !prev);
                setNotificationsOpen(false);
                setQuickActionsOpen(false);
              }}
            >
              <div className="h-9 w-9 rounded-full bg-[#d6c6b3]" />
              <div className="hidden md:block">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-[#83786f]">Marketplace Ops</p>
              </div>
            </button>

            {searchResults.length > 0 && (
              <div className="absolute left-6 right-6 top-[calc(100%-2px)] z-40 rounded-2xl border border-[#e8dece] bg-white p-2 shadow-[0_12px_30px_rgba(62,39,35,0.08)] lg:left-8 lg:right-[390px]">
                {searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.name}`}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-[#f8f2e7]"
                    onClick={() => {
                      if (result.type === 'Section') {
                        setActiveNav(result.name);
                      }
                      setSearchQuery('');
                      showFeedback(`Opened ${result.type}: ${result.name}`);
                    }}
                  >
                    <span>{result.name}</span>
                    <span className="text-xs text-[#8b7f73]">{result.type}</span>
                  </button>
                ))}
              </div>
            )}

            {notificationsOpen && (
              <div className="absolute right-8 top-[calc(100%+8px)] z-40 w-[340px] rounded-2xl border border-[#e8dece] bg-white p-3 shadow-[0_12px_30px_rgba(62,39,35,0.08)]">
                <div className="mb-2 flex items-center justify-between px-1">
                  <p className="text-sm font-medium">Notifications</p>
                  <button
                    className="text-xs text-[#7d7268] underline underline-offset-2"
                    onClick={() => {
                      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
                      showFeedback('All notifications marked as read');
                    }}
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-72 space-y-1 overflow-y-auto">
                  {notifications.map((item) => (
                    <button
                      key={item.id}
                      className="w-full rounded-xl px-3 py-2 text-left transition hover:bg-[#f8f2e7]"
                      onClick={() => {
                        setNotifications((current) =>
                          current.map((entry) => (entry.id === item.id ? { ...entry, read: true } : entry)),
                        );
                        showFeedback(`Opened notification: ${item.title}`);
                      }}
                    >
                      <p className={`text-sm ${item.read ? 'text-[#73685f]' : 'font-medium text-[#302521]'}`}>{item.title}</p>
                      <p className="mt-1 text-xs text-[#8a7f73]">{item.time}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quickActionsOpen && (
              <div className="absolute right-36 top-[calc(100%+8px)] z-40 w-[300px] rounded-2xl border border-[#e8dece] bg-white p-3 shadow-[0_12px_30px_rgba(62,39,35,0.08)]">
                <p className="mb-2 px-1 text-sm font-medium">Quick Actions</p>
                <div className="space-y-1">
                  {quickActionCommands.map((action) => (
                    <button
                      key={action.label}
                      className="w-full rounded-xl px-3 py-2 text-left transition hover:bg-[#f8f2e7]"
                      onClick={() => runQuickAction(action.label)}
                    >
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-xs text-[#84776d]">{action.note}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {profileMenuOpen && (
              <div className="absolute right-8 top-[calc(100%+8px)] z-40 w-52 rounded-2xl border border-[#e8dece] bg-white p-2 shadow-[0_12px_30px_rgba(62,39,35,0.08)]">
                {['Profile', 'Preferences', 'Sign out'].map((entry) => (
                  <button
                    key={entry}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-[#f8f2e7]"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      showFeedback(`Placeholder action: ${entry}`);
                    }}
                  >
                    {entry}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {(() => {
          const SectionMap: Record<string, any> = {
            Dashboard: DashboardSection,
            Users: UsersSection,
            Artisans: ArtisansSection,
            Products: ProductsSection,
            Orders: OrdersSection,
            Approvals: ApprovalsSection,
            Analytics: AnalyticsSection,
            Reports: ReportsSection,
            Settings: SettingsSection,
          };
          const ActiveSection = SectionMap[activeNav] ?? GenericSection;
          return (
            <ActiveSection
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              showFeedback={showFeedback}
              sectionDescriptions={sectionDescriptions}
              placeholderRows={placeholderRows}
              kpiCards={kpiCards}
              quickActions={quickActions}
              usersSnapshot={usersSnapshot}
              activityFeed={activityFeed}
              approvalItems={approvalItems}
              handleApprovalAction={handleApprovalAction}
              rowHeight={rowHeight}
              containerHeight={containerHeight}
              orders={globalOrders}
              ordersLoading={ordersLoading}
              setDetailsOrder={setDetailsOrder}
            />
          );
        })()}
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
                <p className="mt-1 font-medium">{typeof (detailsOrder as any).customer === 'string' ? (detailsOrder as any).customer : ((detailsOrder as any).customer ? `${(detailsOrder as any).customer.firstName ?? ''} ${(detailsOrder as any).customer.lastName ?? ''}`.trim() || (detailsOrder as any).customer.email || (detailsOrder as any).customerId || '' : '')}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Amount</p>
                <p className="mt-1 font-medium">{((detailsOrder as any).totalAmount ?? (detailsOrder as any).amount ?? (detailsOrder as any).subtotalAmount) ? `${(detailsOrder as any).totalAmount ?? (detailsOrder as any).amount ?? (detailsOrder as any).subtotalAmount}${(detailsOrder as any).currency ? ` ${(detailsOrder as any).currency}` : ''}` : ''}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Status</p>
                <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs ${statusClass(detailsOrder.status)}`}>
                  {detailsOrder.status}
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[#85786d]">Date</p>
                <p className="mt-1 font-medium">{(detailsOrder as any).createdAt ?? (detailsOrder as any).paidAt ?? detailsOrder.date ?? ''}</p>
              </div>
            </div>
            <button
              className="mt-8 w-full rounded-xl bg-[#3E2723] py-3 text-sm text-[#FAFAF9] transition hover:opacity-90"
              style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}
              onClick={() => showFeedback(`Opened full record for ${detailsOrder.id}`)}
            >
              Open Full Record
            </button>
          </aside>
        </div>
      )}

      {feedbackMessage && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-[#d8ccb9] bg-white px-4 py-3 text-sm shadow-[0_10px_24px_rgba(62,39,35,0.12)]">
          {feedbackMessage}
        </div>
      )}
    </div>
  );
}
