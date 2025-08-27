// src/components/pages/Tutorials.tsx
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
  MessageCircle, // Added for LinkedIn tutorial
  Briefcase, // Added for job strategy
  User, // Added for general user
  ChevronDown // Added for select dropdown
} from 'lucide-react';
import { VideoModal } from '../VideoModal'; // Import the new VideoModal component

export const Tutorials: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  // Removed showOverlay state

  // NEW: State for VideoModal
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');


  const categories = [
    { id: 'all', name: 'All Tutorials', count: 0 }, // Count will be updated dynamically
    { id: 'getting-started', name: 'Getting Started', count: 0 },
    { id: 'tools-overview', name: 'Tools Overview', count: 0 },
    { id: 'job-strategy', name: 'Job Strategy', count: 0 },
    { id: 'advanced-strategy', name: 'Advanced Strategy', count: 0 },
    { id: 'linkedin-tips', name: 'LinkedIn Tips', count: 0 },
    { id: 'interview-prep', name: 'Interview Prep', count: 0 },
    { id: 'optimization', name: 'Optimization', count: 0 },
    { id: 'analysis', name: 'Analysis', count: 0 }
  ];

 const allTutorials = [
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
      // Updated videoUrl to a directly streamable MP4 from Cloudinary
      videoUrl: 'https://www.youtube.com/watch?v=x6AD2JsGafA',
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
      // Updated videoUrl to a directly streamable MP4 from Cloudinary
      videoUrl: 'https://res.cloudinary.com/dlkovvlud/video/upload/v1700000000/sample_video.mp4',
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
      // Updated videoUrl to a directly streamable MP4 from Cloudinary
      videoUrl: 'https://res.cloudinary.com/dlkovvlud/video/upload/v1700000000/sample_video.mp4',
      isPopular: true
    },
    // New Tutorials
    {
      id: 4,
      title: 'Mastering PrimoBoost AI: Your Four Essential Tools',
      description: 'A comprehensive guide on effectively utilizing the JD-Based Optimizer, Resume Score Check, Guided Resume Builder, and LinkedIn Message Generator.',
      duration: '10:15',
      difficulty: 'Beginner',
      category: 'tools-overview',
      thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
      views: '5.3K',
      rating: 4.7,
      // Updated videoUrl to a directly streamable MP4 from Cloudinary
      videoUrl: 'https://res.cloudinary.com/dlkovvlud/video/upload/v1700000000/sample_video.mp4',
      isPopular: false
    },
    {
      id: 5,
      title: 'Job Search Mastery: Strategies to Land Your Dream Role',
      description: 'Learn proven techniques for effective job searching, interview preparation, and career advancement.',
      duration: '12:00',
      difficulty: 'Intermediate',
      category: 'job-strategy',
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
      views: '7.8K',
      rating: 4.9,
      // Updated videoUrl to a directly streamable MP4 from Cloudinary
      videoUrl: 'https://res.cloudinary.com/dlkovvlud/video/upload/v1700000000/sample_video.mp4',
      isPopular: true
    },
    {
      id: 6,
      title: 'Cracking the Job Market: Combining AI Tools for Success',
      description: 'Discover how to integrate PrimoBoost AI\'s tools to create a powerful job application strategy and maximize your chances of success.',
      duration: '15:40',
      difficulty: 'Advanced',
      category: 'advanced-strategy',
      thumbnail: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=600',
      views: '6.1K',
      rating: 4.8,
      // Updated videoUrl to a directly streamable MP4 from Cloudinary
      videoUrl: 'https://res.cloudinary.com/dlkovvlud/video/upload/v1700000000/sample_video.mp4',
      isPopular: false
    },
    {
      id: 7,
      title: 'LinkedIn Profile Optimization: Stand Out to Recruiters',
      description: 'Tips and tricks to create a compelling LinkedIn profile that attracts recruiters and showcases your professional brand.',
      duration: '7:00',
      difficulty: 'Beginner',
      category: 'linkedin-tips',
      thumbnail: 'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=600',
      views: '9.5K',
      rating: 4.7,
      // Updated videoUrl to a directly streamable MP4 from Cloudinary
      videoUrl: 'https://res.cloudinary.com/dlkovvlud/video/upload/v1700000000/sample_video.mp4',
      isPopular: true
    },
    {
      id: 8,
      title: 'Ace Your Interviews with Confidence',
      description: 'Essential strategies for behavioral, technical, and situational interviews to help you land the job offer.',
      duration: '11:20',
      difficulty: 'Intermediate',
      category: 'interview-prep',
      thumbnail: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=600',
      views: '8.9K',
      rating: 4.9,
      // Updated videoUrl to a directly streamable MP4 from Cloudinary
      videoUrl: 'https://res.cloudinary.com/dlkovvlud/video/upload/v1700000000/sample_video.mp4',
      isPopular: false
    }
  ];


  // Dynamically update category counts
  const updatedCategories = categories.map(cat => {
    if (cat.id === 'all') {
      return { ...cat, count: allTutorials.length };
    }
    const count = allTutorials.filter(tutorial => tutorial.category === cat.id).length;
    return { ...cat, count };
  });

  const filteredTutorials = allTutorials.filter(tutorial => {
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

  // Select the first tutorial to display in the main video section
  const mainVideoTutorial = filteredTutorials.length > 0 ? filteredTutorials[0] : allTutorials[0];

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

  // NEW: Function to open the video modal
  const openVideoModal = (videoUrl: string, title: string) => {
    // Transform YouTube watch URL to embed URL
    const embedUrl = videoUrl.replace("watch?v=", "embed/");
    setCurrentVideoUrl(embedUrl);
    setCurrentVideoTitle(title);
    setIsVideoModalOpen(true);
  };

  // NEW: Function to close the video modal
  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl('');
    setCurrentVideoTitle('');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative dark:from-dark-50 dark:to-dark-200 transition-colors duration-300">
      {/* Main Content - Removed blur effect */}
      <div>
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-700 text-white dark:from-neon-purple-500 dark:to-neon-blue-500">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
          <div className="relative container mx-auto px-4 py-20 sm:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg dark:bg-neon-cyan-500/20 dark:shadow-neon-cyan">
                <Video className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Learn & Master
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent dark:from-neon-cyan-300 dark:to-neon-blue-300">
                  Resume Optimization
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-purple-100 dark:text-gray-200 mb-8 leading-relaxed">
                Watch our tutorial videos to learn how to create the perfect resume and land your dream job.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 dark:bg-neon-cyan-500/20 dark:border-neon-cyan-400/30">
                  <span className="text-lg font-semibold">🎥 Video Tutorials</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 dark:bg-neon-blue-500/20 dark:border-neon-blue-400/30">
                  <span className="text-lg font-semibold">📚 Free Resources</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Video Tutorial Section */}
        <div className="py-20 bg-white dark:bg-dark-100">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Featured Tutorial</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">Watch our top recommended guide to get started</p>
              </div>

              {mainVideoTutorial && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl">
                  <div className="aspect-w-16 aspect-h-9 relative">
                    {/* Placeholder for embedded video */}
                    <iframe
                      src={mainVideoTutorial.videoUrl.replace("watch?v=", "embed/")}
                      title={mainVideoTutorial.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mainVideoTutorial.difficulty)}`}>
                          {mainVideoTutorial.difficulty}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {mainVideoTutorial.duration}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < mainVideoTutorial.rating ? 'fill-current' : ''}`} />
                        ))}
                        <span className="ml-1 text-gray-700 dark:text-gray-300 font-medium">{mainVideoTutorial.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                      {mainVideoTutorial.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      {mainVideoTutorial.description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-800 text-sm font-medium flex items-center dark:bg-neon-cyan-500/10 dark:text-neon-cyan-300">
                        <Users className="w-4 h-4 mr-2" />
                        {mainVideoTutorial.views} views
                      </div>
                      <div className="bg-purple-50 px-4 py-2 rounded-lg text-purple-800 text-sm font-medium flex items-center dark:bg-neon-purple-500/10 dark:text-neon-purple-300">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {mainVideoTutorial.category.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </div>
                      <button // Changed from <a> to <button>
                        onClick={() => openVideoModal(mainVideoTutorial.videoUrl, mainVideoTutorial.title)}
                        className="bg-green-50 px-4 py-2 rounded-lg text-green-800 text-sm font-medium flex items-center dark:bg-neon-cyan-500/10 dark:text-neon-cyan-300 hover:bg-green-100 transition-colors"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Watch Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* All Tutorials Section */}
        <div className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-dark-200 dark:to-dark-300">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">All Tutorials</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">Browse our full library of guides and videos</p>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search tutorials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-200 dark:border-dark-300 dark:text-gray-100"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 pl-10 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-200 dark:border-dark-300 dark:text-gray-100"
                  >
                    {updatedCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.count})
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Tutorial Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTutorials.map((tutorial) => (
                  <div key={tutorial.id} className="group">
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:bg-dark-100 dark:border-dark-300 dark:hover:shadow-neon-cyan/20">
                      <div className="relative aspect-w-16 aspect-h-9 overflow-hidden rounded-t-2xl">
                        <img
                          src={tutorial.thumbnail}
                          alt={tutorial.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                            {tutorial.difficulty}
                          </span>
                          <span className="text-gray-500 text-sm flex items-center dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            {tutorial.duration}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{tutorial.title}</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">{tutorial.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < tutorial.rating ? 'fill-current' : ''}`} />
                            ))}
                            <span className="ml-1 text-gray-700 text-sm font-medium dark:text-gray-300">{tutorial.rating}</span>
                          </div>
                          <button // Changed from <a> to <button>
                            onClick={() => openVideoModal(tutorial.videoUrl, tutorial.title)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 dark:text-neon-cyan-400 dark:hover:text-neon-cyan-300"
                          >
                            <span>Watch Video</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredTutorials.length === 0 && (
                  <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">
                    <Search className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg">No tutorials found matching your criteria.</p>
                    <p className="text-sm">Try adjusting your search or filter options.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Free Resources */}
        <div className="py-20 bg-white dark:bg-dark-100">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Free Resources</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">Download our comprehensive guide</p>
              </div>

              <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
                {guides.map((guide, index) => (
                  <div key={index} className="group">
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 p-8 dark:bg-dark-100 dark:border-dark-300 dark:shadow-dark-xl dark:hover:shadow-neon-cyan/20">
                      <div className="text-center">
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 text-purple-600 dark:from-neon-purple-500/20 dark:to-neon-blue-500/20 dark:text-neon-purple-400 dark:shadow-neon-purple">
                          {guide.icon}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{guide.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{guide.description}</p>

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
        <div className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-dark-200 dark:to-dark-300">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recommended Learning Path</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">Follow this structured path for best results</p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Start with Basics',
                    description: 'Learn how to upload your resume and understand the optimization process',
                    duration: '15 minutes',
                    icon: <Lightbulb className="w-6 h-6" />
                  },
                  {
                    step: 2,
                    title: 'Master ATS Optimization',
                    description: 'Understand how ATS systems work and optimize your resume accordingly',
                    duration: '30 minutes',
                    icon: <Target className="w-6 h-6" />
                  },
                  {
                    step: 3,
                    title: 'Advanced Techniques',
                    description: 'Learn keyword optimization, formatting, and industry-specific tips',
                    duration: '45 minutes',
                    icon: <Zap className="w-6 h-6" />
                  },
                  {
                    step: 4,
                    title: 'Practice & Perfect',
                    description: 'Apply your knowledge and create multiple optimized versions',
                    duration: '60 minutes',
                    icon: <Award className="w-6 h-6" />
                  }
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
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{item.title}</h3>
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
        <div className="py-20 bg-gradient-to-r from-purple-600 to-blue-700 text-white dark:from-neon-purple-500 dark:to-neon-blue-500">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Start Learning?</h2>
              <p className="text-xl text-purple-100 dark:text-gray-200 mb-8">
                Join thousands of professionals who have transformed their careers with our tutorials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-purple-600 font-bold py-4 px-8 rounded-2xl hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 dark:bg-dark-100 dark:text-neon-purple-400 dark:hover:bg-dark-200 dark:shadow-neon-purple">
                  Start Learning Now
                </button>
                <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-2xl hover:bg-white hover:text-purple-600 transition-colors duration-300 dark:border-neon-cyan-400 dark:hover:bg-neon-cyan-400 dark:hover:text-dark-100">
                  Download Free Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: VideoModal component */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        videoUrl={currentVideoUrl}
        title={currentVideoTitle}
      />
    </div>
  );
};
