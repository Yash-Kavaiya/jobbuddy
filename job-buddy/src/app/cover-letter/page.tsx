'use client';

import { useState } from 'react';
import { CoverLetterForm } from '@/components/CoverLetterForm';
import { Button } from '@/components/ui/button';  // This should now work correctly
import { Loader2 } from 'lucide-react';

export default function CoverLetter() {
  const [isLoading, setIsLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const handleFormSubmit = async (data: { resume: File; jobDescription: string }) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to process resume and job description
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        body: JSON.stringify({ jobDescription: data.jobDescription }),
      });
      
      const result = await response.json();
      setCoverLetter(result.coverLetter);
    } catch (error) {
      console.error('Error generating cover letter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Cover Letter Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <CoverLetterForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Preview</h2>
            {coverLetter && (
              <div className="space-x-2">
                <Button onClick={handleCopyToClipboard} variant="outline">
                  Copy to Clipboard
                </Button>
                <Button onClick={() => window.print()} variant="outline">
                  Download PDF
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div 
              className="prose prose-sm max-w-none min-h-[400px] p-4 border rounded-md"
              contentEditable
              suppressContentEditableWarning
            >
              {coverLetter || "Your cover letter will appear here..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}