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
  ArrowRight,
  Calendar,
  Bell,
  Plus,
  Sparkles,
  Zap,
  Activity,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  const { user } = useAuth();

  const quickActions = [
    {
      icon: Target,
      title: "AI Strategy",
      description: "Generate intelligent strategic plans",
      href: "/dashboard/strategy",
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Heart,
      title: "Smart Outreach",
      description: "Create compelling campaigns",
      href: "/dashboard/outreach",
      color: "from-pink-500 to-red-500",
      bgColor: "bg-pink-500/10"
    },
    {
      icon: MessageCircle,
      title: "Community Hub",
      description: "Connect with other non-profits",
      href: "/dashboard/community",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Users,
      title: "Expert Mentors",
      description: "Get guidance from leaders",
      href: "/dashboard/mentorship",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10"
    }
  ];

  const recentActivity = [
    {
      type: "strategy",
      title: "Generated AI strategy: \"Digital Fundraising Revolution\"",
      time: "2 hours ago",
      icon: Target,
      color: "text-blue-400"
    },
    {
      type: "community",
      title: "Answered community question about volunteer retention",
      time: "1 day ago",
      icon: MessageCircle,
      color: "text-green-400"
    },
    {
      type: "outreach",
      title: "Created outreach content for donor engagement",
      time: "3 days ago",
      icon: Heart,
      color: "text-pink-400"
    },
    {
      type: "mentorship",
      title: "Connected with new mentor in fundraising",
      time: "1 week ago",
      icon: Users,
      color: "text-yellow-400"
    }
  ];

  const stats = [
    { 
      label: "AI Strategies", 
      value: "24", 
      change: "+8 this month", 
      icon: Target,
      color: "from-blue-500 to-purple-600"
    },
    { 
      label: "Community Points", 
      value: "1,247", 
      change: "+156 this week", 
      icon: Award,
      color: "from-green-500 to-teal-500"
    },
    { 
      label: "Outreach Campaigns", 
      value: "12", 
      change: "+4 this month", 
      icon: Heart,
      color: "from-pink-500 to-red-500"
    },
    { 
      label: "Active Connections", 
      value: "8", 
      change: "3 new mentors", 
      icon: Users,
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative">
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-heading">
                    Welcome back, <span className="text-gradient">{user?.name}</span>!
                  </h1>
                  <p className="text-body text-secondary">
                    Your AI-powered dashboard is ready to amplify your impact today.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button className="btn btn-secondary">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button className="btn btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="floating-card p-6 group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-small font-medium text-secondary">{stat.label}</div>
                  <div className="text-small text-success">{stat.change}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-subheading">Quick Actions</h2>
            <div className="flex items-center gap-2 text-small text-secondary">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Tools</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href} className="floating-card p-6 group">
                  <div className="space-y-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-subheading group-hover:text-gradient transition-all duration-300">
                        {action.title}
                      </h3>
                      <p className="text-body text-secondary group-hover:text-primary transition-colors duration-300">
                        {action.description}
                      </p>
                    </div>
                    <div className="flex items-center text-primary text-small font-medium group-hover:gap-3 transition-all duration-300">
                      Get started
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="floating-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="text-subheading">Recent Activity</h2>
              </div>
              <Button className="btn btn-ghost text-small">
                View all
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 bg-surface/50 rounded-xl hover:bg-surface transition-colors">
                    <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-body">{activity.title}</p>
                      <p className="text-small text-secondary">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notifications */}
          <div className="floating-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-accent" />
                <h2 className="text-subheading">Smart Notifications</h2>
              </div>
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="neon-border p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  <span className="text-small font-medium text-accent">AI Recommendation</span>
                </div>
                <p className="text-body">New mentor match available with fundraising expertise</p>
                <p className="text-small text-secondary">Perfect match based on your goals</p>
              </div>
              
              <div className="glass-card p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-success" />
                  <span className="text-small font-medium text-success">Community Update</span>
                </div>
                <p className="text-body">Your question got 5 new expert answers</p>
                <p className="text-small text-secondary">Community members shared valuable insights</p>
              </div>
              
              <div className="glass-card p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-small font-medium text-primary">Strategy Reminder</span>
                </div>
                <p className="text-body">Time to review Q4 fundraising progress</p>
                <p className="text-small text-secondary">AI analysis shows 23% improvement opportunity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}