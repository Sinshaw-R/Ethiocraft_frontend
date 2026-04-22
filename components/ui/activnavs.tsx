"use client"
import React from 'react';

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface ActivNavsProps {
  navigation: NavItem[];
  activeNav: string;
  setActiveNav: (s: string) => void;
  collapsed: boolean;
  setMobileSidebarOpen: (b: boolean) => void;
}

export default function ActivNavs({
  navigation,
  activeNav,
  setActiveNav,
  collapsed,
  setMobileSidebarOpen,
}: ActivNavsProps) {
  return (
    <nav className="mt-8 space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = activeNav === item.label;
        return (
          <button
            key={item.label}
            onClick={() => {
              setActiveNav(item.label);
              setMobileSidebarOpen(false);
            }}
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
  );
}
