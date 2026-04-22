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
import { Computer, Copy, FolderDot, FolderTree, Moon, Route, Sun, } from 'lucide-react';
import { treeToPaths } from './utils/serializer';
import ToggleButton from './components/ToggleButton';

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
  const [cliMode, setCliMode] = useState<'tree' | 'paths'>('tree');

  // Compute what to display in CLI panel
  const displayCli = cliMode === 'tree'
    ? cli
    : treeToPaths(tree, showRoot);

  const handleTextChange = (val: string) => {
    setText(val);
    try {
      const t = parseTextToTree(val);
      setTree(t);
      setCli(treeToCLI(t));
    } catch { }
  };

  const handleCliChange = (val: string) => {
    if (cliMode === 'paths') return;
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
        <h1 className="text-xl font-bold"><img src="/favicon.svg" alt="Logo" className="w-8 h-8 inline-block mr-2" />Folder Flow</h1>
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
              size="md"
            />
          </Dropdown>

          {/* Theme Menu */}
          <Dropdown icon={iconMap[theme]}>
            <ThemeDropdown theme={theme} setTheme={setTheme} />
          </Dropdown>

          <div className="relative inline-flex bg-gray-200 dark:bg-gray-800 rounded-full p-1">
            {/* Sliding background */}
            <ToggleButton
              checked={cliMode === "tree"}
              onChange={(val) => setCliMode(val ? "tree" : "paths")}
              onIcon={<FolderTree className="w-4 h-4" />}
              offIcon={<Route className="w-4 h-4" />}
              tooltipOn="Tree view"
              tooltipOff="Paths view"
              size="sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <ToggleButton
              checked={showRoot}
              onChange={setShowRoot}
              onIcon={<FolderDot className="w-4 h-4" />}
              tooltipOn="Show Root"
              tooltipOff="Hide Root"
              size="sm"
            />
          </div>
        </div>
      </div>
      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[85vh]">
        <Panel title="Text Editor">
          <TextEditor value={text} onChange={handleTextChange} theme={resolvedTheme} />
        </Panel>

        <Panel title={`CLI View ${cliMode === 'paths' ? '(Full Paths)' : ''}`}>
          <CliPreview value={displayCli} onChange={handleCliChange} theme={resolvedTheme} mode={cliMode} />
        </Panel>

        <Panel title="Tree View">
          <div className="p-2 overflow-auto h-full">
            <TreeView tree={tree} onChange={handleTreeChange} theme={resolvedTheme} showRoot={showRoot} />
          </div>
        </Panel>
      </div>
    </div>
  );
}