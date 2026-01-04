import { NextRequest, NextResponse } from 'next/server';
import { EmailSender } from '@/lib/email/sender';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, candidateName, hrName, companyName, testUrl, topic, duration } = body;

    // 验证必填字段
    if (!to || !candidateName || !hrName || !companyName || !testUrl || !topic || !duration) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // 发送邮件
    const result = await EmailSender.sendTestInvitation({
      to,
      candidateName,
      hrName,
      companyName,
      testUrl,
      topic,
      duration,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
