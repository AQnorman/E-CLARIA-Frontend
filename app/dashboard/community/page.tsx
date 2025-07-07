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
  User
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
    if (user) {
      loadUserPoints();
    }
    
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
      const params: { search?: string, filter?: string, page?: number, pageSize?: number } = {
        page,
        pageSize: pagination.pageSize
      };
      if (search) params.search = search;
      if (filterParam) params.filter = filterParam;
      
      const response = await getQuestions(params);
      
      // Assuming the API returns { data: Question[], totalCount: number }
      // If your API response is different, adjust accordingly
      const { data, totalCount } = response;
      setQuestions(data || []);
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: Math.ceil((totalCount || data.length) / prev.pageSize)
      }));
    } catch (error) {
      toast({
        title: "Failed to load questions",
        description: "Could not retrieve community questions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserPoints = async () => {
    if (!user) return;
    
    try {
      const data = await getUserPoints(user.id.toString());
      setUserPoints(data.score);
    } catch (error) {
      console.error("Failed to load user points:", error);
    }
  };

  const handleSearch = () => {
    loadQuestions(searchQuery, filter, 1); // Reset to first page when searching
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    loadQuestions(searchQuery, filter, newPage);
  };

  const handleSelectQuestion = async (question: Question) => {
    setSelectedQuestion(question);
    setSuggestedAnswer('');
    
    try {
      const data = await getAnswers(question.id.toString());
      setAnswers(data);
    } catch (error) {
      toast({
        title: "Failed to load answers",
        description: "Could not retrieve answers for this question.",
        variant: "destructive",
      });
    }
  };

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to post a question.",
        variant: "destructive",
      });
      return;
    }

    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your question.",
        variant: "destructive",
      });
      return;
    }

    try {
      setPostingQuestion(true);
      const questionData = {
        user_id: user.id,
        title: newQuestion.title,
        content: newQuestion.content,
        tags: newQuestion.tags
      };
      
      const result = await postQuestion(questionData);
      
      toast({
        title: "Question posted",
        description: "Your question has been posted successfully.",
      });
      
      // Reset form and refresh questions
      setNewQuestion({ title: '', content: '', tags: '' });
      setShowNewQuestionForm(false);
      loadQuestions();
    } catch (error) {
      toast({
        title: "Failed to post question",
        description: "An error occurred while posting your question.",
        variant: "destructive",
      });
    } finally {
      setPostingQuestion(false);
    }
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedQuestion) {
      toast({
        title: "Error",
        description: "Please log in and select a question to answer.",
        variant: "destructive",
      });
      return;
    }

    if (!newAnswer.trim()) {
      toast({
        title: "Empty answer",
        description: "Please provide content for your answer.",
        variant: "destructive",
      });
      return;
    }

    try {
      setPostingAnswer(true);
      const answerData = {
        user_id: user.id,
        question_id: selectedQuestion.id,
        content: newAnswer
      };
      
      const result = await postAnswer(answerData);
      
      toast({
        title: "Answer posted",
        description: "Your answer has been posted successfully.",
      });
      
      // Reset form and refresh answers
      setNewAnswer('');
      setShowAnswerForm(false);
      
      // Refresh answers for the current question
      const updatedAnswers = await getAnswers(selectedQuestion.id.toString());
      setAnswers(updatedAnswers);
    } catch (error) {
      toast({
        title: "Failed to post answer",
        description: "An error occurred while posting your answer.",
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
        description: "Please log in to upvote answers.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpvoting(answerId);
      await upvoteAnswer(answerId.toString());
      
      // Update the answers list with the new upvote count
      const updatedAnswers = answers.map(answer => {
        if (answer.id === answerId) {
          return { ...answer, upvotes: answer.upvotes + 1 };
        }
        return answer;
      });
      
      setAnswers(updatedAnswers);
      
      // Refresh user points
      loadUserPoints();
    } catch (error) {
      toast({
        title: "Failed to upvote",
        description: "An error occurred while upvoting the answer.",
        variant: "destructive",
      });
    } finally {
      setUpvoting(null);
    }
  };

  const handleGetSuggestion = async () => {
    if (!selectedQuestion) return;
    
    try {
      setLoadingSuggestion(true);
      const result = await getSuggestedAnswer(selectedQuestion.id.toString());
      setSuggestedAnswer(result.suggested_answer);
    } catch (error) {
      toast({
        title: "Failed to get suggestion",
        description: "Could not retrieve AI-suggested answer.",
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
    if (!answerToDelete) return;
    
    try {
      await deleteAnswer(answerToDelete);
      
      // Remove the answer from the list
      setAnswers(answers.filter(a => a.id !== answerToDelete));
      
      toast({
        title: "Answer deleted",
        description: "Your answer has been removed.",
      });
    } catch (error) {
      toast({
        title: "Failed to delete answer",
        description: "Could not delete your answer.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteConfirm(false);
      setAnswerToDelete(null);
    }
  };

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
                <h1 className="text-heading">Community Q&A</h1>
                <p className="text-body text-secondary">
                  Connect, learn, and share knowledge with other non-profit leaders
                </p>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center gap-2 mt-2">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="text-small font-medium">Your Points: {userPoints}</span>
              </div>
            )}
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl" />
        </div>

        <div className={`grid ${isMobileView ? '' : 'lg:grid-cols-3'} gap-8`}>
          {/* Questions List */}
          <div className="lg:col-span-1 space-y-6">
            <div className="floating-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-subheading">Questions</h2>
                <Button
                  onClick={() => setShowNewQuestionForm(!showNewQuestionForm)}
                  className="btn btn-secondary"
                  size="sm"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ask
                </Button>
              </div>
              
              {/* Search and Filter */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input flex-1"
                  />
                  <Button onClick={handleSearch} className="btn btn-secondary">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Filter by tag (e.g., fundraising)"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="input flex-1"
                  />
                  <Button onClick={handleSearch} className="btn btn-secondary">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* New Question Form */}
              {showNewQuestionForm && (
                <div className="glass-card p-4 mb-6">
                  <h3 className="text-small font-medium mb-4">Ask a New Question</h3>
                  <form onSubmit={handlePostQuestion} className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-xs font-medium text-primary mb-1 block">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={newQuestion.title}
                        onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                        placeholder="What's your question?"
                        className="input"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content" className="text-xs font-medium text-primary mb-1 block">
                        Details
                      </Label>
                      <Textarea
                        id="content"
                        value={newQuestion.content}
                        onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                        placeholder="Provide more details about your question..."
                        className="input min-h-[100px]"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tags" className="text-xs font-medium text-primary mb-1 block">
                        Tags (comma-separated)
                      </Label>
                      <Input
                        id="tags"
                        value={newQuestion.tags}
                        onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
                        placeholder="e.g., fundraising, volunteers, strategy"
                        className="input"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        onClick={() => setShowNewQuestionForm(false)}
                        className="btn btn-secondary"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={postingQuestion}
                        className="btn btn-primary"
                        size="sm"
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
                    </div>
                  </form>
                </div>
              )}
              
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
                        className={`glass-card p-4 cursor-pointer transition-all duration-300 hover:bg-surface/50 ${
                          selectedQuestion?.id === question.id ? 'border-primary bg-primary/5' : ''
                        }`}
                      >
                        <h3 className="text-small font-medium mb-2">{question.title}</h3>
                        <p className="text-xs text-secondary line-clamp-2 mb-3">{question.content}</p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3 text-secondary" />
                            <span className="text-secondary">{question.tags || 'No tags'}</span>
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
                        className="btn btn-ghost h-8 w-8 p-0"
                        size="sm"
                      >
                        <span>«</span>
                      </Button>
                      <Button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="btn btn-ghost h-8 w-8 p-0"
                        size="sm"
                      >
                        <span>&lt;</span>
                      </Button>
                      
                      <span className="text-small text-secondary">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      
                      <Button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="btn btn-ghost h-8 w-8 p-0"
                        size="sm"
                      >
                        <span>&gt;</span>
                      </Button>
                      <Button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="btn btn-ghost h-8 w-8 p-0"
                        size="sm"
                      >
                        <span>»</span>
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-secondary">No questions found</p>
                  <p className="text-xs text-secondary mt-1">Be the first to ask a question!</p>
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
                  <h2 className="text-subheading mb-4">{selectedQuestion.title}</h2>
                  <p className="text-body mb-6">{selectedQuestion.content}</p>
                  
                  <div className="flex items-center justify-between text-small">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">{selectedQuestion.tags || 'No tags'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">
                        User #{selectedQuestion.user_id}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Answers */}
                <div className="floating-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-subheading">
                      Answers <span className="text-small text-secondary">({answers.length})</span>
                    </h3>
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
                          <h4 className="text-small font-medium">AI-Suggested Answer</h4>
                        </div>
                        <Button
                          onClick={handleUseSuggestion}
                          className="btn btn-secondary"
                          size="sm"
                        >
                          Use This
                        </Button>
                      </div>
                      <p className="text-small">{suggestedAnswer}</p>
                    </div>
                  )}
                  
                  {/* Answer Form */}
                  {showAnswerForm && (
                    <div className="glass-card p-4 mb-6">
                      <h4 className="text-small font-medium mb-4">Your Answer</h4>
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
                        <div key={answer.id} className="glass-card p-4">
                          <p className="text-body mb-4">{answer.content}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-secondary" />
                              <span className="text-small text-secondary">
                                User #{answer.user_id}
                              </span>
                                {answer.user_id === user?.id && (
                                  <button 
                                    onClick={() => confirmDeleteAnswer(answer.id)}
                                    className="text-xs text-destructive hover:underline"
                                  >
                                    Delete
                                  </button>
                                )}
                            </div>
                            <Button
                              onClick={() => handleUpvote(answer.id)}
                              disabled={upvoting === answer.id}
                              className="btn btn-ghost"
                              size="sm"
                            >
                              {upvoting === answer.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  <span>{answer.upvotes}</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-secondary">No answers yet</p>
                      <p className="text-xs text-secondary mt-1">Be the first to answer this question!</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="floating-card p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-secondary/30 mx-auto mb-4" />
                  <h3 className="text-subheading mb-2">Select a Question</h3>
                  <p className="text-secondary">
                    Choose a question from the list to view details and answers
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
