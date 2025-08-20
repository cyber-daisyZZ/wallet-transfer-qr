import AutoTransfer from "@/views/auto-transfer";
import Link from "next/link";

export default function AutoTransferPage() {
  return (
    <div className="font-sans min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← 返回首页
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            自动转账
          </h1>

          <div className="text-gray-600 dark:text-gray-300">
            <AutoTransfer />
          </div>
        </div>
      </div>
    </div>
  );
}
