"use client"
import React from 'react';

export default function PlatformHealth() {
  const metrics = [
    { label: 'Active artisans', value: 82 },
    { label: 'Total products', value: 74 },
    { label: 'Growth', value: 63 },
  ];

  return (
    <article className="rounded-3xl border border-[#e8dece] bg-white p-5 shadow-[0_6px_20px_rgba(62,39,35,0.04)]">
      <h3 className="text-lg uppercase tracking-[0.04em]" style={{ fontFamily: '"Druk Wide", "Arial Black", sans-serif' }}>
        Platform Health
      </h3>
      <div className="mt-4 space-y-4">
        {metrics.map((metric) => (
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
  );
}
