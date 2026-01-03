/**
 * 测试页脚组件
 */

export default function TestFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 px-6 mt-8">
      <div className="container mx-auto text-center text-sm text-gray-600">
        <p>© 2024 英语写作测评系统. All rights reserved.</p>
        <p className="mt-2 text-xs">
          如有技术问题，请联系测试负责人 |{' '}
          <a href="/hr-reports" className="text-blue-600 hover:underline text-xs">
            HR报告入口
          </a>
        </p>
      </div>
    </footer>
  );
}
