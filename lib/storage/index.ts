/**
 * 本地存储管理系统
 * 提供数据持久化、加密、CRUD操作
 */

import CryptoJS from 'crypto-js';
import {
  HRConfig,
  TestConfig,
  CandidateTest,
  CandidateReport,
  HRProfessionalReport,
  StorageKey,
} from '@/types';

/**
 * 存储管理器类
 */
export class StorageManager {
  private static ENCRYPTION_KEY = 'writing-assessment-2024'; // 加密密钥

  /**
   * 检查是否在浏览器环境
   */
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * 加密数据
   */
  private static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
  }

  /**
   * 解密数据
   */
  private static decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * 保存数据到localStorage
   */
  private static setItem(key: string, value: any, encrypt: boolean = false): void {
    if (!this.isBrowser()) return;

    try {
      const jsonString = JSON.stringify(value);
      const dataToStore = encrypt ? this.encrypt(jsonString) : jsonString;
      localStorage.setItem(key, dataToStore);
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  }

  /**
   * 从localStorage读取数据
   */
  private static getItem<T>(key: string, encrypted: boolean = false): T | null {
    if (!this.isBrowser()) return null;

    try {
      const data = localStorage.getItem(key);
      if (!data) return null;

      const jsonString = encrypted ? this.decrypt(data) : data;
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  /**
   * 删除localStorage中的数据
   */
  private static removeItem(key: string): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(key);
  }

  /**
   * 清空所有数据
   */
  static clearAll(): void {
    if (!this.isBrowser()) return;
    localStorage.clear();
  }

  // ============================================
  // HR配置相关方法
  // ============================================

  /**
   * 保存HR配置
   */
  static saveHRConfig(config: HRConfig): void {
    this.setItem(StorageKey.HR_CONFIG, config);
  }

  /**
   * 获取HR配置
   */
  static getHRConfig(): HRConfig | null {
    return this.getItem<HRConfig>(StorageKey.HR_CONFIG);
  }

  /**
   * 删除HR配置
   */
  static removeHRConfig(): void {
    this.removeItem(StorageKey.HR_CONFIG);
  }

  // ============================================
  // 测试配置相关方法
  // ============================================

  /**
   * 保存测试配置
   */
  static saveTestConfig(config: TestConfig): void {
    const configs = this.getAllTestConfigs();
    const existingIndex = configs.findIndex((c) => c.id === config.id);

    if (existingIndex >= 0) {
      configs[existingIndex] = config;
    } else {
      configs.push(config);
    }

    this.setItem(StorageKey.TEST_CONFIGS, configs);
  }

  /**
   * 获取单个测试配置
   */
  static getTestConfig(testId: string): TestConfig | null {
    const configs = this.getAllTestConfigs();
    return configs.find((c) => c.id === testId) || null;
  }

  /**
   * 获取所有测试配置
   */
  static getAllTestConfigs(): TestConfig[] {
    return this.getItem<TestConfig[]>(StorageKey.TEST_CONFIGS) || [];
  }

  /**
   * 删除测试配置
   */
  static removeTestConfig(testId: string): void {
    const configs = this.getAllTestConfigs();
    const filtered = configs.filter((c) => c.id !== testId);
    this.setItem(StorageKey.TEST_CONFIGS, filtered);
  }

  // ============================================
  // 候选人测试相关方法
  // ============================================

  /**
   * 保存候选人测试数据
   */
  static saveCandidateTest(test: CandidateTest): void {
    const tests = this.getAllCandidateTests();
    const existingIndex = tests.findIndex((t) => t.id === test.id);

    if (existingIndex >= 0) {
      tests[existingIndex] = test;
    } else {
      tests.push(test);
    }

    this.setItem(StorageKey.CANDIDATE_TESTS, tests);
  }

  /**
   * 获取候选人测试数据
   */
  static getCandidateTest(candidateTestId: string): CandidateTest | null {
    const tests = this.getAllCandidateTests();
    return tests.find((t) => t.id === candidateTestId) || null;
  }

  /**
   * 获取所有候选人测试数据
   */
  static getAllCandidateTests(): CandidateTest[] {
    return this.getItem<CandidateTest[]>(StorageKey.CANDIDATE_TESTS) || [];
  }

  /**
   * 删除候选人测试数据
   */
  static removeCandidateTest(testId: string): void {
    const tests = this.getAllCandidateTests();
    const filtered = tests.filter((t) => t.testId !== testId);
    this.setItem(StorageKey.CANDIDATE_TESTS, filtered);
  }

  // ============================================
  // 候选人报告相关方法
  // ============================================

  /**
   * 保存候选人报告
   */
  static saveCandidateReport(report: CandidateReport): void {
    const reports = this.getAllCandidateReports();
    const existingIndex = reports.findIndex((r) => r.id === report.id);

    if (existingIndex >= 0) {
      reports[existingIndex] = report;
    } else {
      reports.push(report);
    }

    this.setItem(StorageKey.CANDIDATE_REPORTS, reports);
  }

  /**
   * 获取候选人报告
   */
  static getCandidateReport(reportId: string): CandidateReport | null {
    const reports = this.getAllCandidateReports();
    return reports.find((r) => r.id === reportId) || null;
  }

  /**
   * 获取所有候选人报告
   */
  static getAllCandidateReports(): CandidateReport[] {
    return this.getItem<CandidateReport[]>(StorageKey.CANDIDATE_REPORTS) || [];
  }

  // ============================================
  // HR专业报告相关方法
  // ============================================

  /**
   * 保存HR专业报告（加密存储）
   */
  static saveHRReport(report: HRProfessionalReport): void {
    const reports = this.getAllHRReports();
    const existingIndex = reports.findIndex((r) => r.id === report.id);

    if (existingIndex >= 0) {
      reports[existingIndex] = report;
    } else {
      reports.push(report);
    }

    this.setItem(StorageKey.HR_REPORTS, reports, true); // 加密存储
  }

  /**
   * 获取HR专业报告（需要密码验证）
   */
  static getHRReport(reportId: string, password: string): HRProfessionalReport | null {
    // 验证密码
    const hrConfig = this.getHRConfig();
    if (!hrConfig || hrConfig.reportPassword !== password) {
      return null;
    }

    const reports = this.getAllHRReports();
    return reports.find((r) => r.id === reportId) || null;
  }

  /**
   * 获取所有HR专业报告（需要密码验证）
   */
  static getAllHRReports(password?: string): HRProfessionalReport[] {
    // 如果提供密码，验证密码
    if (password) {
      const hrConfig = this.getHRConfig();
      if (!hrConfig || hrConfig.reportPassword !== password) {
        return [];
      }
    }

    return this.getItem<HRProfessionalReport[]>(StorageKey.HR_REPORTS, true) || [];
  }

  /**
   * 验证HR报告密码
   */
  static verifyHRPassword(password: string): boolean {
    const hrConfig = this.getHRConfig();
    return hrConfig?.reportPassword === password;
  }

  // ============================================
  // 工具方法
  // ============================================

  /**
   * 获取存储使用情况
   */
  static getStorageInfo(): {
    used: number;
    total: number;
    percentage: number;
  } {
    if (!this.isBrowser()) {
      return { used: 0, total: 0, percentage: 0 };
    }

    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    const total = 5 * 1024 * 1024; // 5MB (typical localStorage limit)
    const percentage = (used / total) * 100;

    return { used, total, percentage };
  }

  /**
   * 导出所有数据（用于备份）
   */
  static exportAllData(): string {
    if (!this.isBrowser()) return '{}';

    const data = {
      hrConfig: this.getHRConfig(),
      testConfigs: this.getAllTestConfigs(),
      candidateTests: this.getAllCandidateTests(),
      candidateReports: this.getAllCandidateReports(),
      hrReports: this.getAllHRReports(), // 注意：导出时不加密
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * 导入数据（用于恢复）
   */
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.hrConfig) this.saveHRConfig(data.hrConfig);
      if (data.testConfigs) this.setItem(StorageKey.TEST_CONFIGS, data.testConfigs);
      if (data.candidateTests) this.setItem(StorageKey.CANDIDATE_TESTS, data.candidateTests);
      if (data.candidateReports) this.setItem(StorageKey.CANDIDATE_REPORTS, data.candidateReports);
      if (data.hrReports) this.setItem(StorageKey.HR_REPORTS, data.hrReports, true);

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// 导出单例实例
export default StorageManager;
