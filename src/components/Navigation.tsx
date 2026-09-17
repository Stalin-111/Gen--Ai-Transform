import React from 'react';
import {
  Sparkles,
  LayoutDashboard,
  UploadCloud,
  Wand2,
  LineChart,
  History,
  Layers,
  Settings,
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Content', icon: UploadCloud },
    { id: 'studio', label: 'Transformation Studio', icon: Wand2 },
    { id: 'command-center', label: 'AI Command Center', icon: LineChart },
    { id: 'history', label: 'History', icon: History },
    { id: 'templates', label: 'Templates', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full clay-nav">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center space-x-6">
          <button
            id="nav-brand-logo-btn"
            onClick={() => onNavigate('landing')}
            className="group flex items-center space-x-3 text-left focus:outline-none transition-transform active:scale-95"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl clay-btn-primary shadow-sky-400/30">
              <Sparkles className="h-5 w-5 text-white group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-[#0F172A] font-['Space_Grotesk']">
                  TransformAI
                </span>
                <span className="clay-pill px-2.5 py-0.5 text-[10px] font-bold text-[#2563EB]">
                  AI Platform
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] hidden sm:block font-medium">
                One Source. Infinite Transformations.
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold clay-nav-item ${
                  isActive
                    ? 'clay-nav-item-active'
                    : 'text-[#475569] hover:text-[#1D4ED8]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Quick Start Studio Button */}
          <button
            id="nav-transform-btn"
            onClick={() => onNavigate('studio')}
            className="clay-btn clay-btn-primary px-4 py-2 text-xs font-bold space-x-1.5 text-white"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>New Transform</span>
          </button>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="md:hidden border-t border-[#DBEAFE] bg-[#FFFFFF] px-4 py-2.5 overflow-x-auto flex space-x-2 no-scrollbar shadow-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex shrink-0 items-center space-x-1 px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap ${
                isActive
                  ? 'clay-pill-active'
                  : 'clay-pill text-[#475569] hover:text-[#1D4ED8]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
