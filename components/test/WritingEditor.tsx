'use client';

/**
 * 写作编辑器组件
 */

import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { countWords, countCharacters } from '@/lib/utils/helpers';
import { KeystrokeEventType } from '@/types';

interface WritingEditorProps {
  value: string;
  onChange: (value: string) => void;
  onKeystroke?: (type: KeystrokeEventType, content?: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function WritingEditor({
  value,
  onChange,
  onKeystroke,
  disabled = false,
  placeholder = '开始写作...',
}: WritingEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setWordCount(countWords(value));
    setCharCount(countCharacters(value, false));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!onKeystroke) return;

    if (e.key === 'Backspace' || e.key === 'Delete') {
      onKeystroke('delete');
    } else if (e.key.length === 1) {
      // 普通字符输入
      onKeystroke('type');
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!onKeystroke) return;
    const pastedText = e.clipboardData.getData('text');
    onKeystroke('paste', pastedText);
  };

  const handleCut = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!onKeystroke) return;
    onKeystroke('cut');
  };

  return (
    <div className="space-y-4">
      {/* 编辑器 */}
      <Textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onCut={handleCut}
        disabled={disabled}
        placeholder={placeholder}
        className="min-h-[500px] text-lg font-serif leading-relaxed resize-none focus:ring-2 focus:ring-blue-500"
      />

      {/* 统计信息 */}
      <div className="flex items-center justify-between text-sm text-gray-600 px-2">
        <div className="flex items-center gap-6">
          <div>
            <span className="font-medium">字数:</span>{' '}
            <span className="text-lg font-bold text-blue-600">{wordCount}</span>
          </div>
          <div>
            <span className="font-medium">字符:</span>{' '}
            <span className="text-gray-700">{charCount}</span>
          </div>
        </div>
        
        {wordCount > 0 && (
          <div className="text-xs text-gray-500">
            {wordCount < 100 && '建议至少写100个单词'}
            {wordCount >= 100 && wordCount < 200 && '继续加油！'}
            {wordCount >= 200 && '写得很好！'}
          </div>
        )}
      </div>
    </div>
  );
}
