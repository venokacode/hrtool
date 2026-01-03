'use client';

/**
 * 候选人报告卡片组件（简化版）
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WritingScore } from '@/types';

interface CandidateReportCardProps {
  score: WritingScore;
  candidateName: string;
}

export default function CandidateReportCard({ score, candidateName }: CandidateReportCardProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-50 border-green-200';
      case 'B': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'C': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'D': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'F': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* 总体评分 */}
      <Card className={`border-2 ${getGradeColor(score.grade)}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">
            {candidateName}的写作评估报告
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            综合评分
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className={`text-6xl font-bold ${getScoreColor(score.overallScore)}`}>
            {score.overallScore}
          </div>
          <div className="text-2xl font-semibold mt-2">
            等级: {score.grade}
          </div>
        </CardContent>
      </Card>

      {/* 各项得分 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              词汇
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(score.vocabulary.score)}`}>
              {score.vocabulary.score}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {score.vocabulary.uniqueWords} 个唯一词
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              流畅度
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(score.fluency.score)}`}>
              {score.fluency.score}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {score.fluency.wpm} WPM
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              语法
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(score.grammar.score)}`}>
              {score.grammar.score}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {score.grammar.sentenceCount} 个句子
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              结构
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(score.structure.score)}`}>
              {score.structure.score}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {score.structure.paragraphCount} 个段落
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 改进建议 */}
      <Card>
        <CardHeader>
          <CardTitle>改进建议</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {score.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
