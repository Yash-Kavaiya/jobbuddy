'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { StudyPlan } from '@/utils/studyPlanGenerator';

const timeOptions = [
  { value: '1_hour', label: '1 hour per day' },
  { value: '2_hours', label: '2 hours per day' },
  { value: '3_hours', label: '3 hours per day' },
  { value: '4_hours', label: '4 hours per day' },
  { value: '5_plus_hours', label: '5+ hours per day' },
  { value: 'weekends', label: 'Weekends only' },
  { value: 'flexible', label: 'Flexible schedule' },
];

const topicOptions = [
  { value: 'web_development', label: 'Web Development' },
  { value: 'mobile_development', label: 'Mobile Development' },
  { value: 'data_science', label: 'Data Science' },
  { value: 'cloud_computing', label: 'Cloud Computing' },
  { value: 'devops', label: 'DevOps' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'ai_ml', label: 'AI/Machine Learning' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'ui_ux', label: 'UI/UX Design' },
  { value: 'other', label: 'Other' },
];

// Dynamically import icons with fallback
const Download = dynamic(() => import('lucide-react').then((mod) => mod.Download), {
  ssr: false,
  loading: () => <span>↓</span>,
});

const Copy = dynamic(() => import('lucide-react').then((mod) => mod.Copy), {
  ssr: false,
  loading: () => <span>📋</span>,
});

const RefreshCw = dynamic(() => import('lucide-react').then((mod) => mod.RefreshCw), {
  ssr: false,
  loading: () => <span>⟳</span>,
});

interface StudyPlanForm {
  goals: string;
  jobDescription: string;
  availableTime: string;
  topics: string;
  learningStyle: string;
  currentLevel: string;
}

export default function StudyPlan() {
  const [formData, setFormData] = useState<StudyPlanForm>({
    goals: '',
    jobDescription: '',
    availableTime: '',
    topics: '',
    learningStyle: 'videos',
    currentLevel: 'beginner'
  });
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    try {
      // Validate form data before submission
      if (!formData.goals.trim() || !formData.jobDescription.trim() || !formData.availableTime || !formData.topics) {
        throw new Error('Please fill in all required fields');
      }

      const response = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Enhanced error handling
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to generate study plan');
      }

      // Validate response data structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format received');
      }

      if (!Array.isArray(data.weeklySchedule)) {
        throw new Error('Invalid study plan format: missing weekly schedule');
      }

      // Validate weekly schedule format
      const isValidSchedule = data.weeklySchedule.every((week: any) => 
        week && 
        typeof week.week === 'number' && 
        Array.isArray(week.topics)
      );

      if (!isValidSchedule) {
        throw new Error('Invalid study plan format: malformed weekly schedule');
      }

      setStudyPlan(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate study plan';
      setError(`Error: ${errorMessage}`);
      console.error('Study plan generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (studyPlan) {
      await navigator.clipboard.writeText(JSON.stringify(studyPlan, null, 2));
    }
  };

  const handleDownload = () => {
    if (studyPlan) {
      const blob = new Blob([JSON.stringify(studyPlan, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'study-plan.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
        >
          Personalized Study Plan Generator
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="space-y-6"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Career Goals</label>
                  <textarea
                    value={formData.goals}
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                    className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="What are your career objectives?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                  <textarea
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                    className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Paste the job description you're targeting"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Time</label>
                    <select
                      value={formData.availableTime}
                      onChange={(e) => setFormData({...formData, availableTime: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select available time</option>
                      {timeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Topics</label>
                    <select
                      value={formData.topics}
                      onChange={(e) => setFormData({...formData, topics: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select primary topic</option>
                      {topicOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Learning Style</label>
                    <select
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={formData.learningStyle}
                      onChange={(e) => setFormData({...formData, learningStyle: e.target.value})}
                    >
                      <option value="videos">Videos</option>
                      <option value="reading">Reading</option>
                      <option value="hands-on">Hands-on</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Level</label>
                    <select
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={formData.currentLevel}
                      onChange={(e) => setFormData({...formData, currentLevel: e.target.value})}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Generating Plan...</span>
                  </>
                ) : (
                  'Generate Study Plan'
                )}
              </button>
            </form>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Study Plan Display Section */}
          <motion.div
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Study Plan</h2>
              {studyPlan && (
                <div className="flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </button>
                </div>
              )}
            </div>

            {studyPlan ? (
              <div className="space-y-6 overflow-y-auto max-h-[600px] pr-4 -mr-4">
                {studyPlan.weeklySchedule.map((week, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <h3 className="text-lg font-medium mb-3 text-gray-900">Week {week.week}</h3>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Topics:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {week.topics.map((topic, i) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-lg">Your study plan will appear here</p>
                <p className="text-sm mt-2">Fill out the form and click generate to create your plan</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
