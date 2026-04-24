"use client"
import { useState } from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    Calendar,
    Download,
    Users,
    ShoppingBag,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    LayoutDashboard,
    Box,
    UserCheck,
    ShieldCheck,
    MoreHorizontal,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for tailwind classes */
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- MOCK DATA ---

const REVENUE_DATA = [
    { name: 'Jan', revenue: 45000, orders: 120 },
    { name: 'Feb', revenue: 52000, orders: 145 },
    { name: 'Mar', revenue: 48000, orders: 130 },
    { name: 'Apr', revenue: 61000, orders: 170 },
    { name: 'May', revenue: 55000, orders: 155 },
    { name: 'Jun', revenue: 67000, orders: 190 },
    { name: 'Jul', revenue: 72000, orders: 210 },
    { name: 'Aug', revenue: 85000, orders: 250 },
    { name: 'Sep', revenue: 78000, orders: 230 },
    { name: 'Oct', revenue: 92000, orders: 280 },
    { name: 'Nov', revenue: 105000, orders: 320 },
    { name: 'Dec', revenue: 120000, orders: 380 },
];

const GROWTH_DATA = [
    { name: 'Mon', new: 24, returning: 40 },
    { name: 'Tue', new: 13, returning: 35 },
    { name: 'Wed', new: 98, returning: 60 },
    { name: 'Thu', new: 39, returning: 45 },
    { name: 'Fri', new: 48, returning: 55 },
    { name: 'Sat', new: 38, returning: 70 },
    { name: 'Sun', new: 43, returning: 65 },
];

const ROLE_DATA = [
    { name: 'Customer', value: 4500, color: '#1C1C1C' },
    { name: 'Artisan', value: 850, color: '#C6A75E' },
    { name: 'Agent', value: 300, color: '#525252' },
    { name: 'Admin', value: 12, color: '#A3A3A3' },
];

const TOP_ARTISANS = [
    { id: 1, name: 'Mulugeta Textiles', sales: 124500, orders: 84, avatar: 'MT' },
    { id: 2, name: 'Biniam Crafts', sales: 98200, orders: 62, avatar: 'BC' },
    { id: 3, name: 'Selam Jewelry', sales: 85400, orders: 51, avatar: 'SJ' },
    { id: 4, name: 'Addis Pottery', sales: 76100, orders: 45, avatar: 'AP' },
    { id: 5, name: 'Lalibela Woodwork', sales: 62300, orders: 38, avatar: 'LW' },
];

const INSIGHTS = [
    {
        id: 1,
        text: 'Revenue increased by 18% compared to last period',
        type: 'positive',
    },
    {
        id: 2,
        text: 'Artisan sales dominate 72% of total transactions',
        type: 'neutral',
    },
    {
        id: 3,
        text: 'Peak activity occurs between 6PM–9PM',
        type: 'neutral',
    },
    {
        id: 4,
        text: 'Cart abandonment rate dropped by 4%',
        type: 'positive',
    },
];

// --- COMPONENTS ---



