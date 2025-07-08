'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { 
  getQuestions, 
  getAnswers, 
  postQuestion, 
  postAnswer, 
  upvoteAnswer, 
  getSuggestedAnswer,
  getUserPoints,
  deleteAnswer
} from '../../../actions/community';
import { 
  MessageCircle, 
  Search, 
  Filter, 
  PlusCircle, 
  ThumbsUp, 
  Award, 
  Sparkles,
  Loader2,
  Send,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Tag,
  Clock,
  User,
  TrendingUp,
  Users,
  Brain,
  Zap,
  Star,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Heart
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Question {
  id: number;
  title: string;
  content: string;
  user_id: number;
  tags: string;
  created_at?: string;
  user_name?: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

interface Answer {
  id: number;
  content: string;
  user_id: number;
  question_id: number;
  upvotes: number;
  created_at?: string;
  user_name?: string;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [suggestedAnswer, setSuggestedAnswer] = useState('');
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10
  });
  
  // Confirmation dialog states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [answerToDelete, setAnswerToDelete] = useState<number | null>(null);
  
  // Modal states
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  
  // This function was moved to line ~550
  
  // Form states
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [newAnswer, setNewAnswer] = useState('');
  
  // Loading states
  const [postingQuestion, setPostingQuestion] = useState(false);
  const [postingAnswer, setPostingAnswer] = useState(false);
  const [upvoting, setUpvoting] = useState<number | null>(null);

  useEffect(() => {
    loadQuestions();
    // if (user) {
    //   loadUserPoints();
    // }
    
    // Check for mobile view
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const loadQuestions = async (search?: string, filterParam?: string, page: number = 1) => {
    try {
      setLoading(true);
      
      // Clear selected question when performing a new search
      if ((search || filterParam) && page === 1) {
        setSelectedQuestion(null);
        setAnswers([]);
      }
      
      const params: { search?: string, filter?: string, page?: number, pageSize?: number } = {
        page,
        pageSize: pagination.pageSize
      };
      
      // Only add search/filter params if they have content
      if (search && search.trim()) params.search = search.trim();
      if (filterParam && filterParam.trim()) params.filter = filterParam.trim();
      
      const response = await getQuestions(params);
      
      // Safely extract data and totalCount from response
      const data = Array.isArray(response) ? response : response?.data || [];
      const totalCount = response?.totalCount || data.length || 0;
      
      setQuestions(data);
      
      // Update pagination with safe fallbacks
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: Math.max(1, Math.ceil(totalCount / prev.pageSize))
      }));
      

      // Show search/filter result message
      if ((search || filterParam) && page === 1) {
        const searchMsg = search ? `"${search}"` : '';
        const filterMsg = filterParam ? `tag "${filterParam}"` : '';
        const connector = search && filterParam ? ' and ' : '';
        
        toast({
          title: `Search Results`,
          description: `Found ${totalCount} question${totalCount !== 1 ? 's' : ''} matching ${searchMsg}${connector}${filterMsg}`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: "Failed to load questions",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message)
          : "Could not retrieve community questions.",
        variant: "destructive",
      });
      
      // Reset questions to empty array on error
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPoints = async () => {
    if (!user?.id) {
      setUserPoints(0);
      return;
    }
    
    try {
      const data = await getUserPoints(user.id.toString());
      
      // Check if data has points property and it's a number
      if (data && typeof data.points === 'number') {
        setUserPoints(data.points);
      } else {
        console.warn('Invalid user points data format:', data);
        setUserPoints(0);
      }
    } catch (error) {
      console.error('Failed to load user points:', error);
      // Don't show a toast for this as it's not critical to the user experience
      // Just silently set points to 0
      setUserPoints(0);
    }
  };

  const handleSearch = () => {
    // Reset to first page when searching
    loadQuestions(searchQuery, filter, 1);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setFilter('');
    loadQuestions('', '', 1);
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) {
      return; // Prevent invalid page navigation
    }
    loadQuestions(searchQuery, filter, newPage);
  };
  
  // Helper function to generate pagination range
  const getPaginationRange = () => {
    const range = [];
    const maxButtons = 5; // Maximum number of page buttons to show
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    
    return range;
  };

  const handleSelectQuestion = async (question: Question) => {
    setSelectedQuestion(question);
    setSuggestedAnswer('');
    setAnswers([]); // Clear previous answers while loading
  
    try {
      const data = await getAnswers(question.id.toString());
      // Ensure data is an array before setting
      setAnswers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading answers:', error);
      setAnswers([]); // Ensure answers is always an array
      toast({
        title: "Failed to load answers",
        description: "Could not retrieve answers for this question.",
        variant: "destructive",
      });
    }
  };

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your question.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is authenticated
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to post a question.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setPostingQuestion(true);
      
      const questionData = {
        title: newQuestion.title.trim(),
        content: newQuestion.content.trim(),
        tags: newQuestion.tags.trim(),
        user_id: user.id
      };
      
      const response = await postQuestion(questionData);
      
      // Check if posting was successful
      if (!response || response.error) {
        throw new Error(response?.error || 'Failed to post question');
      }
      
      // Reset form
      setNewQuestion({
        title: '',
        content: '',
        tags: ''
      });
      setShowNewQuestionModal(false);
      
      // Refresh questions list
      try {
        await loadQuestions();
      } catch (refreshError) {
        console.error('Error refreshing questions:', refreshError);
        // Don't block the success message if refresh fails
        toast({
          title: "Question posted but couldn't refresh",
          description: "Your question was posted but we couldn't refresh the list.",
          variant: "default",
        });
        setPostingQuestion(false);
        return;
      }
      
      toast({
        title: "Question posted",
        description: "Your question has been posted successfully.",
      });
    } catch (error) {
      console.error('Error posting question:', error);
      toast({
        title: "Failed to post question",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message)
          : "Could not post your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPostingQuestion(false);
    }
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedQuestion || !newAnswer.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide an answer.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to post an answer.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setPostingAnswer(true);
      
      const answerData = {
        content: newAnswer,
        question_id: selectedQuestion.id,
        user_id: user.id
      };
      
      await postAnswer(answerData);
      
      // Refresh answers
      try {
        const updatedAnswers = await getAnswers(selectedQuestion.id.toString());
        // Ensure data is an array before setting
        setAnswers(Array.isArray(updatedAnswers) ? updatedAnswers : []);
      } catch (refreshError) {
        console.error('Error refreshing answers:', refreshError);
        // Don't reset the form if we couldn't refresh - the answer might have been posted
        toast({
          title: "Answer posted but couldn't refresh",
          description: "Your answer was posted but we couldn't refresh the list.",
          variant: "default",
        });
        setPostingAnswer(false);
        return;
      }
      
      // Reset form
      setNewAnswer('');
      setShowAnswerForm(false);
      
      toast({
        title: "Answer posted",
        description: "Your answer has been posted successfully.",
      });
    } catch (error) {
      console.error('Error posting answer:', error);
      toast({
        title: "Failed to post answer",
        description: "Could not post your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPostingAnswer(false);
    }
  };

  const handleUpvote = async (answerId: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upvote answers.",
        variant: "destructive",
      });
      return;
    }
    
    // Prevent upvoting if already in progress
    if (upvoting !== null) {
      return;
    }
    
    try {
      setUpvoting(answerId);
      
      // Check if answerId is valid
      if (!answerId || isNaN(answerId)) {
        throw new Error('Invalid answer ID');
      }
      
      const response = await upvoteAnswer(answerId.toString());
      
      // Check if the upvote was successful
      if (!response || response.error) {
        throw new Error(response?.error || 'Failed to upvote');
      }
      
      // Update the answer in the local state
      setAnswers(prev => prev.map(answer => {
        if (answer.id === answerId) {
          return { ...answer, upvotes: answer.upvotes + 1 };
        }
        return answer;
      }));
      
      // Update user points
      if (user) {
        loadUserPoints();
      }
      
      toast({
        title: "Upvoted",
        description: "You've successfully upvoted this answer.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error upvoting answer:', error);
      toast({
        title: "Failed to upvote",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message)
          : "Could not upvote this answer.",
        variant: "destructive",
      });
    } finally {
      setUpvoting(null);
    }
  };

  const handleGetSuggestion = async () => {
    if (!selectedQuestion) {
      toast({
        title: "No question selected",
        description: "Please select a question first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoadingSuggestion(true);
      const data = await getSuggestedAnswer(selectedQuestion.id.toString());
      
      // Check if data and suggestion exist
      if (data && typeof data.suggested_answer === 'string') {
        setSuggestedAnswer(data.suggested_answer);
      } else {
        // Handle case where data structure is not as expected
        console.error('Unexpected suggestion data format:', data);
        setSuggestedAnswer('');
        toast({
          title: "Invalid suggestion format",
          description: "Received an invalid suggestion format from the server.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error getting suggestion:', error);
      setSuggestedAnswer('');
      toast({
        title: "Failed to get suggestion",
        description: "Could not generate a suggested answer.",
        variant: "destructive",
      });
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleUseSuggestion = () => {
    if (suggestedAnswer) {
      setNewAnswer(suggestedAnswer);
      setShowAnswerForm(true);
    }
  };

  const confirmDeleteAnswer = (answerId: number) => {
    setAnswerToDelete(answerId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteAnswer = async () => {
    if (!answerToDelete) {
      setShowDeleteConfirm(false);
      return;
    }
    
    // Check if user is authenticated
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to delete answers.",
        variant: "destructive",
      });
      setShowDeleteConfirm(false);
      setAnswerToDelete(null);
      return;
    }
    
    // Check if the answer belongs to the current user
    const answerToDeleteObj = answers.find(answer => answer.id === answerToDelete);
    if (!answerToDeleteObj || answerToDeleteObj.user_id !== user.id) {
      toast({
        title: "Permission denied",
        description: "You can only delete your own answers.",
        variant: "destructive",
      });
      setShowDeleteConfirm(false);
      setAnswerToDelete(null);
      return;
    }
    
    try {
      const response = await deleteAnswer(answerToDelete);
      
      // Check if deletion was successful
      if (!response || response.error) {
        throw new Error(response?.error || 'Failed to delete answer');
      }
      
      // Remove the deleted answer from the state
      setAnswers(prev => prev.filter(answer => answer.id !== answerToDelete));
      
      toast({
        title: "Answer deleted",
        description: "Your answer has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting answer:', error);
      toast({
        title: "Failed to delete answer",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message)
          : "Could not delete your answer.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteConfirm(false);
      setAnswerToDelete(null);
    }
  };

  // Delete Confirmation Dialog
  const DeleteConfirmationDialog = (
    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Answer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this answer? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowDeleteConfirm(false);
              setAnswerToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAnswer}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Community Q&A</h1>
                <p className="text-sm text-secondary">
                  Connect, learn, and share knowledge with other non-profit leaders
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-secondary">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <span className="text-secondary">Community-Driven</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-success" />
                <span className="text-secondary">Real-Time Help</span>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl" />
        </div>

        <div className={`grid ${isMobileView ? '' : 'lg:grid-cols-3'} gap-8`}>
          {/* Questions List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="floating-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Community Stats</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 glass-card">
                  <div className="text-lg font-bold text-primary">{questions.length}</div>
                  <div className="text-xs text-secondary">Questions</div>
                </div>
                <div className="text-center p-3 glass-card">
                  <div className="text-lg font-bold text-success">
                    {answers.reduce((sum, answer) => sum + answer.upvotes, 0)}
                  </div>
                  <div className="text-xs text-secondary">Total Votes</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-accent" />
                  <span className="text-xs font-medium text-accent">Featured</span>
                </div>
                <p className="text-xs text-secondary">
                  Get AI-powered suggestions for your answers and earn community points!
                </p>
              </div>
            </div>

            <div className="floating-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-medium">Questions</h2>
                </div>
                <Button
                  onClick={() => setShowNewQuestionModal(true)}
                  className="btn btn-primary"
                  size="sm"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ask
                </Button>
              </div>
              
              {/* Search and Filter */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input w-full pr-8"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          if (!filter) loadQuestions('', '', pagination.currentPage);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                        type="button"
                        aria-label="Clear search"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    )}
                  </div>
                  <Button onClick={handleSearch} className="btn btn-secondary">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Filter by tag (e.g., fundraising)"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="input w-full pr-8"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {filter && (
                      <button 
                        onClick={() => {
                          setFilter('');
                          if (!searchQuery) loadQuestions('', '', pagination.currentPage);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                        type="button"
                        aria-label="Clear filter"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    )}
                  </div>
                  <Button onClick={handleSearch} className="btn btn-secondary">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                
                {(searchQuery || filter) && (
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <div className="bg-secondary/20 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                          <Search className="h-3 w-3" />
                          <span>{searchQuery}</span>
                        </div>
                      )}
                      {filter && (
                        <div className="bg-secondary/20 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                          <Filter className="h-3 w-3" />
                          <span>{filter}</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={clearSearch} 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-7"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Questions List */}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : questions.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {questions.map((question) => (
                      <div
                        key={question.id}
                        onClick={() => handleSelectQuestion(question)}
                        className={`glass-card p-4 cursor-pointer transition-all duration-300 hover:bg-surface/50 hover:border-primary/30 group ${
                          selectedQuestion?.id === question.id ? 'border-primary bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm font-medium group-hover:text-gradient transition-all duration-300 flex-1">
                            {question.title}
                          </h3>
                          <ArrowRight className="h-4 w-4 text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
                        </div>
                        <p className="text-xs text-secondary line-clamp-2 mb-3">{question.content}</p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Tag className="h-3 w-3 text-secondary" />
                            <span className="text-secondary">
                              {question.tags ? question.tags.split(',').slice(0, 2).join(', ') : 'No tags'}
                              {question.tags && question.tags.split(',').length > 2 && '...'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-secondary" />
                            <span className="text-secondary">User #{question.user_id}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.currentPage === 1}
                        size="sm"
                        variant="outline"
                        className="hidden sm:flex"
                        title="First Page"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        size="sm"
                        variant="outline"
                        title="Previous Page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {/* Page numbers */}
                      <div className="flex gap-1">
                        {getPaginationRange().map(page => (
                          <Button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            size="sm"
                            variant={pagination.currentPage === page ? "default" : "outline"}
                            className={`${pagination.currentPage === page ? 'bg-primary text-primary-foreground' : ''}`}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        size="sm"
                        variant="outline"
                        title="Next Page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        size="sm"
                        variant="outline"
                        className="hidden sm:flex"
                        title="Last Page"
                      >
                        <ChevronRight className="h-4 w-4 mr-1" />
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      <span className="px-2 py-1 text-xs text-secondary">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-subheading mb-2">No questions yet</h3>
                  <p className="text-sm text-secondary mb-4">Be the first to start a conversation!</p>
                  <Button
                    onClick={() => setShowNewQuestionModal(true)}
                    className="btn btn-primary"
                    size="sm"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Ask First Question
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Selected Question and Answers */}
          <div className={`${isMobileView && selectedQuestion ? 'mt-8' : ''} lg:col-span-2 space-y-6`}>
            {selectedQuestion ? (
              <>
                {/* Selected Question */}
                <div className="floating-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="text-xs font-medium text-success">Selected Question</span>
                  </div>
                  <h2 className="text-lg font-medium mb-4">{selectedQuestion.title}</h2>
                  <p className="text-sm mb-6">{selectedQuestion.content}</p>
                  
                  <div className="flex items-center justify-between text-xs bg-surface/30 p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-secondary" />
                        <span className="text-secondary">{selectedQuestion.tags || 'No tags'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-secondary" />
                        <span className="text-secondary">User #{selectedQuestion.user_id}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">
                        {selectedQuestion.created_at 
                          ? new Date(selectedQuestion.created_at).toLocaleDateString()
                          : 'Recently'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Answers */}
                <div className="floating-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-accent" />
                      <h3 className="text-lg font-medium">
                        Answers <span className="text-xs text-secondary">({answers.length})</span>
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleGetSuggestion}
                        disabled={loadingSuggestion}
                        className="btn btn-secondary"
                        size="sm"
                      >
                        {loadingSuggestion ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        AI Suggestion
                      </Button>
                      <Button
                        onClick={() => setShowAnswerForm(!showAnswerForm)}
                        className="btn btn-primary"
                        size="sm"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Answer
                      </Button>
                    </div>
                  </div>
                  
                  {/* AI Suggestion */}
                  {suggestedAnswer && (
                    <div className="glass-card p-4 mb-6 border-accent/30 bg-accent/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-accent" />
                          <h4 className="text-xs font-medium">AI-Suggested Answer</h4>
                        </div>
                        <Button
                          onClick={handleUseSuggestion}
                          className="btn btn-secondary"
                          size="sm"
                        >
                          Use This
                        </Button>
                      </div>
                      <p className="text-xs">{suggestedAnswer}</p>
                    </div>
                  )}
                  
                  {/* Answer Form */}
                  {showAnswerForm && (
                    <div className="glass-card p-6 mb-6 border border-primary/20 bg-primary/5">
                      <h4 className="text-xs font-medium mb-4">Your Answer</h4>
                      <form onSubmit={handlePostAnswer} className="space-y-4">
                        <Textarea
                          value={newAnswer}
                          onChange={(e) => setNewAnswer(e.target.value)}
                          placeholder="Share your knowledge and experience..."
                          className="input min-h-[150px]"
                          required
                        />
                        
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            onClick={() => setShowAnswerForm(false)}
                            className="btn btn-secondary"
                            size="sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={postingAnswer}
                            className="btn btn-primary"
                            size="sm"
                          >
                            {postingAnswer ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Posting...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Post Answer
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  {/* Answers List */}
                  {answers.length > 0 ? (
                    <div className="space-y-6">
                      {answers.map((answer) => (
                        <div key={answer.id} className="glass-card p-6 hover:bg-surface/30 transition-all duration-300 group">
                          <p className="text-sm mb-4">{answer.content}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-secondary" />
                              <span className="text-xs text-secondary">
                                User #{answer.user_id}
                              </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-secondary" />
                                <span className="text-xs text-secondary">
                                  {answer.created_at 
                                    ? new Date(answer.created_at).toLocaleDateString()
                                    : 'Recently'
                                  }
                                </span>
                              </div>
                                {answer.user_id === user?.id && (
                                  <button 
                                    onClick={() => confirmDeleteAnswer(answer.id)}
                                    className="ml-2 p-1 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-1 text-xs"
                                    title="Delete your answer"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3 6h18"></path>
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    </svg>
                                    <span>Delete</span>
                                  </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleUpvote(answer.id)}
                                disabled={upvoting === answer.id}
                                className="btn btn-ghost group-hover:bg-success/10 group-hover:text-success transition-all duration-300"
                                size="sm"
                              >
                                {upvoting === answer.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                    <span className="font-medium">{answer.upvotes}</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No answers yet</h3>
                      <p className="text-sm text-secondary mb-4">Be the first to help with this question!</p>
                      <Button
                        onClick={() => setShowAnswerForm(true)}
                        className="btn btn-primary"
                        size="sm"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Write First Answer
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="floating-card p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Select a Question</h3>
                  <p className="text-sm text-secondary max-w-sm mx-auto">
                    Choose a question from the list to view details and answers
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Render the delete confirmation dialog */}
      {DeleteConfirmationDialog}
      
      {/* New Question Modal */}
      <Dialog open={showNewQuestionModal} onOpenChange={setShowNewQuestionModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ask a New Question</DialogTitle>
            <DialogDescription>
              Share your question with the community and get expert answers.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePostQuestion} className="space-y-6">
            <div>
              <Label htmlFor="modal-title" className="text-xs font-medium text-primary mb-2 block">
                Question Title
              </Label>
              <Input
                id="modal-title"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                placeholder="What's your question?"
                className="input"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="modal-content" className="text-xs font-medium text-primary mb-2 block">
                Question Details
              </Label>
              <Textarea
                id="modal-content"
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                placeholder="Provide more details about your question..."
                className="input min-h-[120px]"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="modal-tags" className="text-xs font-medium text-primary mb-2 block">
                Tags (comma-separated)
              </Label>
              <Input
                id="modal-tags"
                value={newQuestion.tags}
                onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
                placeholder="e.g., fundraising, volunteers, strategy"
                className="input"
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewQuestionModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={postingQuestion}
                className="btn btn-primary"
              >
                {postingQuestion ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Post Question
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}