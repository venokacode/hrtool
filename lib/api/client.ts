export interface SendTestInvitationRequest {
  to: string;
  candidateName: string;
  hrName: string;
  companyName: string;
  testUrl: string;
  topic: string;
  duration: number;
}

export interface SendTestCompletionRequest {
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

export class APIClient {
  private static BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

  /**
   * 发送测试邀请邮件
   */
  static async sendTestInvitation(data: SendTestInvitationRequest) {
    try {
      const response = await fetch(`${this.BASE_URL}/api/send-test-invitation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to send test invitation:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 发送测试完成通知
   */
  static async sendTestCompletion(data: SendTestCompletionRequest) {
    try {
      const response = await fetch(`${this.BASE_URL}/api/send-test-completion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to send test completion:', error);
      return { success: false, error: String(error) };
    }
  }
}
