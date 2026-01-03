# 英语写作测评系统

一个基于 Next.js 14 的英语写作测评系统，为HR提供候选人英语写作能力的专业评估。

## 🎯 项目特点

- ✅ **现代技术栈**: Next.js 14 + TypeScript + Tailwind CSS
- ✅ **零后端依赖**: 使用浏览器本地存储，无需服务器
- ✅ **组件化设计**: 基于 shadcn/ui 的可复用组件
- ✅ **类型安全**: 完整的 TypeScript 类型定义
- ✅ **响应式设计**: 支持桌面和移动设备
- ✅ **一键部署**: 支持 Vercel 零配置部署

## 📦 技术栈

### 核心框架
- **Next.js 14** - React 框架（App Router）
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架

### UI组件
- **shadcn/ui** - 可定制的UI组件库
- **Radix UI** - 无障碍组件基础

### 核心库
- **React Hook Form** - 表单处理
- **Zod** - 数据验证
- **date-fns** - 日期时间处理
- **qrcode.react** - 二维码生成
- **crypto-js** - 数据加密
- **Zustand** - 状态管理
- **nanoid** - 唯一ID生成

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 pnpm

### 安装步骤

1. **克隆或进入项目目录**
```bash
cd writing-assessment
```

2. **安装依赖**
```bash
npm install
# 或
pnpm install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
pnpm dev
```

4. **打开浏览器访问**
```
http://localhost:3000
```

### 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
writing-assessment/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # 首页（HR配置）
│   ├── test/[testId]/           # 测试页面（动态路由）
│   │   └── page.tsx
│   ├── hr-reports/              # HR报告页面
│   │   └── page.tsx
│   ├── layout.tsx               # 根布局
│   └── globals.css              # 全局样式
│
├── components/                   # React组件
│   ├── ui/                      # shadcn/ui组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── textarea.tsx
│   ├── hr/                      # HR相关组件
│   │   └── HRConfigForm.tsx
│   ├── test/                    # 测试相关组件
│   └── report/                  # 报告相关组件
│
├── lib/                         # 核心库
│   ├── storage/                 # 本地存储管理
│   │   └── index.ts
│   ├── assessment/              # 评估算法
│   ├── utils/                   # 工具函数
│   │   ├── helpers.ts
│   │   └── utils.ts
│
├── types/                       # TypeScript类型定义
│   └── index.ts
│
├── hooks/                       # 自定义React Hooks
│
├── public/                      # 静态资源
│
├── components.json              # shadcn/ui配置
├── tailwind.config.ts           # Tailwind CSS配置
├── tsconfig.json                # TypeScript配置
└── package.json                 # 项目依赖
```

## 🎨 核心功能模块

### Phase 1: 项目基础（✅ 已完成）

- ✅ Next.js 14 项目初始化
- ✅ TypeScript 类型定义系统
- ✅ 本地存储管理系统
- ✅ shadcn/ui 组件配置
- ✅ 基础页面框架

### Phase 2: HR配置模块（🚧 进行中）

- ✅ HR信息配置表单
- ⏳ 测试参数配置
- ⏳ 链接生成与分享

### Phase 3: 候选人测试界面（📋 待开发）

- ⏳ 测试页面基础框架
- ⏳ 候选人信息收集
- ⏳ 写作编辑器
- ⏳ 倒计时系统
- ⏳ 提交和报告生成

### Phase 4: 报告系统（📋 待开发）

- ⏳ 候选人简化报告
- ⏳ HR报告访问系统

### Phase 5: 评估算法（📋 待开发）

- ⏳ 基础指标计算
- ⏳ 语法和结构分析
- ⏳ 综合评分系统

### Phase 6: 优化和完善（📋 待开发）

- ⏳ UI/UX优化
- ⏳ 测试和Bug修复
- ⏳ 部署上线

## 🛠️ 开发指南

### 添加新的UI组件

使用 shadcn/ui CLI 添加组件：

```bash
npx shadcn@latest add [component-name]
```

例如：
```bash
npx shadcn@latest add select
npx shadcn@latest add dropdown-menu
```

### 类型定义

所有类型定义在 `types/index.ts` 中，包括：

- `HRConfig` - HR配置信息
- `TestConfig` - 测试配置
- `CandidateTest` - 候选人测试数据
- `WritingScore` - 评分结构
- `CandidateReport` - 候选人报告
- `HRProfessionalReport` - HR专业报告

### 本地存储API

使用 `StorageManager` 类管理数据：

```typescript
import StorageManager from '@/lib/storage';

