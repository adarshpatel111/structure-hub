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
export function treeToPaths(tree: TreeNode, includeRoot: boolean = true): string {
  const paths: string[] = [];

  function traverse(node: TreeNode, currentPath: string) {
    // Add current node path
    const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name;
    paths.push(fullPath);

    if (node.children) {
      node.children.forEach(child => traverse(child, fullPath));
    }
  }

  if (includeRoot) {
    traverse(tree, '');
    // Remove the root entry '.' if you don't want it
    return paths.join('\n');
  } else {
    // Skip root, start from its children
    tree.children?.forEach(child => traverse(child, ''));
    return paths.join('\n');
  }
}