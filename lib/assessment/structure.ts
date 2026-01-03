/**
 * 结构分析模块
 * 分析文章结构、段落组织等
 */

import nlp from 'compromise';
import { StructureScore } from '@/types';

/**
 * 分析结构
 */
export function analyzeStructure(text: string): StructureScore {
  if (!text || text.trim().length === 0) {
    return {
      paragraphCount: 0,
      hasIntroduction: false,
      hasConclusion: false,
      coherence: 0,
      score: 0,
    };
  }

  // 段落分析（按双换行符分割）
  const paragraphs = text
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  const paragraphCount = paragraphs.length;

  // 检测开头段落（引言）
  const firstParagraph = paragraphs[0] || '';
  const introductionKeywords = [
    'introduction', 'firstly', 'first', 'to begin', 'nowadays', 'today',
    'in recent years', 'it is well known', 'generally speaking'
  ];
  const hasIntroduction = introductionKeywords.some(keyword => 
    firstParagraph.toLowerCase().includes(keyword)
  ) || firstParagraph.length > 50;

  // 检测结尾段落（结论）
  const lastParagraph = paragraphs[paragraphs.length - 1] || '';
  const conclusionKeywords = [
    'conclusion', 'finally', 'in conclusion', 'to sum up', 'in summary',
    'to conclude', 'overall', 'in short', 'therefore', 'thus'
  ];
  const hasConclusion = conclusionKeywords.some(keyword => 
    lastParagraph.toLowerCase().includes(keyword)
  ) || (paragraphCount > 2 && lastParagraph.length > 50);

  // 连贯性分析（检测过渡词）
  const doc = nlp(text);
  const transitionWords = [
    'however', 'moreover', 'furthermore', 'therefore', 'thus',
    'consequently', 'nevertheless', 'nonetheless', 'additionally',
    'in addition', 'for example', 'for instance', 'such as',
    'first', 'second', 'third', 'finally', 'lastly',
    'on the other hand', 'in contrast', 'similarly', 'likewise'
  ];

  let transitionCount = 0;
  transitionWords.forEach(word => {
    const matches = doc.match(word).out('array');
    transitionCount += matches.length;
  });

  // 计算连贯性分数 (0-1)
  const coherence = Math.min(1, transitionCount / Math.max(1, paragraphCount * 2));

  // 计算评分 (0-100)
  let score = 0;

  // 段落数量评分 (25分)
  // 优秀: 3-5段, 良好: 2或6段, 一般: 1或7段, 较差: 0或 > 7段
  if (paragraphCount >= 3 && paragraphCount <= 5) {
    score += 25;
  } else if (paragraphCount === 2 || paragraphCount === 6) {
    score += 20;
  } else if (paragraphCount === 1 || paragraphCount === 7) {
    score += 10;
  } else {
    score += 5;
  }

  // 引言评分 (25分)
  if (hasIntroduction) {
    score += 25;
  } else {
    score += 10;
  }

  // 结论评分 (25分)
  if (hasConclusion) {
    score += 25;
  } else {
    score += 10;
  }

  // 连贯性评分 (25分)
  if (coherence >= 0.8) {
    score += 25;
  } else if (coherence >= 0.6) {
    score += 20;
  } else if (coherence >= 0.4) {
    score += 15;
  } else if (coherence >= 0.2) {
    score += 10;
  } else {
    score += 5;
  }

  return {
    paragraphCount,
    hasIntroduction,
    hasConclusion,
    coherence: Math.round(coherence * 100) / 100,
    score: Math.min(100, score),
  };
}
