import TextEditor from './components/TextEditor';
import TreeView from './components/TreeView';
import CliPreview from './components/CliPreview';
import Panel from './components/Panel';
import { useTheme } from './hooks/useTheme';
import Dropdown from './components/Dropdown';
import ThemeDropdown from './components/ThemeDropdown';
import CopyDropdown from './components/CopyDropdown';
import { useState } from 'react';
import { parseTextToTree } from './utils/parser';
import { parseCLIToTree } from './utils/cliParser';
import { treeToCLI, treeToText } from './utils/serializer';
import type { TreeNode } from './utils/types';
import { Computer, Copy, Moon, Sun } from 'lucide-react';

export default function App() {
  const { theme, setTheme } = useTheme();
  const resolvedTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

      const iconMap = {
  light: <Sun size={16} />,
  dark: <Moon size={16} />,
  system: <Computer size={16} />,
};

  const initialText = `project/
  src/
    App.tsx`;

  const initialTree = parseTextToTree(initialText);
  const [text, setText] = useState(initialText);
  const [tree, setTree] = useState<TreeNode>(initialTree);
  const [cli, setCli] = useState(treeToCLI(initialTree));
  const [showRoot, setShowRoot] = useState(true);

  const handleTextChange = (val: string) => {
    setText(val);
    try {
      const t = parseTextToTree(val);
      setTree(t);
      setCli(treeToCLI(t));
    } catch { }
  };

  const handleCliChange = (val: string) => {
    setCli(val);
    try {
      const t = parseCLIToTree(val);
      setTree(t);
      setText(treeToText(t));
    } catch { }
  };

  const handleTreeChange = (t: TreeNode) => {
    setTree(t);
    setText(treeToText(t));
    setCli(treeToCLI(t));
  };
  function generateShareLink(text: string) {
    const encoded = encodeURIComponent(text);
    return `${window.location.origin}?data=${encoded}`;
  }
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Folder Designer</h1>
        <div className="flex gap-2 items-center">

          {/* Copy Menu */}
          <Dropdown icon={<Copy size={16} />}>
            <CopyDropdown
              className={`hover:cursor-pointer`}
              text={text}
              cli={cli}
              onCopy={(val) => navigator.clipboard.writeText(val)}
              onShare={() => {
                const link = generateShareLink(text);
                navigator.clipboard.writeText(link);
                alert('Share link copied!');
              }}
            />
          </Dropdown>

          {/* Theme Menu */}
          <Dropdown icon={iconMap[theme]}>
            <ThemeDropdown theme={theme} setTheme={setTheme} />
          </Dropdown>

          {/* Root Toggle */}
          <button
            onClick={() => setShowRoot(!showRoot)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            {showRoot ? 'Hide Root' : 'Show Root'}
          </button>

        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[85vh]">

        <Panel title="Text Editor">
          <TextEditor value={text} onChange={handleTextChange} theme={resolvedTheme} />
        </Panel>

        <Panel title="CLI View">
          <CliPreview value={cli} onChange={handleCliChange} theme={resolvedTheme} />
        </Panel>

        <Panel title="Tree View">
          <div className="p-2 overflow-auto h-full">
            <TreeView tree={tree} onChange={handleTreeChange} theme={resolvedTheme} />
          </div>
        </Panel>

      </div>
    </div>
  );
}