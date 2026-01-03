/**
 * 词汇分析模块
 * 分析词汇丰富度、唯一词数、TTR等指标
 */

import nlp from 'compromise';
import { VocabularyScore } from '@/types';

// 高级词汇列表（示例）
const ADVANCED_WORDS = new Set([
  'furthermore', 'moreover', 'consequently', 'nevertheless', 'nonetheless',
  'substantial', 'significant', 'comprehensive', 'demonstrate', 'facilitate',
  'implement', 'establish', 'maintain', 'enhance', 'optimize',
  'analyze', 'evaluate', 'investigate', 'determine', 'identify',
  'contribute', 'participate', 'collaborate', 'coordinate', 'integrate',
]);

/**
 * 分析词汇
 */
export function analyzeVocabulary(text: string): VocabularyScore {
  if (!text || text.trim().length === 0) {
    return {
      totalWords: 0,
      uniqueWords: 0,
      ttr: 0,
      advancedWords: 0,
      score: 0,
    };
  }

  const doc = nlp(text);
  
  // 获取所有词汇
  const terms = doc.terms().out('array');
  const totalWords = terms.length;

  // 计算唯一词汇
  const uniqueWordsSet = new Set(
    terms.map((word: string) => word.toLowerCase().trim())
      .filter((word: string) => word.length > 0)
  );
  const uniqueWords = uniqueWordsSet.size;

  // 计算TTR (Type-Token Ratio)
  const ttr = totalWords > 0 ? uniqueWords / totalWords : 0;

  // 检测高级词汇
  let advancedWords = 0;
  terms.forEach((word: string) => {
    const lowerWord = word.toLowerCase().trim();
    if (ADVANCED_WORDS.has(lowerWord)) {
      advancedWords++;
    }
  });

  // 计算评分 (0-100)
  let score = 0;
  
  // TTR评分 (40分)
  // 优秀: TTR > 0.6, 良好: 0.5-0.6, 一般: 0.4-0.5, 较差: < 0.4
  if (ttr >= 0.6) {
    score += 40;
  } else if (ttr >= 0.5) {
    score += 35;
  } else if (ttr >= 0.4) {
    score += 25;
  } else {
    score += 15;
  }

  // 词汇总量评分 (30分)
  // 优秀: > 300词, 良好: 200-300, 一般: 100-200, 较差: < 100
  if (totalWords >= 300) {
    score += 30;
  } else if (totalWords >= 200) {
    score += 25;
  } else if (totalWords >= 100) {
    score += 15;
  } else {
    score += 5;
  }

  // 高级词汇评分 (30分)
  // 优秀: > 10个, 良好: 5-10, 一般: 2-5, 较差: < 2
  if (advancedWords >= 10) {
    score += 30;
  } else if (advancedWords >= 5) {
    score += 25;
  } else if (advancedWords >= 2) {
    score += 15;
  } else {
    score += 5;
  }

  return {
    totalWords,
    uniqueWords,
    ttr: Math.round(ttr * 100) / 100,
    advancedWords,
    score: Math.min(100, score),
  };
}
