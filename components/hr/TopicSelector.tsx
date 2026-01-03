'use client';

/**
 * 写作主题选择组件
 */

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TopicSelectorProps {
  value: string;
  description?: string;
  onChange: (topic: string, description?: string) => void;
}

const PRESET_TOPICS = [
  {
    title: 'Describe your ideal workplace environment',
    description: '描述您理想的工作环境，包括团队氛围、工作方式等。',
  },
  {
    title: 'The importance of teamwork in modern business',
    description: '论述团队合作在现代商业中的重要性。',
  },
  {
    title: 'How technology has changed communication',
    description: '讨论技术如何改变了人们的沟通方式。',
  },
  {
    title: 'Your experience with remote work',
    description: '分享您的远程工作经验和感受。',
  },
  {
    title: 'The role of leadership in organizations',
    description: '论述领导力在组织中的作用。',
  },
  {
    title: 'Challenges facing businesses today',
    description: '分析当今企业面临的主要挑战。',
  },
  {
    title: 'The impact of globalization',
    description: '讨论全球化对商业和社会的影响。',
  },
  {
    title: 'Your career goals and aspirations',
    description: '描述您的职业目标和抱负。',
  },
];

export default function TopicSelector({ value, description, onChange }: TopicSelectorProps) {
  const [isCustom, setIsCustom] = useState(
    !PRESET_TOPICS.some((t) => t.title === value)
  );

  const handlePresetClick = (topic: typeof PRESET_TOPICS[0]) => {
    setIsCustom(false);
    onChange(topic.title, topic.description);
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    if (PRESET_TOPICS.some((t) => t.title === value)) {
      onChange('', '');
    }
  };

  const handleCustomTopicChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value, description);
  };

  const handleCustomDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(value, e.target.value);
  };

  return (
    <div className="space-y-4">
      <Label>写作主题 <span className="text-red-500">*</span></Label>
      
      {/* 预设主题 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PRESET_TOPICS.map((topic, index) => (
          <Button
            key={index}
            type="button"
            variant={value === topic.title && !isCustom ? 'default' : 'outline'}
            className="h-auto py-4 px-4 text-left justify-start flex-col items-start"
            onClick={() => handlePresetClick(topic)}
          >
            <span className="font-semibold text-sm">{topic.title}</span>
            <span className="text-xs text-gray-500 mt-1">{topic.description}</span>
          </Button>
        ))}
      </div>

      {/* 自定义主题 */}
      <div className="space-y-3">
        <Button
          type="button"
          variant={isCustom ? 'default' : 'outline'}
          onClick={handleCustomClick}
          className="w-full"
        >
          自定义主题
        </Button>
        
        {isCustom && (
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-2">
              <Label htmlFor="custom-topic">主题内容</Label>
              <Textarea
                id="custom-topic"
                value={value}
                onChange={handleCustomTopicChange}
                placeholder="输入自定义写作主题..."
                rows={3}
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-description">主题说明（可选）</Label>
              <Textarea
                id="custom-description"
                value={description || ''}
                onChange={handleCustomDescriptionChange}
                placeholder="输入主题说明或要求..."
                rows={2}
                className="bg-white"
              />
            </div>
          </div>
        )}
      </div>
      
      {value && (
        <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
          <strong>已选主题：</strong> {value}
        </div>
      )}
    </div>
  );
}
