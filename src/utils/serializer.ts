import type { TreeNode } from '../utils/types';

export function treeToCLI(node: TreeNode, prefix = ''): string {
  let result = '';

  (node.children || []).forEach((child, index, arr) => {
    const isLast = index === arr.length - 1;

    const connector = isLast ? '└── ' : '├── ';
    result +=
      prefix +
      connector +
      child.name +
      (child.type === 'folder' ? '/' : '') +
      '\n';

    if (child.type === 'folder') {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      result += treeToCLI(child, newPrefix);
    }
  });

  return result;
}

export function treeToText(node: TreeNode, indent = 0): string {
  let result = '';

  (node.children || []).forEach((child) => {
    result +=
      ' '.repeat(indent) +
      child.name +
      (child.type === 'folder' ? '/' : '') +
      '\n';

    if (child.type === 'folder') {
      result += treeToText(child, indent + 2);
    }
  });

  return result;
}