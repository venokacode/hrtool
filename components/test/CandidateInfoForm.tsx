'use client';

/**
 * 候选人信息收集表单
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CandidateInfo } from '@/types';

const candidateSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  email: z.string().email('请输入有效的邮箱地址'),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

interface CandidateInfoFormProps {
  onSubmit: (info: CandidateInfo) => void;
}

export default function CandidateInfoForm({ onSubmit }: CandidateInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
  });

  const handleFormSubmit = (data: CandidateFormData) => {
    onSubmit({
      name: data.name,
      email: data.email,
    });
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>欢迎参加英语写作测试</CardTitle>
        <CardDescription>
          请先填写您的基本信息，然后开始测试
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
              placeholder="your.email@example.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
            <p className="text-xs text-gray-500">
              测试完成后，报告将发送到此邮箱
            </p>
          </div>

          {/* 隐私声明 */}
          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <p>
              <strong>隐私声明：</strong>
              您的个人信息仅用于本次测试评估，我们将严格保护您的隐私。
              测试过程将记录您的写作内容和按键行为，用于生成评估报告。
            </p>
          </div>

          {/* 提交按钮 */}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? '准备中...' : '开始测试'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
