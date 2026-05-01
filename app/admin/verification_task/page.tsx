"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  Eye,
  ChevronRight,
  MoreVertical,
  Clock,
  CheckCircle2,
  XCircle,
  Archive,
  ArrowUpRight,
  FileText,
  AlertTriangle,
  Loader2,
  Image as ImageIcon
} from "lucide-react";

type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
type Priority = "HIGH" | "MEDIUM" | "LOW";

interface VerificationTask {
  id: string;
  productName: string;
  artisanName: string;
  category: string;
  submittedAt: string;
  status: VerificationStatus;
  priority: Priority;
  imageUrl: string;
  description: string;
  materials: string[];
  region: string;
  previousRejections?: string[];
}

const MOCK_TASKS: VerificationTask[] = [
  {
    id: "VT-9021",
    productName: "Handwoven Cotton Netela",
    artisanName: "Abebech Gobena",
    category: "Textiles",
    submittedAt: "2026-04-29T09:30:00Z",
    status: "PENDING",
    priority: "HIGH",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=400",
    description: "Traditional Ethiopian cotton scarf with detailed tibeb borders. Handwoven over 3 days using locally sourced organic cotton.",
    materials: ["Organic Cotton", "Natural Dyes"],
    region: "Addis Ababa",
  },
  {
    id: "VT-9022",
    productName: "Carved Olive Wood Bowl",
    artisanName: "Dawit Workshop",
    category: "Woodwork",
    submittedAt: "2026-04-28T14:15:00Z",
    status: "PENDING",
    priority: "MEDIUM",
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400",
    description: "Solid olive wood bowl, treated with natural beeswax. Perfect for serving or display.",
    materials: ["Olive Wood", "Beeswax"],
    region: "Lalibela",
    previousRejections: ["Images were too dark in the previous submission."],
  },
  {
    id: "VT-9023",
    productName: "Ceramic Coffee Jebena",
    artisanName: "Tarik Pottery",
    category: "Ceramics",
    submittedAt: "2026-04-29T11:00:00Z",
    status: "APPROVED",
    priority: "LOW",
    imageUrl: "https://images.unsplash.com/photo-1553655180-2a819b1db14d?auto=format&fit=crop&q=80&w=400",
    description: "Classic black clay coffee pot used in the Ethiopian coffee ceremony.",
    materials: ["Terracotta Clay"],
    region: "Jimma",
  },
  {
    id: "VT-9024",
    productName: "Leather Messenger Bag",
    artisanName: "Solyana Leather",
    category: "Leather",
    submittedAt: "2026-04-27T16:45:00Z",
    status: "REJECTED",
    priority: "HIGH",
    imageUrl: "https://images.unsplash.com/photo-1559564022-f1af6716075e?auto=format&fit=crop&q=80&w=400",
    description: "Hand-stitched leather messenger bag with adjustable strap and brass hardware.",
    materials: ["Full-grain Leather", "Brass"],
    region: "Bahir Dar",
  }
];

