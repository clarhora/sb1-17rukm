import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import LoadingSpinner from './LoadingSpinner';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TailoredResumeProps {
  tailoredResume: string;
  isLoading: boolean;
}

const TailoredResume: React.FC<TailoredResumeProps> = ({ tailoredResume, isLoading }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!tailoredResume) {
    return (
      <Card className="h-[calc(100vh-8rem)]">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Your tailored resume will appear here...</p>
        </CardContent>
      </Card>
    );
  }

  // Parse the tailored resume
  const sections = tailoredResume.split('\n\n');
  const keyModifications = sections[0].split('\n').slice(1);
  const coreCompetencies = sections[1].split('\n').slice(1);
  const workExperience = sections[2].split('\n').slice(1);
  const projects = sections.slice(3, 6).map(project => {
    const [title, ...details] = project.split('\n');
    return { title, details };
  });
  const otherRelevantExperience = sections[6].split('\n').slice(1);

  const highlightKeywords = (text: string) => {
    const keywords = ['달성', '개선', '개발', '관리', '생성', '구현'];
    return text.split(' ').map((word, index) => 
      keywords.includes(word) 
        ? <span key={`${word}-${index}`} className="bg-yellow-200 dark:bg-yellow-800">{word} </span>
        : `${word} `
    );
  };

  const renderSection = (title: string, content: React.ReactNode, originalContent: string) => (
    <Card key={title} className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {title}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{originalContent}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="flex-grow">
            {content}
          </div>
          <div className="w-[170px] ml-4 p-4 bg-secondary rounded-md">
            <h4 className="font-semibold mb-2">수정사유:</h4>
            <p className="text-sm">
              {getModificationReason(title)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const getModificationReason = (title: string) => {
    switch (title) {
      case '첨삭한 주요 수정사항 키워드':
        return 'JD 키워드 반영, 불필요한 정보 제거, 관련 경험 강조';
      case '핵심역량':
        return 'JD 요구사항 일치 역량 선별, 상세 설명 추가';
      case '직무경험':
        return 'JD 관련 경험 선별, 성과 중심 서술, 구체적 수치 포함';
      case '프로젝트 A':
      case '프로젝트 B':
      case '프로젝트 C':
        return 'JD 연관 프로젝트 선별, 기술 스택 및 성과 강조';
      case '그 외 관련 경력':
        return 'JD 관련 추가 경력 및 자격 선별, 불필요 정보 제거';
      default:
        return 'JD 요구사항에 맞춰 내용 최적화';
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="p-6 space-y-6">
        {renderSection('첨삭한 주요 수정사항 키워드', 
          <ul className="list-disc pl-5">
            {keyModifications.map((item, index) => (
              <li key={`key-mod-${index}`}>{item.replace('- ', '')}</li>
            ))}
          </ul>, 
          '원본 이력서')}
        {renderSection('핵심역량', 
          <ul className="list-disc pl-5">
            {coreCompetencies.map((item, index) => (
              <li key={`core-comp-${index}`}>{highlightKeywords(item.replace('- ', ''))}</li>
            ))}
          </ul>, 
          '원본 핵심역량 섹션')}
        {renderSection('직무경험', 
          <div>
            {workExperience.map((item, index) => (
              <p key={`work-exp-${index}`} className="mb-2">{highlightKeywords(item.replace('- ', ''))}</p>
            ))}
          </div>, 
          '원본 직무경험 섹션')}
        {projects.map((project, index) => 
          renderSection(project.title, 
            <ul className="list-disc pl-5">
              {project.details.map((item, idx) => (
                <li key={`project-${index}-detail-${idx}`}>{highlightKeywords(item.replace('- ', ''))}</li>
              ))}
            </ul>, 
            `원본 프로젝트 ${String.fromCharCode(65 + index)} 내용`)
        )}
        {renderSection('그 외 관련 경력', 
          <ul className="list-disc pl-5">
            {otherRelevantExperience.map((item, index) => (
              <li key={`other-exp-${index}`}>{highlightKeywords(item.replace('- ', ''))}</li>
            ))}
          </ul>, 
          '원본 기타 경력 섹션')}
      </div>
    </ScrollArea>
  );
};

export default TailoredResume;