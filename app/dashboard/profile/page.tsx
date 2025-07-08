'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createOrUpdateProfile, getProfile } from '@/actions/profile';
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
import { 
  User, 
  Building, 
  Target, 
  Users, 
  History, 
  DollarSign, 
  Tag, 
  Leaf, 
  Calendar,
  Loader2,
  Save
} from 'lucide-react';

interface ProfileFormData {
  name: string;
  mission: string;
  demographics: string;
  past_methods: string;
  fundraising_goals: string;
  service_tags: string[];
  sustainability_practices: string;
  operating_years: number;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
  const [originalFormData, setOriginalFormData] = useState<ProfileFormData | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    mission: '',
    demographics: '',
    past_methods: '',
    fundraising_goals: '',
    service_tags: [],
    sustainability_practices: '',
    operating_years: 0
  });

  useEffect(() => {
    // Check for mobile view
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await getProfile(user.id.toString());
        if (profile) {
          const profileData = {
            name: profile.name || '',
            mission: profile.mission || '',
            demographics: profile.demographics || '',
            past_methods: profile.past_methods || '',
            fundraising_goals: profile.fundraising_goals || '',
            service_tags: Array.isArray(profile.service_tags) ? profile.service_tags : (profile.service_tags ? profile.service_tags.split(',').map((tag: string) => tag.trim()) : []),
            sustainability_practices: profile.sustainability_practices || '',
            operating_years: profile.operating_years || 0
          };
          setFormData(profileData);
          setOriginalFormData(profileData);
          setHasChanges(false);
        }
      } catch (error) {
        toast({
          title: "Failed to load profile",
          description: "Could not retrieve your organization profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue;
    
    if (name === 'operating_years') {
      newValue = parseInt(value) || 0;
    } else if (name === 'service_tags') {
      // Convert comma-separated string to array
      newValue = value ? value.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '') : [];
    } else {
      newValue = value;
    }
    
    const newFormData = {
      ...formData,
      [name]: newValue
    };
    
    setFormData(newFormData);
    
    // Check if form data has changed from original
    if (originalFormData) {
      const hasChanged = Object.keys(originalFormData).some(key => {
        const origValue = originalFormData[key as keyof ProfileFormData];
        const newValue = newFormData[key as keyof ProfileFormData];
        
        if (Array.isArray(origValue) && Array.isArray(newValue)) {
          // Compare arrays
          return JSON.stringify(origValue) !== JSON.stringify(newValue);
        }
        return origValue !== newValue;
      });
      setHasChanges(hasChanged);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowUnsavedChangesDialog(true);
    } else {
      router.push('/dashboard');
    }
  };

  const handleDiscardChanges = () => {
    setShowUnsavedChangesDialog(false);
    router.push('/dashboard');
  };

  const handleResetForm = () => {
    if (originalFormData) {
      setFormData(originalFormData);
      setHasChanges(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const profileData = {
        user_id: user.id,
        ...formData
      };
      
      const result = await createOrUpdateProfile(profileData);
      console.log(result)
      
      toast({
        title: "Profile saved",
        description: "Your organization profile has been updated successfully.",
      });
      
      // Update original form data to match current data
      setOriginalFormData({...formData});
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Failed to save profile",
        description: "An error occurred while saving your profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-heading">Organization Profile</h1>
                <p className="text-body text-secondary">
                  Complete your profile to help us personalize your experience
                </p>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="floating-card p-6">
            <h2 className="text-subheading mb-6 flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Basic Information
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="name" className="text-small font-medium text-primary mb-2 block">
                    Organization Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your organization's name"
                    className="input"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="mission" className="text-small font-medium text-primary mb-2 block">
                    Mission Statement
                  </Label>
                  <Textarea
                    id="mission"
                    name="mission"
                    value={formData.mission}
                    onChange={handleInputChange}
                    placeholder="Describe your organization's mission and purpose"
                    className="input min-h-[100px]"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="operating_years" className="text-small font-medium text-primary mb-2 block">
                    Years in Operation
                  </Label>
                  <Input
                    id="operating_years"
                    name="operating_years"
                    type="number"
                    min="0"
                    value={formData.operating_years}
                    onChange={handleInputChange}
                    placeholder="How many years has your organization been operating?"
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="floating-card p-6">
            <h2 className="text-subheading mb-6 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Target & Services
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="demographics" className="text-small font-medium text-primary mb-2 block">
                  Target Demographics
                </Label>
                <Textarea
                  id="demographics"
                  name="demographics"
                  value={formData.demographics}
                  onChange={handleInputChange}
                  placeholder="Describe the demographics your organization serves"
                  className="input"
                />
              </div>
              
              <div>
                <Label htmlFor="service_tags" className="text-small font-medium text-primary mb-2 block">
                  Service Tags
                </Label>
                <Input
                  id="service_tags"
                  name="service_tags"
                  value={Array.isArray(formData.service_tags) ? formData.service_tags.join(', ') : ''}
                  onChange={handleInputChange}
                  placeholder="e.g., education, community, youth (comma-separated)"
                  className="input"
                />
              </div>
              
              <div>
                <Label htmlFor="sustainability_practices" className="text-small font-medium text-primary mb-2 block">
                  Sustainability Practices
                </Label>
                <Textarea
                  id="sustainability_practices"
                  name="sustainability_practices"
                  value={formData.sustainability_practices}
                  onChange={handleInputChange}
                  placeholder="Describe your organization's sustainability practices"
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="floating-card p-6">
            <h2 className="text-subheading mb-6 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Fundraising Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="past_methods" className="text-small font-medium text-primary mb-2 block">
                  Past Fundraising Methods
                </Label>
                <Textarea
                  id="past_methods"
                  name="past_methods"
                  value={formData.past_methods}
                  onChange={handleInputChange}
                  placeholder="Describe previous fundraising methods your organization has used"
                  className="input"
                />
              </div>
              
              <div>
                <Label htmlFor="fundraising_goals" className="text-small font-medium text-primary mb-2 block">
                  Fundraising Goals
                </Label>
                <Textarea
                  id="fundraising_goals"
                  name="fundraising_goals"
                  value={formData.fundraising_goals}
                  onChange={handleInputChange}
                  placeholder="Describe your organization's annual fundraising goals"
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="mr-2"
              >
                Cancel
              </Button>
              {hasChanges && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleResetForm}
                >
                  Reset
                </Button>
              )}
            </div>
            <Button
              type="submit"
              disabled={saving}
              className="btn btn-primary px-8"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
        
        {/* Unsaved Changes Dialog */}
        <AlertDialog open={showUnsavedChangesDialog} onOpenChange={setShowUnsavedChangesDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Stay</AlertDialogCancel>
              <AlertDialogAction onClick={handleDiscardChanges} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Discard Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
