'use client';

/**
 * HR详细报告组件（专业版）
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HRProfessionalReport } from '@/types';
import { formatDateTime, formatDuration } from '@/lib/utils/helpers';

interface HRReportDetailProps {
  report: HRProfessionalReport;
}

export default function HRReportDetail({ report }: HRReportDetailProps) {
  const { candidateTest, score, testConfig } = report;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* 候选人信息 */}
      <Card>
        <CardHeader>
          <CardTitle>候选人信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">姓名</p>
              <p className="text-lg font-semibold">{candidateTest.candidateInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">邮箱</p>
              <p className="text-lg font-semibold">{candidateTest.candidateInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">提交时间</p>
              <p className="text-lg">
                {candidateTest.submittedAt 
                  ? formatDateTime(new Date(candidateTest.submittedAt))
                  : '未提交'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">用时</p>
              <p className="text-lg">
                {candidateTest.timeUsed 
                  ? formatDuration(candidateTest.timeUsed)
                  : '未知'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 测试配置 */}
      <Card>
        <CardHeader>
          <CardTitle>测试配置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">写作主题</p>
              <p className="text-lg font-semibold">{testConfig.topic}</p>
              {testConfig.topicDescription && (
                <p className="text-sm text-gray-500 mt-1">{testConfig.topicDescription}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">测试时长</p>
              <p className="text-lg">{testConfig.duration} 分钟</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 综合评分 */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle>综合评分</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总分</p>
              <p className={`text-5xl font-bold ${getScoreColor(score.overallScore)}`}>
                {score.overallScore}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">等级</p>
              <p className="text-5xl font-bold">{score.grade}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详细评分 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 词汇分析 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>词汇分析</span>
              <span className={`text-2xl ${getScoreColor(score.vocabulary.score)}`}>
                {score.vocabulary.score}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">总词数</span>
                <span className="font-semibold">{score.vocabulary.totalWords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">唯一词数</span>
                <span className="font-semibold">{score.vocabulary.uniqueWords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">词汇丰富度 (TTR)</span>
                <span className="font-semibold">{score.vocabulary.ttr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">高级词汇</span>
                <span className="font-semibold">{score.vocabulary.advancedWords}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 流畅度分析 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>流畅度分析</span>
              <span className={`text-2xl ${getScoreColor(score.fluency.score)}`}>
                {score.fluency.score}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">写作速度 (WPM)</span>
                <span className="font-semibold">{score.fluency.wpm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">暂停次数</span>
                <span className="font-semibold">{score.fluency.pauseCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">平均暂停时间</span>
                <span className="font-semibold">{score.fluency.averagePauseTime}秒</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">修改率</span>
                <span className="font-semibold">{score.fluency.revisionRate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 语法分析 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>语法分析</span>
              <span className={`text-2xl ${getScoreColor(score.grammar.score)}`}>
                {score.grammar.score}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">句子数量</span>
                <span className="font-semibold">{score.grammar.sentenceCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">平均句长</span>
                <span className="font-semibold">{score.grammar.averageSentenceLength}词</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">复杂句</span>
                <span className="font-semibold">{score.grammar.complexSentences}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">检测到的问题</span>
                <span className="font-semibold">{score.grammar.errors.length}</span>
              </div>
            </div>
            {score.grammar.errors.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 mb-2">问题列表:</p>
                <ul className="text-xs space-y-1">
                  {score.grammar.errors.map((error, index) => (
                    <li key={index} className="text-gray-600">• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 结构分析 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>结构分析</span>
              <span className={`text-2xl ${getScoreColor(score.structure.score)}`}>
                {score.structure.score}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">段落数量</span>
                <span className="font-semibold">{score.structure.paragraphCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">有引言</span>
                <span className="font-semibold">
                  {score.structure.hasIntroduction ? '✓ 是' : '✗ 否'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">有结论</span>
                <span className="font-semibold">
                  {score.structure.hasConclusion ? '✓ 是' : '✗ 否'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">连贯性</span>
                <span className="font-semibold">{score.structure.coherence}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 写作内容 */}
      <Card>
        <CardHeader>
          <CardTitle>写作内容</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
              {candidateTest.writingProcess.content}
            </pre>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>字数: {candidateTest.writingProcess.wordCount}</p>
            <p>字符数: {candidateTest.writingProcess.characterCount}</p>
          </div>
        </CardContent>
      </Card>

      {/* 改进建议 */}
      <Card>
        <CardHeader>
          <CardTitle>改进建议</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {score.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600 font-bold">{index + 1}.</span>
                <span className="text-gray-800">{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
