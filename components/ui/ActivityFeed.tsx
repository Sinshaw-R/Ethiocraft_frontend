"use client"
import React from 'react';

interface Props { activityFeed: string[] }

export default function ActivityFeed({ activityFeed }: Props) {
  return (
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
  );
}
