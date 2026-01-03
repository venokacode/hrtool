'use client';

/**
 * 测试链接分享面板组件
 */

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { copyToClipboard } from '@/lib/utils/helpers';

interface SharePanelProps {
  testLink: string;
  testId: string;
}

export default function SharePanel({ testLink, testId }: SharePanelProps) {
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
      `您好，

请点击以下链接完成英语写作测试：

${testLink}

测试ID: ${testId}

请在方便的时候完成测试。

祝好！`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `请完成英语写作测试：${testLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-700">✓ 测试创建成功</CardTitle>
        <CardDescription>分享以下链接给候选人</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 测试ID */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">测试ID</p>
          <div className="p-3 bg-white rounded-lg border">
            <code className="text-sm text-gray-800">{testId}</code>
          </div>
        </div>

        {/* 测试链接 */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">测试链接</p>
          <div className="flex gap-2">
            <Input 
              value={testLink} 
              readOnly 
              className="bg-white"
            />
            <Button 
              onClick={handleCopy}
              variant={copied ? 'default' : 'outline'}
              className="min-w-[80px]"
            >
              {copied ? '✓ 已复制' : '复制'}
            </Button>
          </div>
        </div>

        {/* 二维码 */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">扫码访问</p>
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <QRCodeSVG 
                value={testLink} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
          <p className="text-xs text-center text-gray-500">
            候选人可扫描二维码直接访问测试
          </p>
        </div>

        {/* 分享按钮 */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">快速分享</p>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={handleEmailShare} 
              variant="outline" 
              className="w-full"
            >
              📧 邮件分享
            </Button>
            <Button 
              onClick={handleWhatsAppShare} 
              variant="outline" 
              className="w-full"
            >
              💬 WhatsApp
            </Button>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>提示：</strong> 请将链接发送给候选人，他们可以在任何设备上完成测试。
            测试完成后，您可以在HR报告中心查看详细评估结果。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
