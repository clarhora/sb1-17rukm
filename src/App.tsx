import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Copy, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ResumeInput from './components/ResumeInput';
import JobDescriptions from './components/JobDescriptions';
import TailoredResume from './components/TailoredResume';
import ApiKeyModal from './components/ApiKeyModal';
import { tailorResume } from './lib/api';

interface JobDescription {
  id: string;
  companyName: string;
  description: string;
}

function App() {
  const [resume, setResume] = useState('');
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [selectedJdIndex, setSelectedJdIndex] = useState<number | null>(null);
  const [tailoredResume, setTailoredResume] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('apiKey');
    const storedResume = localStorage.getItem('resume');
    const storedJobDescriptions = localStorage.getItem('jobDescriptions');

    if (storedApiKey) setApiKey(storedApiKey);
    if (storedResume) setResume(storedResume);
    if (storedJobDescriptions) setJobDescriptions(JSON.parse(storedJobDescriptions));
  }, []);

  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('resume', resume);
    localStorage.setItem('jobDescriptions', JSON.stringify(jobDescriptions));
  }, [apiKey, resume, jobDescriptions]);

  const handleTailorResume = async () => {
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
      return;
    }

    if (!resume) {
      alert('Please add your resume');
      return;
    }

    if (selectedJdIndex === null) {
      alert('Please select a job description');
      return;
    }

    setIsLoading(true);
    try {
      const result = await tailorResume(resume, jobDescriptions[selectedJdIndex].description, apiKey);
      setTailoredResume(result);
    } catch (error) {
      console.error('Error tailoring resume:', error);
      alert('Failed to tailor resume. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResume = () => {
    navigator.clipboard.writeText(tailoredResume);
    alert('Resume copied to clipboard!');
  };

  const handleDownloadResume = () => {
    const element = document.createElement('a');
    const file = new Blob([tailoredResume], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'tailored_resume.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row">
      <div className="w-full md:w-[320px] bg-white p-6 mb-6 md:mb-0 md:mr-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Resume Rewriter</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsApiKeyModalOpen(true)}>
            <Settings className="h-6 w-6" />
          </Button>
        </header>

        <div className="space-y-8">
          <ResumeInput resume={resume} setResume={setResume} />
          <JobDescriptions
            jobDescriptions={jobDescriptions}
            setJobDescriptions={setJobDescriptions}
            selectedJdIndex={selectedJdIndex}
            setSelectedJdIndex={setSelectedJdIndex}
          />
          <Button className="w-full" onClick={handleTailorResume}>Tailor Resume</Button>
        </div>
      </div>

      <div className="flex-grow bg-[#f8f8f8] p-6">
        <Card className="w-full h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tailored Resume
            </CardTitle>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleCopyResume}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleDownloadResume}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download resume</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <TailoredResume tailoredResume={tailoredResume} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        setResume={setResume}
        setJobDescriptions={setJobDescriptions}
      />
    </div>
  );
}

export default App;