# 🚀 快速启动指南

## 项目已完成的部分

✅ **Phase 1: 项目基础搭建（100%完成）**
- Next.js 14 项目初始化
- TypeScript 类型定义系统（完整）
- 本地存储管理系统（完整）
- shadcn/ui 组件配置
- 工具函数库

✅ **Phase 2: HR配置模块（30%完成）**
- HR信息配置表单（已完成）
- 测试参数配置（待开发）
- 链接生成与分享（待开发）

## 立即开始开发

### 1. 启动项目

```bash
# 进入项目目录
cd writing-assessment

# 安装依赖（如果还没安装）
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看效果

### 2. 当前可以看到什么

- ✅ 首页：HR配置表单（可以填写并保存）
- ✅ 测试页面：基础框架（/test/[testId]）
- ✅ HR报告页面：占位页面（/hr-reports）

### 3. 测试HR配置表单

1. 打开 http://localhost:3000
2. 填写表单：
   - 姓名：张三
   - 邮箱：zhangsan@company.com
   - 公司：测试公司（可选）
   - 部门：人力资源部（可选）
   - 密码：8889（默认）
3. 点击"保存配置"
4. 数据会保存到浏览器localStorage

### 4. 查看已保存的数据

打开浏览器开发者工具（F12）→ Application → Local Storage → localhost:3000

你会看到：
- `hr_config`: HR配置信息

## 下一步开发任务

### 优先级1：完成HR配置模块

**需要创建的文件**：

1. `components/hr/TestDurationSelector.tsx`
   - 预设时长：15/20/25/30分钟
   - 自定义时长：5-60分钟

2. `components/hr/TopicSelector.tsx`
   - 8个预设主题
   - 自定义主题输入

3. `components/hr/SharePanel.tsx`
   - 显示测试链接
   - 生成二维码
   - 复制链接按钮

**参考代码**: 查看 `DEVELOPMENT_GUIDE.md` 中的详细实现

### 优先级2：开发候选人测试界面

**需要创建的文件**：

1. `components/test/CandidateInfoForm.tsx`
   - 姓名和邮箱输入
   - 开始测试按钮

2. `components/test/WritingEditor.tsx`
   - 大型文本编辑区
   - 实时字数统计
   - 按键追踪

3. `components/test/CountdownTimer.tsx`
   - 倒计时显示
   - 彩色进度条
   - 最后1分钟警告

4. `hooks/useKeystrokeTracking.ts`
   - 追踪打字、删除、粘贴事件

5. `hooks/useAutoSave.ts`
   - 每30秒自动保存

**参考代码**: 查看 `DEVELOPMENT_GUIDE.md` 中的详细实现

## 项目文件说明

### 核心文件

| 文件 | 说明 | 状态 |
|------|------|------|
| `types/index.ts` | 所有TypeScript类型定义 | ✅ 完成 |
| `lib/storage/index.ts` | 本地存储管理类 | ✅ 完成 |
| `lib/utils/helpers.ts` | 工具函数库 | ✅ 完成 |
| `components/hr/HRConfigForm.tsx` | HR配置表单 | ✅ 完成 |
| `app/page.tsx` | 首页 | ✅ 完成 |
| `app/test/[testId]/page.tsx` | 测试页面 | 🚧 框架 |
| `app/hr-reports/page.tsx` | HR报告页面 | 🚧 框架 |

### 配置文件

| 文件 | 说明 |
|------|------|
| `package.json` | 项目依赖 |
| `tsconfig.json` | TypeScript配置 |
| `tailwind.config.ts` | Tailwind CSS配置 |
| `components.json` | shadcn/ui配置 |
| `next.config.ts` | Next.js配置 |

### 文档文件

| 文件 | 说明 |
|------|------|
| `README.md` | 项目说明 |
| `DEVELOPMENT_GUIDE.md` | 详细开发指南 |
| `QUICK_START.md` | 本文件 |

## 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器
npm run lint             # 代码检查

# 添加shadcn/ui组件
npx shadcn@latest add select
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast

# 安装新依赖
npm install [package-name]
```

## 开发建议

### 1. 按模块开发

建议按照以下顺序开发：
1. 完成HR配置模块（时长、主题、分享）
2. 开发候选人测试界面（信息收集、编辑器、倒计时）
3. 实现评估算法（词汇、语法、流畅度）
4. 构建报告系统（候选人报告、HR报告）
5. 优化和测试

### 2. 每完成一个组件立即测试

```bash
# 启动开发服务器
npm run dev

# 在浏览器中测试功能
# 检查控制台是否有错误
# 测试不同的输入情况
```

### 3. 使用TypeScript类型

```typescript
// ✅ 好的做法
import { HRConfig } from '@/types';
const config: HRConfig = { ... };

// ❌ 避免
const config: any = { ... };
```

### 4. 利用已有的工具函数

```typescript
import {
  generateId,
  formatDateTime,
  countWords,
  copyToClipboard,
} from '@/lib/utils/helpers';
```

## 调试技巧

### 1. 查看localStorage数据

```javascript
// 浏览器控制台
console.log(localStorage);
console.log(JSON.parse(localStorage.getItem('hr_config')));
```

### 2. 清空localStorage

```javascript
// 浏览器控制台
localStorage.clear();
```

### 3. 查看组件状态

使用React Developer Tools扩展（Chrome/Firefox）

## 遇到问题？

### TypeScript错误

```bash
# 检查类型错误
npm run build
```

### 样式不生效

```bash
# 重启开发服务器
# Ctrl+C 停止
npm run dev
```

### 组件导入错误

确保使用正确的路径别名：
```typescript
import Component from '@/components/...'  // ✅
import Component from '../components/...' // ❌
```

## 学习资源

- [Next.js 文档](https://nextjs.org/docs)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 组件](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)

## 需要帮助？

查看详细文档：
- `README.md` - 项目概述
- `DEVELOPMENT_GUIDE.md` - 完整开发指南（包含代码示例）

---

**准备好了吗？开始编码吧！** 🎉

```bash
npm run dev
```
