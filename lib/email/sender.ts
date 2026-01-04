import { Resend } from 'resend';
import { render } from '@react-email/render';
import {
  TestInvitationEmail,
  TestCompletionEmailCandidate,
  TestCompletionEmailHR,
} from './templates';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build');

export interface SendTestInvitationParams {
  to: string;
  candidateName: string;
  hrName: string;
  companyName: string;
  testUrl: string;
  topic: string;
  duration: number;
}

export interface SendTestCompletionParams {
  candidateEmail: string;
  candidateName: string;
  hrEmail: string;
  hrName: string;
  score: number;
  grade: string;
  reportUrl: string;
  hrReportUrl: string;
  submittedAt: string;
}

export class EmailSender {
  private static FROM = process.env.EMAIL_FROM || 'noreply@testtool.ai';

  /**
   * 发送测试邀请邮件
   */
  static async sendTestInvitation(params: SendTestInvitationParams) {
    try {
      const html = await render(
        TestInvitationEmail({
          candidateName: params.candidateName,
          hrName: params.hrName,
          companyName: params.companyName,
          testUrl: params.testUrl,
          topic: params.topic,
          duration: params.duration,
        })
      );

      const { data, error } = await resend.emails.send({
        from: this.FROM,
        to: params.to,
        subject: `${params.companyName} - 英语写作测评邀请`,
        html,
      });

      if (error) {
        console.error('Failed to send test invitation:', error);
        return { success: false, error: error.message };
      }

      console.log('Test invitation sent:', data);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('Error sending test invitation:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 发送测试完成通知（候选人和HR）
   */
  static async sendTestCompletion(params: SendTestCompletionParams) {
    const results = {
      candidate: { success: false, messageId: '', error: '' },
      hr: { success: false, messageId: '', error: '' },
    };

    // 发送给候选人
    try {
      const candidateHtml = await render(
        TestCompletionEmailCandidate({
          candidateName: params.candidateName,
          score: params.score,
          grade: params.grade,
          reportUrl: params.reportUrl,
        })
      );

      const { data, error } = await resend.emails.send({
        from: this.FROM,
        to: params.candidateEmail,
        subject: '您的英语写作测评报告',
        html: candidateHtml,
      });

      if (error) {
        console.error('Failed to send candidate email:', error);
        results.candidate.error = error.message;
      } else {
        console.log('Candidate email sent:', data);
        results.candidate.success = true;
        results.candidate.messageId = data?.id || '';
      }
    } catch (error) {
      console.error('Error sending candidate email:', error);
      results.candidate.error = String(error);
    }

    // 发送给HR
    try {
      const hrHtml = await render(
        TestCompletionEmailHR({
          hrName: params.hrName,
          candidateName: params.candidateName,
          candidateEmail: params.candidateEmail,
          score: params.score,
          grade: params.grade,
          reportUrl: params.hrReportUrl,
          submittedAt: params.submittedAt,
        })
      );

      const { data, error } = await resend.emails.send({
        from: this.FROM,
        to: params.hrEmail,
        subject: `新的测试提交 - ${params.candidateName}`,
        html: hrHtml,
      });

      if (error) {
        console.error('Failed to send HR email:', error);
        results.hr.error = error.message;
      } else {
        console.log('HR email sent:', data);
        results.hr.success = true;
        results.hr.messageId = data?.id || '';
      }
    } catch (error) {
      console.error('Error sending HR email:', error);
      results.hr.error = String(error);
    }

    return results;
  }
}
