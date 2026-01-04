import { NextRequest, NextResponse } from 'next/server';
import { EmailSender } from '@/lib/email/sender';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      candidateEmail,
      candidateName,
      hrEmail,
      hrName,
      score,
      grade,
      reportUrl,
      hrReportUrl,
      submittedAt,
    } = body;

    // 验证必填字段
    if (
      !candidateEmail ||
      !candidateName ||
      !hrEmail ||
      !hrName ||
      score === undefined ||
      !grade ||
      !reportUrl ||
      !hrReportUrl ||
      !submittedAt
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidateEmail) || !emailRegex.test(hrEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // 发送邮件
    const results = await EmailSender.sendTestCompletion({
      candidateEmail,
      candidateName,
      hrEmail,
      hrName,
      score,
      grade,
      reportUrl,
      hrReportUrl,
      submittedAt,
    });

    return NextResponse.json({
      success: results.candidate.success || results.hr.success,
      results,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
