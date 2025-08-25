// src/components/ResumeScoreChecker.tsx
import React, { useState } from 'react';
import {
  Upload,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Target,
  Award,
  Lightbulb,
  Zap, // For Impact
  Clock, // For Brevity
  Palette, // For Style
  Sparkles, // For Skills Score
  FileCheck, // For ATS Compatibility
  Search, // For Keyword & Skill Match
  Briefcase, // For Project & Work Relevance
  LayoutDashboard, // For Structure & Flow
  Bug, // For Critical Fixes & Red Flags
  ArrowRight,
  BarChart3,
  Info,
  Eye,
  RefreshCw,
  Calendar,
  Shield
} from 'lucide-react';
import { FileUpload } from './FileUpload';
import { getComprehensiveScore } from '../services/scoringService';
import { LoadingAnimation } from './LoadingAnimation'; // Import LoadingAnimation
import { ComprehensiveScore, ScoringMode, ExtractionResult } from '../types/resume';

// Import Subscription type if it's not already globally available
import { Subscription } from '../types/payment'; // Assuming this path is correct
import { paymentService } from '../services/paymentService'; // Import paymentService

interface ResumeScoreCheckerProps {
  onNavigateBack: () => void;
  isAuthenticated: boolean;
  onShowAuth: () => void;
  userSubscription: Subscription | null; // Add this prop
  onShowSubscriptionPlans: (featureId?: string) => void; // MODIFIED: Changed prop name and added optional parameter
  onShowAlert: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error', actionText?: string, onAction?: () => void) => void;
  refreshUserSubscription: () => Promise<void>; // ADD THIS PROP
}

