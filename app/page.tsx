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
      <section id="home" className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
        <div className="container text-center relative z-10">
          <div className="animate-slide-up">
            {/* Hackathon Badge */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 backdrop-blur-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Zap className="h-3 w-3 text-white" />
                </div>
                <span className="text-gradient font-semibold text-sm tracking-wide">RAISE YOUR HACK 2025</span>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              </div>
            </div>
            
            {/* Brand Title */}
            <div className="mb-8">
                <span className="text-gradient font-bold text-lg tracking-wide">E-CLARIA</span>
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            </div>
            
            <h1 className="text-display mb-8 max-w-5xl mx-auto">
              Transform Your
              <br />
              <span className="text-gradient">Non-Profit Impact</span>
              <br />
              <span className="text-2xl md:text-4xl font-normal text-secondary">with AI-Powered Intelligence</span>
            </h1>
            
            <p className="text-body text-secondary mb-12 max-w-2xl mx-auto text-lg">
              Harness cutting-edge AI to generate strategic insights, create compelling outreach content, 
              and build thriving communities that amplify your mission.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
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
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-success/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-yellow-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '6s' }} />
        
        {/* Geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rotate-45 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-accent/30 rounded-full animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-success/30 animate-float" style={{ animationDelay: '5s' }} />
      </section>

      {/* Hackathon Participation Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="container">
          <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
            <div className="relative z-10">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-4">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-500 font-medium text-sm">HACKATHON SUBMISSION</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Participating in <span className="text-gradient">RAISE YOUR HACK 2025</span>
                </h2>
                <p className="text-secondary max-w-2xl mx-auto">
                  E-CLARIA-AI is our innovative submission to RAISE YOUR HACK 2025, showcasing the power of AI 
                  in transforming non-profit organizations and amplifying their social impact.
                </p>
              </div>

              {/* Key Highlights */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">AI-Powered Innovation</h3>
                  <p className="text-sm text-secondary">Leveraging cutting-edge AI to solve real-world challenges in the non-profit sector</p>
                </div>
                
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Social Impact</h3>
                  <p className="text-sm text-secondary">Empowering non-profits to maximize their reach and effectiveness in creating positive change</p>
                </div>
                
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Future-Ready</h3>
                  <p className="text-sm text-secondary">Building scalable solutions that adapt to the evolving needs of modern non-profit organizations</p>
                </div>
              </div>

              {/* Event Details */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-surface/50 border border-border/50">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Live Submission</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-surface/50 border border-border/50">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Global Competition</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-surface/50 border border-border/50">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Team Innovation</span>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Powered By Section */}
      <section className="py-12">
        <div className="container">
          <div className="text-center mb-8">
            <p className="text-small text-secondary mb-6">Powered by</p>
          </div>
          
          <div className="flex items-center justify-center gap-12 md:gap-16">
            {/* Vultr */}
            <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <svg className="h-12 w-auto" id="logo__on-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 217.5 52">
                <defs>
                  <style>{`.cls-1{fill:currentColor;}.cls-2{fill:#007bfc;}.cls-3{fill:#51b9ff;}`}</style>
                </defs>
                <title>Vultr</title>
                <g id="text">
                  <path className="cls-1" d="M217.3,37.75l-5.47-9.43A8.5,8.5,0,0,0,208.5,12h-12a1.5,1.5,0,0,0-1.5,1.5v25a1.5,1.5,0,0,0,1.5,1.5h1a1.5,1.5,0,0,0,1.5-1.5V29h8.74l5.95,10.25A1.49,1.49,0,0,0,215,40h1a1.5,1.5,0,0,0,1.5-1.5A1.48,1.48,0,0,0,217.3,37.75ZM199,16h9.5a4.5,4.5,0,0,1,0,9H199Z"/>
                  <path className="cls-1" d="M186.5,12h-21a1.5,1.5,0,0,0-1.5,1.5v1a1.5,1.5,0,0,0,1.5,1.5H174V38.5a1.5,1.5,0,0,0,1.5,1.5h1a1.5,1.5,0,0,0,1.5-1.5V16h8.5a1.5,1.5,0,0,0,1.5-1.5v-1A1.5,1.5,0,0,0,186.5,12Z"/>
                  <path className="cls-1" d="M164.5,36H151V13.5a1.5,1.5,0,0,0-1.5-1.5h-1a1.5,1.5,0,0,0-1.5,1.5v25a1.5,1.5,0,0,0,1.5,1.5h16a1.5,1.5,0,0,0,1.5-1.5v-1A1.5,1.5,0,0,0,164.5,36Z"/>
                  <path className="cls-1" d="M139,13.5a1.5,1.5,0,0,0-1.5-1.5h-1a1.5,1.5,0,0,0-1.5,1.5V29a7.5,7.5,0,0,1-15,0V13.5a1.5,1.5,0,0,0-1.5-1.5h-1a1.5,1.5,0,0,0-1.5,1.5V29a11.5,11.5,0,0,0,23,0Z"/>
                  <path className="cls-1" d="M108.5,12h-1a1.5,1.5,0,0,0-1.39.94L97.5,34.59,88.84,12.94A1.5,1.5,0,0,0,87.45,12h-1A1.5,1.5,0,0,0,85,13.5a1.55,1.55,0,0,0,.11.56l10,25A1.49,1.49,0,0,0,96.5,40h2a1.49,1.49,0,0,0,1.39-.94l10-25a1.55,1.55,0,0,0,.11-.56A1.5,1.5,0,0,0,108.5,12Z"/>
                </g>
                <g id="sygnet">
                  <path className="cls-2" d="M20.9,1.4A3,3,0,0,0,18.37,0H3A3,3,0,0,0,.46,4.6l3.15,5L24.06,6.4Z"/>
                  <path className="cls-3" d="M24.06,6.4A3,3,0,0,0,21.52,5H6.15A3,3,0,0,0,3.61,9.6L8,16.6l20.44-3.2Z"/>
                  <path className="cls-1" d="M8,16.6A2.91,2.91,0,0,1,7.57,15a3,3,0,0,1,3-3H25.93a3,3,0,0,1,2.54,1.4L42.22,35.21a3,3,0,0,1,0,3.2L34.54,50.6a3,3,0,0,1-5.08,0Z"/>
                  <path className="cls-1" d="M46.78,23.13a3,3,0,0,0,5.07,0l2.65-4.19,5-8a3,3,0,0,0,0-3.21l-4-6.34A3,3,0,0,0,53,0H37.63a3,3,0,0,0-2.54,4.6Z"/>
                </g>
              </svg>
            </div>
            
            {/* Groq */}
            <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <svg className="h-12 w-auto text-foreground" fill="currentColor" fillRule="evenodd" viewBox="0 0 64 24" xmlns="http://www.w3.org/2000/svg">
                <title>Groq</title>
                <path d="M37.925 2.039c4.142 0 7.509 3.368 7.509 7.528l-.004.244c-.128 4.047-3.437 7.284-7.505 7.284-4.15 0-7.509-3.368-7.509-7.528s3.36-7.528 7.509-7.528zm-11.144-.023c.26 0 .522.015.775.046l.015-.008a7.464 7.464 0 012.922.969L29.09 5.468a4.619 4.619 0 00-2.309-.6h-.253l-.253.016c-.338.03-.66.092-.982.177-.621.169-1.196.469-1.703.869a4.062 4.062 0 00-1.418 2.322l-.04.234-.03.235c-.007.077-.023.161-.023.238l-.014 2.713v2.593l-.016 2.522h-2.815l-.03-4.973V8.852c0-.139.015-.262.022-.392.023-.262.062-.523.115-.777.1-.523.269-1.03.491-1.515a6.998 6.998 0 011.948-2.484 7.465 7.465 0 012.754-1.391c.49-.131.99-.216 1.495-.254.123-.008.253-.023.376-.023h.376zM37.925 4.86a4.7 4.7 0 00-4.694 4.706 4.7 4.7 0 004.694 4.706 4.7 4.7 0 004.694-4.706l-.005-.216a4.7 4.7 0 00-4.689-4.49zM9.578 2C5.428 1.96 2.038 5.298 2 9.458c-.038 4.16 3.29 7.559 7.44 7.597h2.608v-2.822h-2.47c-2.592.031-4.717-2.053-4.748-4.652a4.7 4.7 0 014.64-4.76h.108c2.52 0 4.577 1.992 4.696 4.49l.005.216v6.936c0 2.576-2.093 4.676-4.655 4.706a4.663 4.663 0 01-3.267-1.376l-1.994 2A7.46 7.46 0 009.57 24h.1c4.096-.062 7.386-3.391 7.409-7.497V9.35c-.1-4.09-3.428-7.35-7.501-7.35zm44.929.038c-4.15 0-7.509 3.368-7.509 7.528s3.36 7.528 7.509 7.528h2.57v-2.822h-2.57a4.7 4.7 0 01-4.694-4.706 4.7 4.7 0 014.694-4.706A4.707 4.707 0 0159.16 8.94l.024.22v14.456H62V9.566c-.008-4.152-3.352-7.527-7.493-7.527z"></path>
              </svg>
            </div>
          </div>
        </div>
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
      <footer className="section-sm">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gradient">E-CLARIA-AI</span>
            </div>
            <div className="text-small text-secondary">
              © 2025 E-CLARIA-AI. Revolutionizing non-profit impact through AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}