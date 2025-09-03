import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Video, 
  FileText, 
  Download,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
  Award,
  Search,
  Filter,
  Calendar,
  Bell,
  X,
  Sparkles,
} from 'lucide-react';

// Utility: cn (className joiner)
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// ModernButton Component (inline)
interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseClasses =
      "font-poppins font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-purple-600 text-white hover:scale-105 shadow-lg",
      secondary: "bg-white text-purple-700 hover:scale-105 shadow-md",
      outline: "border border-purple-500 text-purple-500 hover:bg-purple-50",
      ghost: "bg-transparent text-purple-700 hover:bg-purple-100",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

ModernButton.displayName = "ModernButton";

export const Tutorials: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Tutorials', count: 1 },
    { id: 'getting-started', name: 'Getting Started', count: 1 },
    { id: 'optimization', name: 'Optimization', count: 1 },
    { id: 'analysis', name: 'Analysis', count: 1 }
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with PrimoBoost AI',
      description: 'Learn the basics of uploading your resume and getting your first optimization.',
      duration: '5:30',
      difficulty: 'Beginner',
      category: 'getting-started',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
      views: '12.5K',
      rating: 4.9,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      isPopular: true
    },
    {
      id: 2,
      title: 'JD-Based Resume Optimization',
      description: 'Master the art of tailoring your resume to specific job descriptions.',
      duration: '8:45',
      difficulty: 'Intermediate',
      category: 'optimization',
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
      views: '8.2K',
      rating: 4.8,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      isPopular: false
    },
    {
      id: 3,
      title: 'Resume Score Analysis Deep Dive',
      description: 'Understand how our AI scores your resume and what each metric means.',
      duration: '6:20',
      difficulty: 'Beginner',
      category: 'analysis',
      thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
      views: '15.1K',
      rating: 4.9,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      isPopular: true
    }
  ];

  const guides = [
    {
      title: 'Complete Resume Optimization Guide',
      description: 'A comprehensive 50-page guide covering everything from basics to advanced techniques.',
      type: 'PDF Guide',
      pages: 50,
      downloads: '25K+',
      icon: <FileText className="w-6 h-6" />
    }
  ];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative dark:from-dark-50 dark:to-dark-200 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5B00F7] via-[#2E73FF] to-[#5B00F7]" />
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-32 right-32 w-60 h-60 bg-white/10 rounded-full blur-[150px]" />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Learn & Master <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B00F7] to-[#2E73FF]">
              Resume Optimization
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
            Watch our tutorial video to learn how to create the perfect resume and
            land your dream job with AI-powered optimization.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <ModernButton size="sm" className="bg-gradient-to-r from-[#5B00F7] to-[#2E73FF] text-white font-semibold px-6 py-4 rounded-xl flex items-center gap-3 hover:opacity-90 transition">
              <Play className="w-6 h-6" />
              Watch Video Tutorial
            </ModernButton>
            <ModernButton variant="secondary" size="sm" className="bg-[#FFD33D] text-black font-semibold px-6 py-4 rounded-xl flex items-center gap-3 hover:brightness-95 transition">
              <BookOpen className="w-6 h-6" />
              Free Resources
            </ModernButton>
          </div>
        </div>
      </section>

      {/* Video Tutorial */}
      {/* ... (keeping all your middle sections unchanged) ... */}

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Ready to Transform Your Career?
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-poppins">
            Ready to Start Learning?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-inter leading-relaxed">
            Join thousands of professionals who have transformed their careers with our tutorials.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <ModernButton size="lg" variant="secondary" className="group flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black shadow-2xl">
              Start Learning Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </ModernButton>
            <ModernButton variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
              Download Free Guide
            </ModernButton>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/50 rounded-full" />
              <span>Expert support included</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};



























f