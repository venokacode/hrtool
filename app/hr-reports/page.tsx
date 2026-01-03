'use client';

/**
 * HR报告中心页面
 * 需要密码验证
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import HRReportDetail from '@/components/report/HRReportDetail';
import StorageManager from '@/lib/storage';
import { formatDateTime } from '@/lib/utils/helpers';
import { HRProfessionalReport } from '@/types';

export default function HRReportsPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedReport, setSelectedReport] = useState<HRProfessionalReport | null>(null);
  const [reports, setReports] = useState<HRProfessionalReport[]>([]);
  const [error, setError] = useState('');

  const handleLogin = () => {
    const hrConfig = StorageManager.getHRConfig();
    if (!hrConfig) {
      setError('HR配置不存在，请先创建测试');
      return;
    }

    if (password !== hrConfig.reportPassword) {
      setError('密码错误');
      return;
    }

    setAuthenticated(true);
    setError('');

    // 加载所有报告
    const allReports = StorageManager.getAllHRReports(password);
    setReports(allReports);
  };

  const handleViewReport = (reportId: string) => {
    const report = StorageManager.getHRReport(reportId, password);
    if (report) {
      setSelectedReport(report);
    }
  };

  const handleBackToList = () => {
    setSelectedReport(null);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 登录界面
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <Card>
            <CardHeader>
              <CardTitle>HR报告中心</CardTitle>
              <CardDescription>
                请输入密码访问专业评估报告
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">访问密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className={error ? 'border-red-500' : ''}
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    默认密码：8889（可在创建测试时自定义）
                  </p>
                </div>

                <Button onClick={handleLogin} className="w-full">
                  登录
                </Button>

                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full"
                >
                  返回首页
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 报告详情页
  if (selectedReport) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Button onClick={handleBackToList} variant="outline">
              ← 返回报告列表
            </Button>
            <Button onClick={() => window.print()} variant="outline">
              打印报告
            </Button>
          </div>

          <HRReportDetail report={selectedReport} />
        </div>
      </div>
    );
  }

  // 报告列表页
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* 页头 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              HR报告中心
            </h1>
            <p className="text-gray-600">
              查看所有候选人的详细评估报告
            </p>
          </div>
          <Button onClick={() => router.push('/')} variant="outline">
            创建新测试
          </Button>
        </div>

        {/* 报告列表 */}
        {reports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">暂无报告</p>
              <Button onClick={() => router.push('/')}>
                创建第一个测试
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewReport(report.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{report.candidateTest.candidateInfo.name}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(report.score.grade)}`}>
                      {report.score.grade}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {report.candidateTest.candidateInfo.email}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">综合得分</span>
                      <span className="font-bold text-lg">
                        {report.score.overallScore}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">提交时间</span>
                      <span>
                        {report.candidateTest.submittedAt
                          ? formatDateTime(new Date(report.candidateTest.submittedAt))
                          : '未知'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">字数</span>
                      <span>{report.candidateTest.writingProcess.wordCount}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <p className="text-gray-600">词汇</p>
                      <p className="font-bold">{report.score.vocabulary.score}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">流畅</p>
                      <p className="font-bold">{report.score.fluency.score}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">语法</p>
                      <p className="font-bold">{report.score.grammar.score}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">结构</p>
                      <p className="font-bold">{report.score.structure.score}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
