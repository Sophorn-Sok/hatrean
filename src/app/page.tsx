'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
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
      icon: '�',
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
    <div className="font-sans min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center overflow-hidden">
              <Image 
                src="/logo (2).png" 
                alt="Hat rean Logo" 
                width={32} 
                height={32} 
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-purple-700">Hat rean</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/loginpage">
              <button className="px-6 py-2 border border-purple-300 text-purple-700 rounded-full hover:bg-purple-50 transition-colors">
                Login
              </button>
            </Link>
            <Link href="/signuppage">
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="mb-8">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-6">
            Welcome to Hat rean
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-4">The Ultimate Quiz Experience 🧠✨</p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-12">
            Challenge yourself with thousands of questions across multiple categories. 
            Test your knowledge, compete with friends, and learn something new every day!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/homepage">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
              Start Your Journey 🚀
            </button>
          </Link>
          <Link href="/quiz">
            <button className="px-8 py-4 border-2 border-purple-300 text-purple-700 rounded-2xl font-semibold text-lg hover:bg-purple-50 transition-colors">
              Take Quiz Now 🎯
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Why Choose Hat rean?</h3>
            <p className="text-xl text-gray-600">Discover what makes our quiz platform special</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Explore Categories 📚</h3>
            <p className="text-xl text-gray-600">Choose from a wide variety of topics</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
                <h4 className="text-2xl font-bold text-gray-800 mb-3">{category.name}</h4>
                <p className="text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h3>
            <p className="text-xl opacity-90">Get started in 3 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h4 className="text-2xl font-bold mb-4">Sign Up</h4>
              <p className="opacity-90">Create your free account and choose your preferences</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h4 className="text-2xl font-bold mb-4">Choose Category</h4>
              <p className="opacity-90">Pick from hundreds of categories or try mixed mode</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h4 className="text-2xl font-bold mb-4">Start Playing</h4>
              <p className="opacity-90">Answer questions, earn points, and climb the leaderboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">About Hat rean</h3>
              <p className="text-lg text-gray-600 mb-6">
                Hat rean is more than just a quiz platform - it&apos;s a community of curious minds passionate about learning. 
                Founded with the mission to make education fun and accessible, we&apos;ve created an engaging environment where 
                knowledge meets entertainment.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Whether you&apos;re a student looking to test your knowledge, a teacher seeking interactive content, or 
                someone who simply loves trivia, Hat rean has something for everyone.
              </p>
              <div className="flex gap-4">
                <Link href="/signuppage">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
                    Join Us Today
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12 text-center">
              <div className="text-8xl mb-6">🎓</div>
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Learning Made Fun</h4>
              <p className="text-gray-600">Join thousands of users who are already expanding their knowledge with Hat rean</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Explore Hat rean</h3>
            <p className="text-gray-600">Quick access to all platform features</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Link href="/quiz" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all group-hover:scale-105">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="font-bold text-gray-800 mb-2">Take Quiz</h4>
                <p className="text-sm text-gray-600">Start testing your knowledge</p>
              </div>
            </Link>
            
            <Link href="/admin/leaderboard" className="group">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all group-hover:scale-105">
                <div className="text-4xl mb-4">🏆</div>
                <h4 className="font-bold text-gray-800 mb-2">Leaderboard</h4>
                <p className="text-sm text-gray-600">See top performers</p>
              </div>
            </Link>
            
            <Link href="/admin" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all group-hover:scale-105">
                <div className="text-4xl mb-4">⚙️</div>
                <h4 className="font-bold text-gray-800 mb-2">Admin Panel</h4>
                <p className="text-sm text-gray-600">Manage questions</p>
              </div>
            </Link>
            
            <Link href="/homepage" className="group">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all group-hover:scale-105">
                <div className="text-4xl mb-4">🏠</div>
                <h4 className="font-bold text-gray-800 mb-2">Dashboard</h4>
                <p className="text-sm text-gray-600">Your home base</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Ready to Test Your Knowledge?</h3>
          <p className="text-xl text-gray-600 mb-12">
            Join the Hat rean community and start your learning adventure today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signuppage">
              <button className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
                Get Started Free �
              </button>
            </Link>
            <Link href="/loginpage">
              <button className="px-10 py-4 border-2 border-purple-300 text-purple-700 rounded-2xl font-semibold text-lg hover:bg-purple-50 transition-colors">
                Already a Member?
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/logo (2).png" 
                    alt="Hat rean Logo" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                  />
                </div>
                <h4 className="text-2xl font-bold">Hat rean</h4>
              </div>
              <p className="text-gray-400">
                Making learning fun and accessible for everyone, everywhere.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#categories" className="hover:text-white transition-colors">Categories</Link></li>
                <li><Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Account</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/loginpage" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/signuppage" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link href="/homepage" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-gray-400">
                <li>📧 support@hatrean.com</li>
                <li>📱 +1 (555) 123-4567</li>
                <li>🌐 www.hatrean.com</li>
                <li>📍 San Francisco, CA</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Hat rean. All rights reserved. Made with ❤️ for learners everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
