'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  optInToMentorship,
  getMentors,
  sendMessage,
  getMessages,
  getSuggestedReply
} from '@/actions/mentorship';
import { 
  Users, 
  MessageCircle, 
  Send, 
  Sparkles,
  Loader2,
  Star,
  Clock,
  User,
  Heart,
  Award,
  CheckCircle,
  Plus,
  ArrowRight,
  Zap,
  Brain
} from 'lucide-react';

interface MentorProfile {
  id: number;
  user_id: number;
  expertise_areas: string;
  experience_years: number;
  bio: string;
  availability: string;
  user_name?: string;
  rating?: number;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  sender_name?: string;
  receiver_name?: string;
}

export default function MentorshipPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showOptInDialog, setShowOptInDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [suggestedReply, setSuggestedReply] = useState('');
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [optingIn, setOptingIn] = useState(false);
  
  // Opt-in form state
  const [optInForm, setOptInForm] = useState({
    expertise_areas: '',
    experience_years: 0,
    bio: '',
    availability: ''
  });

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      setLoading(true);
      const data = await getMentors();
      setMentors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading mentors:', error);
      toast({
        title: "Failed to load mentors",
        description: "Could not retrieve available mentors.",
        variant: "destructive",
      });
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to become a mentor.",
        variant: "destructive",
      });
      return;
    }

    try {
      setOptingIn(true);
      const mentorData = {
        user_id: user.id,
        ...optInForm
      };
      
      await optInToMentorship(mentorData);
      
      setShowOptInDialog(false);
      setOptInForm({
        expertise_areas: '',
        experience_years: 0,
        bio: '',
        availability: ''
      });
      
      // Refresh mentors list
      await loadMentors();
      
      toast({
        title: "Welcome to mentorship!",
        description: "You've successfully joined as a mentor.",
      });
    } catch (error) {
      console.error('Error opting in to mentorship:', error);
      toast({
        title: "Failed to join mentorship",
        description: "Could not complete your mentor registration.",
        variant: "destructive",
      });
    } finally {
      setOptingIn(false);
    }
  };

  const handleSelectMentor = async (mentor: MentorProfile) => {
    setSelectedMentor(mentor);
    setMessages([]);
    
    try {
      const data = await getMessages(mentor.user_id.toString());
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Failed to load messages",
        description: "Could not retrieve conversation history.",
        variant: "destructive",
      });
    }
    
    setShowMessageDialog(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMentor || !newMessage.trim() || !user) {
      return;
    }

    try {
      setSendingMessage(true);
      
      const messageData = {
        sender_id: user.id,
        receiver_id: selectedMentor.user_id,
        content: newMessage.trim()
      };
      
      await sendMessage(messageData);
      
      // Refresh messages
      const updatedMessages = await getMessages(selectedMentor.user_id.toString());
      setMessages(Array.isArray(updatedMessages) ? updatedMessages : []);
      
      setNewMessage('');
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Could not send your message.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleGetSuggestion = async () => {
    if (!messages.length) {
      toast({
        title: "No messages to reply to",
        description: "Start a conversation first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingSuggestion(true);
      const lastMessage = messages[messages.length - 1];
      const data = await getSuggestedReply(lastMessage.id.toString());
      
      if (data && typeof data.suggested_reply === 'string') {
        setSuggestedReply(data.suggested_reply);
      } else {
        setSuggestedReply('');
        toast({
          title: "Could not generate suggestion",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error getting suggestion:', error);
      setSuggestedReply('');
      toast({
        title: "Failed to get suggestion",
        description: "Could not generate a suggested reply.",
        variant: "destructive",
      });
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleUseSuggestion = () => {
    if (suggestedReply) {
      setNewMessage(suggestedReply);
      setSuggestedReply('');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-heading">Expert Mentorship</h1>
                <p className="text-body text-secondary">
                  Connect with experienced non-profit leaders and grow your impact
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-small">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-secondary">AI-Matched</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-accent" />
                <span className="text-secondary">Community-Driven</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-success" />
                <span className="text-secondary">Real-Time Support</span>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Actions Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="floating-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Plus className="h-5 w-5 text-primary" />
                <h2 className="text-subheading">Get Started</h2>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={() => setShowOptInDialog(true)}
                  className="btn btn-primary w-full"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Become a Mentor
                </Button>
                
                <div className="text-center">
                  <div className="text-small text-secondary mb-2">or</div>
                  <p className="text-small text-secondary">
                    Browse available mentors below to start learning
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="floating-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Star className="h-5 w-5 text-accent" />
                <h3 className="text-subheading">Community Stats</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-small text-secondary">Active Mentors</span>
                  <span className="text-small font-medium">{mentors.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-small text-secondary">Success Stories</span>
                  <span className="text-small font-medium">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-small text-secondary">Avg Response Time</span>
                  <span className="text-small font-medium">2 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mentors List */}
          <div className="lg:col-span-2">
            <div className="floating-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-subheading">Available Mentors</h2>
                <div className="flex items-center gap-2 text-small text-secondary">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>{mentors.length} mentors online</span>
                </div>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : mentors.length > 0 ? (
                <div className="grid gap-6">
                  {mentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      className="glass-card p-6 hover:bg-surface/50 transition-all duration-300 group cursor-pointer"
                      onClick={() => handleSelectMentor(mentor)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-subheading group-hover:text-gradient transition-all duration-300">
                                {mentor.user_name || `Mentor #${mentor.user_id}`}
                              </h3>
                              <p className="text-small text-secondary">
                                {mentor.experience_years} years experience
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-amber-500 fill-current" />
                              <span className="text-small font-medium">
                                {mentor.rating || '4.8'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-primary" />
                              <span className="text-small">
                                Expertise: {mentor.expertise_areas}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-success" />
                              <span className="text-small">
                                Available: {mentor.availability}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-small text-secondary line-clamp-2">
                            {mentor.bio}
                          </p>
                          
                          <div className="flex items-center text-primary text-small font-medium group-hover:gap-3 transition-all duration-300">
                            Connect with mentor
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="text-subheading mb-2">No mentors available</h3>
                  <p className="text-body text-secondary">
                    Be the first to join our mentorship community!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Opt-in Dialog */}
        <Dialog open={showOptInDialog} onOpenChange={setShowOptInDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Become a Mentor</DialogTitle>
              <DialogDescription>
                Share your expertise and help other non-profit leaders succeed.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleOptIn} className="space-y-6">
              <div>
                <Label htmlFor="expertise" className="text-small font-medium text-primary mb-2 block">
                  Expertise Areas
                </Label>
                <Input
                  id="expertise"
                  value={optInForm.expertise_areas}
                  onChange={(e) => setOptInForm({...optInForm, expertise_areas: e.target.value})}
                  placeholder="e.g., Fundraising, Volunteer Management, Grant Writing"
                  className="input"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="experience" className="text-small font-medium text-primary mb-2 block">
                  Years of Experience
                </Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={optInForm.experience_years}
                  onChange={(e) => setOptInForm({...optInForm, experience_years: parseInt(e.target.value) || 0})}
                  placeholder="5"
                  className="input"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="bio" className="text-small font-medium text-primary mb-2 block">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={optInForm.bio}
                  onChange={(e) => setOptInForm({...optInForm, bio: e.target.value})}
                  placeholder="Tell others about your background and how you can help..."
                  className="input min-h-[100px]"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="availability" className="text-small font-medium text-primary mb-2 block">
                  Availability
                </Label>
                <Input
                  id="availability"
                  value={optInForm.availability}
                  onChange={(e) => setOptInForm({...optInForm, availability: e.target.value})}
                  placeholder="e.g., Weekdays 9-5 EST, Weekends"
                  className="input"
                  required
                />
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowOptInDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={optingIn}
                  className="btn btn-primary"
                >
                  {optingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Become a Mentor
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Message Dialog */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>
                Chat with {selectedMentor?.user_name || `Mentor #${selectedMentor?.user_id}`}
              </DialogTitle>
              <DialogDescription>
                Get personalized guidance from an experienced mentor.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Messages */}
              <div className="max-h-[300px] overflow-y-auto space-y-4 p-4 bg-surface/30 rounded-lg">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-primary text-white'
                            : 'bg-surface border border-border'
                        }`}
                      >
                        <p className="text-small">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === user?.id ? 'text-white/70' : 'text-secondary'
                        }`}>
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-8 w-8 text-secondary/30 mx-auto mb-2" />
                    <p className="text-small text-secondary">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* AI Suggestion */}
              {suggestedReply && (
                <div className="glass-card p-4 border-accent/30 bg-accent/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <h4 className="text-small font-medium">AI-Suggested Reply</h4>
                    </div>
                    <Button
                      onClick={handleUseSuggestion}
                      className="btn btn-secondary"
                      size="sm"
                    >
                      Use This
                    </Button>
                  </div>
                  <p className="text-small">{suggestedReply}</p>
                </div>
              )}

              {/* Message Form */}
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="input flex-1"
                    rows={3}
                    required
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      onClick={handleGetSuggestion}
                      disabled={loadingSuggestion}
                      className="btn btn-secondary"
                      size="sm"
                    >
                      {loadingSuggestion ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      type="submit"
                      disabled={sendingMessage}
                      className="btn btn-primary"
                      size="sm"
                    >
                      {sendingMessage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}