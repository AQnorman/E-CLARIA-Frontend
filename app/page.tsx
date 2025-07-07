'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  Heart, 
  MessageCircle, 
  Users, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Shield,
  Rocket
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: Target,
      title: "AI Strategy",
      description: "Generate personalized strategic plans powered by advanced AI",
      color: "from-blue-500 to-purple-600",
      delay: "0ms"
    },
    {
      icon: Heart,
      title: "Smart Outreach",
      description: "Create compelling campaigns that resonate with your audience",
      color: "from-pink-500 to-red-500",
      delay: "100ms"
    },
    {
      icon: MessageCircle,
      title: "Community Hub",
      description: "Connect with other non-profits and share knowledge",
      color: "from-green-500 to-teal-500",
      delay: "200ms"
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      description: "Get guidance from experienced non-profit leaders",
      color: "from-yellow-500 to-orange-500",
      delay: "300ms"
    },
    {
      icon: TrendingUp,
      title: "Impact Analytics",
      description: "Track your organization's progress and growth",
      color: "from-indigo-500 to-blue-500",
      delay: "400ms"
    },
    {
      icon: Brain,
      title: "Smart Insights",
      description: "Receive intelligent recommendations for optimization",
      color: "from-purple-500 to-pink-500",
      delay: "500ms"
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Interactive Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="interactive-grid"
          style={{
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`,
          } as React.CSSProperties}
        />
      </div>

      {/* Floating Navigation */}
      <nav className="floating-nav animate-slide-up">
        <div className="flex items-center gap-2">
          <Link href="#home" className="floating-nav-item active">Home</Link>
          <Link href="#features" className="floating-nav-item">Features</Link>
          <Link href="#about" className="floating-nav-item">About</Link>
          <div className="w-px h-4 bg-border/50 mx-2" />
          <Link href="/auth/login" className="floating-nav-item">Login</Link>
        </div>
      </nav>

      {/* Cursor Follower */}
      <div 
        className="fixed w-6 h-6 bg-primary/20 rounded-full pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${scrollY > 100 ? 1.5 : 1})`
        }}
      />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="container text-center relative z-10">
          <div className="animate-slide-up">
            
            <h1 className="text-display mb-8 max-w-5xl mx-auto">
              Revolutionize Your
              <br />
              <span className="text-gradient">Non-Profit Impact</span>
            </h1>
            
            <p className="text-body text-secondary mb-12 max-w-2xl mx-auto text-lg">
              Harness the power of artificial intelligence to generate strategies, 
              create compelling content, and build stronger communities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth/register" className="btn btn-primary text-lg px-8 py-4">
                <Rocket className="mr-3 h-5 w-5" />
                Launch Your Journey
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
              <Link href="#features" className="btn btn-ghost text-lg px-8 py-4">
                <Globe className="mr-3 h-5 w-5" />
                Explore Platform
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-success/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="section">
        <div className="container">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-heading mb-6">
              Innovative <span className="text-gradient">Solutions</span>
            </h2>
            <p className="text-body text-secondary max-w-2xl mx-auto text-lg">
              Experience the future of non-profit management with our cutting-edge AI tools
            </p>
          </div>

          <div className="bento-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className={`bento-item floating-card group ${index === 0 ? 'large' : index === 1 ? 'tall' : ''}`}
                  style={{ animationDelay: feature.delay }}
                >
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-subheading mb-4 group-hover:text-gradient transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-body text-secondary group-hover:text-primary transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center text-primary text-small font-medium group-hover:gap-3 transition-all duration-300">
                      Learn more
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="section diagonal-split">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-slide-left">
              <div className="text-5xl font-bold text-gradient mb-4">10K+</div>
              <div className="text-body text-secondary">Non-Profits Empowered</div>
            </div>
            <div className="text-center animate-slide-up">
              <div className="text-5xl font-bold text-gradient mb-4">500K+</div>
              <div className="text-body text-secondary">Strategies Generated</div>
            </div>
            <div className="text-center animate-slide-right">
              <div className="text-5xl font-bold text-gradient mb-4">98%</div>
              <div className="text-body text-secondary">Success Rate</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="glass-card p-16 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-heading mb-6">
                Ready to <span className="text-gradient">Transform</span> Your Impact?
              </h2>
              <p className="text-body text-secondary mb-8 max-w-2xl mx-auto text-lg">
                Join the revolution of AI-powered non-profit management and amplify your organization's potential
              </p>
              <Link href="/auth/register" className="btn btn-primary text-lg px-8 py-4 animate-glow">
                <Shield className="mr-3 h-5 w-5" />
                Start Free Today
                <Zap className="ml-3 h-5 w-5" />
              </Link>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full blur-xl" />
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent rounded-full blur-xl" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-success rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-sm border-t border-border/50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gradient">E-CLARIA-AI</span>
            </div>
            <div className="text-small text-secondary">
              © 2024 E-CLARIA-AI. Revolutionizing non-profit impact through AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}