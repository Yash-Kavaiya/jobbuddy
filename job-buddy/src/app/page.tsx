'use client';
import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-white">
      {/* Refined Header */}
      <header className="relative bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900">
        <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-overlay opacity-5"></div>
        <nav className="container mx-auto px-6 py-5 flex justify-between items-center relative">
          <h1 className="text-2xl font-bold text-white tracking-tight">JobBuddy</h1>
          <div className="space-x-6">
            <a href="/login" className="text-blue-50 hover:text-white transition-colors duration-200">
              Login
            </a>
            <a href="/register" className="inline-flex items-center px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all duration-200 border border-white/20">
              Get Started
            </a>
          </div>
        </nav>
      </header>

      {/* Enhanced Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.15]"></div>
        <div className="container mx-auto px-6 py-32 text-center relative">
          <motion.h2 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-6xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-50 via-white to-blue-50"
          >
            Accelerate Your Career Growth
          </motion.h2>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            AI-powered tools to help you prepare, plan, and succeed in your career journey
          </p>
          <button className="group relative px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-white/20">
            <span className="relative z-10">Start Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Our Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Interview Question Generator",
                description: "Get personalized interview questions based on job descriptions using AI",
                icon: (
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                ),
                link: "/interview-questions"
              },
              {
                title: "Study Plan Generator",
                description: "Create customized study plans tailored to your goals and schedule",
                icon: (
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                link: "/study-plan"
              },
              {
                title: "Cover Letter Generator",
                description: "Generate tailored cover letters matching your resume with job descriptions",
                icon: (
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                link: "/cover-letter"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative">
                  <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <a href={feature.link} className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                    Try it now
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h5 className="text-lg font-semibold mb-6">JobBuddy</h5>
              <p className="text-gray-400 leading-relaxed">
                Empowering your career journey with AI-powered tools
              </p>
            </div>
            {[
              {
                title: "Features",
                links: [
                  { name: "Interview Questions", href: "/interview-questions" },
                  { name: "Study Plan", href: "/study-plan" },
                  { name: "Cover Letter", href: "/cover-letter" }
                ]
              },
              {
                title: "Resources",
                links: [
                  { name: "Blog", href: "/blog" },
                  { name: "Guides", href: "/guides" },
                  { name: "FAQ", href: "/faq" }
                ]
              },
              {
                title: "Contact",
                items: [
                  "support@jobbuddy.com",
                  "+1 (555) 123-4567"
                ]
              }
            ].map((section, index) => (
              <div key={index}>
                <h5 className="text-lg font-semibold mb-6">{section.title}</h5>
                <ul className="space-y-4">
                  {section.links ? (
                    section.links.map((link, i) => (
                      <li key={i}>
                        <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                          {link.name}
                        </a>
                      </li>
                    ))
                  ) : (
                    section.items.map((item, i) => (
                      <li key={i} className="text-gray-400">
                        {item}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 JobBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;