/**
 * 英语写作测评系统 - 类型定义
 * 定义所有数据结构的TypeScript接口
 */

// ============================================
// HR配置相关类型
// ============================================

/**
 * HR配置信息
 */
export interface HRConfig {
  id: string;
  name: string;
  email: string;
  company?: string;
  department?: string;
  reportPassword: string;
  createdAt: string;
}

/**
 * 测试配置信息
 */
export interface TestConfig {
  id: string;
  hrId: string;
  duration: number; // 测试时长（分钟）
  topic: string; // 写作主题
  topicDescription?: string; // 主题描述（可选）
  createdAt: string;
  expiresAt?: string; // 过期时间（可选）
}

// ============================================
// 候选人测试相关类型
// ============================================

/**
 * 候选人基本信息
 */
export interface CandidateInfo {
  name: string;
  email: string;
}

/**
 * 按键事件类型
 */
export type KeystrokeEventType = 'type' | 'delete' | 'paste' | 'cut';

/**
 * 按键追踪事件
 */
export interface KeystrokeEvent {
  type: KeystrokeEventType;
  timestamp: number;
  content?: string; // 粘贴内容或删除内容
  position?: number; // 光标位置
}

/**
 * 写作过程数据
 */
export interface WritingProcess {
  content: string; // 当前文本内容
  wordCount: number; // 字数
  characterCount: number; // 字符数
  keystrokeEvents: KeystrokeEvent[]; // 按键事件列表
  startTime: number; // 开始时间戳
  lastSaveTime: number; // 最后保存时间
  pauseCount: number; // 暂停次数
  revisionCount: number; // 修改次数
}

/**
 * 候选人测试完整数据
 */
export interface CandidateTest {
  id: string;
  testId: string;
  candidateInfo: CandidateInfo;
  writingProcess: WritingProcess;
  submittedAt?: number; // 提交时间
  timeUsed?: number; // 实际用时（秒）
  status: 'in_progress' | 'completed' | 'expired';
}

// ============================================
// 评分相关类型
// ============================================

/**
 * 词汇评分
 */
export interface VocabularyScore {
  totalWords: number; // 总词数
  uniqueWords: number; // 唯一词数
  ttr: number; // Type-Token Ratio (词汇丰富度)
  advancedWords: number; // 高级词汇数量
  score: number; // 词汇得分 (0-100)
}

/**
 * 流畅度评分
 */
export interface FluencyScore {
  wpm: number; // Words Per Minute
  averagePauseTime: number; // 平均暂停时间（秒）
  pauseCount: number; // 暂停次数
  revisionRate: number; // 修改率
  score: number; // 流畅度得分 (0-100)
}

/**
 * 语法评分
 */
export interface GrammarScore {
  sentenceCount: number; // 句子数量
  averageSentenceLength: number; // 平均句子长度
  complexSentences: number; // 复合句数量
  errors: string[]; // 错误列表
  score: number; // 语法得分 (0-100)
}

/**
 * 结构评分
 */
export interface StructureScore {
  paragraphCount: number; // 段落数量
  hasIntroduction: boolean; // 是否有引言
  hasConclusion: boolean; // 是否有结论
  coherence: number; // 连贯性得分 (0-1)
  score: number; // 结构得分 (0-100)
}

/**
 * 综合评分
 */
export interface WritingScore {
  vocabulary: VocabularyScore;
  fluency: FluencyScore;
  grammar: GrammarScore;
  structure: StructureScore;
  overallScore: number; // 总分 (0-100)
  grade: 'A' | 'B' | 'C' | 'D' | 'F'; // 等级
  suggestions: string[]; // 改进建议
}

// ============================================
// 报告相关类型
// ============================================

/**
 * 候选人简化报告（候选人可见）
 */
export interface CandidateReport {
  id: string;
  candidateInfo: CandidateInfo;
  score: WritingScore;
  generatedAt: number;
}

/**
 * HR专业报告（HR可见，包含详细数据）
 */
export interface HRProfessionalReport {
  id: string;
  candidateTest: CandidateTest;
  score: WritingScore;
  testConfig: TestConfig;
  generatedAt: number;
}

// ============================================
// 工具类型
// ============================================

/**
 * API响应通用类型
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 存储键名枚举
 */
export enum StorageKey {
  HR_CONFIG = 'hr_config',
  TEST_CONFIGS = 'test_configs',
  CANDIDATE_TESTS = 'candidate_tests',
  CANDIDATE_REPORTS = 'candidate_reports',
  HR_REPORTS = 'hr_reports',
}

/**
 * 测试状态
 */
export type TestStatus = 'draft' | 'active' | 'completed' | 'expired';

/**
 * 时间格式化选项
 */
export interface TimeFormatOptions {
  showSeconds?: boolean;
  format?: '12h' | '24h';
}
