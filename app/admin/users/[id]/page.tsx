"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    AlertTriangle,
    BadgeCheck,
    Ban,
    ChevronDown,
    ChevronRight,
    CreditCard,
    History,
    Lock,
    Pencil,
    ShieldAlert,
    ShoppingBag,
    Upload,
    UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "customer" | "artisan" | "agent" | "admin";
type Status = "active" | "suspended" | "banned";
type TabKey = "activity" | "orders" | "submissions" | "notes";

type Note = {
    id: number;
    text: string;
    author: string;
    createdAt: string;
};

type ActivityLog = {
    id: number;
    label: string;
    date: string;
    tone?: "neutral" | "warning" | "danger" | "success";
};

const ROLE_LABEL: Record<Role, string> = {
    customer: "Customer",
    artisan: "Artisan",
    agent: "Agent",
    admin: "Admin",
};

const ROLE_UPPER: Record<Role, string> = {
    customer: "CUSTOMER",
    artisan: "ARTISAN",
    agent: "AGENT",
    admin: "ADMIN",
};

const STATUS_LABEL: Record<Status, string> = {
    active: "Active",
    suspended: "Suspended",
    banned: "Banned",
};

const STATUS_UPPER: Record<Status, string> = {
    active: "ACTIVE",
    suspended: "SUSPENDED",
    banned: "BANNED",
};

const BASE_ACTIVITY: ActivityLog[] = [
    { id: 1, label: "User logged in from Addis Ababa", date: "2026-04-22 08:21", tone: "neutral" },
    { id: 2, label: "Profile phone number updated", date: "2026-04-21 15:08", tone: "neutral" },
    { id: 3, label: "Order #ETH-9021 placed", date: "2026-04-20 12:44", tone: "success" },
    { id: 4, label: "Sample #S-113 submitted for review", date: "2026-04-19 09:16", tone: "warning" },
    { id: 5, label: "Admin Hana suspended this user", date: "2026-04-10 18:09", tone: "danger" },
];

const ORDER_ROWS = [
    { id: "ETH-9021", status: "Delivered", amount: "ETB 4,200", date: "2026-04-20" },
    { id: "ETH-8977", status: "In Transit", amount: "ETB 2,750", date: "2026-04-16" },
    { id: "ETH-8831", status: "Cancelled", amount: "ETB 1,950", date: "2026-04-09" },
];

const SUBMISSION_ROWS = [
    { id: "S-113", title: "Handwoven Gabi Set", status: "Pending", date: "2026-04-19" },
    { id: "S-104", title: "Clay Coffee Pot", status: "Approved", date: "2026-04-15" },
    { id: "S-099", title: "Leather Shoulder Bag", status: "Rejected", date: "2026-04-02" },
];

const riskMessagesByRole: Record<Role, string[]> = {
    customer: [
        "3 failed payments in the last 14 days.",
        "Shipping address changed 4 times this month.",
    ],
    artisan: [
        "Rejected samples above threshold (5 in last 30 days).",
        "Verification note unresolved for 9 days.",
    ],
    agent: [
        "Task completion dropped below 70% this week.",
        "Two active assignments are overdue.",
    ],
    admin: ["No direct risk signals. Audit log review recommended weekly."],
};

const tabs: { key: TabKey; label: string }[] = [
    { key: "activity", label: "Activity" },
    { key: "orders", label: "Orders" },
    { key: "notes", label: "Notes" },
];

function statusStyles(status: Status) {
    if (status === "active") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "suspended") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
}

function roleStyles(role: Role) {
    if (role === "admin") return "bg-violet-50 text-violet-700 border-violet-200";
    if (role === "agent") return "bg-blue-50 text-blue-700 border-blue-200";
    if (role === "artisan") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-neutral-100 text-neutral-700 border-neutral-200";
}