export default function VerificationControlCenter() {
  const [tasks, setTasks] = useState<VerificationTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "ALL">("PENDING");
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<VerificationTask | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    // Simulate initial fetch
    const timer = setTimeout(() => {
      setTasks(MOCK_TASKS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = 
        task.productName.toLowerCase().includes(search.toLowerCase()) || 
        task.artisanName.toLowerCase().includes(search.toLowerCase()) ||
        task.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTasks.length && filteredTasks.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTasks.map((t) => t.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleApprove = (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: "APPROVED" } : t));
    showToast(`Approved ${id}`, "success");
    if (selectedTask?.id === id) setSelectedTask({ ...selectedTask, status: "APPROVED" });
  };

  const handleReject = () => {
    if (!selectedTask) return;
    if (!rejectReason.trim()) {
      showToast("Rejection reason is required", "error");
      return;
    }
    setTasks((prev) => prev.map((t) => t.id === selectedTask.id ? { ...t, status: "REJECTED" } : t));
    showToast(`Rejected ${selectedTask.id}`, "success");
    setSelectedTask({ ...selectedTask, status: "REJECTED" });
    setShowRejectModal(false);
    setRejectReason("");
  };

  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;
    setTasks((prev) => prev.map((t) => selectedIds.has(t.id) ? { ...t, status: "APPROVED" } : t));
    showToast(`Bulk approved ${selectedIds.size} tasks`, "success");
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    if (selectedIds.size === 0) return;
    // In a real app, you might prompt for a shared reason. Here we just mark rejected.
    setTasks((prev) => prev.map((t) => selectedIds.has(t.id) ? { ...t, status: "REJECTED" } : t));
    showToast(`Bulk rejected ${selectedIds.size} tasks`, "success");
    setSelectedIds(new Set());
  };

  const stats = useMemo(() => {
    return {
      pending: tasks.filter(t => t.status === "PENDING").length,
      approved: tasks.filter(t => t.status === "APPROVED").length,
      rejected: tasks.filter(t => t.status === "REJECTED").length,
    };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#F6F4F0] text-[#1C1C1C] font-sans overflow-x-hidden relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#EAE5D9] px-6 py-5 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl tracking-tight text-[#2D2620]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif', textTransform: 'uppercase' }}>
              Verification Control
            </h1>
            <p className="text-sm text-[#766A5D] mt-1 font-medium">Review and manage all product verification tasks</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A39B8F] group-focus-within:text-[#C6A75E] transition-colors" />
              <input
                type="text"
                placeholder="Search products, artisans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[#FBFaf8] border border-[#EAE5D9] rounded-xl text-sm focus:outline-none focus:border-[#C6A75E] focus:ring-1 focus:ring-[#C6A75E] transition-all w-[260px]"
              />
            </div>
            
            <div className="flex items-center bg-[#FBFaf8] border border-[#EAE5D9] rounded-xl p-1">
              {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    statusFilter === s 
                      ? "bg-white shadow-sm text-[#3E2723]" 
                      : "text-[#766A5D] hover:text-[#3E2723]"
                  }`}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EAE5D9] rounded-xl text-sm font-medium hover:bg-[#FBFaf8] transition-colors">
              <Filter className="h-4 w-4 text-[#766A5D]" />
              Filters
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        
        {/* Analytics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending Reviews", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
            { label: "Approved Today", value: stats.approved, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "Rejected Today", value: stats.rejected, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
            { label: "Avg Review Time", value: "2.4 hrs", icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          ].map((stat, i) => (
            <div key={i} className={`p-5 rounded-2xl border ${stat.border} bg-white shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300`}>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8B7F72] uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-[#2D2620] mt-0.5">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions Banner */}
        <div className={`mb-6 overflow-hidden transition-all duration-300 ease-in-out ${selectedIds.size > 0 ? 'h-16 opacity-100' : 'h-0 opacity-0'}`}>
          <div className="flex items-center justify-between bg-[#3E2723] text-white px-6 py-4 rounded-2xl shadow-lg shadow-[#3E2723]/20">
            <span className="text-sm font-medium">{selectedIds.size} tasks selected</span>
            <div className="flex gap-3">
              <button onClick={handleBulkReject} className="px-4 py-1.5 text-sm bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 rounded-lg transition-colors border border-rose-500/30">
                Bulk Reject
              </button>
              <button onClick={handleBulkApprove} className="px-4 py-1.5 text-sm bg-emerald-500 text-white hover:bg-emerald-400 rounded-lg transition-colors shadow-sm">
                Bulk Approve
              </button>
            </div>
          </div>
        </div>

        {/* Verification Queue Table */}
        <div className="bg-white border border-[#EAE5D9] rounded-3xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-[#A39B8F]">
              <Loader2 className="h-8 w-8 animate-spin text-[#C6A75E] mb-4" />
              <p className="text-sm font-medium tracking-wide">Loading queue...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 bg-[#FBFaf8] rounded-full flex items-center justify-center mb-4 border border-[#EAE5D9]">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-[#2D2620]">Queue is Empty</h3>
              <p className="text-sm text-[#766A5D] mt-1">Great job! All verification tasks are completed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-[#FBFaf8] border-b border-[#EAE5D9]">
                    <th className="px-6 py-4 font-semibold text-[#766A5D] w-12">
                      <input 
                        type="checkbox" 
                        className="rounded border-[#C8BEB2] text-[#C6A75E] focus:ring-[#C6A75E] h-4 w-4 cursor-pointer"
                        checked={selectedIds.size === filteredTasks.length && filteredTasks.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-4 font-semibold text-[#766A5D]">Product</th>
                    <th className="px-6 py-4 font-semibold text-[#766A5D]">Artisan</th>
                    <th className="px-6 py-4 font-semibold text-[#766A5D]">Submitted</th>
                    <th className="px-6 py-4 font-semibold text-[#766A5D]">Priority</th>
                    <th className="px-6 py-4 font-semibold text-[#766A5D]">Status</th>
                    <th className="px-6 py-4 font-semibold text-[#766A5D] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5D9]">
                  {filteredTasks.map((task) => {
                    const isSelected = selectedIds.has(task.id);
                    return (
                      <tr 
                        key={task.id} 
                        className={`group transition-colors hover:bg-[#FAF9F7] ${isSelected ? 'bg-[#FBFaf8]' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            className="rounded border-[#C8BEB2] text-[#C6A75E] focus:ring-[#C6A75E] h-4 w-4 cursor-pointer"
                            checked={isSelected}
                            onChange={() => toggleSelect(task.id)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl border border-[#EAE5D9] overflow-hidden bg-[#FBFaf8] flex-shrink-0">
                              {task.imageUrl ? (
                                <img src={task.imageUrl} alt={task.productName} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-[#A39B8F] m-auto mt-3" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-[#2D2620] group-hover:text-[#C6A75E] transition-colors cursor-pointer" onClick={() => setSelectedTask(task)}>{task.productName}</p>
                              <p className="text-xs text-[#8B7F72] mt-0.5">{task.id} • {task.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#2D2620]">{task.artisanName}</p>
                          <p className="text-xs text-[#8B7F72] mt-0.5">{task.region}</p>
                        </td>
                        <td className="px-6 py-4 text-[#5C5449]">
                          {new Date(task.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                            task.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                            task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-slate-50 text-slate-700 border border-slate-200'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            task.status === 'PENDING' ? 'bg-amber-100/50 text-amber-700' :
                            task.status === 'APPROVED' ? 'bg-emerald-100/50 text-emerald-700' :
                            'bg-rose-100/50 text-rose-700'
                          }`}>
                            {task.status === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                            {task.status === 'APPROVED' && <Check className="w-3 h-3" />}
                            {task.status === 'REJECTED' && <X className="w-3 h-3" />}
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setSelectedTask(task)}
                              className="p-1.5 text-[#766A5D] hover:text-[#3E2723] hover:bg-[#EAE5D9] rounded-lg transition-colors"
                              title="Review Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {task.status === "PENDING" && (
                              <>
                                <button 
                                  onClick={() => handleApprove(task.id)}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Quick Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => { setSelectedTask(task); setShowRejectModal(true); }}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Quick Reject"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Side Drawer for Detail Review */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-[#1C1C1C]/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedTask(null)} />
          <div className="relative w-full max-w-xl bg-[#FAFAF9] h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE5D9] bg-white">
              <div>
                <h2 className="text-sm font-semibold text-[#8B7F72] uppercase tracking-wider">Review Task</h2>
                <p className="font-bold text-[#2D2620] text-lg">{selectedTask.id}</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-2 text-[#A39B8F] hover:bg-[#FBFaf8] rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                selectedTask.status === 'PENDING' ? 'bg-amber-50 border-amber-200' :
                selectedTask.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200' :
                'bg-rose-50 border-rose-200'
              }`}>
                <div className="flex items-center gap-3">
                  {selectedTask.status === 'PENDING' && <Clock className="text-amber-600 w-5 h-5" />}
                  {selectedTask.status === 'APPROVED' && <CheckCircle2 className="text-emerald-600 w-5 h-5" />}
                  {selectedTask.status === 'REJECTED' && <XCircle className="text-rose-600 w-5 h-5" />}
                  <div>
                    <p className={`font-semibold ${
                      selectedTask.status === 'PENDING' ? 'text-amber-800' :
                      selectedTask.status === 'APPROVED' ? 'text-emerald-800' :
                      'text-rose-800'
                    }`}>
                      Current Status: {selectedTask.status}
                    </p>
                    {selectedTask.status === 'PENDING' && <p className="text-xs text-amber-700/80">Awaiting your decision</p>}
                  </div>
                </div>
              </div>

              {/* Product Media */}
              <div>
                <h3 className="text-xs font-bold text-[#A39B8F] uppercase tracking-wider mb-3">Product Media</h3>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#EAE5D9] bg-white group relative">
                  <img src={selectedTask.imageUrl} alt={selectedTask.productName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/30 transition-colors">
                      <Eye className="w-4 h-4" /> View Full Resolution
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-white rounded-2xl border border-[#EAE5D9] p-5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[#2D2620]">{selectedTask.productName}</h3>
                  <span className="px-2.5 py-1 bg-[#FBFaf8] border border-[#EAE5D9] rounded-md text-xs font-medium text-[#766A5D]">
                    {selectedTask.category}
                  </span>
                </div>
                <p className="text-[#5C5449] text-sm leading-relaxed mb-6">{selectedTask.description}</p>
                
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-[#A39B8F] text-xs font-semibold uppercase tracking-wider mb-1">Materials</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTask.materials.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#F6F4F0] text-[#5C5449] rounded text-xs">{m}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[#A39B8F] text-xs font-semibold uppercase tracking-wider mb-1">Origin</p>
                    <p className="font-medium text-[#2D2620]">{selectedTask.region}</p>
                  </div>
                </div>
              </div>

              {/* Artisan Profile */}
              <div className="bg-[#FBFaf8] rounded-2xl border border-[#EAE5D9] p-5">
                <h3 className="text-xs font-bold text-[#A39B8F] uppercase tracking-wider mb-3">Submitted By</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#EAE5D9] rounded-full flex items-center justify-center text-[#766A5D] font-bold">
                      {selectedTask.artisanName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#2D2620]">{selectedTask.artisanName}</p>
                      <p className="text-xs text-[#8B7F72]">Verified Artisan</p>
                    </div>
                  </div>
                  <button className="text-[#C6A75E] text-sm font-medium hover:underline flex items-center gap-1">
                    View Profile <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* History / Rejections */}
              {selectedTask.previousRejections && selectedTask.previousRejections.length > 0 && (
                <div className="bg-rose-50 rounded-2xl border border-rose-100 p-5">
                  <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Previous Rejections
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-rose-700/80 space-y-1">
                    {selectedTask.previousRejections.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Internal Notes */}
              <div>
                <h3 className="text-xs font-bold text-[#A39B8F] uppercase tracking-wider mb-2">Internal Note (Optional)</h3>
                <textarea 
                  placeholder="Add a private note visible only to admins..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="w-full h-20 p-3 bg-white border border-[#EAE5D9] rounded-xl text-sm focus:outline-none focus:border-[#C6A75E] focus:ring-1 focus:ring-[#C6A75E] transition-all resize-none"
                />
              </div>

            </div>

            {/* Drawer Footer / Decisions */}
            <div className="border-t border-[#EAE5D9] bg-white p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
              {selectedTask.status === "PENDING" ? (
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowRejectModal(true)}
                    className="flex items-center justify-center gap-2 py-3 border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl font-semibold transition-colors"
                  >
                    <X className="w-5 h-5" /> Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedTask.id)}
                    className="flex items-center justify-center gap-2 py-3 bg-[#3E2723] text-white hover:bg-[#2A1A17] shadow-lg shadow-[#3E2723]/20 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
                  >
                    <Check className="w-5 h-5" /> Approve
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="w-full py-3 bg-[#FBFaf8] border border-[#EAE5D9] text-[#2D2620] hover:bg-[#EAE5D9] rounded-xl font-semibold transition-colors"
                >
                  Close Review
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1C1C1C]/60 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-[#2D2620] mb-2">Reject Submission</h3>
            <p className="text-sm text-[#766A5D] mb-5">Please provide a reason for rejecting <span className="font-semibold">{selectedTask?.productName}</span>. This will be sent to the artisan.</p>
            
            <textarea 
              autoFocus
              placeholder="E.g., Images are blurry, description lacks details..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full h-28 p-3 bg-[#FBFaf8] border border-[#EAE5D9] rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all resize-none mb-5"
            />
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-[#766A5D] hover:bg-[#FBFaf8] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleReject}
                className="px-5 py-2.5 text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 rounded-xl transition-all"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[70] animate-in slide-in-from-bottom-5">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
            toast.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' :
            'bg-white text-[#2D2620] border-[#EAE5D9]'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-500" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5 text-[#C6A75E]" />}
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

    </div>
  );
}