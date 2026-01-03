/**
 * 综合评分模块
 * 整合各项评分，生成最终报告
 */

import { analyzeVocabulary } from './vocabulary';
import { analyzeFluency } from './fluency';
import { analyzeGrammar } from './grammar';
import { analyzeStructure } from './structure';
import { WritingScore, KeystrokeEvent } from '@/types';
import { getGradeFromScore } from '@/lib/utils/helpers';

/**
 * 生成综合评分
 */
export function generateWritingScore(
  content: string,
  keystrokeEvents: KeystrokeEvent[],
  timeUsed: number
): WritingScore {
  // 各项分析
  const vocabulary = analyzeVocabulary(content);
  const fluency = analyzeFluency(content, keystrokeEvents, timeUsed);
  const grammar = analyzeGrammar(content);
  const structure = analyzeStructure(content);

  // 计算总分（加权平均）
  // 词汇: 30%, 流畅度: 25%, 语法: 25%, 结构: 20%
  const overallScore = Math.round(
    vocabulary.score * 0.3 +
    fluency.score * 0.25 +
    grammar.score * 0.25 +
    structure.score * 0.2
  );

  // 获取等级
  const grade = getGradeFromScore(overallScore);

  // 生成建议
  const suggestions = generateSuggestions({
    vocabulary,
    fluency,
    grammar,
    structure,
    overallScore,
  });

  return {
    vocabulary,
    fluency,
    grammar,
    structure,
    overallScore,
    grade,
    suggestions,
  };
}

/**
 * 生成改进建议
 */
function generateSuggestions(scores: {
  vocabulary: any;
  fluency: any;
  grammar: any;
  structure: any;
  overallScore: number;
}): string[] {
  const suggestions: string[] = [];

  // 词汇建议
  if (scores.vocabulary.score < 70) {
    if (scores.vocabulary.ttr < 0.5) {
      suggestions.push('尝试使用更多样化的词汇，避免重复使用相同的词语');
    }
    if (scores.vocabulary.advancedWords < 5) {
      suggestions.push('增加高级词汇的使用，如连接词、学术词汇等');
    }
    if (scores.vocabulary.totalWords < 200) {
      suggestions.push('增加文章长度，至少写200个单词以充分表达观点');
    }
  }

  // 流畅度建议
  if (scores.fluency.score < 70) {
    if (scores.fluency.wpm < 30) {
      suggestions.push('提高写作速度，多练习快速组织思路和表达');
    }
    if (scores.fluency.pauseCount > 30) {
      suggestions.push('减少写作中的停顿次数，提前规划好文章结构');
    }
    if (scores.fluency.revisionRate > 0.3) {
      suggestions.push('减少修改次数，先完成初稿再进行修改');
    }
  }

  // 语法建议
  if (scores.grammar.score < 70) {
    if (scores.grammar.errors.length > 0) {
      suggestions.push('注意检查语法错误，特别是句子长度和重复词');
    }
    if (scores.grammar.averageSentenceLength < 12) {
      suggestions.push('增加句子的复杂度，使用更丰富的句式结构');
    }
    if (scores.grammar.complexSentences < scores.grammar.sentenceCount * 0.3) {
      suggestions.push('增加复杂句的使用，如使用连词连接多个从句');
    }
  }

  // 结构建议
  if (scores.structure.score < 70) {
    if (scores.structure.paragraphCount < 3) {
      suggestions.push('将文章分成多个段落，每段表达一个主要观点');
    }
    if (!scores.structure.hasIntroduction) {
      suggestions.push('添加明确的引言段落，介绍文章主题');
    }
    if (!scores.structure.hasConclusion) {
      suggestions.push('添加结论段落，总结文章要点');
    }
    if (scores.structure.coherence < 0.5) {
      suggestions.push('使用更多过渡词和连接词，增强段落间的连贯性');
    }
  }

  // 总体建议
  if (scores.overallScore >= 90) {
    suggestions.push('🎉 写作水平优秀！继续保持高质量的写作习惯');
  } else if (scores.overallScore >= 80) {
    suggestions.push('写作水平良好，继续提升词汇和语法的准确性');
  } else if (scores.overallScore >= 70) {
    suggestions.push('写作基础扎实，需要在流畅度和结构上进一步提升');
  } else if (scores.overallScore >= 60) {
    suggestions.push('写作能力有待提高，建议多阅读英文文章并练习写作');
  } else {
    suggestions.push('需要系统性地提升英语写作能力，建议参加写作培训');
  }

  return suggestions;
}
