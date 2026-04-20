import type { ReactNode } from 'react';

export default function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col h-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 font-medium">
        {title}
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}