export default function UserDetailPage() {
    const params = useParams() as { id: string };
    const id = params.id;
    const router = useRouter();

    const [role, setRole] = useState<Role>("customer");
    const [status, setStatus] = useState<Status>("active");
    const [draftRole, setDraftRole] = useState<Role>("customer");
    const [activeTab, setActiveTab] = useState<TabKey>("activity");
    const [showRoleConfirm, setShowRoleConfirm] = useState(false);
    const [draftNote, setDraftNote] = useState("");
    const [editNoteId, setEditNoteId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const [toast, setToast] = useState("");
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [notes, setNotes] = useState<Note[]>([
        {
            id: 1,
            text: "Follow-up needed on verification documents before approving premium listings.",
            author: "Admin Hana",
            createdAt: "2026-04-18",
        },
        {
            id: 2,
            text: "Agent reported delayed sample pickup due to regional strike.",
            author: "Admin Dawit",
            createdAt: "2026-04-12",
        },
    ]);
    const [adminLogs, setAdminLogs] = useState<ActivityLog[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const base = (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "") || "http://localhost:4000/api/v1";
                const token = localStorage.getItem("token");
                const res = await fetch(`${base}/admin/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`Error: ${res.status}`);
                const json = await res.json();
                const data = json.data || json;
                setUserData(data);

                // Sync initial states
                let r = (data.role?.toLowerCase() || "customer") as Role;
                if (data.role === 'VERIFICATION_AGENT') r = 'agent';
                if (data.role === 'USER') r = 'customer';

                setRole(r);
                setDraftRole(r);
                setStatus((data.status?.toLowerCase() || "active") as Status);
            } catch (err) {
                console.error("Failed to fetch user:", err);
                setToast("Failed to load user data");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchUser();
    }, [id]);

    const user = useMemo(() => {
        if (!userData) return {
            name: "Loading...",
            email: "...",
            phone: "...",
            id: id,
            joined: "...",
            lastActive: "...",
            avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80"
        };

        return {
            name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || userData.name || "Unknown User",
            email: userData.email || "No email",
            phone: userData.phone || userData.phoneNumber || "No phone",
            id: userData.id || id,
            joined: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A",
            lastActive: "Recent",
            avatar: userData.avatar || "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80",
        };
    }, [userData, id]);

    const combinedLogs = useMemo(() => {
        return [...adminLogs, ...BASE_ACTIVITY].sort((a, b) => (a.date < b.date ? 1 : -1));
    }, [adminLogs]);

    useEffect(() => {
        if (!toast) return;
        const timer = window.setTimeout(() => setToast(""), 2200);
        return () => window.clearTimeout(timer);
    }, [toast]);

    const showToast = (message: string) => setToast(message);

    const pushLog = (label: string, tone: ActivityLog["tone"] = "neutral") => {
        const now = new Date();
        const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
            now.getDate()
        ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        setAdminLogs((prev) => [{ id: Date.now(), label, date: stamp, tone }, ...prev]);
    };

    const handleStatusChange = (next: Status) => {
        setStatus(next);
        pushLog(
            `Admin changed status to ${STATUS_LABEL[next]}.`,
            next === "banned" ? "danger" : next === "suspended" ? "warning" : "success"
        );
        showToast(`Status set to ${STATUS_UPPER[next]}`);
    };

    const handleRoleUpdate = () => {
        setRole(draftRole);
        setShowRoleConfirm(false);
        pushLog(`Admin changed role to ${ROLE_LABEL[draftRole]}.`, "warning");
        showToast(`Role updated to ${ROLE_UPPER[draftRole]}`);
    };

    const handleAddNote = (event: FormEvent) => {
        event.preventDefault();
        if (!draftNote.trim()) return;
        const nextNote: Note = {
            id: Date.now(),
            text: draftNote.trim(),
            author: "Admin You",
            createdAt: new Date().toISOString().slice(0, 10),
        };
        setNotes((prev) => [nextNote, ...prev]);
        setDraftNote("");
        pushLog("Admin added an internal note.", "neutral");
        showToast("Internal note saved");
    };

    const saveNoteEdit = (id: number) => {
        if (!editText.trim()) return;
        setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, text: editText.trim() } : note)));
        setEditNoteId(null);
        setEditText("");
        pushLog("Admin edited an internal note.", "neutral");
        showToast("Note updated");
    };

    const deleteNote = (id: number) => {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        pushLog("Admin deleted an internal note.", "danger");
        showToast("Note deleted");
    };

    const insightItems = [
        { label: "Activity Pts", value: "1.2K", icon: History },
        { label: "Orders", value: role === "agent" ? "12" : "38", icon: ShoppingBag },
        { label: "Samples", value: role === "artisan" ? "27" : "0", icon: Upload },
        { label: role === "artisan" ? "Rev ETB" : "Spend ETB", value: role === "artisan" ? "182.5K" : "74.8K", icon: CreditCard },
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FAFAF9] text-[#1C1C1C]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C6A75E] border-t-transparent" />
                    <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Loading User Profile...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FAFAF9] px-4 py-6 text-[#1C1C1C] md:px-8">
            <div className="mx-auto max-w-[1440px]">
                <nav className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    <button onClick={() => router.push('/admin/dashboard')} className="hover:text-[#C6A75E] transition">Dashboard</button>
                    <span>/</span>
                    <span className="text-[#C6A75E]">User Details</span>
                </nav>

                <header className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-5">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <img src={user.avatar} className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-md" alt={user.name} />
                                <span
                                    className={cn(
                                        "absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-white",
                                        status === "active" ? "bg-emerald-500" : "bg-rose-500"
                                    )}
                                />
                            </div>
                            <div>
                                <h1 className="font-display text-3xl font-black uppercase tracking-[0.04em] md:text-4xl">{user.name}</h1>
                                <p className="mt-2 text-sm text-neutral-500">
                                    {user.email} | {user.phone}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide", roleStyles(role))}>
                                        {ROLE_UPPER[role]}
                                    </span>
                                    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide", statusStyles(status))}>
                                        {STATUS_UPPER[status]}
                                    </span>
                                    <span className="text-[11px] text-[#786e66]">UID: {user.id}</span>
                                    <span className="text-[11px] text-neutral-400">Joined: {user.joined}</span>
                                    <span className="text-[11px] text-neutral-400">Last Active: {user.lastActive}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    pushLog("Admin opened user edit panel.");
                                    showToast("User editor opened");
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs transition duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                <Pencil className="h-3.5 w-3.5" /> Edit User
                            </button>
                            <button
                                onClick={() => handleStatusChange("suspended")}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700 transition duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                <Lock className="h-3.5 w-3.5" /> Suspend
                            </button>
                            <button
                                onClick={() => handleStatusChange("banned")}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700 transition duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                <Ban className="h-3.5 w-3.5" /> Ban User
                            </button>
                            <button
                                onClick={() => handleStatusChange("active")}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700 transition duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                <UserCheck className="h-3.5 w-3.5" /> Reactivate
                            </button>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    <section className="space-y-6 xl:col-span-7">
                        {role === "customer" && (
                            <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                                <h2 className="font-display text-xl uppercase tracking-[0.04em]">Customer Summary</h2>
                                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/30 p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Orders</p>
                                        <p className="mt-1 text-2xl font-bold">38</p>
                                    </div>
                                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/30 p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Spent</p>
                                        <p className="mt-1 text-2xl font-bold text-[#C6A75E]">74,800 ETB</p>
                                    </div>
                                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/30 p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Last Order</p>
                                        <p className="mt-2 text-sm font-bold">2026-04-20</p>
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-3 text-[11px] font-bold uppercase tracking-wider">
                                    <button
                                        onClick={() => {
                                            setActiveTab("orders");
                                            pushLog("Admin action: View Orders.");
                                        }}
                                        className="rounded-lg bg-[#1C1C1C] px-4 py-2 text-[#FAFAF9] transition hover:opacity-90"
                                    >
                                        View Orders
                                    </button>
                                    <button
                                        onClick={() => {
                                            pushLog("Admin action: Message Customer.");
                                            showToast("Message panel opened");
                                        }}
                                        className="rounded-lg border border-neutral-200 px-4 py-2 transition hover:bg-neutral-50"
                                    >
                                        Message
                                    </button>
                                    <button
                                        onClick={() => {
                                            pushLog("Admin action: Flag for Fraud.", "danger");
                                            showToast("Fraud flag submitted");
                                        }}
                                        className="px-2 py-2 text-rose-600 transition hover:underline"
                                    >
                                        Flag for fraud
                                    </button>
                                </div>
                            </article>
                        )}

                        {role === "artisan" && (
                            <div className="space-y-6">
                                <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                                    <h2 className="font-display text-xl uppercase tracking-[0.04em]">Artisan Profile</h2>
                                    <div className="mt-6 space-y-5">
                                        <div>
                                            <p className="text-lg font-bold text-[#C6A75E]">Addis Loom Studio</p>
                                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-neutral-600">
                                                Traditional weaving and clay craft studio rooted in Gurage and Oromo motifs.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                            {[
                                                { l: "Products", v: "64" },
                                                { l: "Approved", v: "58" },
                                                { l: "Pending", v: "6" },
                                                { l: "Sales", v: "182.5K" },
                                            ].map((stat) => (
                                                <div key={stat.l} className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">{stat.l}</p>
                                                    <p className="mt-0.5 text-lg font-bold">{stat.v}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                                            <div className="flex items-center gap-3">
                                                <BadgeCheck className="h-5 w-5 text-emerald-700" />
                                                <p className="text-sm font-bold">Verification Status: Verified</p>
                                            </div>
                                            <p className="mt-2 text-xs text-neutral-600">
                                                Region/City: Addis Ababa/Bole. Cultural metadata: handloom textiles, coffee ceremony ceramics, natural dye techniques.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    pushLog("Admin opened verification pipeline view.");
                                                    showToast("Verification pipeline opened");
                                                }}
                                                className="mt-3 rounded-lg bg-[#C6A75E] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white"
                                            >
                                                View Verification Pipeline
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex flex-wrap gap-3 text-[11px] font-bold uppercase tracking-wider">
                                        <button
                                            className="rounded-lg bg-[#1C1C1C] px-4 py-2 text-[#FAFAF9]"
                                            onClick={() => {
                                                pushLog("Admin action: View Products.");
                                                showToast("Products view opened");
                                            }}
                                        >
                                            View Products
                                        </button>
                                        <button
                                            className="rounded-lg border border-neutral-200 px-4 py-2"
                                            onClick={() => {
                                                setActiveTab("submissions");
                                                pushLog("Admin action: View Submitted Samples.");
                                            }}
                                        >
                                            View Samples
                                        </button>
                                        <button
                                            className="rounded-lg border border-neutral-200 px-4 py-2"
                                            onClick={() => {
                                                pushLog("Admin action: Message Artisan.");
                                                showToast("Message artisan opened");
                                            }}
                                        >
                                            Message Artisan
                                        </button>
                                        <button
                                            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-rose-700"
                                            onClick={() => {
                                                pushLog("Admin action: Suspend Artisan.", "warning");
                                                handleStatusChange("suspended");
                                            }}
                                        >
                                            Suspend Artisan
                                        </button>
                                    </div>
                                </article>
                            </div>
                        )}

                        {role === "agent" && (
                            <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                                <h2 className="font-display text-xl uppercase tracking-[0.04em]">Agent Overview</h2>
                                <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold uppercase tracking-widest text-neutral-400">Region Coverage</span>
                                            <span className="font-bold">Addis Ababa, Oromia</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold uppercase tracking-widest text-neutral-400">Success Rate</span>
                                            <span className="font-bold text-emerald-600">91%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold uppercase tracking-widest text-neutral-400">Avg Completion</span>
                                            <span className="font-bold">2.4 days</span>
                                        </div>
                                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                                            <div className="h-full w-[91%] bg-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 shadow-inner">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-600">Active tasks</p>
                                            <p className="mt-1 text-3xl font-black text-blue-800">6</p>
                                        </div>
                                        <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 shadow-inner">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Completed</p>
                                            <p className="mt-1 text-3xl font-black text-neutral-800">18</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 flex flex-wrap gap-3 text-[11px] font-bold uppercase tracking-wider">
                                    <button
                                        className="rounded-lg bg-[#3E2723] px-5 py-2.5 text-white shadow-lg"
                                        onClick={() => {
                                            pushLog("Admin action: Assign New Verification.");
                                            showToast("Assign verification opened");
                                        }}
                                    >
                                        Assign New Verification
                                    </button>
                                    <button
                                        className="rounded-lg border border-neutral-200 px-5 py-2.5 transition hover:bg-neutral-50"
                                        onClick={() => {
                                            pushLog("Admin action: View Assigned Tasks.");
                                            showToast("Task board opened");
                                        }}
                                    >
                                        View All Tasks
                                    </button>
                                </div>
                            </article>
                        )}

                        {role === "admin" && (
                            <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                                <h2 className="font-display text-xl uppercase tracking-[0.04em]">Admin Visibility</h2>
                                <div className="mt-4 space-y-3 text-sm text-neutral-700">
                                    <p>Role permissions include finance visibility, moderation, verification override, and role assignment.</p>
                                    <p>All actions are tracked in immutable audit streams.</p>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-3 text-[11px] font-bold uppercase tracking-wider">
                                    <button
                                        onClick={() => setShowRoleConfirm(true)}
                                        className="rounded-lg border border-[#C6A75E]/30 bg-[#C6A75E]/10 px-4 py-2 text-[#7E6322]"
                                    >
                                        Change Role
                                    </button>
                                    <button
                                        onClick={() => {
                                            pushLog("Admin opened audit actions.");
                                            showToast("Audit actions opened");
                                        }}
                                        className="rounded-lg border border-neutral-200 px-4 py-2"
                                    >
                                        Audit Actions
                                    </button>
                                </div>
                            </article>
                        )}

                        <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex flex-wrap gap-7 border-b border-neutral-100 pb-4">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={cn(
                                            "relative pb-2 text-xs font-bold uppercase tracking-widest transition",
                                            activeTab === tab.key ? "text-[#3E2723]" : "text-neutral-400 hover:text-neutral-600"
                                        )}
                                    >
                                        {tab.label}
                                        {activeTab === tab.key && <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-[#C6A75E]" />}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[340px]">
                                {activeTab === "activity" && (
                                    <ol className="mt-4 space-y-8 border-l border-neutral-100 pl-5">
                                        {combinedLogs.map((item) => (
                                            <li key={item.id} className="relative">
                                                <span
                                                    className={cn(
                                                        "absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white",
                                                        item.tone === "danger" && "bg-rose-500",
                                                        item.tone === "warning" && "bg-amber-500",
                                                        item.tone === "success" && "bg-emerald-500",
                                                        (!item.tone || item.tone === "neutral") && "bg-[#C6A75E]"
                                                    )}
                                                />
                                                <p className="text-sm font-bold leading-none text-neutral-800">{item.label}</p>
                                                <p className="mt-1.5 text-[11px] font-medium uppercase text-neutral-400">{item.date}</p>
                                            </li>
                                        ))}
                                    </ol>
                                )}

                                {activeTab === "orders" &&
                                    (role === "customer" || role === "artisan" ? (
                                        <div className="mt-2 overflow-hidden rounded-xl border border-neutral-100">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-neutral-50 uppercase tracking-widest text-neutral-400">
                                                    <tr>
                                                        <th className="px-5 py-4">ID</th>
                                                        <th className="px-5 py-4">Status</th>
                                                        <th className="px-5 py-4">Value</th>
                                                        <th className="px-5 py-4 text-right">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-neutral-100">
                                                    {ORDER_ROWS.map((order) => (
                                                        <tr
                                                            key={order.id}
                                                            className="group cursor-pointer transition hover:bg-neutral-50"
                                                            onClick={() => {
                                                                pushLog(`Opened order detail ${order.id}.`);
                                                                showToast(`Navigate to ${order.id}`);
                                                            }}
                                                        >
                                                            <td className="px-5 py-4 font-bold text-neutral-700">{order.id}</td>
                                                            <td className="px-5 py-4">
                                                                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[9px] font-black">
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-4 font-bold">{order.amount}</td>
                                                            <td className="px-5 py-4 text-right font-medium text-neutral-400">
                                                                {order.date}
                                                                <ChevronRight className="ml-1 inline h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-sm text-neutral-500">Orders are available for customer and artisan roles only.</p>
                                    ))}

                                {activeTab === "submissions" &&
                                    (role === "artisan" ? (
                                        <div className="mt-2 space-y-4">
                                            {SUBMISSION_ROWS.map((submission) => (
                                                <div
                                                    key={submission.id}
                                                    className="group flex cursor-pointer items-center justify-between rounded-2xl border border-neutral-100 p-5 transition hover:border-[#C6A75E] hover:bg-neutral-50/50"
                                                    onClick={() => {
                                                        pushLog(`Opened sample detail ${submission.id}.`);
                                                        showToast(`Navigate to ${submission.id}`);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                                                            <Upload className="h-5 w-5 text-neutral-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-neutral-800">{submission.title}</p>
                                                            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                                                {submission.id} - {submission.date}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span
                                                            className={cn(
                                                                "rounded-full border px-3 py-1 text-[9px] font-black tracking-widest",
                                                                submission.status === "Approved" && "border-emerald-100 bg-emerald-50 text-emerald-700",
                                                                submission.status === "Pending" && "border-amber-100 bg-amber-50 text-amber-700",
                                                                submission.status === "Rejected" && "border-rose-100 bg-rose-50 text-rose-700"
                                                            )}
                                                        >
                                                            {submission.status.toUpperCase()}
                                                        </span>
                                                        <ChevronRight className="h-4 w-4 text-neutral-300 transition group-hover:text-[#C6A75E]" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-sm text-neutral-500">Submissions are available for artisan role only.</p>
                                    ))}

                                {activeTab === "notes" && (
                                    <div className="mt-2 space-y-5">
                                        <form onSubmit={handleAddNote} className="space-y-3">
                                            <textarea
                                                rows={4}
                                                value={draftNote}
                                                onChange={(event) => setDraftNote(event.target.value)}
                                                placeholder="Type an internal administrative note..."
                                                className="w-full rounded-2xl border border-neutral-200 bg-[#fffcf9] p-4 text-sm outline-none transition focus:border-[#C6A75E]"
                                            />
                                            <button className="rounded-xl bg-[#3E2723] px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-[#FAFAF9] shadow-lg transition hover:opacity-90">
                                                Save Note
                                            </button>
                                        </form>

                                        <div className="space-y-3">
                                            {notes.map((note) => (
                                                <div key={note.id} className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-5">
                                                    {editNoteId === note.id ? (
                                                        <div className="space-y-2">
                                                            <textarea
                                                                value={editText}
                                                                onChange={(event) => setEditText(event.target.value)}
                                                                rows={3}
                                                                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-[#C6A75E] focus:ring"
                                                            />
                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => saveNoteEdit(note.id)}
                                                                    className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEditNoteId(null)}
                                                                    className="rounded-lg bg-stone-200 px-3 py-1 text-xs font-semibold"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="text-sm text-neutral-700">{note.text}</p>
                                                            <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                                                {note.author} - {note.createdAt}
                                                            </p>
                                                            <div className="mt-3 flex gap-3 text-[11px] font-bold uppercase tracking-wider">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditNoteId(note.id);
                                                                        setEditText(note.text);
                                                                    }}
                                                                    className="text-[#7E6322]"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button type="button" onClick={() => deleteNote(note.id)} className="text-rose-600">
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </article>
                    </section>

                    <aside className="space-y-6 xl:col-span-5">
                        <div className="space-y-6 xl:sticky xl:top-6">
                            <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Profile Information</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C6A75E]/20 font-display text-lg font-bold text-[#7E6322]">
                                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{user.name}</p>
                                        <p className="text-xs text-neutral-500">{user.email}</p>
                                        <p className="text-xs text-neutral-500">{user.phone}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => {
                                            pushLog("Admin sent password reset email.", "warning");
                                            showToast("Password reset sent");
                                        }}
                                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold transition hover:-translate-y-1"
                                    >
                                        Reset Password
                                    </button>
                                    <button
                                        onClick={() => {
                                            pushLog("Admin initiated direct email.");
                                            showToast("Email composer opened");
                                        }}
                                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold transition hover:-translate-y-1"
                                    >
                                        Send Email
                                    </button>
                                </div>
                            </article>

                            <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Status Control</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { s: "active", i: UserCheck, c: "text-emerald-700 bg-emerald-50 border-emerald-100" },
                                        { s: "suspended", i: Lock, c: "text-amber-700 bg-amber-50 border-amber-100" },
                                        { s: "banned", i: Ban, c: "text-rose-700 bg-rose-50 border-rose-100" },
                                    ].map((item) => {
                                        const Icon = item.i;
                                        const isActive = status === item.s;
                                        return (
                                            <button
                                                key={item.s}
                                                onClick={() => handleStatusChange(item.s as Status)}
                                                className={cn(
                                                    "group flex w-full items-center gap-4 rounded-2xl border p-4 transition",
                                                    isActive
                                                        ? `${item.c} shadow-sm`
                                                        : "border-neutral-50 bg-white text-neutral-400 hover:border-neutral-200 hover:text-neutral-600"
                                                )}
                                            >
                                                <div className={cn("rounded-lg p-2 transition", isActive ? "bg-white/50" : "bg-neutral-50 group-hover:bg-neutral-100")}>
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <span className="text-[11px] font-black uppercase tracking-widest">{STATUS_UPPER[item.s as Status]}</span>
                                                {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-current" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </article>

                            <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Role Management</h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <select
                                            value={draftRole}
                                            onChange={(event) => setDraftRole(event.target.value as Role)}
                                            className="w-full appearance-none rounded-2xl border border-neutral-100 bg-neutral-50/50 px-5 py-3.5 text-[11px] font-black uppercase tracking-widest outline-none transition focus:border-[#C6A75E]"
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="artisan">Artisan</option>
                                            <option value="agent">Agent</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                    </div>
                                    <button
                                        onClick={() => setShowRoleConfirm(true)}
                                        className="w-full rounded-2xl bg-[#C6A75E] py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition duration-300 hover:-translate-y-[2px]"
                                    >
                                        Update Role
                                    </button>
                                </div>
                            </article>

                            <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Quick Insights</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {insightItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={item.label} className="rounded-2xl border border-neutral-50 bg-neutral-50/30 p-4 transition hover:shadow-inner">
                                                <Icon className="mb-3 h-4 w-4 text-[#C6A75E] opacity-80" />
                                                <p className="text-xl font-black leading-none text-neutral-800">{item.value}</p>
                                                <p className="mt-2 text-[9px] font-black uppercase tracking-tight text-neutral-400">{item.label}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </article>

                            <article className="rounded-2xl border border-amber-100 bg-amber-50/30 p-6 shadow-sm">
                                <div className="mb-5 flex items-center gap-3">
                                    <ShieldAlert className="h-5 w-5 text-amber-600" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Risk Indicators</h3>
                                </div>
                                <div className="space-y-3">
                                    {(riskMessagesByRole[role] || riskMessagesByRole.customer).map((risk) => (
                                        <div key={risk} className="flex items-start gap-3 rounded-xl border border-amber-100/50 bg-white/80 p-3.5 shadow-sm">
                                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                            <p className="text-[10px] font-bold uppercase leading-relaxed tracking-tighter text-amber-800">{risk}</p>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Cross Navigation</h3>
                                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold uppercase tracking-wider">
                                    {["View Orders", "View Products", "View Samples", "View Tasks"].map((label) => (
                                        <button
                                            key={label}
                                            onClick={() => {
                                                pushLog(`Cross navigation: ${label}.`);
                                                showToast(label);
                                                if (label === "View Orders") setActiveTab("orders");
                                                if (label === "View Samples") setActiveTab("submissions");
                                            }}
                                            className="rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-left transition hover:-translate-y-1"
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </article>
                        </div>
                    </aside>
                </div>
            </div>

            {showRoleConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1c1c]/60 p-4 backdrop-blur-sm"
                    onClick={() => setShowRoleConfirm(false)}
                >
                    <div
                        className="w-full max-w-md rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="font-display text-xl font-black uppercase tracking-tight leading-none">Modify Access</h3>
                        <p className="mt-6 text-sm font-medium leading-relaxed text-neutral-600">
                            Changing role from
                            <span className="mx-1 rounded border border-neutral-100 bg-neutral-50 px-1.5 py-0.5 font-black text-[#C6A75E]">
                                {ROLE_UPPER[role]}
                            </span>
                            to
                            <span className="mx-1 rounded border border-neutral-100 bg-neutral-50 px-1.5 py-0.5 font-black text-[#C6A75E]">
                                {ROLE_UPPER[draftRole]}
                            </span>
                            will reconfigure this user's marketplace permissions.
                        </p>
                        <div className="mt-10 flex flex-col gap-3">
                            <button
                                className="w-full rounded-2xl bg-[#1C1C1C] py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl transition active:scale-95"
                                onClick={handleRoleUpdate}
                            >
                                Confirm Elevation
                            </button>
                            <button
                                className="w-full rounded-2xl border border-neutral-200 bg-white py-4 text-[11px] font-black uppercase tracking-widest text-neutral-400 transition hover:bg-neutral-50"
                                onClick={() => setShowRoleConfirm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className="fixed bottom-8 right-8 z-50 rounded-2xl border border-neutral-100 bg-[#1C1C1C] px-6 py-4 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-[#C6A75E]" />
                        <p className="text-xs font-black uppercase tracking-widest text-white">{toast}</p>
                    </div>
                </div>
            )}
        </main>
    );
}