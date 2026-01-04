'use client';

/**
 * 首页 - HR配置页面
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import TestDurationSelector from '@/components/hr/TestDurationSelector';
import TopicSelector from '@/components/hr/TopicSelector';
import SharePanel from '@/components/hr/SharePanel';
import { generateId, generateTestLink } from '@/lib/utils/helpers';
import StorageManager from '@/lib/storage';
import { HRConfig, TestConfig } from '@/types';

// HR表单验证schema（只验证HR信息）
const hrConfigSchema = z.object({
  hrName: z.string().min(1, '姓名不能为空'),
  hrEmail: z.string().email('请输入有效的邮箱地址'),
  company: z.string().optional(),
  department: z.string().optional(),
  reportPassword: z.string().min(4, '密码至少4位'),
});

type HRFormData = z.infer<typeof hrConfigSchema>;

export default function HomePage() {
  const [step, setStep] = useState<'hr' | 'test' | 'share'>('hr');
  const [hrConfig, setHRConfig] = useState<HRConfig | null>(null);
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [testLink, setTestLink] = useState('');

  const [duration, setDuration] = useState(20);
  const [topic, setTopic] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HRFormData>({
    resolver: zodResolver(hrConfigSchema),
    defaultValues: {
      reportPassword: '8889',
    },
  });

  const onSubmitHR = (data: HRFormData) => {
    const config: HRConfig = {
      id: generateId('hr'),
      name: data.hrName,
      email: data.hrEmail,
      company: data.company,
      department: data.department,
      reportPassword: data.reportPassword || '8889',
      createdAt: new Date().toISOString(),
    };

    StorageManager.saveHRConfig(config);
    setHRConfig(config);
    setStep('test');
  };

  const onSubmitTest = () => {
    if (!topic || topic.trim().length === 0) {
      alert('请选择或输入写作主题');
      return;
    }

    if (!hrConfig) return;

    const testId = generateId('test');
    const config: TestConfig = {
      id: testId,
      hrId: hrConfig.id,
      duration: duration,
      topic: topic,
      topicDescription: topicDescription,
      createdAt: new Date().toISOString(),
    };

    StorageManager.saveTestConfig(config);
    setTestConfig(config);
    
    const link = generateTestLink(testId);
    setTestLink(link);
    setStep('share');

    // 如果填写了候选人邮箱，自动发送邀请邮件
    if (candidateEmail && candidateEmail.trim().length > 0) {
      sendInvitationEmail(link, config);
    }
  };

  // 发送邀请邮件
  const sendInvitationEmail = async (testUrl: string, config: TestConfig) => {
    if (!hrConfig || !candidateEmail) return;

    setSendingEmail(true);
    try {
      const response = await fetch('/api/send-test-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: candidateEmail,
          candidateName: candidateName || '候选人',
          hrName: hrConfig.name,
          companyName: hrConfig.company || '公司',
          testUrl: testUrl,
          topic: config.topic,
          duration: config.duration,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('邀请邮件发送成功');
      } else {
        console.error('邮件发送失败:', result.error);
      }
    } catch (error) {
      console.error('邮件发送错误:', error);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleReset = () => {
    setStep('hr');
    setHRConfig(null);
    setTestConfig(null);
    setTestLink('');
    setDuration(20);
    setTopic('');
    setTopicDescription('');
    setCandidateEmail('');
    setCandidateName('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* 页头 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            英语写作测评系统
          </h1>
          <p className="text-lg text-gray-600">
            为候选人创建个性化的英语写作测试，获取专业的评估报告
          </p>
        </div>

        {/* 进度指示器 */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center ${step === 'hr' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'hr' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">HR信息</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className={`flex items-center ${step === 'test' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'test' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">测试配置</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className={`flex items-center ${step === 'share' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'share' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="ml-2 font-medium">分享链接</span>
            </div>
          </div>
        </div>

        {/* 表单内容 */}
        <div className="max-w-3xl mx-auto">
          {/* Step 1: HR信息 */}
          {step === 'hr' && (
            <Card>
              <CardHeader>
                <CardTitle>HR信息配置</CardTitle>
                <CardDescription>请填写您的基本信息</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmitHR)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="hrName">
                      姓名 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hrName"
                      placeholder="请输入您的姓名"
                      {...register('hrName')}
                      className={errors.hrName ? 'border-red-500' : ''}
                    />
                    {errors.hrName && (
                      <p className="text-sm text-red-500">{errors.hrName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hrEmail">
                      邮箱 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hrEmail"
                      type="email"
                      placeholder="your.email@company.com"
                      {...register('hrEmail')}
                      className={errors.hrEmail ? 'border-red-500' : ''}
                    />
                    {errors.hrEmail && (
                      <p className="text-sm text-red-500">{errors.hrEmail.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">公司名称（可选）</Label>
                    <Input
                      id="company"
                      placeholder="请输入公司名称"
                      {...register('company')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">部门名称（可选）</Label>
                    <Input
                      id="department"
                      placeholder="请输入部门名称"
                      {...register('department')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportPassword">
                      报告访问密码 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="reportPassword"
                      type="password"
                      placeholder="默认密码：8889"
                      {...register('reportPassword')}
                      className={errors.reportPassword ? 'border-red-500' : ''}
                    />
                    {errors.reportPassword && (
                      <p className="text-sm text-red-500">{errors.reportPassword.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      此密码用于访问HR专业报告，请妥善保管
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? '保存中...' : '下一步'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 2: 测试配置 */}
          {step === 'test' && (
            <Card>
              <CardHeader>
                <CardTitle>测试参数配置</CardTitle>
                <CardDescription>设置测试时长和写作主题</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <TestDurationSelector
                  value={duration}
                  onChange={setDuration}
                />

                <TopicSelector
                  value={topic}
                  description={topicDescription}
                  onChange={(t, d) => {
                    setTopic(t);
                    setTopicDescription(d || '');
                  }}
                />

                {/* 候选人信息（可选） */}
                <div className="border-t pt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      候选人信息（可选）
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      填写候选人邮箱，系统将自动发送测试邀请邮件
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="candidateName">候选人姓名</Label>
                    <Input
                      id="candidateName"
                      placeholder="请输入候选人姓名"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="candidateEmail">候选人邮箱</Label>
                    <Input
                      id="candidateEmail"
                      type="email"
                      placeholder="candidate@example.com"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      填写后将自动发送邀请邮件，也可以空着后手动分享链接
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('hr')}
                    className="flex-1"
                  >
                    上一步
                  </Button>
                  <Button
                    type="button"
                    onClick={onSubmitTest}
                    className="flex-1"
                  >
                    生成测试链接
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: 分享链接 */}
          {step === 'share' && testConfig && (
            <div className="space-y-4">
              <SharePanel testLink={testLink} testId={testConfig.id} />
              
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="w-full"
              >
                创建新的测试
              </Button>
            </div>
          )}
        </div>

        {/* 页脚 */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>© 2024 英语写作测评系统. All rights reserved.</p>
          <p className="mt-2">
            <a href="/hr-reports" className="text-blue-600 hover:underline">
              查看HR报告
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
