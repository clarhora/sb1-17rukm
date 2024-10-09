import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2 } from 'lucide-react';

interface JobDescription {
  id: string;
  companyName: string;
  description: string;
}

interface JobDescriptionsProps {
  jobDescriptions: JobDescription[];
  setJobDescriptions: (jds: JobDescription[]) => void;
  selectedJdIndex: number | null;
  setSelectedJdIndex: (index: number | null) => void;
}

const JobDescriptions: React.FC<JobDescriptionsProps> = ({
  jobDescriptions,
  setJobDescriptions,
  selectedJdIndex,
  setSelectedJdIndex,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');

  const openDialog = (index: number | null = null) => {
    if (index !== null) {
      const jd = jobDescriptions[index];
      setCompanyName(jd.companyName);
      setDescription(jd.description);
      setEditingIndex(index);
    } else {
      setCompanyName('');
      setDescription('');
      setEditingIndex(null);
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setCompanyName('');
    setDescription('');
    setEditingIndex(null);
  };

  const handleSave = () => {
    if (companyName.trim() && description.trim()) {
      const newJd: JobDescription = {
        id: editingIndex !== null ? jobDescriptions[editingIndex].id : Date.now().toString(),
        companyName: companyName.trim(),
        description: description.trim(),
      };

      let updatedJds: JobDescription[];
      if (editingIndex !== null) {
        updatedJds = jobDescriptions.map((jd, index) => 
          index === editingIndex ? newJd : jd
        );
      } else {
        updatedJds = [...jobDescriptions, newJd];
      }

      setJobDescriptions(updatedJds);
      closeDialog();
    }
  };

  const handleDelete = (index: number) => {
    const updatedJds = jobDescriptions.filter((_, i) => i !== index);
    setJobDescriptions(updatedJds);
    if (selectedJdIndex === index) {
      setSelectedJdIndex(null);
    } else if (selectedJdIndex && selectedJdIndex > index) {
      setSelectedJdIndex(selectedJdIndex - 1);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="job-description">Job Descriptions</Label>
        <Button variant="secondary" onClick={() => openDialog()}>Add</Button>
      </div>
      <ScrollArea className="h-40 w-full border rounded-md p-4">
        {jobDescriptions.map((jd, index) => (
          <div
            key={jd.id}
            className={`p-2 mb-2 rounded cursor-pointer flex justify-between items-center ${
              selectedJdIndex === index ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
            onClick={() => setSelectedJdIndex(index)}
          >
            <div>
              <strong>{jd.companyName}</strong>: {jd.description.substring(0, 50)}...
            </div>
            <div>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openDialog(index); }}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(index); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </ScrollArea>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? 'Edit' : 'Add'} Job Description</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter job description"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={closeDialog} variant="outline">Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDescriptions;