/**
 * 倒计时Hook
 * 用于测试时间倒计时
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCountdownOptions {
  durationInMinutes: number;
  onTimeUp: () => void;
  autoStart?: boolean;
}

export function useCountdown({ durationInMinutes, onTimeUp, autoStart = false }: UseCountdownOptions) {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  // 更新onTimeUp引用
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // 倒计时逻辑
  useEffect(() => {
    if (!isRunning || isPaused) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    setTimeLeft(durationInMinutes * 60);
    setIsRunning(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [durationInMinutes]);

  const addTime = useCallback((seconds: number) => {
    setTimeLeft((prev) => prev + seconds);
  }, []);

  // 计算百分比
  const percentage = (timeLeft / (durationInMinutes * 60)) * 100;

  // 判断是否警告（最后1分钟）
  const isWarning = timeLeft <= 60;

  // 格式化时间
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return {
    timeLeft,
    formattedTime,
    percentage,
    isWarning,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
    addTime,
  };
}
