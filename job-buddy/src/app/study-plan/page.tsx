'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { LucideIcon } from 'lucide-react';
import { StudyPlan } from '@/utils/studyPlanGenerator';

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
      const response = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to generate study plan');
      }

      if (!data?.weeklySchedule) {
        throw new Error('Invalid study plan format received');
      }

      setStudyPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate study plan. Please try again.');
      console.error('Study plan error:', err);
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
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Personalized Study Plan Generator</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Career Goals:</label>
          <textarea 
            value={formData.goals}
            onChange={(e) => setFormData({...formData, goals: e.target.value})}
            className="w-full p-2 border rounded min-h-[100px]"
            placeholder="What are your career objectives?"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Job Description:</label>
          <textarea 
            value={formData.jobDescription}
            onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
            className="w-full p-2 border rounded min-h-[100px]"
            placeholder="Paste the job description you're targeting"
          />
        </div>

        <div>
          <label className="block font-medium">Study Goals:</label>
          <input 
            type="text" 
            placeholder="Enter your study goals" 
            className="w-full p-2 border rounded" 
            value={formData.goals}
            onChange={(e) => setFormData({...formData, goals: e.target.value})}
          />
        </div>
        <div>
          <label className="block font-medium">Available Time (per day/week):</label>
          <input 
            type="text" 
            placeholder="e.g., 2 hours per day" 
            className="w-full p-2 border rounded" 
            value={formData.availableTime}
            onChange={(e) => setFormData({...formData, availableTime: e.target.value})}
          />
        </div>
        <div>
          <label className="block font-medium">Topics of Interest:</label>
          <input 
            type="text" 
            placeholder="e.g., React, Node.js" 
            className="w-full p-2 border rounded" 
            value={formData.topics}
            onChange={(e) => setFormData({...formData, topics: e.target.value})}
          />
        </div>
        <div>
          <label className="block font-medium">Learning Style:</label>
          <select 
            className="w-full p-2 border rounded"
            value={formData.learningStyle}
            onChange={(e) => setFormData({...formData, learningStyle: e.target.value})}
          >
            <option value="videos">Videos</option>
            <option value="reading">Reading</option>
            <option value="hands-on">Hands-on</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Current Proficiency Level:</label>
          <select 
            value={formData.currentLevel}
            onChange={(e) => setFormData({...formData, currentLevel: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="px-6 py-2 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50"
          disabled={isGenerating}
        >
          {isGenerating ? <RefreshCw className="animate-spin" /> : 'Generate Study Plan'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-500 rounded">
          {error}
        </div>
      )}

      {studyPlan && (
        <div className="mt-8 border p-6 rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Personalized Study Plan</h2>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="p-2 hover:bg-gray-100 rounded-full">
                <Copy size={20} />
              </button>
              <button onClick={handleDownload} className="p-2 hover:bg-gray-100 rounded-full">
                <Download size={20} />
              </button>
            </div>
          </div>
          <div className="prose max-w-none">
            {studyPlan.weeklySchedule.map((week, index) => (
              <div key={index} className="mb-6">
                <h3>Week {week.week}</h3>
                <h4>Topics:</h4>
                <ul>
                  {week.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
                {/* Add more structured content display */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