const KpiCard = ({
    label,
    value,
    trend,
    isUp,
    data,
}: {
    label: string;
    value: string;
    trend: string;
    isUp: boolean;
    data: any[];
}) => (
    <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                {label}
            </p>
            <div
                className={cn(
                    'flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full',
                    isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-rose-600'
                )}
            >
                {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {trend}
            </div>
        </div>
        <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-[#1C1C1C] tracking-tight">
                {value}
            </h3>
            <div className="h-10 w-24 opacity-40 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={isUp ? '#10b981' : '#f43f5e'}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

const App = () => {
    const [activeDate, setActiveDate] = useState('Last 30 days');

    return (
        <div className="min-h-screen bg-[#FAFAF9] text-[#1C1C1C] font-sans selection:bg-[#C6A75E] selection:text-white">


            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
                {/* Top Control Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 sticky top-0 z-20 bg-[#FAFAF9]/80 backdrop-blur-xl py-4 -mt-4 border-b border-transparent">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
                        <p className="text-sm text-[#737373]">Actionable insights for EthioCraft.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-white border border-[#E5E5E5] rounded-xl flex items-center p-1 shadow-sm">
                            {['Last 7 days', 'Last 30 days', 'Custom'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setActiveDate(range)}
                                    className={cn(
                                        'px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                                        activeDate === range
                                            ? 'bg-[#FAFAF9] text-[#1C1C1C] border border-[#E5E5E5] shadow-sm'
                                            : 'text-[#737373] hover:text-[#1C1C1C]'
                                    )}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>

                        <button className="bg-white border border-[#E5E5E5] rounded-xl px-4 py-2 text-xs font-semibold shadow-sm hover:bg-neutral-50 transition-colors flex items-center gap-2">
                            <Download size={14} />
                            Export
                        </button>
                    </div>
                </header>

                {/* KPI Overview Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <KpiCard
                        label="Total Revenue"
                        value="1.2M ETB"
                        trend="+12.5%"
                        isUp={true}
                        data={[
                            { value: 40 },
                            { value: 45 },
                            { value: 42 },
                            { value: 50 },
                            { value: 55 },
                            { value: 65 },
                        ]}
                    />
                    <KpiCard
                        label="Total Orders"
                        value="3,842"
                        trend="+8.1%"
                        isUp={true}
                        data={[
                            { value: 30 },
                            { value: 35 },
                            { value: 45 },
                            { value: 40 },
                            { value: 55 },
                            { value: 60 },
                        ]}
                    />
                    <KpiCard
                        label="Active Users"
                        value="1,204"
                        trend="-2.4%"
                        isUp={false}
                        data={[
                            { value: 50 },
                            { value: 48 },
                            { value: 55 },
                            { value: 52 },
                            { value: 45 },
                            { value: 42 },
                        ]}
                    />
                    <KpiCard
                        label="Conversion"
                        value="4.82%"
                        trend="+0.6%"
                        isUp={true}
                        data={[
                            { value: 4.0 },
                            { value: 4.2 },
                            { value: 4.5 },
                            { value: 4.3 },
                            { value: 4.7 },
                            { value: 4.8 },
                        ]}
                    />
                    <KpiCard
                        label="Avg Order Value"
                        value="312 ETB"
                        trend="+1.2%"
                        isUp={true}
                        data={[
                            { value: 290 },
                            { value: 300 },
                            { value: 305 },
                            { value: 295 },
                            { value: 310 },
                            { value: 312 },
                        ]}
                    />
                </div>

                {/* Grid for main sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Revenue Trend Chart */}
                    <div className="lg:col-span-2 bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h4 className="font-bold text-lg tracking-tight">Revenue & Orders</h4>
                                <p className="text-xs text-[#737373]">Yearly trend performance</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-xs text-[#737373]">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#C6A75E]" />
                                    Revenue
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-[#737373]">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#1C1C1C]" />
                                    Orders
                                </div>
                            </div>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={REVENUE_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#737373' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        hide
                                        yAxisId="left"
                                    />
                                    <YAxis
                                        hide
                                        yAxisId="right"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            border: '1px solid #E5E5E5',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        }}
                                    />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#C6A75E"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#C6A75E' }}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#1C1C1C"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#1C1C1C' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Role Distribution Donut */}
                    <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-lg tracking-tight mb-1">User Distribution</h4>
                        <p className="text-xs text-[#737373] mb-8">By platform role</p>
                        <div className="h-64 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={ROLE_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {ROLE_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold">5.6k</span>
                                <span className="text-[10px] text-[#737373] uppercase font-bold tracking-widest">Total Users</span>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-y-3">
                            {ROLE_DATA.map((role) => (
                                <div key={role.name} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: role.color }} />
                                    <span className="text-xs text-[#525252] font-medium">{role.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* User Growth Area Chart */}
                    <div className="lg:col-span-2 bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-lg tracking-tight mb-1">Activity Growth</h4>
                        <p className="text-xs text-[#737373] mb-8">Daily new vs returning users</p>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={GROWTH_DATA}>
                                    <defs>
                                        <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#C6A75E" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#C6A75E" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorRet" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1C1C1C" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#1C1C1C" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#737373' }}
                                    />
                                    <YAxis hide />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="new"
                                        stroke="#C6A75E"
                                        fillOpacity={1}
                                        fill="url(#colorNew)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="returning"
                                        stroke="#1C1C1C"
                                        fillOpacity={1}
                                        fill="url(#colorRet)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Artisans List */}
                    <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-lg tracking-tight mb-1">Top Artisans</h4>
                        <p className="text-xs text-[#737373] mb-8">By sales volume</p>
                        <div className="space-y-5">
                            {TOP_ARTISANS.map((artisan) => (
                                <div key={artisan.id} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center text-xs font-bold text-[#1C1C1C] group-hover:border-[#C6A75E] transition-colors">
                                            {artisan.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold tracking-tight">{artisan.name}</p>
                                            <p className="text-[10px] text-[#737373] uppercase font-bold">{artisan.orders} Orders</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">{artisan.sales.toLocaleString()} ETB</p>
                                        <p className="text-[10px] text-green-600 font-bold">+5.2%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-3 border-t border-[#F5F5F5] text-[10px] font-bold uppercase tracking-widest text-[#737373] hover:text-[#1C1C1C] transition-colors">
                            View All Partners
                        </button>
                    </div>
                </div>

                {/* Smart Insights Panel */}
                <section className="bg-[#1C1C1C] p-10 rounded-3xl text-white relative overflow-hidden">
                    {/* Decorative pattern hint */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A75E] opacity-10 rounded-full -mr-20 -mt-20 blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div className="max-w-md">
                            <h3 className="text-2xl font-bold tracking-tight mb-2">Automated Insights</h3>
                            <p className="text-sm text-[#A3A3A3] mb-6">
                                Our analysis engine detected these significant trends in your marketplace.
                            </p>
                            <div className="grid gap-3">
                                {INSIGHTS.map((insight) => (
                                    <div
                                        key={insight.id}
                                        className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md"
                                    >
                                        <div className={cn(
                                            "mt-1 w-2 h-2 rounded-full",
                                            insight.type === 'positive' ? "bg-green-500" : "bg-[#C6A75E]"
                                        )} />
                                        <p className="text-sm leading-tight text-[#E5E5E5]">{insight.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#C6A75E] p-8 rounded-2xl text-white flex flex-col items-center justify-center text-center max-w-[280px]">
                            <TrendingUp size={48} className="mb-4 text-white/50" />
                            <h5 className="font-bold text-lg mb-2 leading-none">Healthy Growth</h5>
                            <p className="text-xs text-white/80 leading-relaxed">
                                Overall platform engagement is tracking 12% above quarterly targets.
                            </p>
                            <button className="mt-6 bg-white text-[#1C1C1C] px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-[#FAFAF9] transition-colors">
                                Deep Audit
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default App;
