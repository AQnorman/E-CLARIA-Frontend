'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  Heart, 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, color: 'from-blue-500 to-purple-600' },
    { name: 'AI Strategy', href: '/dashboard/strategy', icon: Target, color: 'from-blue-500 to-purple-600' },
    { name: 'Smart Outreach', href: '/dashboard/outreach', icon: Heart, color: 'from-pink-500 to-red-500' },
    { name: 'Community', href: '/dashboard/community', icon: MessageCircle, color: 'from-green-500 to-teal-500' },
    { name: 'Mentorship', href: '/dashboard/mentorship', icon: Users, color: 'from-yellow-500 to-orange-500' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp, color: 'from-indigo-500 to-blue-500' },
    { name: 'Profile', href: '/dashboard/profile', icon: Settings, color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <div className="min-h-screen flex relative">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 glass-card transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-gradient">E-CLARIA-AI</span>
          </div>
          <Button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden btn btn-ghost p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-small transition-all duration-300 group ${
                    isActive 
                      ? "bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30" 
                      : "text-secondary hover:text-primary hover:bg-surface/50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-br ${item.color}` 
                      : "bg-surface group-hover:bg-surface-elevated"
                  }`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-secondary group-hover:text-primary'}`} />
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="glass-card p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <span className="text-white text-small font-semibold">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-small font-medium truncate">{user?.name}</p>
                <p className="text-small text-secondary truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={logout}
              className="btn btn-ghost w-full justify-start text-secondary hover:text-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden glass-card p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-ghost p-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gradient">E-CLARIA-AI</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}