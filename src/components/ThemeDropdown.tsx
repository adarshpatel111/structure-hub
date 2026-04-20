import { Sun, Moon, Laptop } from 'lucide-react';

interface Props {
  theme: 'light' | 'dark' | 'system';
  setTheme: (t: 'light' | 'dark' | 'system') => void;
}

export default function ThemeDropdown({ theme, setTheme }: Props) {
  const options: {
    value: 'light' | 'dark' | 'system';
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: 'light',
      label: 'Light',
      icon: <Sun size={16} />,
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: <Moon size={16} />,
    },
    {
      value: 'system',
      label: 'System',
      icon: <Laptop size={16} />,
    },
  ];

  return (
    <>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          className={`
            flex items-center gap-2 w-full text-left px-3 py-2 text-sm
            hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer
            ${theme === opt.value ? 'font-semibold bg-gray-100 dark:bg-gray-800' : ''}
          `}
        >
          {/* Icon */}
          <span className="opacity-80">{opt.icon}</span>

          {/* Label */}
          <span>{opt.label}</span>

          {/* Active indicator */}
          {theme === opt.value && (
            <span className="ml-auto text-xs opacity-60">✓</span>
          )}
        </button>
      ))}
    </>
  );
}