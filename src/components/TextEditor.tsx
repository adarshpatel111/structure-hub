import Editor from '@monaco-editor/react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  theme: 'light' | 'dark';
}

export default function TextEditor({ value, onChange, theme }: Props) {
  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage="markdown"
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={value}
        onChange={(v) => onChange(v || '')}
      />
    </div>
  );
}