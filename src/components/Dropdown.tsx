import { useEffect, useRef, useState } from 'react';

interface Props {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Dropdown({ icon, children, className }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
      <button
        onClick={() => setOpen(!open)}
        className={`
    flex items-center justify-center w-9 h-9 rounded-lg
    bg-gray-200 dark:bg-gray-800
    hover:bg-gray-300 dark:hover:bg-gray-700
    transition cursor-pointer
    ${className || ''}
  `}
      >
        {icon}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
          {children}
        </div>
      )}
    </div>
  );
}