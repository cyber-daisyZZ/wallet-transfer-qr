import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          扫码转账
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center sm:text-left">
          选择您需要的功能
        </p>

        <div className="flex gap-6 items-center flex-col sm:flex-row">
          <Link
            className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-lg h-14 px-8 sm:w-auto shadow-lg hover:shadow-xl"
            href="/permit"
          >
            Permit
          </Link>
          <Link
            className="rounded-lg border border-solid border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center bg-white dark:bg-gray-800 text-gray-800 dark:text-white gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-lg h-14 px-8 w-full sm:w-auto shadow-lg hover:shadow-xl"
            href="/auto-transfer"
          >
            自动转账
          </Link>
          <Link
            className="rounded-lg border border-solid border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center bg-white dark:bg-gray-800 text-gray-800 dark:text-white gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-lg h-14 px-8 w-full sm:w-auto shadow-lg hover:shadow-xl"
            href="/fly"
          >
            航班信息
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500">
        <span>钱包转账系统 © 2025</span>
      </footer>
    </div>
  );
}
