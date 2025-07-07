'use client';

import { useState } from 'react';
import { generateOutreachContent } from '@/actions/outreach';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Sparkles, 
  Download, 
  Copy, 
  Loader2,
  Mail,
  MessageSquare,
  Share2,
  Users,
  Target,
  Zap,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OutreachPage() {
  const [goal, setGoal] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('professional');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const contentTypes = [
    {
      icon: Mail,
      title: "Email Campaign",
      description: "Compelling email content for donors and supporters",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: MessageSquare,
      title: "Social Media",
      description: "Engaging posts for social media platforms",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: Share2,
      title: "Press Release",
      description: "Professional announcements for media outlets",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Users,
      title: "Volunteer Recruitment",
      description: "Inspiring content to attract volunteers",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal and authoritative' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { value: 'urgent', label: 'Urgent', description: 'Compelling and action-oriented' },
    { value: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' }
  ];

  const handleGenerate = async () => {
    if (!goal.trim()) {
      toast({
        title: "Please enter your outreach goal",
        description: "Describe what you want to achieve with this content.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const outreachData = {
        goal,
        audience,
        tone
      };
      
      // Call the server action to generate content
      const result = await generateOutreachContent(outreachData);
      
      // Use the result from the server action
      setContent(result.content);
      
      toast({
        title: "Content generated successfully!",
        description: "Your AI-powered outreach content is ready to use.",
      });
    } catch (error) {
      toast({
        title: "Failed to generate content",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Outreach content has been copied successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-heading">Smart Outreach Creator</h1>
                <p className="text-body text-secondary">
                  Generate compelling, conversion-optimized content that resonates with your audience
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-small">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-secondary">AI-Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-accent" />
                <span className="text-secondary">Audience-Targeted</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-success" />
                <span className="text-secondary">Conversion-Focused</span>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="floating-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-subheading">Content Parameters</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="goal" className="text-small font-medium text-primary mb-3 block">
                    Campaign Goal
                  </Label>
                  <Textarea
                    id="goal"
                    placeholder="e.g., Create an email campaign to recruit corporate sponsors for our annual fundraising gala"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="input min-h-[100px] resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="audience" className="text-small font-medium text-primary mb-3 block">
                    Target Audience (Optional)
                  </Label>
                  <Input
                    id="audience"
                    placeholder="e.g., Corporate executives, previous donors, community leaders"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <Label className="text-small font-medium text-primary mb-3 block">
                    Content Tone
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {toneOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTone(option.value)}
                        className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                          tone === option.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50 hover:bg-surface/50'
                        }`}
                      >
                        <div className="font-medium text-small mb-1">{option.label}</div>
                        <div className="text-xs text-secondary">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      Generate Outreach Content
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Content Types */}
            <div className="floating-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Share2 className="h-5 w-5 text-accent" />
                <h3 className="text-subheading">Content Types</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {contentTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <div key={index} className="glass-card p-4 text-center group hover:bg-surface/50 transition-all duration-300">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color} p-2.5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-small font-medium mb-1 group-hover:text-gradient transition-all duration-300">
                        {type.title}
                      </h4>
                      <p className="text-xs text-secondary">{type.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="floating-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-subheading">Generated Content</h2>
              {content && (
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
            
            {content ? (
              <div className="glass-card p-6 max-h-[600px] overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-small leading-relaxed font-normal text-primary">
                    {content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-pink-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-subheading">Ready to Create</h3>
                  <p className="text-body text-secondary max-w-sm mx-auto">
                    Enter your campaign details and let our AI craft compelling outreach content that converts.
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