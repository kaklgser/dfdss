// src/components/ResumeOptimizer.tsx
import React, { useState, useEffect, useCallback } from 'react';

// Supabase client and auth context
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

// Lucide React Icons
import { FileText, Sparkles, Download, TrendingUp, Target, Award, User, Briefcase, AlertCircle, CheckCircle, Loader2, RefreshCw, Zap, Plus, Eye, EyeOff, Crown, Calendar, Clock, Users, Star, ArrowRight, Shield, Settings, LogOut, Menu, X, Upload, BarChart3, Lightbulb, ArrowLeft, StretchHorizontal as SwitchHorizontal, ChevronUp, ChevronDown } from 'lucide-react';

// Local Components
import { Header } from './Header';
import { Navigation } from './components/navigation/Navigation';
import { FileUpload } from './FileUpload';
import { InputSection } from './InputSection';
import { ResumePreview } from './ResumePreview';
import { ExportButtons } from './ExportButtons';
import { ComprehensiveAnalysis } from './ComprehensiveAnalysis';
import { ProjectAnalysisModal } from './ProjectAnalysisModal';
import { MobileOptimizedInterface } from './MobileOptimizedInterface';
import { ProjectEnhancement } from './ProjectEnhancement';
import { SubscriptionPlans } from './payment/SubscriptionPlans';
import { SubscriptionStatus } from './payment/SubscriptionStatus';
import { MissingSectionsModal } from './MissingSectionsModal';
import { InputWizard } from './InputWizard';
import { LoadingAnimation } from './LoadingAnimation';

// Services and Utilities
import { parseFile } from '../utils/fileParser';
import { optimizeResume } from '../services/geminiService';
import {
  getMatchScore, generateBeforeScore, generateAfterScore,
  getDetailedResumeScore, reconstructResumeText
} from '../services/scoringService';
import { analyzeProjectAlignment } from '../services/projectAnalysisService';
import { paymentService } from '../services/paymentService';
// Data Types
import { ResumeData, UserType, MatchScore, DetailedScore } from '../types/resume';
import { useNavigate } from 'react-router-dom';

interface ResumeOptimizerProps {
  isAuthenticated: boolean;
  onShowAuth: () => void;
  onShowProfile: (mode?: 'profile' | 'wallet') => void;
  onNavigateBack: () => void;
  userSubscription: any;
  refreshUserSubscription: () => Promise<void>;
  onShowPlanSelection: (featureId?: string) => void;
  toolProcessTrigger: (() => void) | null;
  setToolProcessTrigger: React.Dispatch<React.SetStateAction<(() => void) | null>>;
}

