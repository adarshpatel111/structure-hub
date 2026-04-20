import type { TreeNode } from './types';

export function parseCLIToTree(input: string): TreeNode {
  // Normalize line endings and remove empty lines
  const lines = input.split('\n').filter(l => l.trim() !== '');

  // Skip the first line if it's just a root indicator (e.g., ".")
  const startIndex = lines[0]?.trim() === '.' || lines[0]?.trim() === './' ? 1 : 0;

  interface ParsedLine {
    depth: number;
    name: string;
  }

  const parsedLines: ParsedLine[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];

    // Count depth by groups of "│   " or "    " BEFORE the tree connector
    // These are the vertical continuation characters.
    const depthMatches = line.match(/(│   |    )/g);
    const depth = depthMatches ? depthMatches.length : 0;

    // Remove the leading indent segments and the connector (├── , └── , etc.)
    const cleaned = line
      .replace(/^([\s│]*[├└]──\s*)/, '')
      .replace(/\/$/, '')   // remove trailing slash if present
      .trim();

    parsedLines.push({ depth, name: cleaned });
  }

  // Determine folder/file based on whether the next line has greater depth
  const nodesWithType: { depth: number; name: string; type: 'file' | 'folder' }[] = parsedLines.map((line, index) => {
    const nextLine = parsedLines[index + 1];
    const isFolder = nextLine ? nextLine.depth > line.depth : false;
    return {
      depth: line.depth,
      name: line.name,
      type: isFolder ? 'folder' : 'file',
    };
  });

  const root: TreeNode = {
    name: '.',
    type: 'folder',
    children: [],
  };

  const stack: { depth: number; node: TreeNode }[] = [
    { depth: -1, node: root },
  ];

  nodesWithType.forEach(item => {
    const node: TreeNode = {
      name: item.name,
      type: item.type,
      children: item.type === 'folder' ? [] : undefined,
    };

    // Pop stack until we find a parent (depth < current depth)
    while (stack.length > 1 && stack[stack.length - 1].depth >= item.depth) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].node;
    if (!parent.children) parent.children = [];
    parent.children.push(node);

    if (item.type === 'folder') {
      stack.push({ depth: item.depth, node });
    }
  });

  return root;
}