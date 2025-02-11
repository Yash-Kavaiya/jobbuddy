'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuestionCategory, generateInterviewQuestions } from '@/utils/gemini';
import { jsPDF } from 'jspdf';

export default function InterviewQuestions() {
  const [jobDescription, setJobDescription] = useState('');
  const [category, setCategory] = useState('technical');
  const [questions, setQuestions] = useState<QuestionCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const generatedQuestions = await generateInterviewQuestions(
        jobDescription,
        category
      );
      setQuestions(generatedQuestions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate questions';
      setError(`Error: ${errorMessage}. Please try again.`);
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const text = questions
      .map((cat) => {
        return `${cat.type.toUpperCase()} QUESTIONS:\n${cat.questions
          .map((q, i) => `${i + 1}. ${q.question}\n${q.hint ? `Hint: ${q.hint}\n` : ''}`)
          .join('\n')}`;
      })
      .join('\n\n');
    navigator.clipboard.writeText(text);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(16);
    doc.text('Interview Questions', 20, yPos);
    yPos += 10;

    questions.forEach((category) => {
      doc.setFontSize(14);
      yPos += 10;
      doc.text(`${category.type.toUpperCase()} QUESTIONS:`, 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      category.questions.forEach((q, i) => {
        const lines = doc.splitTextToSize(`${i + 1}. ${q.question}`, 170);
        lines.forEach((line: string) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 20, yPos);
          yPos += 7;
        });

        if (q.hint) {
          const hintLines = doc.splitTextToSize(`Hint: ${q.hint}`, 170);
          hintLines.forEach((line: string) => {
            if (yPos > 280) {
              doc.addPage();
              yPos = 20;
            }
            doc.text(line, 25, yPos);
            yPos += 7;
          });
        }
        yPos += 5;
      });
    });

    doc.save('interview-questions.pdf');
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
          Interview Question Generator
        </motion.h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Paste the job description here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="technical">Technical</option>
                  <option value="managerial">Managerial</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Generating...</span>
                  </>
                ) : (
                  'Generate Questions'
                )}
              </button>
            </div>

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

          {/* Results Section */}
          <motion.div 
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Generated Questions</h2>
              {questions.length > 0 && (
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
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                </div>
              )}
            </div>

            {questions.length > 0 ? (
              <div className="space-y-8 overflow-y-auto max-h-[600px] pr-4 -mr-4">
                {questions.map((category, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <h3 className="text-lg font-medium mb-4 text-gray-900 capitalize flex items-center gap-2">
                      {category.type} Questions
                      <span className="text-sm font-normal text-gray-500">({category.questions.length})</span>
                    </h3>
                    <div className="space-y-4">
                      {category.questions.map((q, j) => (
                        <motion.div 
                          key={j}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: (i * 0.1) + (j * 0.05) }}
                          className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all duration-200"
                        >
                          <p className="font-medium text-gray-900">{q.question}</p>
                          {q.hint && (
                            <p className="mt-2 text-sm text-gray-600 border-l-2 border-blue-500 pl-3">
                              {q.hint}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">Generated questions will appear here</p>
                <p className="text-sm mt-2">Enter a job description and click generate to start</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