// 保存HR配置
StorageManager.saveHRConfig(config);

// 获取HR配置
const config = StorageManager.getHRConfig();

// 保存测试配置
StorageManager.saveTestConfig(testConfig);

// 获取测试配置
const test = StorageManager.getTestConfig(testId);
```

### 工具函数

常用工具函数在 `lib/utils/helpers.ts` 中：

```typescript
import { generateId, formatDateTime, countWords } from '@/lib/utils/helpers';

// 生成唯一ID
const id = generateId('test');

// 格式化日期
const date = formatDateTime(new Date());

// 计算字数
const wordCount = countWords(text);
```

## 🎯 下一步开发计划

### 1. 完成HR配置模块（优先级：高）

**文件位置**: `components/hr/`

需要创建的组件：
- `TestDurationSelector.tsx` - 时长选择组件
- `TopicSelector.tsx` - 主题选择组件
- `SharePanel.tsx` - 分享面板组件

**功能要求**：
- 预设时长选项：15/20/25/30分钟
- 自定义时长输入：5-60分钟
- 预设主题库（8个主题）
- 自定义主题输入
- 生成唯一测试链接
- 生成二维码
- 复制链接功能

### 2. 开发候选人测试界面（优先级：高）

**文件位置**: `app/test/[testId]/page.tsx`, `components/test/`

需要创建的组件：
- `CandidateInfoForm.tsx` - 信息收集表单
- `WritingEditor.tsx` - 写作编辑器
- `CountdownTimer.tsx` - 倒计时组件
- `TestHeader.tsx` - 测试页头
- `TestFooter.tsx` - 测试页脚

**核心功能**：
- 候选人信息收集（姓名、邮箱）
- 大型文本编辑区域
- 实时字数统计
- 按键追踪（打字、删除、粘贴）
- 倒计时显示（彩色进度条）
- 自动保存（每30秒）
- 时间到自动提交

### 3. 实现评估算法（优先级：中）

**文件位置**: `lib/assessment/`

需要创建的文件：
- `vocabulary.ts` - 词汇分析
- `fluency.ts` - 流畅度分析
- `grammar.ts` - 语法检查
- `structure.ts` - 结构分析
- `scoring.ts` - 综合评分

**推荐使用的库**：
```bash
npm install compromise
```

### 4. 开发报告系统（优先级：中）

**文件位置**: `components/report/`, `app/hr-reports/`

需要创建的组件：
- `CandidateReportCard.tsx` - 候选人报告卡片
- `HRReportDetail.tsx` - HR详细报告
- `PasswordVerification.tsx` - 密码验证组件
- `ReportsList.tsx` - 报告列表

### 5. UI/UX优化（优先级：低）

- 添加加载动画
- 优化过渡效果
- 改进错误提示
- 响应式设计优化
- 暗色模式支持

## 📝 代码规范

### TypeScript

- 所有组件必须有类型定义
- 使用接口定义props
- 避免使用 `any` 类型

### React组件

- 使用函数组件
- 使用 React Hooks
- 组件文件使用 PascalCase 命名
- 一个文件一个组件

### 样式

- 优先使用 Tailwind CSS
- 使用 `cn()` 函数合并类名
- 避免内联样式

### 提交规范

```
feat: 添加新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
test: 测试相关
chore: 构建/工具相关
```

## 🚀 部署

### Vercel部署（推荐）

1. 将代码推送到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 导入 GitHub 仓库
4. 自动部署完成

### 手动部署

```bash
npm run build
npm start
```

## 📚 学习资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 组件库](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod 验证库](https://zod.dev/)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

## 👥 作者

英语写作测评系统开发团队

---

**当前版本**: v0.1.0 (开发中)  
**最后更新**: 2024-01-03
