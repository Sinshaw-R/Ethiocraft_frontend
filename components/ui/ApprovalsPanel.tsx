"use client"
import React from 'react';
import { Check, X } from 'lucide-react';

type ApprovalItem = {
  id: string;
  type: 'Artisan' | 'Product' | 'Verification';
  name: string;
  date: string;
  priority: 'high' | 'medium';
};

interface Props {
  approvalItems: ApprovalItem[];
  handleApprovalAction: (id: string, action: 'approve' | 'reject') => void;
}

export default function ApprovalsPanel({ approvalItems, handleApprovalAction }: Props) {
  return (
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
                <span className={`h-2 w-2 rounded-full ${item.priority === 'high' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                <span className="rounded-full bg-[#f1e9da] px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[#594b37]" style={{ fontFamily: 'Aeonik, Inter, sans-serif' }}>
                  {item.type}
                </span>
                <p className="text-sm font-medium">{item.name}</p>
              </div>
              <p className="text-xs text-[#7e7268]">{item.date}</p>
            </div>
            <div className="mt-3 flex gap-2">
              <button 
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#3E2723] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#FAFAF9] transition hover:opacity-90 shadow-md shadow-[#3E2723]/10" 
                onClick={() => handleApprovalAction(item.id, 'approve')}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
