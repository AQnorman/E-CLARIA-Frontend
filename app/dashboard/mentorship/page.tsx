'use client';

import { useState, useEffect, useRef } from 'react';
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
  expertise: string;
  bio: string;
  is_available: boolean;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  timestamp: string;
  message: string;
}

export default function MentorshipPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showOptInDialog, setShowOptInDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [suggestedReply, setSuggestedReply] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [optingIn, setOptingIn] = useState(false);
  
  // Opt-in form state
  const [optInForm, setOptInForm] = useState({
    expertise: '',
    bio: '',
  });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to load mentors on component mount
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
      // Format the mentor data according to what the API expects
      // The API requires exactly: user_id, bio, and expertise fields
      const mentorData = {
        user_id: user.id,
        bio: optInForm.bio,
        expertise: optInForm.expertise // API expects 'expertise', not 'expertise_areas'
      };
      
      console.log('Sending mentor data:', mentorData);
      
      const response = await optInToMentorship(mentorData);
      console.log('Opt-in response:', response);
      
      setShowOptInDialog(false);
      setOptInForm({
        expertise: '',
        bio: '',
      });
      
      // Refresh user data to update is_mentor status
      await refreshUser();
      
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
        description: "Please check the console for details.",
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
      // Sort messages by timestamp in ascending order (earliest first)
      const sortedMessages = Array.isArray(data) ? 
        [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : 
        [];
      setMessages(sortedMessages);
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
    
    if (!user || !selectedMentor || !newMessage.trim()) {
      return;
    }
    
    const tempMessage = {
      id: Date.now(), // Temporary ID
      sender_id: user.id,
      receiver_id: selectedMentor.user_id,
      timestamp: new Date().toISOString(),
      message: newMessage.trim()
    };

    console.log(tempMessage)
    
    // Optimistically update UI
    setMessages([...messages, tempMessage]);
    setNewMessage('');
    setSuggestedReply('');
    
    try {
      setSendingMessage(true);
      // Get the response from sendMessage which contains the newly created message
      // Ensure all IDs are integers as expected by the API
      const messageData = {
        sender_id: parseInt(String(user.id)),
        receiver_id: parseInt(String(selectedMentor.user_id)),
        message: tempMessage.message
      };
      
      const response = await sendMessage(messageData);
      
      if (response && response.message) {
        // Replace the temporary message with the server response
        const updatedMessages = messages.filter(msg => msg.id !== tempMessage.id);
        // Add the new message from the response
        const newMessages = [...updatedMessages, response];
        // Sort messages by timestamp in ascending order (earliest first)
        const sortedMessages = newMessages.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sortedMessages);
      } else {
        // If we don't get a proper response, fall back to fetching all messages
        const data = await getMessages(selectedMentor.user_id.toString());
        const sortedMessages = Array.isArray(data) ? 
          [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : 
          [];
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Your message could not be delivered.",
        variant: "destructive",
      });
      
      // Remove the optimistic message
      setMessages(messages.filter(msg => msg.id !== tempMessage.id));
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
                {user?.is_mentor ? (
                  <div className="glass-card p-4 border-success/30 bg-success/5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <h3 className="text-subheading">Active Mentor</h3>
                    </div>
                    <p className="text-small text-secondary mb-3">
                      You are currently an active mentor in the community. Thank you for sharing your expertise!
                    </p>
                    <Button
                      onClick={() => toast({
                        title: "Mentor Dashboard",
                        description: "Your mentor statistics and pending requests will be available soon."
                      })}
                      className="btn btn-secondary w-full"
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Mentor Dashboard
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowOptInDialog(true)}
                    className="btn btn-primary w-full"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Become a Mentor
                  </Button>
                )}
                
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
                                {`Mentor #${mentor.user_id}`}
                              </h3>
                              <p className="text-small text-secondary">
                                {mentor.is_available ? 'Available' : 'Not available'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-primary" />
                              <span className="text-small">
                                Expertise: {mentor.expertise}
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
                  value={optInForm.expertise}
                  onChange={(e) => setOptInForm({...optInForm, expertise: e.target.value})}
                  placeholder="e.g., Fundraising, Volunteer Management, Grant Writing"
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
                Chat with {`Mentor #${selectedMentor?.user_id}`}
              </DialogTitle>
              <DialogDescription>
                Get personalized guidance from an experienced mentor.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Messages */}
              <div className="max-h-[300px] overflow-y-auto space-y-4 p-4 bg-surface/30 rounded-lg">
                {messages.length > 0 ? (
                  messages.map((message) => {
                    // Determine if this is the current user's message
                    const isCurrentUser = message.sender_id === user?.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            isCurrentUser
                              ? 'bg-primary text-white'
                              : 'bg-surface border border-border'
                          }`}
                        >
                          <p className="text-small">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            isCurrentUser ? 'text-white/70' : 'text-secondary'
                          }`}>
                            {message.timestamp ? new Date(message.timestamp).toLocaleString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            }) : 'Just now'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-8 w-8 text-secondary/30 mx-auto mb-2" />
                    <p className="text-small text-secondary">No messages yet. Start the conversation!</p>
                  </div>
                )}
                {/* This empty div is used as a reference for scrolling to the bottom */}
                <div ref={messagesEndRef} />
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