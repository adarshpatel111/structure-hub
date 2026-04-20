import type { TreeNode } from '../utils/types';

export function parseTextToTree(input: string): TreeNode {
  const lines = input
    .replace(/\t/g, '  ')
    .split('\n')
    .filter((l) => l.trim() !== '');

  const root: TreeNode = {
    name: '.',
    type: 'folder',
    children: [],
  };

  const stack: { indent: number; node: TreeNode }[] = [
    { indent: -1, node: root },
  ];

  lines.forEach((rawLine, index) => {
    const indent = rawLine.search(/\S/);
    let line = rawLine.trim();

    line = line.replace(/^[-*]\s*/, '');

    const nextLine = lines[index + 1];
    const nextIndent = nextLine ? nextLine.search(/\S/) : -1;

    const isFolder =
      line.endsWith('/') || nextIndent > indent;

    const name = line.replace(/\/$/, '');

    const node: TreeNode = {
      name,
      type: isFolder ? 'folder' : 'file',
      children: isFolder ? [] : undefined,
    };

    while (stack.length && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    stack[stack.length - 1].node.children!.push(node);

    if (isFolder) {
      stack.push({ indent, node });
    }
  });

  return root;
}