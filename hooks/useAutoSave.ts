/**
 * 自动保存Hook
 * 每30秒自动保存一次
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => void | Promise<void>;
  interval?: number; // 毫秒
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  interval = 30000, // 默认30秒
  enabled = true,
}: UseAutoSaveOptions<T>) {
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dataRef = useRef(data);

  // 更新数据引用
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // 保存函数
  const save = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await onSave(dataRef.current);
      setLastSaveTime(new Date());
      setSaveCount((prev) => prev + 1);
    } catch (error) {
      console.error('自动保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, onSave]);

  // 手动保存
  const saveNow = useCallback(async () => {
    await save();
  }, [save]);

  // 自动保存逻辑
  useEffect(() => {
    if (!enabled) return;

    timerRef.current = setInterval(() => {
      save();
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [enabled, interval, save]);

  // 计算距离上次保存的时间
  const timeSinceLastSave = lastSaveTime
    ? Math.floor((Date.now() - lastSaveTime.getTime()) / 1000)
    : null;

  return {
    lastSaveTime,
    isSaving,
    saveCount,
    timeSinceLastSave,
    saveNow,
  };
}
