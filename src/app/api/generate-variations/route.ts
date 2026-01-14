import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 패키지 import 확인
    let GoogleGenerativeAI;
    try {
      const genAIModule = await import('@google/generative-ai');
      GoogleGenerativeAI = genAIModule.GoogleGenerativeAI;
    } catch (importError: any) {
      console.error('Failed to import @google/generative-ai:', importError);
      return NextResponse.json(
        { 
          error: 'AI 패키지를 불러올 수 없습니다.',
          details: importError.message,
          hint: '패키지가 설치되었는지 확인해주세요.'
        },
        { status: 500 }
      );
    }

    const { originalText } = await request.json();

    if (!originalText || typeof originalText !== 'string') {
      return NextResponse.json(
        { error: '원본 텍스트가 필요합니다.' },
        { status: 400 }
      );
    }

    // 환경변수에서 API 키 가져오기
    const apiKey = process.env.GEMINI_API_KEY;
    
    // 디버깅을 위한 로그
    console.log('Environment check:', {
      hasKey: !!apiKey,
      keyLength: apiKey?.length,
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('GEMINI'))
    });
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return NextResponse.json(
        { 
          error: 'Gemini API 키가 설정되지 않았습니다.',
          debug: {
            hasKey: false,
            availableEnvKeys: Object.keys(process.env).filter(k => k.includes('GEMINI'))
          }
        },
        { status: 500 }
      );
    }

    console.log('Initializing Gemini AI...');
    const genAI = new GoogleGenerativeAI(apiKey);
    // gemini-1.5-flash는 최신 안정 버전입니다
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `다음 인스타그램 캡션 텍스트를 기반으로 3가지 다른 스타일의 변형을 만들어주세요. 각 변형은 원본의 의미를 유지하면서도 톤, 스타일, 접근 방식이 달라야 합니다.

원본 텍스트:
"${originalText}"

요구사항:
1. 첫 번째 변형: 친근하고 대화하는 듯한 톤 (이모지 적절히 사용)
2. 두 번째 변형: 질문이나 호기심을 유발하는 스타일
3. 세 번째 변형: 강조와 감정을 살린 역동적인 스타일

각 변형은 한 줄로 작성하고, 번호 없이 텍스트만 반환해주세요. 변형 사이는 줄바꿈으로 구분해주세요.`;

    console.log('Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini API response received, length:', text.length);

    // 응답을 3개로 분리
    const variations = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.match(/^\d+[\.\)]/)) // 번호 제거
      .slice(0, 3); // 최대 3개만

    // 3개가 안 나오면 기본 변형 추가
    while (variations.length < 3) {
      variations.push(originalText);
    }

    return NextResponse.json({ variations });
  } catch (error: any) {
    console.error('Gemini API Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    });
    
    // 더 자세한 에러 정보 반환
    return NextResponse.json(
      { 
        error: 'AI 변형 생성 중 오류가 발생했습니다.',
        details: error.message,
        type: error.name,
        hint: error.message?.includes('API key') 
          ? 'API 키가 유효하지 않거나 만료되었을 수 있습니다.'
          : error.message?.includes('import')
          ? '패키지 설치가 필요합니다.'
          : 'Netlify Functions 로그를 확인해주세요.'
      },
      { status: 500 }
    );
  }
}