export const ResumeScoreChecker: React.FC<ResumeScoreCheckerProps> = ({
  onNavigateBack,
  isAuthenticated,
  onShowAuth,
  userSubscription, // Destructure the new prop
  onShowSubscriptionPlans, // MODIFIED: Destructure the new prop
  onShowAlert,
  refreshUserSubscription, // DESTUCTURE THE NEW PROP
}) => {
  console.log('ResumeScoreChecker: Component rendered. userSubscription:', userSubscription);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult>({ text: '', extraction_mode: 'TEXT', trimmed: false });
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [scoringMode, setScoringMode] = useState<ScoringMode>('general');
  const [autoScoreOnUpload, setAutoScoreOnUpload] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [scoreResult, setScoreResult] = useState<ComprehensiveScore | null>(null);

  const handleFileUpload = (result: ExtractionResult) => {
    setExtractionResult(result);
    
    // Auto-score on upload if enabled and in general mode
    if (autoScoreOnUpload && scoringMode === 'general' && result.text.trim()) {
      setTimeout(() => analyzeResume(), 500); // Small delay for better UX
    }
  };

  const analyzeResume = async () => {
    if (!isAuthenticated) {
      console.log('ResumeScoreChecker: analyzeResume called. userSubscription at call time:', userSubscription);
      onShowAlert('Authentication Required', 'Please sign in to get your resume score.', 'error', 'Sign In', onShowAuth);
      return;
    }

    // Check subscription and score check credits
    if (!userSubscription || (userSubscription.scoreChecksTotal - userSubscription.scoreChecksUsed) <= 0) {
      const planDetails = paymentService.getPlanById(userSubscription?.planId);
      const planName = planDetails?.name || 'your current plan';
      const scoreChecksTotal = planDetails?.scoreChecks || 0;

      onShowAlert(
        'Resume Score Check Credits Exhausted',
        `You have used all your ${scoreChecksTotal} Resume Score Checks from ${planName}. Please upgrade your plan to continue checking scores.`,
        'warning',
        'Upgrade Plan',
        () => onShowSubscriptionPlans('score-checker') // MODIFIED: Call the new plan selection handler with feature ID
      );
      return;
    }

    if (!extractionResult.text.trim()) {
      onShowAlert('Missing Resume', 'Please upload your resume first to get a score.', 'warning');
      return;
    }

    // Validate required fields based on scoring mode
    if (scoringMode === 'jd_based') {
      if (!jobDescription.trim()) {
        onShowAlert('Missing Job Description', 'Job description is required for JD-based scoring.', 'warning');
        return;
      }
      if (!jobTitle.trim()) {
        onShowAlert('Missing Job Title', 'Job title is required for JD-based scoring.', 'warning');
        return;
      }
    }

    setScoreResult(null); // Clear previous result before new analysis
    setIsAnalyzing(true); // Set loading state
    setLoadingStep('Extracting & cleaning your resume...');

    try {
      if (scoringMode === 'jd_based') {
        setLoadingStep(`Comparing with Job Title: ${jobTitle}...`);
      }
      
      setLoadingStep('Scoring across 16 criteria...');

      const result = await getComprehensiveScore(
        extractionResult.text,
        scoringMode === 'jd_based' ? jobDescription : undefined,
        scoringMode === 'jd_based' ? jobTitle : undefined,
        scoringMode,
        extractionResult.extraction_mode,
        extractionResult.trimmed
      );

      setScoreResult(result);

      // Decrement usage count and refresh subscription
      if (userSubscription) { // Ensure userSubscription is not null before attempting to use it
        const usageResult = await paymentService.useScoreCheck(userSubscription.userId); // Assuming useScoreCheck exists
        if (usageResult.success) {
          await refreshUserSubscription(); // Refresh the global subscription state
        } else {
          console.error('Failed to decrement score check usage:', usageResult.error);
          onShowAlert('Usage Update Failed', 'Failed to record score check usage. Please contact support.', 'error');
        }
      }

    } catch (error) {
      console.error('Error analyzing resume:', error);
      onShowAlert('Analysis Failed', `Failed to analyze resume: ${error.message || 'Unknown error'}. Please try again.`, 'error');
    } finally {
      setIsAnalyzing(false); // Ensure loading state is reset
      setLoadingStep('');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  // Moved these helper functions outside the component for better readability and reusability
  const getConfidenceColor = (confidence: ConfidenceLevel) => {
    switch (confidence) {
      case 'High': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'Low': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
    }
  };

  const getMatchBandColor = (band: MatchBand) => {
    if (band.includes('Excellent') || band.includes('Very Good')) return 'text-green-600 dark:text-green-400';
    if (band.includes('Good') || band.includes('Fair')) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  const getCategoryScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCategoryIcon = (category: keyof DetailedScore['breakdown']) => {
    switch (category) {
      case 'atsCompatibility': return <FileCheck className="w-5 h-5 mr-2 text-blue-600" />;
      case 'keywordSkillMatch': return <Search className="w-5 h-5 mr-2 text-green-600" />;
      case 'projectWorkRelevance': return <Briefcase className="w-5 h-5 mr-2 text-purple-600" />;
      case 'structureFlow': return <LayoutDashboard className="w-5 h-5 mr-2 text-indigo-600" />;
      case 'criticalFixesRedFlags': return <Bug className="w-5 h-5 mr-2 text-red-600" />;
      case 'impactScore': return <Zap className="w-5 h-5 mr-2 text-orange-600" />;
      case 'brevityScore': return <Clock className="w-5 h-5 mr-2 text-gray-600" />;
      case 'styleScore': return <Palette className="w-5 h-5 mr-2 text-pink-600" />;
      case 'skillsScore': return <Sparkles className="w-5 h-5 mr-2 text-teal-600" />;
      default: return null;
    }
  };

  const getCategoryTitle = (category: keyof DetailedScore['breakdown']) => {
    switch (category) {
      case 'atsCompatibility': return 'ATS Compatibility';
      case 'keywordSkillMatch': return 'Keyword & Skill Match';
      case 'projectWorkRelevance': return 'Project & Work Relevance';
      case 'structureFlow': return 'Structure & Flow';
      case 'criticalFixesRedFlags': return 'Critical Fixes & Red Flags';
      case 'impactScore': return 'Impact Score';
      case 'brevityScore': return 'Brevity Score';
      case 'styleScore': return 'Style Score';
      case 'skillsScore': return 'Skills Score';
      default: return category;
    }
  };

  return (
    <>
      {isAnalyzing ? (
        <LoadingAnimation
          message={loadingStep}
          submessage="Please wait while we analyze your resume."
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 sm:px-0 dark:from-dark-50 dark:to-dark-200 transition-colors duration-300">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 dark:bg-dark-50 dark:border-dark-300">
            <div className="container-responsive">
              <div className="flex items-center justify-between h-16">
                <button
                  onClick={onNavigateBack}
                  className="mb-6 bg-gradient-to-r from-neon-cyan-500 to-neon-blue-500 text-white hover:from-neon-cyan-400 hover:to-neon-blue-400 active:from-neon-cyan-600 active:to-neon-blue-600 shadow-md hover:shadow-neon-cyan py-3 px-5 rounded-xl inline-flex items-center space-x-2 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="hidden sm:block">Back to Home</span>
                </button>

                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resume Score Checker</h1>

                <div className="w-24"></div> {/* Spacer for alignment */}
              </div>
            </div>
          </div>

          {/* Scoring Mode Selection */}
          <div className="container-responsive py-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl mb-8">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-200 dark:from-dark-200 dark:to-dark-300 dark:border-dark-400">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Choose Scoring Method</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setScoringMode('jd_based')}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        scoringMode === 'jd_based'
                          ? 'border-blue-500 bg-blue-50 shadow-lg dark:border-neon-cyan-500 dark:bg-neon-cyan-500/20'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:border-dark-300 dark:hover:border-neon-cyan-400 dark:hover:bg-neon-cyan-500/10'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <Target className="w-6 h-6 text-blue-600 dark:text-neon-cyan-400 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Score Against a Job</h3>
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium dark:bg-neon-cyan-500/20 dark:text-neon-cyan-300">Best</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Get a targeted score by comparing your resume against a specific job description and title.</p>
                    </button>

                    <button
                      onClick={() => setScoringMode('general')}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        scoringMode === 'general'
                          ? 'border-purple-500 bg-purple-50 shadow-lg dark:border-neon-purple-500 dark:bg-neon-purple-500/20'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 dark:border-dark-300 dark:hover:border-neon-purple-400 dark:hover:bg-neon-purple-500/10'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <BarChart3 className="w-6 h-6 text-purple-600 dark:text-neon-purple-400 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">General Score</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Get a general assessment of your resume quality against industry standards.</p>
                      
                      {scoringMode === 'general' && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-300">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={autoScoreOnUpload}
                              onChange={(e) => setAutoScoreOnUpload(e.target.checked)}
                              className="form-checkbox h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Auto-score on upload</span>
                          </label>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container-responsive py-8">
            <div className="max-w-4xl mx-auto">

              {!scoreResult ? (
                <div className="space-y-8">
                  {/* Resume Upload Section */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200 dark:from-dark-200 dark:to-dark-300 dark:border-dark-400">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                        <Upload className="w-5 h-5 mr-2 text-blue-600 dark:text-neon-cyan-400" />
                        Upload Your Resume
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">Upload your current resume for analysis</p>
                    </div>
                    <div className="p-6">
                      <FileUpload onFileUpload={handleFileUpload} />
                    </div>
                  </div>

                  {/* Job Title Section (Required for JD-based scoring) */}
                  {scoringMode === 'jd_based' && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-gray-200 dark:from-dark-200 dark:to-dark-300 dark:border-dark-400">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                          Job Title *
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">Enter the exact job title you're targeting</p>
                      </div>
                      <div className="p-6">
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="e.g., Senior Software Engineer, Product Manager, Data Scientist"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-dark-200 dark:border-dark-300 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  )}

                  {/* Job Description Section (Optional) */}
                  {(scoringMode === 'general' || scoringMode === 'jd_based') && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-200 dark:from-dark-200 dark:to-dark-300 dark:border-dark-400">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-green-600 dark:text-neon-blue-400" />
                        Job Description {scoringMode === 'jd_based' ? '*' : '(Optional)'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {scoringMode === 'jd_based' 
                          ? 'Paste the complete job description for targeted analysis'
                          : 'Add a job description for more targeted analysis'
                        }
                      </p>
                    </div>
                    <div className="p-6">
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder={scoringMode === 'jd_based' 
                          ? "Paste the complete job description here including requirements, responsibilities, and qualifications..."
                          : "Paste the job description here for more specific analysis. If left empty, we'll use general industry standards."
                        }
                        className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-neon-cyan-500 focus:border-neon-cyan-500 resize-none dark:bg-dark-200 dark:border-dark-300 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  )}

                  {/* Analyze Button */}
                  <div className="text-center">
                    <button
                      onClick={analyzeResume}
                      disabled={!extractionResult.text.trim() || (scoringMode === 'jd_based' && (!jobDescription.trim() || !jobTitle.trim()))}
                      className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center space-x-3 mx-auto shadow-xl hover:shadow-2xl ${
                        !extractionResult.text.trim() || (scoringMode === 'jd_based' && (!jobDescription.trim() || !jobTitle.trim()))
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-gradient-to-r from-neon-cyan-500 to-neon-purple-500 hover:from-neon-cyan-400 hover:to-neon-purple-400 text-white hover:shadow-neon-cyan transform hover:scale-105'
                      }`}
                    >
                      <TrendingUp className="w-6 h-6" />
                      <span>{isAuthenticated ? 'Analyze My Resume' : 'Sign In to Analyze'}</span>
                    </button>

                    {!isAuthenticated && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                        Sign in to access our AI-powered resume analysis
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Score Results */
                <div className="space-y-8">
                  {/* Cache Notice */}
                  {scoreResult.cached && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 dark:bg-neon-cyan-500/10 dark:border-neon-cyan-400/50">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-neon-cyan-400 mr-2" />
                        <span className="text-blue-800 dark:text-neon-cyan-300 font-medium">
                          Cached Result - This analysis was free (expires {scoreResult.cache_expires_at ? new Date(scoreResult.cache_expires_at).toLocaleDateString() : 'soon'})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Score Overview */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-200 dark:from-dark-200 dark:to-dark-300 dark:border-dark-400">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-green-600 dark:text-neon-cyan-400" />
                        Your Resume Score
                      </h2>
                      
                      {/* Extraction Flags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {extractionResult.extraction_mode === 'OCR' && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium dark:bg-orange-900/20 dark:text-orange-300">
                            <Eye className="w-3 h-3 inline mr-1" />
                            OCR Used
                          </span>
                        )}
                        {extractionResult.trimmed && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium dark:bg-yellow-900/20 dark:text-yellow-300">
                            <Info className="w-3 h-3 inline mr-1" />
                            Content Trimmed
                          </span>
                        )}
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getConfidenceColor(scoreResult.confidence)}`}>
                          <Shield className="w-3 h-3 inline mr-1" />
                          {scoreResult.confidence} Confidence
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                        {/* Score Circle */}
                        <div className="text-center">
                          <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                              <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                              />
                              <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                strokeDasharray={`${(scoreResult.overall / 100) * 314} 314`}
                                strokeLinecap="round"
                                className={`${getScoreColor(scoreResult.overall)} dark:stroke-neon-cyan-400`}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className={`text-3xl font-bold ${getScoreColor(scoreResult.overall)} dark:text-neon-cyan-400`}>
                                  {scoreResult.overall}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                              
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Match Band */}
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 dark:from-neon-cyan-500/20 dark:to-neon-blue-500/20 dark:shadow-neon-cyan">
                            <Award className="w-8 h-8 text-blue-600 dark:text-neon-cyan-400" />
                          </div>
                          <div className={`text-lg font-bold ${getMatchBandColor(scoreResult.match_band)} mb-2`}>
                            {scoreResult.match_band}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Match Quality</div>
                        </div>

                        {/* Interview Probability */}
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 dark:from-neon-blue-500/20 dark:to-neon-purple-500/20 dark:shadow-neon-blue">
                            <TrendingUp className="w-8 h-8 text-green-600 dark:text-neon-blue-400" />
                          </div>
                          <div className="text-lg font-bold text-green-600 dark:text-neon-blue-400 mb-2">
                            {scoreResult.interview_probability_range}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Interview Chance</div>
                        </div>

                        {/* Analysis Summary */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Overall Analysis</h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm mb-4">{scoreResult.analysis}</p>

                          <div className="space-y-2">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200 dark:bg-neon-cyan-500/10 dark:border-neon-cyan-400/50">
                              <h4 className="font-medium text-green-800 dark:text-neon-cyan-300 mb-1 text-xs">Key Strengths</h4>
                              <div className="text-xs text-green-700 dark:text-gray-300">
                                {scoreResult.keyStrengths.length} key strengths identified
                              </div>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 dark:bg-orange-900/20 dark:border-orange-500/50">
                              <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-1 text-xs">Areas for Improvement</h4>
                              <div className="text-xs text-orange-700 dark:text-orange-400">
                                {scoreResult.improvementAreas.length} areas for improvement
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 16-Metric Breakdown */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200 dark:from-dark-200 dark:to-dark-300 dark:border-dark-400">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-indigo-600 dark:text-neon-purple-400" />
                        16-Metric Detailed Breakdown
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">Comprehensive analysis across all scoring criteria</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {scoreResult.breakdown.map((metric, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 dark:bg-dark-200 dark:border-dark-300">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{metric.name}</h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{metric.weight_pct}%</span>
                            </div>
                            <div className="flex items-center mb-2">
                              <span className={`text-lg font-bold ${getCategoryScoreColor(metric.score, metric.max_score)} dark:text-neon-cyan-400`}>
                                {metric.score}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">/{metric.max_score}</span>
                              <div className="ml-auto text-xs text-gray-600 dark:text-gray-400">
                                +{metric.contribution.toFixed(1)} pts
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2 dark:bg-dark-300">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  (metric.score / metric.max_score) >= 0.9 ? 'bg-green-500' :
                                  (metric.score / metric.max_score) >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${(metric.score / metric.max_score) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300">{metric.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Missing Keywords (JD-based only) */}
                  {scoringMode === 'jd_based' && scoreResult.missing_keywords.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-gray-200 dark:from-dark-200 dark:to-dark-300 dark:border-dark-400">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                          <Search className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                          Missing Keywords from Job Description
                        </h2>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {scoreResult.missing_keywords.map((keyword, index) => (
                            <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3 dark:bg-orange-900/20 dark:border-orange-500/50">
                              <span className="font-medium text-orange-800 dark:text-orange-300">{keyword}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-neon-cyan-500/10 dark:border-neon-cyan-400/50">
                          <p className="text-blue-800 dark:text-neon-cyan-300 text-sm">
                            💡 <strong>Tip:</strong> Add these keywords to your skills section, work experience bullets, or project descriptions to improve your ATS score.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actionable Fixes */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200 dark:from-dark-200 dark:to-dark-300 dark:border-dark-400">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-purple-600 dark:text-neon-purple-400" />
                        Actionable Fixes
                      </h2>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-3">
                        {scoreResult.actions.length > 0 ? (
                          scoreResult.actions.map((action, index) => (
                            <li key={index} className="flex items-start">
                              <ArrowRight className="w-5 h-5 text-purple-500 dark:text-neon-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{action}</span>
                            </li>
                          ))
                        ) : (
                          <p className="text-gray-600 dark:text-gray-300 italic">No specific recommendations at this time. Your resume looks great!</p>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Example Rewrites */}
                  {(scoreResult.example_rewrites.experience || scoreResult.example_rewrites.projects) && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
                      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 border-b border-gray-200 dark:from-dark-200 dark:to-dark-300 dark:border-dark-400">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-green-600 dark:text-neon-cyan-400" />
                          Example Rewrites
                        </h2>
                      </div>
                      <div className="p-6 space-y-6">
                        {scoreResult.example_rewrites.experience && (
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                              <Briefcase className="w-4 h-4 mr-2 text-blue-600 dark:text-neon-cyan-400" />
                              Work Experience Improvement
                            </h3>
                            <div className="space-y-3">
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-900/20 dark:border-red-500/50">
                                <div className="text-xs font-medium text-red-800 dark:text-red-300 mb-1">Before:</div>
                                <p className="text-sm text-red-700 dark:text-red-400">{scoreResult.example_rewrites.experience.original}</p>
                              </div>
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3 dark:bg-neon-cyan-500/10 dark:border-neon-cyan-400/50">
                                <div className="text-xs font-medium text-green-800 dark:text-neon-cyan-300 mb-1">After:</div>
                                <p className="text-sm text-green-700 dark:text-neon-cyan-400">{scoreResult.example_rewrites.experience.improved}</p>
                              </div>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-neon-blue-500/10 dark:border-neon-blue-400/50">
                                <div className="text-xs font-medium text-blue-800 dark:text-neon-blue-300 mb-1">Why this works:</div>
                                <p className="text-sm text-blue-700 dark:text-neon-blue-400">{scoreResult.example_rewrites.experience.explanation}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {scoreResult.example_rewrites.projects && (
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                              <Target className="w-4 h-4 mr-2 text-purple-600 dark:text-neon-purple-400" />
                              Project Description Improvement
                            </h3>
                            <div className="space-y-3">
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-900/20 dark:border-red-500/50">
                                <div className="text-xs font-medium text-red-800 dark:text-red-300 mb-1">Before:</div>
                                <p className="text-sm text-red-700 dark:text-red-400">{scoreResult.example_rewrites.projects.original}</p>
                              </div>
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3 dark:bg-neon-cyan-500/10 dark:border-neon-cyan-400/50">
                                <div className="text-xs font-medium text-green-800 dark:text-neon-cyan-300 mb-1">After:</div>
                                <p className="text-sm text-green-700 dark:text-neon-cyan-400">{scoreResult.example_rewrites.projects.improved}</p>
                              </div>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-neon-blue-500/10 dark:border-neon-blue-400/50">
                                <div className="text-xs font-medium text-blue-800 dark:text-neon-blue-300 mb-1">Why this works:</div>
                                <p className="text-sm text-blue-700 dark:text-neon-blue-400">{scoreResult.example_rewrites.projects.explanation}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Detailed Breakdown Section */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
                    <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 border-b border-gray-200 dark:from-dark-200 dark:to-dark-300 dark:border-dark-400">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-neon-cyan-400" />
                        Legacy Score Breakdown
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">Previous 9-category analysis for reference</p>
                    </div>
                    <div className="p-6">
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        <Info className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Legacy breakdown will be shown here for backward compatibility</p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations Section */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200 dark:from-dark-200 dark:to-dark-300 dark:border-dark-400">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-purple-600 dark:text-neon-purple-400" />
                        Actionable Recommendations
                      </h2>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-3">
                        {scoreResult.recommendations.length > 0 ? (
                          scoreResult.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start">
                              <ArrowRight className="w-5 h-5 text-purple-500 dark:text-neon-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                            </li>
                          ))
                        ) : (
                          <p className="text-gray-600 dark:text-gray-300 italic">No specific recommendations at this time. Your resume looks great!</p>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="text-center space-y-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
                    {/* Re-score CTA */}
                    <button
                      onClick={() => {
                        setScoreResult(null);
                        // Reset form but keep current mode
                      }}
                      className="w-full bg-gradient-to-r from-neon-cyan-500 to-neon-blue-500 hover:from-neon-cyan-400 hover:to-neon-blue-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-neon-cyan mb-4"
                    >
                      <RefreshCw className="w-5 h-5 inline mr-2" />
                      Apply these fixes → Re-score free within 24h
                    </button>
                    
                    <button
                      onClick={() => setScoreResult(null)}
                      className="bg-gradient-to-r from-neon-cyan-500 to-neon-blue-500 hover:from-neon-cyan-400 hover:to-neon-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 mr-4 shadow-neon-cyan"
                    >
                      Check Another Resume
                    </button>
                    <button
                      onClick={onNavigateBack}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 dark:bg-dark-300 dark:hover:bg-dark-400"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};