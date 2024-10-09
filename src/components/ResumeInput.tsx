import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ResumeInputProps {
  resume: string;
  setResume: (resume: string) => void;
}

const ResumeInput: React.FC<ResumeInputProps> = ({ resume, setResume }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempResume, setTempResume] = useState(resume);

  const openDialog = () => {
    setTempResume(resume);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSave = () => {
    setResume(tempResume.trim());
    closeDialog();
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="resume">Your Resume</Label>
        <Button variant="secondary" onClick={openDialog}>
          {resume ? 'Edit' : 'Add'} Resume
        </Button>
      </div>
      {resume && (
        <div className="p-2 rounded bg-secondary">
          {resume.substring(0, 100)}...
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{resume ? 'Edit' : 'Add'} Your Resume</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resume-content">Resume Content</Label>
              <Textarea
                id="resume-content"
                value={tempResume}
                onChange={(e) => setTempResume(e.target.value)}
                placeholder="Enter your resume here..."
                rows={10}
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

export default ResumeInput;