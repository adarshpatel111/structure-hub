interface Props {
  value: string;
  onChange: (val: string) => void;
  theme: 'light' | 'dark';
}

export default function CliPreview({ value, onChange, theme }: Props) {
  return (
    <textarea
      className={`
        w-full h-full p-4 font-mono text-sm outline-none resize-none
        ${theme === 'dark'
          ? 'bg-black text-green-400'
          : 'bg-gray-100 text-green-700'}
      `}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}