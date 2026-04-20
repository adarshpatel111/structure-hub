import type { TreeNode } from './types';

export function parseCLIToTree(input: string): TreeNode {
  const lines = input.split('\n').filter(l => l.trim() !== '');

  const root: TreeNode = {
    name: '.',
    type: 'folder',
    children: [],
  };

  const stack: { depth: number; node: TreeNode }[] = [
    { depth: -1, node: root },
  ];

  lines.forEach((line) => {
    if (line.trim() === '.') return;

    // count depth by "│   " or spaces
    const depth = (line.match(/(│   |    )/g) || []).length;

    // remove tree symbols
    const cleaned = line
      .replace(/^[\s│]*[├└]── /, '')
      .trim();

    const isFolder = cleaned.endsWith('/');
    const name = cleaned.replace(/\/$/, '');

    const node: TreeNode = {
      name,
      type: isFolder ? 'folder' : 'file',
      children: isFolder ? [] : undefined,
    };

    while (stack.length && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    stack[stack.length - 1].node.children!.push(node);

    if (isFolder) {
      stack.push({ depth, node });
    }
  });

  return root;
}