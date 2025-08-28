'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Background images for slideshow
  const backgroundImages = [
    'https://scontent.fpnh10-1.fna.fbcdn.net/v/t39.30808-6/481999772_966753138880356_4431833456804033463_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=asKJZLF6AV8Q7kNvwHYE2ba&_nc_oc=AdmVciOi1BcNeg5sZXo4W7vBMwe0aQWPx0z9ANUzKQhcv5pwQD0a8IiI4DjorotM4FA&_nc_zt=23&_nc_ht=scontent.fpnh10-1.fna&_nc_gid=6cWuDxJn87ouu0yykTvEHA&oh=00_AfUDao2qSBr3VU2yeBxrHVMyXbhtZFLNInFUxA_A1UeRkw&oe=68B58455',
    'https://scontent.fpnh10-1.fna.fbcdn.net/v/t39.30808-6/482033842_966758638879806_7394100411083961888_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=h1VYYJ9APxAQ7kNvwEvvvH4&_nc_oc=AdmE45GTMnWd5HJpF1hemRmNjOQqyLIPriI_VxhtHWU4GZYz8hM7MUa4OUHn1n0EWyg&_nc_zt=23&_nc_ht=scontent.fpnh10-1.fna&_nc_gid=k9Goo4lob_vzQz91Juzz7Q&oh=00_AfV0JRgOkJv8QWIVZZLtSh0PWS8o9ti3a0Ii7aYLk87Zgg&oe=68B5A25E',
    'https://images.unsplash.com/photo-1690982625154-5a1efe8c3da2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://scontent.fpnh10-1.fna.fbcdn.net/v/t39.30808-6/532966366_1081905060698496_7823454689841170356_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=soLMQ00foMMQ7kNvwGmkhjU&_nc_oc=AdnxBOm5uwue32lZvo1-MFmMs2rVEvdGRhiiJIE0qSVyKRzNfGXYPavZjwgJQ95b2k0&_nc_zt=23&_nc_ht=scontent.fpnh10-1.fna&_nc_gid=EHQTbRB9oOTLe1uH-z5DNw&oh=00_AfXyCDSNNFcB606vqaCNBJzhAfYkbuqbMIMwOIi-wzFmSw&oe=68B57D29',
    'https://scontent.fpnh10-1.fna.fbcdn.net/v/t39.30808-6/480979278_965390585683278_2212681294595256439_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=NLEvfS5y_rQQ7kNvwFKGtxW&_nc_oc=AdlldFsY7UcrMIOMx_M9nfBCeyK8yeIbzVH-p6eH4LwuzRawEQDpv97w51wCDkELRYA&_nc_zt=23&_nc_ht=scontent.fpnh10-1.fna&_nc_gid=0j4bt4K-imn4TphB3borrg&oh=00_AfUEf4WwqX-HZCPgNn13xZFPOqHlUzfEagwAagyw7F-_hw&oe=68B5968B',

  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-scroll through images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Quick-fire questions to test your reflexes and knowledge'
    },
    {
      icon: '🎯',
      title: 'Super Accurate',
      description: 'Precisely crafted questions with verified answers'
    },
    {
      icon: '🎮',
      title: 'Mega Fun',
      description: 'Gamified experience that makes learning enjoyable'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics'
    },
    {
      icon: '🏆',
      title: 'Achievements',
      description: 'Unlock badges and rewards as you progress'
    },
    {
      icon: '⏱️',
      title: 'Time Challenges',
      description: 'Race against time for an adrenaline rush'
    }
  ];

  const categories = [
    { name: 'Science', icon: '🧪', description: 'Biology, Chemistry, Physics and more' },
    { name: 'History', icon: '🏛️', description: 'World history, ancient civilizations' },
    { name: 'Technology', icon: '💻', description: 'Programming, AI, gadgets and innovation' },
    { name: 'Sports', icon: '⚽', description: 'Football, basketball, Olympics and more' },
    { name: 'Literature', icon: '📚', description: 'Classic novels, poetry and authors' },
    { name: 'Geography', icon: '🌍', description: 'Countries, capitals, landmarks' }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Questions' },
    { number: '100+', label: 'Categories' },
    { number: '95%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="font-sans min-h-screen">
      {/* Header - Clean Minimalist Design */}
      <header className="bg-white/95 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
              <Image 
                src="/logo (2).png" 
                alt="Hat rean Logo" 
                width={40} 
                height={40} 
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Hat rean</h1>
              <p className="text-xs text-gray-500 -mt-1">Learn • Test • Excel</p>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
            <a href="#categories" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Categories</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">About</a>
          </nav>
          
          <div className="hidden md:flex items-center gap-3">
            <Link href="/loginpage">
              <button className="px-6 py-2.5 text-gray-700 font-semibold hover:text-blue-600 transition-colors">
                Login
              </button>
            </Link>
            <Link href="/signuppage">
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-gray-600 hover:text-blue-600 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg shadow-lg border-t border-gray-200/50">
            <nav className="flex flex-col items-center gap-4 py-6 px-6">
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors py-2 w-full text-center" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#categories" className="text-gray-600 hover:text-blue-600 font-medium transition-colors py-2 w-full text-center" onClick={() => setIsMenuOpen(false)}>Categories</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors py-2 w-full text-center" onClick={() => setIsMenuOpen(false)}>About</a>
              <div className="flex flex-col items-center gap-4 mt-4 w-full">
                <Link href="/loginpage" className="w-full">
                  <button className="w-full px-6 py-3 text-gray-700 font-semibold hover:text-blue-600 transition-colors border border-gray-200 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </button>
                </Link>
                <Link href="/signuppage" className="w-full">
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl min-h-[48px] touch-manipulation" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with Background Image Slideshow */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Slideshow with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/70 to-indigo-900/80 z-10"></div>
          
          {/* Multiple Background Images with Smooth Transitions */}
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-2000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url('${image}')`
              }}
            ></div>
          ))}
          
          {/* Sliding Animation Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform translate-x-full animate-pulse opacity-20"></div>
        </div>
        
        {/* Image Navigation Dots */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2 sm:space-x-3">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 touch-manipulation ${
                index === currentImageIndex 
                  ? 'bg-yellow-400 scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? backgroundImages.length - 1 : currentImageIndex - 1)}
          className="absolute left-3 sm:left-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full p-2 sm:p-3 transition-all duration-300 group touch-manipulation"
          aria-label="Previous image"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white group-hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => setCurrentImageIndex(currentImageIndex === backgroundImages.length - 1 ? 0 : currentImageIndex + 1)}
          className="absolute right-3 sm:right-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full p-2 sm:p-3 transition-all duration-300 group touch-manipulation"
          aria-label="Next image"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white group-hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 text-center text-white">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="block text-white drop-shadow-2xl">Welcome to</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                Hat rean
              </span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 text-gray-100 drop-shadow-lg">The Ultimate Quiz Experience 🧠✨</p>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed drop-shadow-md px-4">
              Challenge yourself with thousands of questions across multiple categories. 
              Test your knowledge, compete with friends, and learn something new every day!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-20 px-4">
            <Link href="/homepage">
              <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-bold text-lg sm:text-xl hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-2xl hover:shadow-yellow-500/25 min-h-[56px] touch-manipulation">
                Start Your Journey 🚀
              </button>
            </Link>
            <Link href="/quiz">
              <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg sm:text-xl hover:bg-white/30 transition-all transform hover:scale-105 shadow-2xl min-h-[56px] touch-manipulation">
                Take Quiz Now 🎯
              </button>
            </Link>
          </div>

          {/* Stats with Glass Effect */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 px-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">
                <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-1 sm:mb-2 drop-shadow-lg">{stat.number}</div>
                <div className="text-gray-200 font-medium text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </section>

      {/* Features Section with Background */}
      <section id="features" className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/85 to-indigo-900/90 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
            }}
          ></div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl px-4">Why Choose Hat rean?</h3>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 drop-shadow-lg px-4">Discover what makes our quiz platform special</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-xl hover:shadow-2xl hover:scale-105">
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h4 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">{feature.title}</h4>
                <p className="text-gray-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section with Background */}
      <section id="categories" className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-teal-900/85 to-cyan-900/90 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2028&q=80')`
            }}
          ></div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">Explore Categories 📚</h3>
            <p className="text-xl md:text-2xl text-gray-200 drop-shadow-lg">Choose from a wide variety of topics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:bg-white/25 transition-all duration-300 cursor-pointer group border border-white/20 hover:scale-105">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                <h4 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">{category.name}</h4>
                <p className="text-gray-200">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works with Enhanced Background */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/95 via-pink-900/90 to-red-900/95 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
            }}
          ></div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-white">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl">How It Works</h3>
            <p className="text-xl md:text-2xl opacity-90 drop-shadow-lg">Get started in 3 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mx-auto mb-8 border border-white/30 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">1️⃣</span>
              </div>
              <h4 className="text-3xl font-bold mb-6 drop-shadow-lg">Sign Up</h4>
              <p className="opacity-90 text-lg leading-relaxed">Create your free account and choose your preferences</p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mx-auto mb-8 border border-white/30 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">2️⃣</span>
              </div>
              <h4 className="text-3xl font-bold mb-6 drop-shadow-lg">Choose Category</h4>
              <p className="opacity-90 text-lg leading-relaxed">Pick from hundreds of categories or try mixed mode</p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mx-auto mb-8 border border-white/30 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">3️⃣</span>
              </div>
              <h4 className="text-3xl font-bold mb-6 drop-shadow-lg">Start Playing</h4>
              <p className="opacity-90 text-lg leading-relaxed">Answer questions, earn points, and climb the leaderboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Background */}
      <section id="about" className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/90 to-zinc-900/95 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
            }}
          ></div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h3 className="text-4xl md:text-6xl font-bold mb-8 drop-shadow-2xl">About Hat rean</h3>
              <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-lg">
                Hat rean is more than just a quiz platform - it&apos;s a community of curious minds passionate about learning. 
                Founded with the mission to make education fun and accessible, we&apos;ve created an engaging environment where 
                knowledge meets entertainment.
              </p>
              <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed drop-shadow-lg">
                Whether you&apos;re a student looking to test your knowledge, a teacher seeking interactive content, or 
                someone who simply loves trivia, Hat rean has something for everyone.
              </p>
              <div className="flex gap-6">
                <Link href="/signuppage">
                  <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-2xl">
                    Join Us Today
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
              <div className="text-8xl mb-8">🎓</div>
              <h4 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">Learning Made Fun</h4>
              <p className="text-gray-200 text-lg leading-relaxed">Join thousands of users who are already expanding their knowledge with Hat rean</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation with Background */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/95 via-purple-900/90 to-pink-900/95 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-25"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')`
            }}
          ></div>
        </div>
        
        <div className="relative z-20 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-2xl">Explore Hat rean</h3>
            <p className="text-xl text-gray-200 drop-shadow-lg">Quick access to all platform features</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <Link href="/quiz" className="group">
              <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white/25 transition-all duration-300 group-hover:scale-105 border border-white/20 shadow-2xl">
                <div className="text-5xl mb-6">🎯</div>
                <h4 className="font-bold text-white mb-3 text-lg drop-shadow-lg">Take Quiz</h4>
                <p className="text-sm text-gray-200">Start testing your knowledge</p>
              </div>
            </Link>
            
            <Link href="/admin/leaderboard" className="group">
              <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white/25 transition-all duration-300 group-hover:scale-105 border border-white/20 shadow-2xl">
                <div className="text-5xl mb-6">🏆</div>
                <h4 className="font-bold text-white mb-3 text-lg drop-shadow-lg">Leaderboard</h4>
                <p className="text-sm text-gray-200">See top performers</p>
              </div>
            </Link>
            
            <Link href="/admin" className="group">
              <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white/25 transition-all duration-300 group-hover:scale-105 border border-white/20 shadow-2xl">
                <div className="text-5xl mb-6">⚙️</div>
                <h4 className="font-bold text-white mb-3 text-lg drop-shadow-lg">Admin Panel</h4>
                <p className="text-sm text-gray-200">Manage questions</p>
              </div>
            </Link>
            
            <Link href="/homepage" className="group">
              <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 text-center hover:bg-white/25 transition-all duration-300 group-hover:scale-105 border border-white/20 shadow-2xl">
                <div className="text-5xl mb-6">🏠</div>
                <h4 className="font-bold text-white mb-3 text-lg drop-shadow-lg">Dashboard</h4>
                <p className="text-sm text-gray-200">Your home base</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section with Background */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/95 via-blue-900/90 to-purple-900/95 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
            }}
          ></div>
        </div>
        
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white">
          <h3 className="text-4xl md:text-6xl font-bold mb-8 drop-shadow-2xl">Ready to Test Your Knowledge?</h3>
          <p className="text-xl md:text-2xl mb-16 drop-shadow-lg leading-relaxed">
            Join the Hat rean community and start your learning adventure today!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signuppage">
              <button className="px-12 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-bold text-xl hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-2xl hover:shadow-yellow-500/25">
                Get Started Free 🚀
              </button>
            </Link>
            <Link href="/loginpage">
              <button className="px-12 py-5 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-xl hover:bg-white/30 transition-all transform hover:scale-105 shadow-2xl">
                Already a Member?
              </button>
            </Link>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Footer with Background */}
      <footer id="contact" className="relative bg-black text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/98 via-black/95 to-gray-900/98 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
            }}
          ></div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center overflow-hidden shadow-2xl">
                  <Image 
                    src="/logo (2).png" 
                    alt="Hat rean Logo" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                  />
                </div>
                <h4 className="text-3xl font-bold drop-shadow-lg">Hat rean</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Making learning fun and accessible for everyone, everywhere.
              </p>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-6 text-yellow-400 drop-shadow-lg">Platform</h5>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#features" className="hover:text-yellow-400 transition-colors duration-300">Features</Link></li>
                <li><Link href="#categories" className="hover:text-yellow-400 transition-colors duration-300">Categories</Link></li>
                <li><Link href="/leaderboard" className="hover:text-yellow-400 transition-colors duration-300">Leaderboard</Link></li>
                <li><Link href="/admin" className="hover:text-yellow-400 transition-colors duration-300">Admin Panel</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-6 text-yellow-400 drop-shadow-lg">Account</h5>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/loginpage" className="hover:text-yellow-400 transition-colors duration-300">Login</Link></li>
                <li><Link href="/signuppage" className="hover:text-yellow-400 transition-colors duration-300">Sign Up</Link></li>
                <li><Link href="/homepage" className="hover:text-yellow-400 transition-colors duration-300">Dashboard</Link></li>
                <li><Link href="/admin" className="hover:text-yellow-400 transition-colors duration-300">Admin Panel</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-6 text-yellow-400 drop-shadow-lg">Contact</h5>
              <ul className="space-y-3 text-gray-300">
                <li>📧 support@hatrean.com</li>
                <li>📱 +855 11981289</li>
                <li>🌐 www.hatrean.com</li>
                <li>📍 Phnom Srouch, Kirirom</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}