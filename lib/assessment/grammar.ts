/**
 * 语法分析模块
 * 分析句子结构、语法错误等
 */

import nlp from 'compromise';
import { GrammarScore } from '@/types';

/**
 * 分析语法
 */
export function analyzeGrammar(text: string): GrammarScore {
  if (!text || text.trim().length === 0) {
    return {
      sentenceCount: 0,
      averageSentenceLength: 0,
      complexSentences: 0,
      errors: [],
      score: 0,
    };
  }

  const doc = nlp(text);
  
  // 句子分析
  const sentences = doc.sentences().out('array');
  const sentenceCount = sentences.length;

  // 计算平均句子长度
  const totalWords = doc.terms().out('array').length;
  const averageSentenceLength = sentenceCount > 0 
    ? Math.round(totalWords / sentenceCount) 
    : 0;

  // 检测复杂句（包含连词的句子）
  let complexSentences = 0;
  sentences.forEach((sentence: string) => {
    const sentenceDoc = nlp(sentence);
    const conjunctions = sentenceDoc.match('#Conjunction').out('array');
    if (conjunctions.length > 0) {
      complexSentences++;
    }
  });

  // 简单的语法错误检测
  const errors: string[] = [];

  // 检测重复词
  const words = doc.terms().out('array');
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].toLowerCase() === words[i + 1].toLowerCase()) {
      errors.push(`重复词: "${words[i]}"`);
    }
  }

  // 检测过长句子（超过40词）
  sentences.forEach((sentence: string, index: number) => {
    const sentenceDoc = nlp(sentence);
    const wordCount = sentenceDoc.terms().out('array').length;
    if (wordCount > 40) {
      errors.push(`句子 ${index + 1} 过长 (${wordCount}词)`);
    }
  });

  // 检测过短句子（少于5词）
  sentences.forEach((sentence: string, index: number) => {
    const sentenceDoc = nlp(sentence);
    const wordCount = sentenceDoc.terms().out('array').length;
    if (wordCount < 5) {
      errors.push(`句子 ${index + 1} 过短 (${wordCount}词)`);
    }
  });

  // 计算评分 (0-100)
  let score = 0;

  // 句子数量评分 (20分)
  // 优秀: 10-20句, 良好: 8-10或20-25, 一般: 5-8或25-30, 较差: < 5或 > 30
  if (sentenceCount >= 10 && sentenceCount <= 20) {
    score += 20;
  } else if ((sentenceCount >= 8 && sentenceCount < 10) || (sentenceCount > 20 && sentenceCount <= 25)) {
    score += 15;
  } else if ((sentenceCount >= 5 && sentenceCount < 8) || (sentenceCount > 25 && sentenceCount <= 30)) {
    score += 10;
  } else {
    score += 5;
  }

  // 平均句子长度评分 (30分)
  // 优秀: 15-25词, 良好: 12-15或25-30, 一般: 10-12或30-35, 较差: < 10或 > 35
  if (averageSentenceLength >= 15 && averageSentenceLength <= 25) {
    score += 30;
  } else if ((averageSentenceLength >= 12 && averageSentenceLength < 15) || 
             (averageSentenceLength > 25 && averageSentenceLength <= 30)) {
    score += 25;
  } else if ((averageSentenceLength >= 10 && averageSentenceLength < 12) || 
             (averageSentenceLength > 30 && averageSentenceLength <= 35)) {
    score += 15;
  } else {
    score += 10;
  }

  // 复杂句评分 (30分)
  const complexRate = sentenceCount > 0 ? complexSentences / sentenceCount : 0;
  // 优秀: 40-60%, 良好: 30-40%或60-70%, 一般: 20-30%或70-80%, 较差: < 20%或 > 80%
  if (complexRate >= 0.4 && complexRate <= 0.6) {
    score += 30;
  } else if ((complexRate >= 0.3 && complexRate < 0.4) || 
             (complexRate > 0.6 && complexRate <= 0.7)) {
    score += 25;
  } else if ((complexRate >= 0.2 && complexRate < 0.3) || 
             (complexRate > 0.7 && complexRate <= 0.8)) {
    score += 15;
  } else {
    score += 10;
  }

  // 错误扣分 (20分)
  const errorCount = errors.length;
  if (errorCount === 0) {
    score += 20;
  } else if (errorCount <= 2) {
    score += 15;
  } else if (errorCount <= 5) {
    score += 10;
  } else {
    score += 5;
  }

  return {
    sentenceCount,
    averageSentenceLength,
    complexSentences,
    errors: errors.slice(0, 10), // 最多返回10个错误
    score: Math.min(100, score),
  };
}
