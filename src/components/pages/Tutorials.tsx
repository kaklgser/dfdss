



import React, { useState } from 'react';
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  FileText,
  Download,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
  Award,
  Sparkles
} from 'lucide-react';
import { motion } from "framer-motion";


// Utility: cn (className joiner)
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// ModernButton Component (inline)
interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClasses =
      'font-poppins font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-purple-600 text-white hover:scale-105 shadow-lg',
      secondary: 'bg-white text-purple-700 hover:scale-105 shadow-md',
      outline: 'border border-purple-500 text-purple-500 hover:bg-purple-50',
      ghost: 'bg-transparent text-purple-700 hover:bg-purple-100',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
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

ModernButton.displayName = 'ModernButton';

export const Tutorials: React.FC = () => {
  // Keeping state in case you expand filters/search later
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Guides (used in Free Resources)
  const guides = [
    {
      title: 'Complete Resume Optimization Guide',
      description:
        'A comprehensive 50-page guide covering everything from basics to advanced techniques.',
      type: 'PDF Guide',
      pages: 50,
      downloads: '25K+',
      icon: <FileText className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative dark:from-dark-50 dark:to-dark-200 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5B00F7] via-[#2E73FF] to-[#5B00F7]" />
        {/* Decorative wave/blur effects */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-32 right-32 w-60 h-60 bg-white/10 rounded-full blur-[150px]" />

        {/* Content */}
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
            <ModernButton
              size="sm"
              className="bg-gradient-to-r from-[#5B00F7] to-[#2E73FF] text-white font-semibold px-6 py-4 rounded-xl flex items-center gap-3 hover:opacity-90 transition"
            >
              <Play className="w-6 h-6" />
              Watch Video Tutorial
            </ModernButton>

            <ModernButton
              variant="secondary"
              size="sm"
              className="bg-[#FFD33D] text-black font-semibold px-6 py-4 rounded-xl flex items-center gap-3 hover:brightness-95 transition"
            >
              <BookOpen className="w-6 h-6" />
              Free Resources
            </ModernButton>
          </div>
        </div>
      </section>

      {/* Video Tutorial */}
      <div className="py-20 bg-white dark:bg-dark-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Video Tutorial
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Learn how to use PrimoBoost AI to optimize your resume
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
              <div className="aspect-w-16 aspect-h-9 relative">
                <div className="w-full h-0 pb-[56.25%] relative bg-gray-200 dark:bg-dark-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-neon-cyan-500/20 dark:shadow-neon-cyan">
                        <Play className="w-10 h-10 text-gray-600 dark:text-neon-cyan-400 ml-1" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">
                        Click to play tutorial video
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium dark:bg-neon-cyan-500/20 dark:text-neon-cyan-300">
                      Beginner
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      5:30
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <span className="ml-1 text-gray-700 dark:text-gray-300 font-medium">4.9</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Getting Started with PrimoBoost AI
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  In this comprehensive tutorial, you'll learn how to upload your resume, optimize it
                  for specific job descriptions, and export it in various formats. We'll cover all
                  the essential features of PrimoBoost AI to help you create a resume that stands
                  out to both ATS systems and human recruiters.
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-800 text-sm font-medium flex items-center dark:bg-neon-cyan-500/10 dark:text-neon-cyan-300">
                    <Users className="w-4 h-4 mr-2" />
                    12.5K views
                  </div>
                  <div className="bg-purple-50 px-4 py-2 rounded-lg text-purple-800 text-sm font-medium flex items-center dark:bg-neon-purple-500/10 dark:text-neon-purple-300">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Beginner friendly
                  </div>
                  <div className="bg-green-50 px-4 py-2 rounded-lg text-green-800 text-sm font-medium flex items-center dark:bg-neon-cyan-500/10 dark:text-neon-cyan-300">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Updated for 2025
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Free Resources */}
      <div className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-dark-200 dark:to-dark-300">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Free Resources
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Download our comprehensive guide
              </p>
            </div>

            <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
              {guides.map((guide, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 p-8 dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl dark:hover:shadow-neon-cyan/20">
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 text-purple-600 dark:from-neon-purple-500/20 dark:to-neon-blue-500/20 dark:text-neon-purple-400 dark:shadow-neon-purple">
                        {guide.icon}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        {guide.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {guide.description}
                      </p>

                      <div className="flex justify-center space-x-6 mb-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{guide.pages} pages</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{guide.downloads}</span>
                        </div>
                      </div>

                      <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl dark:from-neon-purple-500 dark:to-neon-blue-500 dark:hover:from-neon-purple-400 dark:hover:to-neon-blue-400 dark:shadow-neon-purple">
                        <Download className="w-5 h-5" />
                        <span>Download Free</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <div className="py-20 bg-white dark:bg-dark-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Recommended Learning Path
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Follow this structured path for best results
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: 'Start with Basics',
                  description:
                    'Learn how to upload your resume and understand the optimization process',
                  duration: '15 minutes',
                  icon: <Lightbulb className="w-6 h-6" />,
                },
                {
                  step: 2,
                  title: 'Master ATS Optimization',
                  description:
                    'Understand how ATS systems work and optimize your resume accordingly',
                  duration: '30 minutes',
                  icon: <Target className="w-6 h-6" />,
                },
                {
                  step: 3,
                  title: 'Advanced Techniques',
                  description:
                    'Learn keyword optimization, formatting, and industry-specific tips',
                  duration: '45 minutes',
                  icon: <Zap className="w-6 h-6" />,
                },
                {
                  step: 4,
                  title: 'Practice & Perfect',
                  description:
                    'Apply your knowledge and create multiple optimized versions',
                  duration: '60 minutes',
                  icon: <Award className="w-6 h-6" />,
                },
              ].map((item, index) => (
                <div key={index} className="group">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 dark:from-dark-200 dark:to-dark-300 dark:border-dark-400 dark:hover:shadow-neon-cyan/20">
                    <div className="flex items-center space-x-6">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 dark:from-neon-purple-500 dark:to-neon-blue-500 dark:shadow-neon-purple">
                        {item.step}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="text-purple-600 dark:text-neon-purple-400">
                            {item.icon}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {item.title}
                          </h3>
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium dark:bg-neon-purple-500/20 dark:text-neon-purple-300">
                            {item.duration}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                      </div>

                      <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors dark:text-gray-500 dark:group-hover:text-neon-purple-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 relative overflow-hidden">
        {/* Background Elements */}
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
            <ModernButton
              size="lg"
              variant="secondary"
              className="group flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black shadow-2xl"
            >
              Start Learning Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </ModernButton>

            <ModernButton
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
            >
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















