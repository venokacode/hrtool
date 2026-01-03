/**
 * 测试页头组件
 */

import { HRConfig } from '@/types';

interface TestHeaderProps {
  hrConfig: HRConfig;
}

export default function TestHeader({ hrConfig }: TestHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo/标题 */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            英语写作测评系统
          </h1>
          {hrConfig.company && (
            <p className="text-sm text-gray-600">
              {hrConfig.company}
              {hrConfig.department && ` - ${hrConfig.department}`}
            </p>
          )}
        </div>

        {/* HR信息 */}
        <div className="text-right text-sm text-gray-600">
          <p>测试负责人: {hrConfig.name}</p>
          {hrConfig.email && (
            <p className="text-xs">{hrConfig.email}</p>
          )}
        </div>
      </div>
    </header>
  );
}
