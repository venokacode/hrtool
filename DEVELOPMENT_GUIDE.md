# 英语写作测评系统 - 开发指南

## 📖 目录

1. [项目概述](#项目概述)
2. [开发环境设置](#开发环境设置)
3. [项目架构](#项目架构)
4. [核心模块详解](#核心模块详解)
5. [开发流程](#开发流程)
6. [常见问题](#常见问题)
7. [最佳实践](#最佳实践)

---

## 项目概述

### 项目目标

构建一个完整的英语写作测评系统，包括：
- HR配置和测试创建
- 候选人在线写作测试
- 智能评分算法
- 双重报告系统（候选人简化版 + HR专业版）

### 技术选型理由

| 技术 | 选择理由 |
|------|---------|
| **Next.js 14** | 服务端渲染、文件路由、性能优化 |
| **TypeScript** | 类型安全、减少运行时错误 |
| **Tailwind CSS** | 快速开发、一致的设计系统 |
| **shadcn/ui** | 可定制、零bundle成本 |
| **localStorage** | 无需后端、简化部署 |
| **React Hook Form** | 高性能表单处理 |
| **Zod** | 运行时类型验证 |

---

## 开发环境设置

### 1. 必需软件

```bash
# 检查Node.js版本（需要18+）
node -v

# 检查npm版本
npm -v
```

### 2. VS Code扩展（推荐）

在VS Code中安装以下扩展：

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### 3. 启动开发服务器

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 4. 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查

# shadcn/ui
npx shadcn@latest add button    # 添加组件
npx shadcn@latest add dialog    # 添加对话框
```

---

## 项目架构

### 目录结构详解

```
writing-assessment/
│
├── app/                        # Next.js App Router
│   ├── page.tsx               # 首页（HR配置）
│   ├── layout.tsx             # 根布局
│   ├── globals.css            # 全局样式
│   │
│   ├── test/[testId]/         # 测试页面（动态路由）
│   │   └── page.tsx           # 候选人测试主页面
│   │
│   └── hr-reports/            # HR报告系统
│       ├── page.tsx           # 密码验证页面
│       ├── dashboard/         # 报告列表
│       │   └── page.tsx
│       └── view/[reportId]/   # 详细报告
│           └── page.tsx
│
├── components/                 # React组件
│   ├── ui/                    # shadcn/ui基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── textarea.tsx
│   │
│   ├── hr/                    # HR相关组件
│   │   ├── HRConfigForm.tsx          # ✅ 已完成
│   │   ├── TestDurationSelector.tsx  # ⏳ 待开发
│   │   ├── TopicSelector.tsx         # ⏳ 待开发
│   │   └── SharePanel.tsx            # ⏳ 待开发
│   │
│   ├── test/                  # 测试相关组件
│   │   ├── CandidateInfoForm.tsx     # ⏳ 待开发
│   │   ├── WritingEditor.tsx         # ⏳ 待开发
│   │   ├── CountdownTimer.tsx        # ⏳ 待开发
│   │   ├── TestHeader.tsx            # ⏳ 待开发
│   │   └── TestFooter.tsx            # ⏳ 待开发
│   │
│   └── report/                # 报告相关组件
│       ├── CandidateReportCard.tsx   # ⏳ 待开发
│       ├── HRReportDetail.tsx        # ⏳ 待开发
│       └── PasswordVerification.tsx  # ⏳ 待开发
│
├── lib/                       # 核心库
│   ├── storage/              # 本地存储管理
│   │   └── index.ts          # ✅ 已完成
│   │
│   ├── assessment/           # 评估算法
│   │   ├── vocabulary.ts     # ⏳ 待开发
│   │   ├── fluency.ts        # ⏳ 待开发
│   │   ├── grammar.ts        # ⏳ 待开发
│   │   ├── structure.ts      # ⏳ 待开发
│   │   └── scoring.ts        # ⏳ 待开发
│   │
│   └── utils/                # 工具函数
│       ├── helpers.ts        # ✅ 已完成
│       └── utils.ts          # shadcn/ui工具
│
├── types/                    # TypeScript类型定义
│   └── index.ts             # ✅ 已完成
│
├── hooks/                    # 自定义React Hooks
│   ├── useKeystrokeTracking.ts   # ⏳ 待开发
│   ├── useCountdown.ts           # ⏳ 待开发
│   └── useAutoSave.ts            # ⏳ 待开发
│
└── public/                   # 静态资源
    ├── favicon.ico
    └── images/
```

### 数据流架构

```
┌─────────────┐
│   HR配置    │
│  (首页)     │
└──────┬──────┘
       │
       ├─> 保存到 localStorage
       │
       ├─> 生成测试链接
       │
       v
┌─────────────┐
│  候选人测试  │
│ /test/[id]  │
└──────┬──────┘
       │
       ├─> 实时追踪按键
       │
       ├─> 自动保存草稿
       │
       ├─> 提交测试
       │
       v
┌─────────────┐
│  评估算法    │
│  (lib/)     │
└──────┬──────┘
       │
       ├─> 词汇分析
       │
       ├─> 流畅度分析
       │
       ├─> 语法检查
       │
       ├─> 综合评分
       │
       v
┌─────────────┐
│  双重报告    │
│  生成保存    │
└──────┬──────┘
       │
       ├─> 候选人简化报告
       │
       └─> HR专业报告（加密）
```

---

## 核心模块详解

### 1. 类型系统 (types/index.ts)

**已完成的类型定义**：

```typescript
// HR配置
interface HRConfig {
  id: string;
  name: string;
  email: string;
  company?: string;
  department?: string;
  reportPassword: string;
  createdAt: string;
}

// 测试配置
interface TestConfig {
  id: string;
  hrId: string;
  duration: number;
  topic: string;
  topicDescription?: string;
  createdAt: string;
}

// 候选人测试
interface CandidateTest {
  id: string;
  testId: string;
  candidateInfo: CandidateInfo;
  writingProcess: WritingProcess;
  submittedAt?: number;
  timeUsed?: number;
  status: 'in_progress' | 'completed' | 'expired';
}

// 评分结构
interface WritingScore {
  vocabulary: VocabularyScore;
  fluency: FluencyScore;
  grammar: GrammarScore;
  structure: StructureScore;
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  suggestions: string[];
}
```

**使用示例**：

```typescript
import { HRConfig, TestConfig } from '@/types';

const config: HRConfig = {
  id: 'hr_abc123',
  name: 'John Doe',
  email: 'john@company.com',
  reportPassword: '8889',
  createdAt: new Date().toISOString(),
};
```

### 2. 存储系统 (lib/storage/index.ts)

**核心功能**：

```typescript
import StorageManager from '@/lib/storage';

// 保存HR配置
StorageManager.saveHRConfig(config);

// 获取HR配置
const hrConfig = StorageManager.getHRConfig();

// 保存测试配置
StorageManager.saveTestConfig(testConfig);

// 获取测试配置
const test = StorageManager.getTestConfig(testId);

// 保存候选人测试数据
StorageManager.saveCandidateTest(candidateTest);

// 保存HR报告（加密）
StorageManager.saveHRReport(report);

// 验证密码并获取报告
const report = StorageManager.getHRReport(reportId, password);
```

**数据加密**：

- HR报告使用AES加密存储
- 需要密码才能访问
- 默认密码：8889

### 3. 工具函数 (lib/utils/helpers.ts)

**常用函数**：

```typescript
import {
  generateId,
  generateTestLink,
  formatDateTime,
  countWords,
  calculateWPM,
  copyToClipboard,
} from '@/lib/utils/helpers';

// 生成唯一ID
const testId = generateId('test'); // "test_abc123xyz"

// 生成测试链接
const link = generateTestLink(testId);
// "https://yourdomain.com/test/test_abc123xyz"

// 格式化日期
const date = formatDateTime(new Date());
// "2024-01-03 14:30:00"

// 计算字数
const wordCount = countWords("Hello world"); // 2

// 计算WPM
const wpm = calculateWPM(300, 600); // 300词 / 10分钟 = 30 WPM

// 复制到剪贴板
await copyToClipboard("https://test-link.com");
```

---

## 开发流程

### Phase 2: 完成HR配置模块

#### 2.1 创建时长选择组件

**文件**: `components/hr/TestDurationSelector.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TestDurationSelectorProps {
  value: number;
  onChange: (duration: number) => void;
}

export default function TestDurationSelector({ value, onChange }: TestDurationSelectorProps) {
  const [isCustom, setIsCustom] = useState(false);
  const presetDurations = [15, 20, 25, 30];

  return (
    <div className="space-y-4">
      <Label>测试时长（分钟）</Label>
      
      {/* 预设选项 */}
      <div className="grid grid-cols-4 gap-2">
        {presetDurations.map((duration) => (
          <Button
            key={duration}
            type="button"
            variant={value === duration && !isCustom ? 'default' : 'outline'}
            onClick={() => {
              setIsCustom(false);
              onChange(duration);
            }}
          >
            {duration}分钟
          </Button>
        ))}
      </div>

      {/* 自定义输入 */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={isCustom ? 'default' : 'outline'}
          onClick={() => setIsCustom(true)}
        >
          自定义
        </Button>
        {isCustom && (
          <Input
            type="number"
            min={5}
            max={60}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder="5-60分钟"
          />
        )}
      </div>
    </div>
  );
}
```

#### 2.2 创建主题选择组件

**文件**: `components/hr/TopicSelector.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TopicSelectorProps {
  value: string;
  onChange: (topic: string) => void;
}

const PRESET_TOPICS = [
  'Describe your ideal workplace environment',
  'The importance of teamwork in modern business',
  'How technology has changed communication',
  'Your experience with remote work',
  'The role of leadership in organizations',
  'Challenges facing businesses today',
  'The impact of globalization',
  'Your career goals and aspirations',
];

export default function TopicSelector({ value, onChange }: TopicSelectorProps) {
  const [isCustom, setIsCustom] = useState(false);

  return (
    <div className="space-y-4">
      <Label>写作主题</Label>
      
      {/* 预设主题 */}
      <div className="grid grid-cols-2 gap-2">
        {PRESET_TOPICS.map((topic, index) => (
          <Button
            key={index}
            type="button"
            variant={value === topic && !isCustom ? 'default' : 'outline'}
            className="h-auto py-3 text-left justify-start"
            onClick={() => {
              setIsCustom(false);
              onChange(topic);
            }}
          >
            {topic}
          </Button>
        ))}
      </div>

      {/* 自定义主题 */}
      <div className="space-y-2">
        <Button
          type="button"
          variant={isCustom ? 'default' : 'outline'}
          onClick={() => setIsCustom(true)}
        >
          自定义主题
        </Button>
        {isCustom && (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="输入自定义写作主题..."
            rows={3}
          />
        )}
      </div>
    </div>
  );
}
```

#### 2.3 创建分享面板组件

**文件**: `components/hr/SharePanel.tsx`

```typescript
'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { copyToClipboard } from '@/lib/utils/helpers';

interface SharePanelProps {
  testLink: string;
}

export default function SharePanel({ testLink }: SharePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(testLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('英语写作测试邀请');
    const body = encodeURIComponent(
      `您好，\n\n请点击以下链接完成英语写作测试：\n\n${testLink}\n\n祝好！`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>分享测试链接</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 链接 */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input value={testLink} readOnly />
            <Button onClick={handleCopy}>
              {copied ? '已复制!' : '复制'}
            </Button>
          </div>
        </div>

        {/* 二维码 */}
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg border">
            <QRCodeSVG value={testLink} size={200} />
          </div>
        </div>

        {/* 分享按钮 */}
        <div className="flex gap-2">
          <Button onClick={handleEmailShare} variant="outline" className="flex-1">
            📧 邮件分享
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Phase 3: 开发候选人测试界面

#### 3.1 创建写作编辑器

**文件**: `components/test/WritingEditor.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { countWords } from '@/lib/utils/helpers';

interface WritingEditorProps {
  value: string;
  onChange: (value: string) => void;
  onKeystroke?: (event: KeystrokeEvent) => void;
}

export default function WritingEditor({ value, onChange, onKeystroke }: WritingEditorProps) {
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setWordCount(countWords(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onKeystroke) {
      onKeystroke({
        type: e.key === 'Backspace' ? 'delete' : 'type',
        timestamp: Date.now(),
      });
    }
  };

  const handlePaste = () => {
    if (onKeystroke) {
      onKeystroke({
        type: 'paste',
        timestamp: Date.now(),
      });
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder="开始写作..."
        className="min-h-[400px] text-lg font-serif"
      />
      
      <div className="text-sm text-gray-600">
        字数: <span className="font-semibold">{wordCount}</span>
      </div>
    </div>
  );
}
```

#### 3.2 创建倒计时组件

**文件**: `components/test/CountdownTimer.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { formatDuration } from '@/lib/utils/helpers';

interface CountdownTimerProps {
  durationInMinutes: number;
  onTimeUp: () => void;
}

export default function CountdownTimer({ durationInMinutes, onTimeUp }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  const percentage = (timeLeft / (durationInMinutes * 60)) * 100;
  const isWarning = timeLeft <= 60;

  const getColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-2">
      <div className={`text-2xl font-bold text-center ${isWarning ? 'text-red-600 animate-pulse' : ''}`}>
        剩余时间: {formatDuration(timeLeft)}
      </div>
      
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

---

## 常见问题

### Q1: localStorage数据丢失怎么办？

**A**: 实现数据导出/导入功能：

```typescript
// 导出数据
const data = StorageManager.exportAllData();
downloadFile(data, 'backup.json', 'application/json');

// 导入数据
const success = StorageManager.importData(jsonData);
```

### Q2: 如何测试不同的测试时长？

**A**: 在开发环境可以修改时长为秒：

```typescript
// 开发环境：1分钟 = 10秒
const duration = process.env.NODE_ENV === 'development' 
  ? durationInMinutes * 10 
  : durationInMinutes * 60;
```

### Q3: 如何添加新的shadcn/ui组件？

**A**: 使用CLI命令：

```bash
npx shadcn@latest add select
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
```

### Q4: TypeScript类型错误怎么解决？

**A**: 确保导入正确的类型：

```typescript
import { HRConfig, TestConfig } from '@/types';
```

---

## 最佳实践

### 1. 组件设计原则

- **单一职责**: 每个组件只负责一个功能
- **可复用**: 通过props传递数据和回调
- **类型安全**: 定义清晰的Props接口

```typescript
interface ComponentProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}
```

### 2. 状态管理

- **本地状态**: 使用useState
- **表单状态**: 使用React Hook Form
- **全局状态**: 使用Zustand（如需要）

### 3. 性能优化

```typescript
// 使用useMemo缓存计算结果
const wordCount = useMemo(() => countWords(text), [text]);

// 使用useCallback缓存回调函数
const handleChange = useCallback((value: string) => {
  onChange(value);
}, [onChange]);

// 使用防抖处理频繁操作
const debouncedSave = debounce(saveToStorage, 1000);
```

### 4. 错误处理

```typescript
try {
  StorageManager.saveHRConfig(config);
} catch (error) {
  console.error('保存失败:', error);
  // 显示错误提示
  toast.error('保存失败，请重试');
}
```

### 5. 代码组织

```typescript
// ✅ 好的做法
export default function Component() {
  // 1. Hooks
  const [state, setState] = useState();
  
  // 2. 副作用
  useEffect(() => {}, []);
  
  // 3. 事件处理
  const handleClick = () => {};
  
  // 4. 渲染
  return <div>...</div>;
}

// ❌ 避免的做法
export default function Component() {
  const handleClick = () => {};
  const [state, setState] = useState();
  useEffect(() => {}, []);
  return <div>...</div>;
}
```

---

## 调试技巧

### 1. 查看localStorage数据

```javascript
// 在浏览器控制台
console.log(localStorage);

// 查看特定数据
console.log(JSON.parse(localStorage.getItem('hr_config')));
```

### 2. React DevTools

安装React Developer Tools扩展，可以：
- 查看组件树
- 检查Props和State
- 追踪组件重渲染

### 3. 网络请求（如果后续添加API）

使用Chrome DevTools的Network标签监控请求。

---

## 下一步计划

1. ✅ **完成HR配置模块** - 添加时长选择、主题选择、分享面板
2. ⏳ **开发测试界面** - 写作编辑器、倒计时、自动保存
3. ⏳ **实现评估算法** - 词汇、语法、流畅度分析
4. ⏳ **构建报告系统** - 双重报告生成和展示
5. ⏳ **优化和测试** - UI/UX改进、性能优化

---

**文档版本**: v1.0  
**最后更新**: 2024-01-03  
**维护者**: 开发团队
