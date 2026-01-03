'use client';

/**
 * 倒计时组件
 */

import { useCountdown } from '@/hooks/useCountdown';

interface CountdownTimerProps {
  durationInMinutes: number;
  onTimeUp: () => void;
  autoStart?: boolean;
}

export default function CountdownTimer({
  durationInMinutes,
  onTimeUp,
  autoStart = true,
}: CountdownTimerProps) {
  const {
    formattedTime,
    percentage,
    isWarning,
    isRunning,
    isPaused,
  } = useCountdown({
    durationInMinutes,
    onTimeUp,
    autoStart,
  });

  const getColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (percentage > 50) return 'text-green-700';
    if (percentage > 20) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="space-y-3">
      {/* 时间显示 */}
      <div className="text-center">
        <div className={`text-4xl font-bold ${getTextColor()} ${isWarning ? 'animate-pulse' : ''}`}>
          {formattedTime}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {isPaused ? '已暂停' : isRunning ? '剩余时间' : '未开始'}
        </div>
      </div>

      {/* 进度条 */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 警告提示 */}
      {isWarning && isRunning && (
        <div className="text-center text-sm text-red-600 font-medium animate-pulse">
          ⚠️ 最后1分钟！请尽快完成
        </div>
      )}
    </div>
  );
}
