'use client';

/**
 * 测试时长选择组件
 */

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

  const handlePresetClick = (duration: number) => {
    setIsCustom(false);
    onChange(duration);
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    if (!presetDurations.includes(value)) {
      // 保持当前值
    } else {
      onChange(20); // 默认20分钟
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val >= 5 && val <= 60) {
      onChange(val);
    }
  };

  return (
    <div className="space-y-4">
      <Label>测试时长（分钟）<span className="text-red-500">*</span></Label>
      
      {/* 预设选项 */}
      <div className="grid grid-cols-4 gap-2">
        {presetDurations.map((duration) => (
          <Button
            key={duration}
            type="button"
            variant={value === duration && !isCustom ? 'default' : 'outline'}
            onClick={() => handlePresetClick(duration)}
            className="h-12"
          >
            {duration}分钟
          </Button>
        ))}
      </div>

      {/* 自定义输入 */}
      <div className="space-y-2">
        <Button
          type="button"
          variant={isCustom ? 'default' : 'outline'}
          onClick={handleCustomClick}
          className="w-full"
        >
          自定义时长
        </Button>
        {isCustom && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={5}
              max={60}
              value={value}
              onChange={handleCustomChange}
              placeholder="5-60分钟"
              className="flex-1"
            />
            <span className="text-sm text-gray-600">分钟</span>
          </div>
        )}
      </div>
      
      {isCustom && (value < 5 || value > 60) && (
        <p className="text-sm text-red-500">时长必须在5-60分钟之间</p>
      )}
    </div>
  );
}
