import { useState, useRef } from 'react';

interface Props {
  content: string;
  children: React.ReactNode;
}

export default function Tooltip({ content, children }: Props) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), 300);
  };

  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white dark:bg-gray-200 dark:text-black rounded shadow-lg whitespace-nowrap z-50">
          {content}
        </div>
      )}
    </div>
  );
}