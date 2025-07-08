'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { 
  Target, 
  Sparkles, 
  Download, 
  Copy, 
  Loader2,
  Lightbulb,
  BookOpen,
  TrendingUp,
  Users,
  Heart,
  Zap,
  Brain,
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateStrategy } from '@/actions/strategy';
import { useAuth } from '@/contexts/AuthContext';

interface StrategyResponse {
  id: number;
  title: string;
  content: string;
  audio_url: string;
}

export default function StrategyPage() {
  const [query, setQuery] = useState('');
  const [strategy, setStrategy] = useState<StrategyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const exampleQueries = [
    {
      icon: TrendingUp,
      title: "Fundraising Revolution",
      query: "How can we leverage digital platforms to diversify our fundraising and reduce grant dependency?",
      color: "from-blue-500 to-purple-600",
      category: "Fundraising"
    },
    {
      icon: Users,
      title: "Volunteer Engagement",
      query: "What innovative strategies can boost volunteer retention and create deeper community connections?",
      color: "from-green-500 to-teal-500",
      category: "Community"
    },
    {
      icon: Heart,
      title: "Impact Amplification",
      query: "How can we expand our reach in underserved communities while maintaining program quality?",
      color: "from-pink-500 to-red-500",
      category: "Outreach"
    },
    {
      icon: BookOpen,
      title: "Digital Transformation",
      query: "What's the optimal roadmap for modernizing our operations and embracing digital-first approaches?",
      color: "from-yellow-500 to-orange-500",
      category: "Technology"
    }
  ];

  const handleGenerate = async () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a strategy query",
        description: "Describe what kind of strategy you need help with.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to generate a strategy.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateStrategy({
        profile_id: user.id,
        query: query.trim()
      });
      
      if (result && result.id !== undefined) {
        setStrategy(result as StrategyResponse);
        // Reset audio player state when new strategy is generated
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        
        toast({
          title: "Strategy generated successfully!",
          description: "Your AI-powered strategy is ready for implementation.",
        });
      } else {
        throw new Error('Invalid strategy response');
      }
    } catch (error) {
      toast({
        title: "Failed to generate strategy",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
      console.error('Strategy generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log(strategy)

  const copyToClipboard = () => {
    if (strategy) {
      navigator.clipboard.writeText(strategy.content);
      toast({
        title: "Copied to clipboard",
        description: "Strategy content has been copied successfully.",
      });
    }
  };
  
  const toggleAudio = () => {
    if (!strategy?.audio_url) return;
    
    if (!audioRef.current) {
      // Extract the audio filename from the URL
      const audioFilename = strategy.audio_url.split('/').pop();
      
      if (audioFilename) {
        // Use our API route to proxy the audio request
        const audioProxyUrl = `/api/audio/${audioFilename}`;
        console.log('Using audio proxy URL:', audioProxyUrl);
        
        audioRef.current = new Audio(audioProxyUrl);
        audioRef.current.addEventListener('ended', () => setIsPlaying(false));
      } else {
        console.error('Invalid audio URL format:', strategy.audio_url);
        toast({
          title: "Audio playback error",
          description: "Invalid audio format. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.error('Audio playback error:', error);
        toast({
          title: "Audio playback error",
          description: "There was an issue playing the audio. Please try again.",
          variant: "destructive",
        });
      });
      setIsPlaying(true);
    }
  };

  const useExampleQuery = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-heading">AI Strategy Generator</h1>
                <p className="text-body text-secondary">
                  Generate intelligent, data-driven strategic plans powered by advanced AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-small">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-secondary">AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-secondary">Instant Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-success" />
                <span className="text-secondary">Customized Solutions</span>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="floating-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-subheading">Strategy Query</h2>
              </div>
              <p className="text-body text-secondary mb-6">
                Describe your strategic challenge in detail. The more specific you are, the better our AI can tailor the solution.
              </p>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="query" className="text-small font-medium text-primary mb-3 block">
                    What strategic challenge do you need help with?
                  </Label>
                  <Textarea
                    id="query"
                    placeholder="e.g., How can we develop a comprehensive digital fundraising strategy that targets younger demographics while maintaining our current donor base?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="input min-h-[140px] resize-none"
                  />
                </div>
                
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating AI Strategy...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate AI Strategy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Example Queries */}
            <div className="floating-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="h-5 w-5 text-accent" />
                <h3 className="text-subheading">Strategy Inspirations</h3>
              </div>
              <p className="text-body text-secondary mb-6">
                Explore these AI-curated strategy examples to spark your thinking
              </p>
              <div className="space-y-4">
                {exampleQueries.map((example, index) => {
                  const Icon = example.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => useExampleQuery(example.query)}
                      className="w-full p-4 glass-card hover:bg-surface/50 transition-all duration-300 text-left group border border-border/50 hover:border-primary/30"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${example.color} p-2.5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-small font-medium group-hover:text-gradient transition-all duration-300">
                              {example.title}
                            </h4>
                            <span className="px-2 py-1 bg-surface rounded-full text-xs text-secondary">
                              {example.category}
                            </span>
                          </div>
                          <p className="text-small text-secondary group-hover:text-primary transition-colors duration-300">
                            {example.query}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="floating-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-subheading">Generated Strategy</h2>
              {strategy && (
                <div className="flex gap-3">
                  <Button
                    onClick={copyToClipboard}
                    className="btn btn-secondary"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    className="btn btn-secondary"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              )}
            </div>
            
            {strategy ? (
              <div className="space-y-6">
                {/* Strategy Title and Audio Controls */}
                <div className="flex items-center justify-between sticky top-0 bg-background z-10 pb-4">
                  <h3 className="text-xl font-semibold text-primary">{strategy.title}</h3>
                  
                  {/* Audio Player */}
                  {strategy.audio_url && (
                    <Button 
                      onClick={toggleAudio} 
                      variant="outline" 
                      className="flex items-center gap-2 hover:bg-primary/10"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-4 w-4" />
                          <span>Pause Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          <span>Play Audio</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                {/* Strategy Content */}
                <div className="glass-card p-6" style={{ maxHeight: 'calc(100vh - 0px)', overflowY: 'auto' }}>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown
                      components={{
                        h1: ({ className, ...props }) => (
                          <h1 className={cn("text-xl font-bold mt-6 mb-4 text-primary", className)} {...props} />
                        ),
                        h2: ({ className, ...props }) => (
                          <h2 className={cn("text-lg font-semibold mt-5 mb-3 text-primary", className)} {...props} />
                        ),
                        h3: ({ className, ...props }) => (
                          <h3 className={cn("text-md font-semibold mt-4 mb-2 text-primary", className)} {...props} />
                        ),
                        p: ({ className, ...props }) => (
                          <p className={cn("text-small leading-relaxed my-3 text-primary", className)} {...props} />
                        ),
                        ul: ({ className, ...props }) => (
                          <ul className={cn("list-disc pl-6 my-3", className)} {...props} />
                        ),
                        ol: ({ className, ...props }) => (
                          <ol className={cn("list-decimal pl-6 my-3", className)} {...props} />
                        ),
                        li: ({ className, ...props }) => (
                          <li className={cn("mt-1", className)} {...props} />
                        ),
                        blockquote: ({ className, ...props }) => (
                          <blockquote className={cn("border-l-4 border-accent pl-4 italic my-3", className)} {...props} />
                        ),
                        a: ({ className, ...props }) => (
                          <a className={cn("text-accent hover:underline", className)} {...props} />
                        ),
                        strong: ({ className, ...props }) => (
                          <strong className={cn("font-bold", className)} {...props} />
                        ),
                        code: ({ className, ...props }) => (
                          <code className={cn("bg-surface px-1 py-0.5 rounded text-xs", className)} {...props} />
                        ),
                        pre: ({ className, ...props }) => (
                          <pre className={cn("bg-surface p-3 rounded-md overflow-auto my-3", className)} {...props} />
                        ),
                      }}
                    >
                      {strategy.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-subheading">Ready to Generate</h3>
                  <p className="text-body text-secondary max-w-sm mx-auto">
                    Enter your strategy query above and let our AI create a comprehensive plan for your organization.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}