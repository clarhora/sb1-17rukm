import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';

export async function tailorResume(resume: string, jobDescription: string, apiKey: string): Promise<string> {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `당신은 경력 컨설턴트이자 전문 이력서 작성자입니다. 특정 직무 설명서(JD)에 맞춰 이력서를 작성하는 것이 목표입니다. 제공된 이력서와 JD를 바탕으로 맞춤형 이력서를 작성해 주세요.

1. 먼저 제공된 JD를 분석하여 주요 요구사항, 필요 기술, 그리고 회사가 찾는 경험을 파악해 주세요.

2. 그 다음, 제공된 이력서를 검토하고, JD와 가장 관련성 높은 경험과 기술을 선별해 주세요.

3. 선별된 정보를 바탕으로 다음 구조로 이력서를 작성해 주세요:

첨삭한 주요 수정사항 키워드:
- 키워드1
- 키워드2
- 키워드3

핵심역량:
- 역량1: 설명
- 역량2: 설명
- 역량3: 설명

직무경험:
회사명 | 직위 | 기간
- 주요 책임1
- 주요 책임2
- 주요 성과

프로젝트 A:
- 프로젝트 설명
- 사용 기술
- 주요 성과

프로젝트 B:
- 프로젝트 설명
- 사용 기술
- 주요 성과

프로젝트 C:
- 프로젝트 설명
- 사용 기술
- 주요 성과

그 외 관련 경력:
- 관련 활동
- 자격증
- 수상 경력

4. 각 섹션에 대해 다음 지침을 따라주세요:
   a) 첨삭한 주요 수정사항 키워드: 원본 이력서에서 JD에 맞춰 주요 변경된 키워드를 3-5개 나열하세요.
   b) 핵심역량: JD의 요구사항과 일치하는 3-5개의 핵심 기술 및 역량을 선택하고 간단히 설명하세요.
   c) 직무경험: JD와 가장 관련 있는 경험을 선택하고, 구체적인 책임과 성과를 bullet point로 나열하세요.
   d) 프로젝트 A, B, C: JD와 가장 관련 있는 3개의 프로젝트를 선택하고, 각각에 대해 프로젝트 설명, 사용 기술, 주요 성과를 bullet point로 나열하세요.
   e) 그 외 관련 경력: JD와 관련된 추가 활동, 자격증, 수상 경력을 나열하세요.

5. 각 섹션은 반드시 위의 구조를 따라 작성하고, 섹션 간에는 빈 줄을 넣어 구분해 주세요.

6. 모든 내용은 JD의 요구사항과 직접적으로 연관되어야 하며, 불필요한 정보는 제외하세요.

7. 가능한 경우 구체적인 수치와 성과를 포함하여 작성하세요.`
          },
          {
            role: 'user',
            content: `제 이력서는 다음과 같습니다:
${resume}

지원하고자 하는 직무의 JD는 다음과 같습니다:
${jobDescription}

이 정보를 바탕으로 JD에 최적화된 이력서를 작성해 주시기 바랍니다.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error tailoring resume:', error);
    throw new Error('Failed to tailor resume. Please check your API key and try again.');
  }
}