import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface CoverLetterFormProps {
  onSubmit: (data: { resume: File; jobDescription: string }) => void;
  isLoading: boolean;
}

export function CoverLetterForm({ onSubmit, isLoading }: CoverLetterFormProps) {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !jobDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both resume and job description",
        variant: "destructive",
      });
      return;
    }

    if (resume.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    onSubmit({ resume, jobDescription });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Upload Resume (PDF or DOCX)</label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full min-h-[200px] p-3 border rounded-md"
          placeholder="Paste the job description here..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Generating..." : "Generate Cover Letter"}
      </button>
    </form>
  );
}
