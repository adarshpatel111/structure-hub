import type { TreeNode } from './types';

export function getPathFromTree(
    root: TreeNode,
    path: number[]
): string {
    let current = root;
    const names: string[] = [];

    for (const i of path) {
        if (!current.children) break;
        current = current.children[i];
        names.push(current.name);
    }

    return names.join('/');
}