const ResumeOptimizer: React.FC<ResumeOptimizerProps> = ({
  isAuthenticated,
  onShowAuth,
  onShowProfile,
  onNavigateBack,
  userSubscription,
  refreshUserSubscription,
  onShowPlanSelection,
  toolProcessTrigger,
  setToolProcessTrigger
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [extractionResult, setExtractionResult] = useState<ExtractionResult>({ text: '', extraction_mode: 'TEXT', trimmed: false });
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [userType, setUserType] = useState<UserType>('fresher');
  const [scoringMode, setScoringMode] = useState<ScoringMode>('general');
  const [autoScoreOnUpload, setAutoScoreOnUpload] = useState(true);

  const [optimizedResume, setOptimizedResume] = useState<ResumeData | null>(null);
  const [parsedResumeData, setParsedResumeData] = useState<ResumeData | null>(null);
  const [pendingResumeData, setPendingResumeData] = useState<ResumeData | null>(null);

  const [beforeScore, setBeforeScore] = useState<MatchScore | null>(null);
  const [afterScore, setAfterScore] = useState<MatchScore | null>(null);
  const [initialResumeScore, setInitialResumeScore] = useState<DetailedScore | null>(null);
  const [finalResumeScore, setFinalResumeScore] = useState<DetailedScore | null>(null);
  const [changedSections, setChangedSections] = useState<string[]>([]);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isCalculatingScore, setIsCalculatingScore] = useState(false);
  const [isProcessingMissingSections, setIsProcessingMissingSections] = useState(false);
  const [activeTab, setActiveTab] = useState<'resume'>('resume');
  const [currentStep, setCurrentStep] = useState(0);

  const [showProjectAnalysis, setShowProjectAnalysis] = useState(false);
  const [showMissingSectionsModal, setShowMissingSectionsModal] = useState(false);
  const [missingSections, setMissingSections] = useState<string[]>([]);

  const [showMobileInterface, setShowMobileInterface] = useState(false);
  const [showProjectMismatch, setShowProjectMismatch] = useState(false);
  const [showProjectOptions, setShowProjectOptions] = useState(false);
  const [showManualProjectAdd, setShowManualProjectAdd] = useState(false);
  const [lowScoringProjects, setLowScoringProjects] = useState<any[]>([]);
  const [manualProject, setManualProject] = useState({
    title: '',
    startDate: '',
    endDate: '',
    techStack: [],
    oneLiner: ''
  });
  const [newTechStack, setNewTechStack] = useState('');

  const [showProjectEnhancement, setShowProjectEnhancement] = useState(false);

  const [subscription, setSubscription] = useState<any>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [walletRefreshKey, setWalletRefreshKey] = useState(0);

  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const [optimizationInterrupted, setOptimizationInterrupted] = useState(false);

  const handleStartNewResume = () => {
    setOptimizedResume(null);
    setExtractionResult({ text: '', extraction_mode: 'TEXT', trimmed: false });
    setJobDescription('');
    setTargetRole('');
    setUserType('fresher');
    setBeforeScore(null);
    setAfterScore(null);
    setInitialResumeScore(null);
    setFinalResumeScore(null);
    setParsedResumeData(null);
    setManualProject({ title: '', startDate: '', endDate: [], techStack: [], oneLiner: '' });
    setNewTechStack('');
    setLowScoringProjects([]);
    setChangedSections([]);
    setCurrentStep(0);
    setActiveTab('resume');
    setShowMobileInterface(false);
    setOptimizationInterrupted(false);
  };

  const checkSubscriptionStatus = async () => {
    if (!user) return;
    try {
      const userSubscriptionData = await paymentService.getUserSubscription(user.id);
      setSubscription(userSubscriptionData);
      console.log('ResumeOptimizer: checkSubscriptionStatus - Fetched subscription:', userSubscriptionData);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      checkSubscriptionStatus();
    } else {
      setLoadingSubscription(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (extractionResult.text.trim().length > 0 && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [extractionResult.text, currentStep]);

  useEffect(() => {
    setToolProcessTrigger(() => handleOptimize);
    return () => {
      setToolProcessTrigger(null);
    };
  }, [setToolProcessTrigger, handleOptimize]);

  useEffect(() => {
    if (optimizationInterrupted && userSubscription) {
      refreshUserSubscription().then(() => {
        if (userSubscription && (userSubscription.optimizationsTotal - userSubscription.optimizationsUsed) > 0) {
          console.log('ResumeOptimizer: Credits replenished, re-attempting optimization.');
          setOptimizationInterrupted(false);
          handleOptimize();
        }
      });
    }
  }, [optimizationInterrupted, refreshUserSubscription, userSubscription, handleOptimize]);

  const handleOptimize = useCallback(async () => {
    console.log('handleOptimize: Function called.');

    if (!extractionResult.text.trim() || !jobDescription.trim()) {
      alert('Please provide both resume content and job description');
      return;
    }
    if (!user) {
      alert('User information not available. Please sign in again.');
      onShowAuth();
      return;
    }

    try {
      console.log('handleOptimize: Manually refreshing session...');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error('handleOptimize: Session refresh failed:', refreshError.message);
        alert('Your session has expired. Please sign in again.');
        onShowAuth();
        return;
      }
      
      const session = refreshData.session;
      if (!session || !session.access_token) {
        console.error('handleOptimize: Session refresh returned no valid session.');
        alert('Your session has expired. Please sign in again.');
        onShowAuth();
        return;
      }
      console.log('handleOptimize: Session refreshed successfully. Session is now:', session);

      console.log('handleOptimize: Current subscription (before useOptimization check):', userSubscription);
      console.log('handleOptimize: Optimizations remaining (before useOptimization check):', userSubscription ? (userSubscription.optimizationsTotal - userSubscription.optimizationsUsed) : 'N/A');

      if (!userSubscription || (userSubscription.optimizationsTotal - userSubscription.optimizationsUsed) <= 0) {
        setOptimizationInterrupted(true);
        onShowPlanSelection('optimizer');
        return;
      }

      setIsOptimizing(true);
      try {
        const parsedResume = await optimizeResume(
          extractionResult.text,
          jobDescription,
          userType,
          user.name,
          user.email,
          user.phone,
          user.linkedin,
          user.github,
          undefined,
          undefined,
          targetRole
        );

        setParsedResumeData(parsedResume);
        const missing = checkForMissingSections(parsedResume);

        if (missing.length > 0) {
          setMissingSections(missing);
          setPendingResumeData(parsedResume);
          setShowMissingSectionsModal(true);
          setIsOptimizing(false);
          return;
        }

        await continueOptimizationProcess(parsedResume, session.access_token);

      } catch (error: any) {
        console.error('Error optimizing resume:', error);
        alert('Failed to optimize resume. Please try again.');
      } finally {
        setIsOptimizing(false);
      }
    } catch (error: any) {
      console.error('handleOptimize: Error during session validation or subscription check:', error);
      alert(`An error occurred: ${error.message || 'Failed to validate session or check subscription.'}`);
      setIsOptimizing(false);
    }
  }, [extractionResult, jobDescription, user, onShowAuth, userSubscription, onShowPlanSelection, userType, targetRole]);

  const continueOptimizationProcess = async (resumeData: ResumeData, accessToken: string) => {
    try {
      await handleInitialResumeProcessing(resumeData, accessToken);
    } catch (error) {
      console.error('Error in optimization process:', error);
      alert('Failed to continue optimization. Please try again.');
      setIsOptimizing(false);
    }
  };

  const handleInitialResumeProcessing = async (resumeData: ResumeData, accessToken: string) => {
    try {
      setIsCalculatingScore(true);
      const initialScore = await getDetailedResumeScore(resumeData, jobDescription, setIsCalculatingScore);
      setInitialResumeScore(initialScore);
      setOptimizedResume(resumeData);
      setParsedResumeData(resumeData);

      if (resumeData.projects && resumeData.projects.length > 0) {
        setShowProjectAnalysis(true);
      } else {
        await proceedWithFinalOptimization(resumeData, initialScore, accessToken);
      }
    } catch (error) {
      console.error('Error in initial resume processing:', error);
      alert('Failed to process resume. Please try again.');
    } finally {
      setIsCalculatingScore(false);
    }
  };

  const checkForMissingSections = (resumeData: ResumeData): string[] => {
    const missing: string[] = [];
    if (!resumeData.workExperience || resumeData.workExperience.length === 0 || resumeData.workExperience.every(exp => !exp.role?.trim())) {
      missing.push('workExperience');
    }
    if (!resumeData.projects || resumeData.projects.length === 0 || resumeData.projects.every(proj => !proj.title?.trim())) {
      missing.push('projects');
    }
    if (!resumeData.skills || resumeData.skills.length === 0 || resumeData.skills.every(skillCat => !skillCat.list || skillCat.list.every(s => !s.trim()))) {
      missing.push('skills');
    }
    if (!resumeData.education || resumeData.education.length === 0 || resumeData.education.every(edu => !edu.degree?.trim() || !edu.school?.trim() || !edu.year?.trim())) {
      missing.push('education');
    }
    return missing;
  };

  const handleMissingSectionsProvided = async (data: any) => {
    setIsProcessingMissingSections(true);
    try {
      if (!pendingResumeData) {
        throw new Error("No pending resume data to update.");
      }
      const updatedResume: ResumeData = {
        ...pendingResumeData,
        ...(data.workExperience && data.workExperience.length > 0 && { workExperience: data.workExperience }),
        ...(data.projects && data.projects.length > 0 && { projects: data.projects }),
        ...(data.skills && data.skills.length > 0 && { skills: data.skills }),
        ...(data.education && data.education.length > 0 && { education: data.education }),
        ...(data.summary && { summary: data.summary }),
      };
      setShowMissingSectionsModal(false);
      setMissingSections([]);
      setPendingResumeData(null);
      setIsOptimizing(false);
      const { data: { session } = { data: { session: null } } } = supabase.auth.getSession();
      await handleInitialResumeProcessing(updatedResume, session?.access_token || '');
    } catch (error) {
      console.error('Error processing missing sections:', error);
      alert('Failed to process the provided information. Please try again.');
    } finally {
      setIsProcessingMissingSections(false);
    }
  };

  const proceedWithFinalOptimization = async (resumeData: ResumeData, initialScore: DetailedScore, accessToken: string) => {
    try {
      setIsOptimizing(true);
      const finalOptimizedResume = await optimizeResume(
        reconstructResumeText(resumeData),
        jobDescription,
        userType,
        user!.name,
        user!.email,
        user!.phone,
        user!.linkedin,
        user!.github,
        undefined,
        undefined,
        targetRole
      );

      const beforeScoreData = generateBeforeScore(reconstructResumeText(resumeData));
      setBeforeScore(beforeScoreData);

      const finalScore = await getDetailedResumeScore(finalOptimizedResume, jobDescription, setIsCalculatingScore);
      setFinalResumeScore(finalScore);

    const afterScoreData = await generateAfterScore(finalOptimizedResume, jobDescription);
      setAfterScore(afterScoreData);

      const sections = ['workExperience', 'education', 'projects', 'skills', 'certifications'];
      setChangedSections(sections);

      console.log('ResumeOptimizer: Before useOptimization call - userSubscription:', userSubscription);
      const optimizationResult = await paymentService.useOptimization(user!.id);
      console.log('ResumeOptimizer: After useOptimization call - optimizationResult:', optimizationResult);

      if (optimizationResult.success) {
        await checkSubscriptionStatus();
        setWalletRefreshKey(prevKey => prev + 1);
        console.log('ResumeOptimizer: After checkSubscriptionStatus - userSubscription:', userSubscription);
      } else {
        console.error('ResumeOptimizer: Failed to decrement optimization usage:', optimizationResult.error);
      }

      if (window.innerWidth < 768) {
        setShowMobileInterface(true);
      }
      setActiveTab('resume');
      setOptimizedResume(finalOptimizedResume);
    } catch (error) {
      console.error('Error in final optimization pass:', error);
      alert('Failed to complete resume optimization. Please try again.');
    } finally {
      setIsOptimizing(false);
      setIsCalculatingScore(false);
    }
  };

  const handleProjectMismatchResponse = (proceed: boolean) => {
    setShowProjectMismatch(false);
    if (proceed) {
      setShowProjectOptions(true);
    } else {
      if (parsedResumeData && initialResumeScore) {
        const { data: { session } = { data: { session: null } } } = supabase.auth.getSession();
        proceedWithFinalOptimization(parsedResumeData, initialResumeScore, session?.access_token || '');
      }
    }
  };

  const handleProjectOptionSelect = (option: 'manual' | 'ai') => {
    setShowProjectOptions(false);
    if (option === 'manual') {
      setShowManualProjectAdd(true);
    } else {
      setShowProjectEnhancement(true);
    }
  };

  const addTechToStack = () => {
    if (newTechStack.trim() && !manualProject.techStack.includes(newTechStack.trim())) {
      setManualProject(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTechStack.trim()],
      }));
      setNewTechStack('');
    }
  };

  const removeTechFromStack = (tech: string) => {
    setManualProject(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const generateProjectDescription = async (project: typeof manualProject, jd: string): Promise<string> => {
    return `• Developed ${project.title} using ${project.techStack.join(', ')} technologies
• Implemented core features and functionality aligned with industry best practices
• Delivered scalable solution with focus on performance and user experience`;
  };

  const handleManualProjectSubmit = async () => {
    if (!manualProject.title || manualProject.techStack.length === 0 || !parsedResumeData) {
      alert('Please provide project title and tech stack.');
      return;
    }

    setIsOptimizing(true);
    try {
      const projectDescriptionText = await generateProjectDescription(manualProject, jobDescription);
      const newProject = {
        title: manualProject.title,
        bullets: projectDescriptionText.split('\n').filter(line => line.trim().startsWith('•')).map(line => line.replace('•', '').trim()),
        githubUrl: ''
      };

      const updatedResume = { ...parsedResumeData, projects: [...(parsedResumeData.projects || []), newProject] };

      setShowManualProjectAdd(false);
      const { data: { session } = { data: { session: null } } } = supabase.auth.getSession();
      if (initialResumeScore) {
        await proceedWithFinalOptimization(updatedResume, initialResumeScore, session?.access_token || '');
      } else {
        const newInitialScore = await getDetailedResumeScore(updatedResume, jobDescription, setIsCalculatingScore);
        await proceedWithFinalOptimization(updatedResume, newInitialScore, session?.access_token || '');
      }
    } catch (error) {
      console.error('Error creating manual project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleProjectsUpdated = async (updatedResumeData: ResumeData) => {
    console.log('Projects updated, triggering final AI re-optimization...');
    setOptimizedResume(updatedResumeData);
    setParsedResumeData(updatedResumeData);

    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    
    if (initialResumeScore) {
      proceedWithFinalOptimization(updatedResumeData, initialResumeScore, session?.access_token || '');
    } else {
      generateScoresAfterProjectAdd(updatedResumeData, session?.access_token || '');
    }
  };

  const generateScoresAfterProjectAdd = async (updatedResume: ResumeData, accessToken: string) => {
    try {
      setIsCalculatingScore(true);
      const freshInitialScore = await getDetailedResumeScore(updatedResume, jobDescription, setIsCalculatingScore);
      setInitialResumeScore(freshInitialScore);
      await proceedWithFinalOptimization(updatedUpdatedResume, freshInitialScore, accessToken);
    } catch (error) {
      console.error('Error generating scores after project add:', error);
      alert('Failed to generate updated scores. Please try again.');
    } finally {
      setIsCalculatingScore(false);
    }
  }

  const handleSubscriptionSuccess = () => {
    checkSubscriptionStatus();
    onShowPlanSelection();
    setWalletRefreshKey(prevKey => prev + 1);
  };

  if (showMobileInterface && optimizedResume) {
    const mobileSections = [
      {
        id: 'resume',
        title: 'Optimized Resume',
        icon: <FileText className="w-5 h-5" />,
        component: (
          <>
            {optimizedResume ? (
              <ResumePreview resumeData={optimizedResume} userType={userType} />
            ) : null}
            {optimizedResume && (
              <ExportButtons
                resumeData={optimizedResume}
                userType={userType}
                targetRole={targetRole}
                onShowProfile={onShowProfile}
                walletRefreshKey={walletRefreshKey}
              />
            )}
          </>
        ),
        resumeData: optimizedResume
      },
    ];
    return <MobileOptimizedInterface sections={mobileSections} onStartNewResume={handleStartNewResume} />;
  }

  if (isOptimizing || isCalculatingScore || isProcessingMissingSections) {
    let loadingMessage = "Optimizing Your Resume...";
    let subMessage = "Please wait while our AI analyzes your resume and job description to generate the best possible match.";
    if (isCalculatingScore) {
      loadingMessage = "OPTIMIZING RESUME...";
      subMessage = "Our AI is evaluating your resume based on comprehensive criteria.";
    } else if (isProcessingMissingSections) {
      loadingMessage = "Processing Your Information...";
      subMessage = "We're updating your resume with the new sections you provided.";
    }

    return (
      <LoadingAnimation
        message={loadingMessage}
        submessage={subMessage}
      />
    );
  }

// ... (keep the rest of the component code as it is) ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 px-4 sm:px-0 dark:from-dark-50 dark:to-dark-200 transition-colors duration-300">
      <div className="w-90vh max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-8">
        {!optimizedResume ? (
          <>
            <button
              onClick={() => navigate('/')}
              className="mb-6 bg-gradient-to-r from-neon-cyan-500 to-neon-blue-500 text-white hover:from-neon-cyan-400 hover:to-neon-blue-400 active:from-neon-cyan-600 active:to-neon-blue-600 shadow-md hover:shadow-neon-cyan py-3 px-5 rounded-xl inline-flex items-center space-x-2 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:block">Back to Home</span>
            </button>

            {isAuthenticated && !loadingSubscription && (
              <div className="relative text-center mb-8 z-10">
                <button
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 font-semibold text-sm bg-gradient-to-r from-neon-purple-500 to-neon-blue-600 text-white shadow-md hover:shadow-neon-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan-500 max-w-[300px] mx-auto justify-center dark:shadow-neon-purple"
                >
                  <span>
                    {userSubscription
                      ? `Optimizations Left: ${userSubscription.optimizationsTotal - userSubscription.optimizationsUsed}`
                      : 'No Active Plan'}
                  </span>
                </button>

              </div>
            )}
            <div className="max-w-7xl mx-auto space-y-6">
              <InputWizard
                extractionResult={extractionResult}
                setExtractionResult={setExtractionResult}
                scoringMode={scoringMode}
                setScoringMode={setScoringMode}
                autoScoreOnUpload={autoScoreOnUpload}
                setAutoScoreOnUpload={setAutoScoreOnUpload}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                targetRole={targetRole}
                setTargetRole={setTargetRole}
                userType={userType}
                setUserType={setUserType}
                handleOptimize={handleOptimize}
                isAuthenticated={isAuthenticated}
                onShowAuth={onShowAuth}
                user={user}
                onShowProfile={onShowProfile}
              />
            </div>
          </>
        ) : (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="text-center flex flex-col items-center gap-4">
              <button
                onClick={() => setActiveTab('resume')}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors font-medium text-sm shadow-lg ${
                  activeTab === 'resume'
                    ? 'bg-gradient-to-r from-neon-cyan-500 to-neon-blue-500 text-white shadow-neon-cyan'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-200 dark:text-gray-300 dark:hover:bg-dark-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Resume Preview</span>
              </button>
              
              <button
                onClick={handleStartNewResume}
                className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-xl shadow transition-colors dark:bg-dark-300 dark:hover:bg-dark-400"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Create New Resume</span>
              </button>
            </div>

            {optimizedResume && activeTab === 'resume' && (
              <>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 border-b border-gray-200 dark:from-dark-200 dark:to-dark-300 dark:border-dark-400">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-green-600 dark:text-neon-cyan-400" />
                      Optimized Resume
                    </h2>
                  </div>
                  <ResumePreview resumeData={optimizedResume} userType={userType} />
                </div>
                <ExportButtons
                  resumeData={optimizedResume}
                  userType={userType}
                  targetRole={targetRole}
                  onShowProfile={onShowProfile}
                  walletRefreshKey={walletRefreshKey}
                />
              </>
            )}
          </div>
        )}
      </div>

      {showProjectMismatch && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Project Mismatch Detected</h2>
                <p className="text-gray-600">
                  Your current projects don't align well with the job description. Would you like to add a relevant project to improve your resume score?
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {initialResumeScore?.totalScore}/100
                  </div>
                  <div className="text-sm text-red-700">Current Resume Score</div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleProjectMismatchResponse(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Yes, Add Project
                </button>
                <button
                  onClick={() => handleProjectMismatchResponse(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProjectOptions && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Project Addition Method</h2>
                <p className="text-gray-600">
                  How would you like to add a relevant project to your resume?
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => handleProjectOptionSelect('manual')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span>Manual Add - I'll provide project details</span>
                </button>
                <button
                  onClick={() => handleProjectOptionSelect('ai')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>AI-Suggested - Generate automatically</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showManualProjectAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Add Project Manually</h2>
                <p className="text-gray-600">
                  Provide project details and AI will generate a professional description
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={manualProject.title}
                    onChange={(e) => setManualProject(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., E-commerce Website"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    value={manualProject.startDate}
                    onChange={(e) => setManualProject(prev => ({ ...prev, startDate: e.target.value }))}
                    placeholder="e.g., React, Node.js"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="month"
                    value={manualProject.endDate}
                    onChange={(e) => setManualProject(prev => ({ ...prev, endDate: e.target.value }))}
                    placeholder="e.g., React, Node.js"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tech Stack *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTechStack}
                    onChange={(e) => setNewTechStack(e.target.value)}
                    placeholder="e.g., React, Node.js"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    onKeyPress={(e) => e.key === 'Enter' && addTechToStack()}
                  />
                  <button
                    onClick={addTechToStack}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {manualProject.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {tech}
                      <button
                        onClick={() => removeTechFromStack(tech)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  One-liner Description (Optional)
                </label>
                <input
                  type="text"
                  value={manualProject.oneLiner}
                  onChange={(e) => setManualProject(prev => ({ ...prev, oneLiner: e.target.value }))}
                  placeholder="Brief description of the project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleManualProjectSubmit}
                disabled={!manualProject.title || manualProject.techStack.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                Generate & Add Project
              </button>
              <button
                onClick={() => setShowManualProjectAdd(false)}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ProjectEnhancement
        isOpen={showProjectEnhancement}
        onClose={() => setShowProjectEnhancement(false)}
        currentResume={parsedResumeData || optimizedResume || { name: '', phone: '', email: '', linkedin: '', github: '', education: [], workExperience: [], projects: [], skills: [], certifications: [] }}
        jobDescription={jobDescription}
        onProjectsAdded={handleProjectsUpdated}
      />

      <ProjectAnalysisModal
        isOpen={showProjectAnalysis}
        onClose={() => setShowProjectAnalysis(false)}
        resumeData={parsedResumeData || optimizedResume || { name: '', phone: '', email: '', linkedin: '', github: '', education: [], workExperience: [], projects: [], skills: [], certifications: [] }}
        jobDescription={jobDescription}
        targetRole={targetRole}
        onProjectsUpdated={handleProjectsUpdated}
      />

      <MissingSectionsModal
        isOpen={showMissingSectionsModal}
        onClose={() => {
          setShowMissingSectionsModal(false);
          setMissingSections([]);
          setPendingResumeData(null);
          setIsOptimizing(false);
        }}
        missingSections={missingSections}
        onSectionsProvided={handleMissingSectionsProvided}
      />
    </div>
  )
}

export default ResumeOptimizer;
