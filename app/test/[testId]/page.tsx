'use client';

/**
 * 候选人测试页面
 * 动态路由：/test/[testId]
 */

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CandidateInfoForm from '@/components/test/CandidateInfoForm';
import WritingEditor from '@/components/test/WritingEditor';
import CountdownTimer from '@/components/test/CountdownTimer';
import TestHeader from '@/components/test/TestHeader';
import TestFooter from '@/components/test/TestFooter';
import { useKeystrokeTracking } from '@/hooks/useKeystrokeTracking';
import { useAutoSave } from '@/hooks/useAutoSave';
import StorageManager from '@/lib/storage';
import { generateId } from '@/lib/utils/helpers';
import { CandidateInfo, CandidateTest, TestConfig, HRConfig, WritingProcess } from '@/types';

interface TestPageProps {
  params: Promise<{
    testId: string;
  }>;
}

export default function TestPage({ params }: TestPageProps) {
  const { testId } = use(params);
  const router = useRouter();

  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [hrConfig, setHRConfig] = useState<HRConfig | null>(null);
  const [stage, setStage] = useState<'loading' | 'info' | 'writing' | 'submitted'>('loading');
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null);
  const [content, setContent] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [candidateTestId, setCandidateTestId] = useState<string>('');

  const { trackEvent, events, getStatistics } = useKeystrokeTracking();

  // 加载测试配置
  useEffect(() => {
    const config = StorageManager.getTestConfig(testId);
    if (!config) {
      alert('测试不存在或已过期');
      router.push('/');
      return;
    }

    const hr = StorageManager.getHRConfig();
    if (!hr) {
      alert('HR配置不存在');
      router.push('/');
      return;
    }

    setTestConfig(config);
    setHRConfig(hr);
    setStage('info');
  }, [testId, router]);

  // 自动保存
  const { lastSaveTime, saveNow } = useAutoSave({
    data: { content, events },
    onSave: async (data) => {
      if (!candidateTestId || !candidateInfo || !testConfig) return;

      const writingProcess: WritingProcess = {
        content: data.content,
        wordCount: data.content.split(/\s+/).filter(w => w.length > 0).length,
        characterCount: data.content.length,
        keystrokeEvents: data.events,
        startTime,
        lastSaveTime: Date.now(),
        pauseCount: getStatistics().pauseCount,
        revisionCount: getStatistics().deleteCount,
      };

      const candidateTest: CandidateTest = {
        id: candidateTestId,
        testId: testConfig.id,
        candidateInfo,
        writingProcess,
        status: 'in_progress',
      };

      StorageManager.saveCandidateTest(candidateTest);
    },
    enabled: stage === 'writing',
  });

  // 开始测试
  const handleStartTest = (info: CandidateInfo) => {
    setCandidateInfo(info);
    setStartTime(Date.now());
    setCandidateTestId(generateId('candidate'));
    setStage('writing');
  };

  // 发送完成通知邮件
  const sendCompletionEmail = async (candidateTest: CandidateTest) => {
    if (!candidateInfo || !testConfig || !hrConfig) return;

    try {
      // 计算评分（简化版，实际应使用完整的评估算法）
      const wordCount = candidateTest.writingProcess.wordCount;
      let score = 50;
      if (wordCount >= 200) score = 80;
      else if (wordCount >= 150) score = 70;
      else if (wordCount >= 100) score = 60;
      
      const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

      const response = await fetch('/api/send-test-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateEmail: candidateInfo.email,
          candidateName: candidateInfo.name,
          hrEmail: hrConfig.email,
          hrName: hrConfig.name,
          score: score,
          grade: grade,
          reportUrl: `${window.location.origin}/report/${candidateTest.id}`,
          hrReportUrl: `${window.location.origin}/hr-reports`,
          submittedAt: new Date(candidateTest.submittedAt || Date.now()).toISOString(),
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('完成通知邮件发送成功');
      } else {
        console.error('邮件发送失败:', result);
      }
    } catch (error) {
      console.error('邮件发送错误:', error);
    }
  };

  // 提交测试
  const handleSubmit = async () => {
    if (!candidateInfo || !testConfig || !candidateTestId) return;

    const confirmed = window.confirm('确定要提交测试吗？提交后将无法修改。');
    if (!confirmed) return;

    // 保存最终数据
    await saveNow();

    const timeUsed = Math.floor((Date.now() - startTime) / 1000);

    const writingProcess: WritingProcess = {
      content,
      wordCount: content.split(/\s+/).filter(w => w.length > 0).length,
      characterCount: content.length,
      keystrokeEvents: events,
      startTime,
      lastSaveTime: Date.now(),
      pauseCount: getStatistics().pauseCount,
      revisionCount: getStatistics().deleteCount,
    };

    const candidateTest: CandidateTest = {
      id: candidateTestId,
      testId: testConfig.id,
      candidateInfo,
      writingProcess,
      submittedAt: Date.now(),
      timeUsed,
      status: 'completed',
    };

    StorageManager.saveCandidateTest(candidateTest);
    setStage('submitted');

    // 发送完成通知邮件
    sendCompletionEmail(candidateTest);

    // 跳转到报告页面
    setTimeout(() => {
      router.push(`/report/${candidateTestId}`);
    }, 2000);
  };

  // 时间到自动提交
  const handleTimeUp = () => {
    alert('时间到！测试将自动提交。');
    handleSubmit();
  };

  if (stage === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!testConfig || !hrConfig) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TestHeader hrConfig={hrConfig} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* 信息收集阶段 */}
        {stage === 'info' && (
          <div className="max-w-2xl mx-auto">
            <CandidateInfoForm onSubmit={handleStartTest} />
          </div>
        )}

        {/* 写作阶段 */}
        {stage === 'writing' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 倒计时 */}
            <Card>
              <CardContent className="pt-6">
                <CountdownTimer
                  durationInMinutes={testConfig.duration}
                  onTimeUp={handleTimeUp}
                  autoStart={true}
                />
              </CardContent>
            </Card>

            {/* 写作主题 */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">写作主题</h2>
                  <p className="text-xl text-gray-800">{testConfig.topic}</p>
                  {testConfig.topicDescription && (
                    <p className="text-sm text-gray-600 mt-2">
                      {testConfig.topicDescription}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 写作编辑器 */}
            <Card>
              <CardContent className="pt-6">
                <WritingEditor
                  value={content}
                  onChange={setContent}
                  onKeystroke={trackEvent}
                />
              </CardContent>
            </Card>

            {/* 自动保存提示 */}
            {lastSaveTime && (
              <div className="text-center text-sm text-gray-500">
                最后保存: {new Date(lastSaveTime).toLocaleTimeString()}
              </div>
            )}

            {/* 提交按钮 */}
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="min-w-[200px]"
                disabled={content.trim().length === 0}
              >
                提交测试
              </Button>
            </div>
          </div>
        )}

        {/* 提交成功 */}
        {stage === 'submitted' && (
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="text-green-600 text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  提交成功！
                </h2>
                <p className="text-gray-600 mb-6">
                  您的测试已成功提交，正在生成评估报告...
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <TestFooter />
    </div>
  );
}
