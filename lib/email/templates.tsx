import React from 'react';

// 测试邀请邮件
export const TestInvitationEmail = ({
  candidateName,
  hrName,
  companyName,
  testUrl,
  topic,
  duration,
}: {
  candidateName: string;
  hrName: string;
  companyName: string;
  testUrl: string;
  topic: string;
  duration: number;
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', margin: 0, padding: 0 }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
            英语写作测评邀请
          </h1>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.5', marginBottom: '10px' }}>
            您好 {candidateName}，
          </p>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.5', marginBottom: '20px' }}>
            {companyName} 的 {hrName} 邀请您参加英语写作能力测评。
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '20px 0' }} />
          <p style={{ fontSize: '16px', color: '#333', fontWeight: 'bold', marginBottom: '10px' }}>
            测试信息：
          </p>
          <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
            • 写作主题：{topic}
          </p>
          <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
            • 测试时长：{duration} 分钟
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '20px 0' }} />
          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <a
              href={testUrl}
              style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              开始测试
            </a>
          </div>
          <p style={{ fontSize: '14px', color: '#999', marginTop: '20px' }}>
            或复制以下链接到浏览器：
          </p>
          <p style={{ fontSize: '12px', color: '#3b82f6', wordBreak: 'break-all' }}>
            {testUrl}
          </p>
        </div>
      </div>
    </body>
  </html>
);

// 测试完成通知邮件（候选人）
export const TestCompletionEmailCandidate = ({
  candidateName,
  score,
  grade,
  reportUrl,
}: {
  candidateName: string;
  score: number;
  grade: string;
  reportUrl: string;
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', margin: 0, padding: 0 }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
            测试提交成功
          </h1>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.5', marginBottom: '10px' }}>
            {candidateName}，您好！
          </p>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.5', marginBottom: '20px' }}>
            您的英语写作测评已成功提交。以下是您的评估结果：
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '20px 0' }} />
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6', margin: '0' }}>
              {score}
            </div>
            <div style={{ fontSize: '24px', color: '#666', margin: '10px 0' }}>
              等级：{grade}
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '20px 0' }} />
          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <a
              href={reportUrl}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              查看详细报告
            </a>
          </div>
          <p style={{ fontSize: '14px', color: '#999', marginTop: '20px' }}>
            报告链接：
          </p>
          <p style={{ fontSize: '12px', color: '#3b82f6', wordBreak: 'break-all' }}>
            {reportUrl}
          </p>
        </div>
      </div>
    </body>
  </html>
);

// 测试完成通知邮件（HR）
export const TestCompletionEmailHR = ({
  hrName,
  candidateName,
  candidateEmail,
  score,
  grade,
  reportUrl,
  submittedAt,
}: {
  hrName: string;
  candidateName: string;
  candidateEmail: string;
  score: number;
  grade: string;
  reportUrl: string;
  submittedAt: string;
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', margin: 0, padding: 0 }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
            新的测试提交
          </h1>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.5', marginBottom: '10px' }}>
            {hrName}，您好！
          </p>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.5', marginBottom: '20px' }}>
            候选人 {candidateName} 已完成英语写作测评。
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '20px 0' }} />
          <p style={{ fontSize: '16px', color: '#333', fontWeight: 'bold', marginBottom: '10px' }}>
            候选人信息：
          </p>
          <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
            • 姓名：{candidateName}
          </p>
          <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
            • 邮箱：{candidateEmail}
          </p>
          <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
            • 提交时间：{submittedAt}
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '20px 0' }} />
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6', margin: '0' }}>
              {score}
            </div>
            <div style={{ fontSize: '24px', color: '#666', margin: '10px 0' }}>
              等级：{grade}
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '20px 0' }} />
          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <a
              href={reportUrl}
              style={{
                backgroundColor: '#8b5cf6',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              查看详细报告
            </a>
          </div>
          <p style={{ fontSize: '14px', color: '#999', marginTop: '20px' }}>
            报告链接：
          </p>
          <p style={{ fontSize: '12px', color: '#3b82f6', wordBreak: 'break-all' }}>
            {reportUrl}
          </p>
        </div>
      </div>
    </body>
  </html>
);
