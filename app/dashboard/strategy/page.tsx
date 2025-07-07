'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function StrategyPage() {
  const [query, setQuery] = useState('');
  const [strategy, setStrategy] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

    setLoading(true);
    try {
      // Simulate API call with more realistic delay
      setTimeout(() => {
        setStrategy(`# 🎯 AI-Generated Strategic Plan: ${query}

## 📊 Executive Summary
Based on your query about "${query}", our AI has analyzed thousands of successful non-profit strategies to create this comprehensive, actionable plan tailored to your organization's unique needs.

## 🔍 1. Situational Analysis
### Current Landscape Assessment
- **Market Position**: Evaluate your organization's standing within the sector
- **Stakeholder Ecosystem**: Map key relationships and influence networks
- **Resource Audit**: Comprehensive review of financial, human, and technological assets
- **Competitive Intelligence**: Analysis of similar organizations and their methodologies

### SWOT Framework
- **Strengths**: Core competencies and unique value propositions
- **Weaknesses**: Areas requiring immediate attention and improvement
- **Opportunities**: Emerging trends and untapped potential
- **Threats**: External challenges and risk factors

## 🎯 2. Strategic Objectives Framework
### Primary Mission-Critical Goals
- **Quantifiable Outcomes**: Specific, measurable targets aligned with your mission
- **Impact Metrics**: Key Performance Indicators (KPIs) for success measurement
- **Timeline Milestones**: Realistic deadlines with built-in flexibility
- **Resource Allocation**: Strategic distribution of budget, personnel, and technology

### Secondary Supporting Objectives
- **Capacity Building**: Organizational development and skill enhancement
- **Partnership Development**: Strategic alliances and collaboration opportunities
- **Brand Positioning**: Reputation management and thought leadership
- **Innovation Integration**: Technology adoption and process optimization

## 🚀 3. Implementation Roadmap
### Phase 1: Foundation (Months 1-3)
- **Infrastructure Setup**: Systems, processes, and team alignment
- **Stakeholder Engagement**: Buy-in from board, staff, and key supporters
- **Baseline Establishment**: Current performance metrics and benchmarks
- **Quick Wins**: Early victories to build momentum and confidence

### Phase 2: Acceleration (Months 4-8)
- **Core Strategy Execution**: Primary initiative implementation
- **Partnership Activation**: Collaborative relationships and joint ventures
- **Performance Monitoring**: Regular assessment and course correction
- **Scaling Preparation**: Systems and processes for growth

### Phase 3: Optimization (Months 9-12)
- **Impact Amplification**: Scaling successful initiatives
- **Continuous Improvement**: Data-driven refinements and enhancements
- **Sustainability Planning**: Long-term viability and growth strategies
- **Knowledge Transfer**: Documentation and best practice sharing

## ⚠️ 4. Risk Management & Mitigation
### Identified Risk Categories
- **Financial Risks**: Funding shortfalls, economic downturns, donor fatigue
- **Operational Risks**: Staff turnover, technology failures, process breakdowns
- **External Risks**: Regulatory changes, competitive pressures, market shifts
- **Reputational Risks**: Public relations challenges, stakeholder conflicts

### Mitigation Strategies
- **Diversification**: Multiple revenue streams and partnership networks
- **Contingency Planning**: Alternative approaches for critical scenarios
- **Early Warning Systems**: Monitoring indicators and response protocols
- **Crisis Communication**: Prepared messaging and stakeholder management

## 📈 5. Performance Measurement & Optimization
### Monitoring Framework
- **Real-time Dashboards**: Live performance tracking and visualization
- **Regular Reviews**: Monthly operational and quarterly strategic assessments
- **Stakeholder Feedback**: Systematic input collection and analysis
- **External Benchmarking**: Industry comparison and best practice adoption

### Continuous Improvement Process
- **Data-Driven Decisions**: Analytics-based strategy refinement
- **Agile Methodology**: Rapid testing, learning, and adaptation
- **Innovation Culture**: Encouraging experimentation and creative solutions
- **Knowledge Management**: Capturing and sharing organizational learning

## 🎯 Next Steps for Implementation
1. **Strategy Validation**: Review with key stakeholders and subject matter experts
2. **Resource Planning**: Detailed budget and personnel allocation
3. **Timeline Refinement**: Adjust milestones based on organizational capacity
4. **Communication Strategy**: Internal and external messaging about the new direction
5. **Pilot Program**: Small-scale testing of key initiatives before full implementation

## 💡 AI-Powered Recommendations
- **Technology Integration**: Leverage automation for efficiency gains
- **Data Analytics**: Implement robust measurement and reporting systems
- **Partnership Opportunities**: Strategic alliances for resource sharing
- **Innovation Adoption**: Stay ahead of sector trends and best practices

---

*This strategy framework has been generated using advanced AI analysis of successful non-profit strategies and can be customized further based on your specific organizational context and constraints.*`);
        setLoading(false);
        toast({
          title: "Strategy generated successfully!",
          description: "Your AI-powered strategy is ready for implementation.",
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Failed to generate strategy",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(strategy);
    toast({
      title: "Copied to clipboard",
      description: "Strategy content has been copied successfully.",
    });
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
              <div className="glass-card p-6 max-h-[600px] overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-small leading-relaxed font-normal text-primary">
                    {strategy}
                  </pre>
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