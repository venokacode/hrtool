'use client';

/**
 * 候选人报告页面（简化版）
 * 路由：/report/[reportId]
 */

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CandidateReportCard from '@/components/report/CandidateReportCard';
import StorageManager from '@/lib/storage';
import { generateWritingScore } from '@/lib/assessment/scoring';
import { CandidateTest, WritingScore, CandidateReport } from '@/types';

interface ReportPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

export default function ReportPage({ params }: ReportPageProps) {
  const { reportId } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [candidateTest, setCandidateTest] = useState<CandidateTest | null>(null);
  const [score, setScore] = useState<WritingScore | null>(null);

  useEffect(() => {
    // 加载候选人测试数据
    const test = StorageManager.getCandidateTest(reportId);
    if (!test) {
      alert('报告不存在');
      router.push('/');
      return;
    }

    if (test.status !== 'completed') {
      alert('测试尚未完成');
      router.push(`/test/${test.testId}`);
      return;
    }

    setCandidateTest(test);

    // 生成评分
    const writingScore = generateWritingScore(
      test.writingProcess.content,
      test.writingProcess.keystrokeEvents,
      test.timeUsed || 0
    );
    setScore(writingScore);

    // 保存候选人报告
    const candidateReport: CandidateReport = {
      id: test.id,
      candidateInfo: test.candidateInfo,
      score: writingScore,
      generatedAt: Date.now(),
    };
    StorageManager.saveCandidateReport(candidateReport);

    // 保存HR专业报告（加密）
    const testConfig = StorageManager.getTestConfig(test.testId);
    if (testConfig) {
      const hrConfig = StorageManager.getHRConfig();
      if (hrConfig) {
        StorageManager.saveHRReport({
          id: test.id,
          candidateTest: test,
          score: writingScore,
          testConfig,
          generatedAt: Date.now(),
        });
      }
    }

    setLoading(false);
  }, [reportId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在生成报告...</p>
        </div>
      </div>
    );
  }

  if (!candidateTest || !score) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* 页头 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            写作评估报告
          </h1>
          <p className="text-gray-600">
            感谢您完成测试！以下是您的评估结果
          </p>
        </div>

        {/* 报告内容 */}
        <div className="max-w-4xl mx-auto">
          <CandidateReportCard
            score={score}
            candidateName={candidateTest.candidateInfo.name}
          />
        </div>

        {/* 操作按钮 */}
        <div className="max-w-4xl mx-auto mt-8 flex justify-center gap-4">
          <Button
            onClick={() => window.print()}
            variant="outline"
          >
            打印报告
          </Button>
          <Button
            onClick={() => router.push('/')}
          >
            返回首页
          </Button>
        </div>

        {/* 页脚提示 */}
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
          <p>
            <strong>提示：</strong> 本报告为简化版，仅供候选人参考。
            HR负责人可通过专业报告系统查看更详细的评估数据。
          </p>
        </div>
      </div>
    </div>
  );
}
