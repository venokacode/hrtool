/**
 * 通用工具函数
 */

import { nanoid } from 'nanoid';
import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 生成唯一ID
 */
export function generateId(prefix?: string): string {
  const id = nanoid(10);
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * 生成测试链接
 */
export function generateTestLink(testId: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/test/${testId}`;
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: string | number | Date, formatStr: string = 'yyyy-MM-dd HH:mm:ss'): string {
  return format(new Date(date), formatStr, { locale: zhCN });
}

/**
 * 格式化相对时间（如：3分钟前）
 */
export function formatRelativeTime(date: string | number | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: zhCN });
}

/**
 * 格式化时长（秒转为可读格式）
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}秒`;
  }

  return remainingSeconds > 0 
    ? `${minutes}分${remainingSeconds}秒`
    : `${minutes}分钟`;
}

/**
 * 计算字数（英文单词）
 */
export function countWords(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  
  // 移除多余空格，按空格分割
  const words = text.trim().split(/\s+/);
  return words.filter(word => word.length > 0).length;
}

/**
 * 计算字符数（不包括空格）
 */
export function countCharacters(text: string, includeSpaces: boolean = false): number {
  if (!text) return 0;
  
  if (includeSpaces) {
    return text.length;
  }
  
  return text.replace(/\s/g, '').length;
}

/**
 * 计算WPM (Words Per Minute)
 */
export function calculateWPM(wordCount: number, timeInSeconds: number): number {
  if (timeInSeconds === 0) return 0;
  const minutes = timeInSeconds / 60;
  return Math.round(wordCount / minutes);
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 安全的JSON解析
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 获取等级颜色
 */
export function getGradeColor(grade: 'A' | 'B' | 'C' | 'D' | 'F'): string {
  const colors = {
    A: 'text-green-600',
    B: 'text-blue-600',
    C: 'text-yellow-600',
    D: 'text-orange-600',
    F: 'text-red-600',
  };
  return colors[grade];
}

/**
 * 获取分数对应的等级
 */
export function getGradeFromScore(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * 下载文件
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 生成随机颜色
 */
export function generateRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

/**
 * 延迟函数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
