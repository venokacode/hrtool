/**
 * 按键追踪Hook
 * 用于追踪候选人的打字、删除、粘贴等操作
 */

import { useState, useCallback } from 'react';
import { KeystrokeEvent, KeystrokeEventType } from '@/types';

export function useKeystrokeTracking() {
  const [events, setEvents] = useState<KeystrokeEvent[]>([]);

  const trackEvent = useCallback((type: KeystrokeEventType, content?: string, position?: number) => {
    const event: KeystrokeEvent = {
      type,
      timestamp: Date.now(),
      content,
      position,
    };

    setEvents((prev) => [...prev, event]);
  }, []);

  const getStatistics = useCallback(() => {
    const typeCount = events.filter((e) => e.type === 'type').length;
    const deleteCount = events.filter((e) => e.type === 'delete').length;
    const pasteCount = events.filter((e) => e.type === 'paste').length;
    const cutCount = events.filter((e) => e.type === 'cut').length;

    // 计算暂停时间（两次按键间隔超过3秒）
    let pauseCount = 0;
    let totalPauseTime = 0;
    for (let i = 1; i < events.length; i++) {
      const timeDiff = events[i].timestamp - events[i - 1].timestamp;
      if (timeDiff > 3000) {
        pauseCount++;
        totalPauseTime += timeDiff;
      }
    }

    const averagePauseTime = pauseCount > 0 ? totalPauseTime / pauseCount / 1000 : 0;

    return {
      typeCount,
      deleteCount,
      pasteCount,
      cutCount,
      pauseCount,
      averagePauseTime,
      totalEvents: events.length,
      revisionRate: events.length > 0 ? deleteCount / events.length : 0,
    };
  }, [events]);

  const reset = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    trackEvent,
    getStatistics,
    reset,
  };
}
