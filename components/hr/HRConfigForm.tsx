'use client';

/**
 * HR配置表单组件
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { generateId } from '@/lib/utils/helpers';
import StorageManager from '@/lib/storage';
import { HRConfig } from '@/types';

// 表单验证schema
const hrConfigSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  email: z.string().email('请输入有效的邮箱地址'),
  company: z.string().optional(),
  department: z.string().optional(),
  reportPassword: z.string().min(4, '密码至少4位'),
});

type HRConfigFormData = z.infer<typeof hrConfigSchema>;

export default function HRConfigForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedConfig, setSavedConfig] = useState<HRConfig | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HRConfigFormData>({
    resolver: zodResolver(hrConfigSchema),
  });

  const onSubmit = async (data: HRConfigFormData) => {
    try {
      const config: HRConfig = {
        id: generateId('hr'),
        name: data.name,
        email: data.email,
        company: data.company,
        department: data.department,
        reportPassword: data.reportPassword || '8889',
        createdAt: new Date().toISOString(),
      };

      // 保存到localStorage
      StorageManager.saveHRConfig(config);
      setSavedConfig(config);
      setIsSubmitted(true);
    } catch (error) {
      console.error('保存配置失败:', error);
      alert('保存失败，请重试');
    }
  };

  if (isSubmitted && savedConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">✓ 配置保存成功</CardTitle>
          <CardDescription>您可以继续配置测试参数</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">HR姓名：{savedConfig.name}</p>
              <p className="text-sm text-gray-600">邮箱：{savedConfig.email}</p>
              {savedConfig.company && (
                <p className="text-sm text-gray-600">公司：{savedConfig.company}</p>
              )}
              {savedConfig.department && (
                <p className="text-sm text-gray-600">部门：{savedConfig.department}</p>
              )}
            </div>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              修改配置
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>HR信息配置</CardTitle>
        <CardDescription>请填写您的基本信息以开始创建测试</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 姓名 */}
          <div className="space-y-2">
            <Label htmlFor="name">
              姓名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="请输入您的姓名"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* 邮箱 */}
          <div className="space-y-2">
            <Label htmlFor="email">
              邮箱 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@company.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* 公司名称 */}
          <div className="space-y-2">
            <Label htmlFor="company">公司名称（可选）</Label>
            <Input
              id="company"
              placeholder="请输入公司名称"
              {...register('company')}
            />
          </div>

          {/* 部门名称 */}
          <div className="space-y-2">
            <Label htmlFor="department">部门名称（可选）</Label>
            <Input
              id="department"
              placeholder="请输入部门名称"
              {...register('department')}
            />
          </div>

          {/* 报告密码 */}
          <div className="space-y-2">
            <Label htmlFor="reportPassword">
              报告访问密码 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reportPassword"
              type="password"
              placeholder="默认密码：8889"
              {...register('reportPassword')}
              className={errors.reportPassword ? 'border-red-500' : ''}
            />
            {errors.reportPassword && (
              <p className="text-sm text-red-500">{errors.reportPassword.message}</p>
            )}
            <p className="text-xs text-gray-500">
              此密码用于访问HR专业报告，请妥善保管
            </p>
          </div>

          {/* 提交按钮 */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : '保存配置'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
