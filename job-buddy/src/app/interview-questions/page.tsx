'use client';

import { useState } from 'react';
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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Interview Question Generator</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Job Description:</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Paste the job description here..."
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Job Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="technical">Technical</option>
              <option value="managerial">Managerial</option>
              <option value="creative">Creative</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Generating...' : 'Generate Questions'}
          </button>

          {error && (
            <p className="mt-4 text-red-500">{error}</p>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Generated Questions</h2>
            {questions.length > 0 && (
              <div className="space-x-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Copy
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Download PDF
                </button>
              </div>
            )}
          </div>

          {questions.length > 0 ? (
            <div className="space-y-6">
              {questions.map((category, i) => (
                <div key={i}>
                  <h3 className="text-lg font-medium mb-2 capitalize">
                    {category.type} Questions
                  </h3>
                  <div className="space-y-4">
                    {category.questions.map((q, j) => (
                      <div key={j} className="bg-white p-4 rounded-lg">
                        <p className="font-medium">{q.question}</p>
                        {q.hint && (
                          <p className="mt-2 text-sm text-gray-600">
                            Hint: {q.hint}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Generated questions will appear here...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
