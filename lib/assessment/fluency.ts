/**
 * 流畅度分析模块
 * 分析写作速度、暂停次数、修改率等指标
 */

import { KeystrokeEvent, FluencyScore } from '@/types';

/**
 * 分析流畅度
 */
export function analyzeFluency(
  content: string,
  keystrokeEvents: KeystrokeEvent[],
  timeUsed: number // 秒
): FluencyScore {
  if (!content || content.trim().length === 0) {
    return {
      wpm: 0,
      pauseCount: 0,
      averagePauseTime: 0,
      revisionRate: 0,
      score: 0,
    };
  }

  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  const timeInMinutes = timeUsed / 60;

  // 计算WPM (Words Per Minute)
  const wpm = timeInMinutes > 0 ? Math.round(wordCount / timeInMinutes) : 0;

  // 分析暂停
  let pauseCount = 0;
  let totalPauseTime = 0;
  
  for (let i = 1; i < keystrokeEvents.length; i++) {
    const timeDiff = keystrokeEvents[i].timestamp - keystrokeEvents[i - 1].timestamp;
    // 超过3秒算一次暂停
    if (timeDiff > 3000) {
      pauseCount++;
      totalPauseTime += timeDiff;
    }
  }

  const averagePauseTime = pauseCount > 0 
    ? Math.round(totalPauseTime / pauseCount / 1000) 
    : 0;

  // 计算修改率
  const deleteCount = keystrokeEvents.filter(e => e.type === 'delete').length;
  const totalEvents = keystrokeEvents.length;
  const revisionRate = totalEvents > 0 
    ? Math.round((deleteCount / totalEvents) * 100) / 100 
    : 0;

  // 计算评分 (0-100)
  let score = 0;

  // WPM评分 (40分)
  // 优秀: 40+ WPM, 良好: 30-40, 一般: 20-30, 较差: < 20
  if (wpm >= 40) {
    score += 40;
  } else if (wpm >= 30) {
    score += 35;
  } else if (wpm >= 20) {
    score += 25;
  } else {
    score += 15;
  }

  // 暂停次数评分 (30分)
  // 暂停越少越好，但过少可能说明没有思考
  // 优秀: 5-15次, 良好: 15-25次, 一般: 25-40次, 较差: > 40次或 < 5次
  if (pauseCount >= 5 && pauseCount <= 15) {
    score += 30;
  } else if (pauseCount >= 15 && pauseCount <= 25) {
    score += 25;
  } else if (pauseCount >= 25 && pauseCount <= 40) {
    score += 15;
  } else {
    score += 10;
  }

  // 修改率评分 (30分)
  // 适度修改是好的，但过多修改说明不流畅
  // 优秀: 0.1-0.2, 良好: 0.2-0.3, 一般: 0.3-0.4, 较差: > 0.4 或 < 0.1
  if (revisionRate >= 0.1 && revisionRate <= 0.2) {
    score += 30;
  } else if (revisionRate >= 0.2 && revisionRate <= 0.3) {
    score += 25;
  } else if (revisionRate >= 0.3 && revisionRate <= 0.4) {
    score += 15;
  } else {
    score += 10;
  }

  return {
    wpm,
    pauseCount,
    averagePauseTime,
    revisionRate,
    score: Math.min(100, score),
  };
}
