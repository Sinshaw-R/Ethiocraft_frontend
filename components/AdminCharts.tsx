import { useEffect, useState } from 'react';

const monthlyRevenue = [28, 34, 31, 39, 42, 48, 45, 54, 58, 61, 66, 72];
const maxRevenue = Math.max(...monthlyRevenue);

const categories = [
  { label: 'Textiles', value: 42 },
  { label: 'Jewelry', value: 27 },
  { label: 'Home Craft', value: 18 },
  { label: 'Leather', value: 13 },
];

export default function AdminCharts() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  const points = monthlyRevenue
    .map((value, index) => {
      const x = (index / (monthlyRevenue.length - 1)) * 100;
      const y = 100 - (value / maxRevenue) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <article className="xl:col-span-2">
        <p className="text-xs uppercase tracking-[0.08em] text-[#81756b]">Revenue Over Time</p>
        <div className="mt-4 rounded-2xl border border-[#ece1d2] bg-[#fdfbf7] p-4">
          <svg viewBox="0 0 100 100" className="h-56 w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3E2723" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#C6A75E" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {[0, 25, 50, 75, 100].map((line) => (
              <line key={line} x1="0" y1={line} x2="100" y2={line} stroke="#efe6d9" strokeWidth="0.5" />
            ))}
            <polyline
              fill="url(#lineGradient)"
              stroke="none"
              points={`0,100 ${points} 100,100`}
              style={{ opacity: visible ? 1 : 0, transition: 'opacity 400ms ease' }}
            />
            <polyline
              fill="none"
              stroke="#3E2723"
              strokeWidth="1.2"
              points={points}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 260,
                strokeDashoffset: visible ? 0 : 260,
                transition: 'stroke-dashoffset 900ms ease',
              }}
            />
          </svg>
        </div>
      </article>

      <article>
        <p className="text-xs uppercase tracking-[0.08em] text-[#81756b]">Category Distribution</p>
        <div className="mt-4 rounded-2xl border border-[#ece1d2] bg-[#fdfbf7] p-4">
          <div className="mx-auto h-40 w-40 rounded-full" style={{ background: 'conic-gradient(#3E2723 0% 42%, #C6A75E 42% 69%, #d8c298 69% 87%, #ebdcc3 87% 100%)' }} />
          <ul className="mt-5 space-y-2">
            {categories.map((category) => (
              <li key={category.label} className="flex items-center justify-between text-sm">
                <span className="text-[#60564e]">{category.label}</span>
                <span className="font-medium">{category.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}