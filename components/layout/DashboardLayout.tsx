'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
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
import { useState, useEffect } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when route changes (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sidebarOpen && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [sidebarOpen]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, color: 'from-blue-500 to-purple-600' },
    { name: 'Profile', href: '/dashboard/profile', icon: Settings, color: 'from-gray-500 to-gray-600' },
    { name: 'AI Strategy', href: '/dashboard/strategy', icon: Target, color: 'from-blue-500 to-purple-600' },
    { name: 'Smart Outreach', href: '/dashboard/outreach', icon: Heart, color: 'from-pink-500 to-red-500' },
    { name: 'Community', href: '/dashboard/community', icon: MessageCircle, color: 'from-green-500 to-teal-500' },
    { name: 'Mentorship', href: '/dashboard/mentorship', icon: Users, color: 'from-yellow-500 to-orange-500' },
    // { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp, color: 'from-indigo-500 to-blue-500' },
    
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-full md:w-72 bg-background/80 backdrop-blur-md shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col h-full overflow-hidden`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gradient">E-CLARIA-AI</span>
          </div>
          <Button
            onClick={() => setSidebarOpen(false)}
            size="sm"
            variant="ghost"
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground/70 hover:bg-accent/10 hover:text-foreground'}`}
                  onClick={(e) => {
                    // Prevent the document click handler from closing the sidebar immediately
                    e.stopPropagation();
                  }}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-md ${isActive 
                    ? `bg-gradient-to-br ${item.color} text-white` 
                    : 'bg-muted/50'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{item.name}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User profile */}
        <div className="mt-auto p-4">
          <div className="flex items-center gap-3 mb-3">
            {user?.name && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
            variant="outline"
            size="sm"
            className="w-full justify-start mt-1"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-20 bg-background/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(true);
            }}
            variant="ghost"
            size="sm"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <span className="text-lg font-bold text-gradient">E-CLARIA-AI</span>
          <div className="w-8" /> {/* Empty space for balance */}
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}