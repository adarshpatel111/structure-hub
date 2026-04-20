import { useState } from 'react';
import type { TreeNode } from '../utils/types';
import Tooltip from './Tooltip';

interface Props {
  tree: TreeNode;
  onChange: (tree: TreeNode) => void;
  theme: 'light' | 'dark';
}

export default function TreeView({ tree, onChange, theme }: Props) {
  const bgColor = theme === 'dark' ? '#1f2937' : '#f9fafb';
  const textColor = theme === 'dark' ? '#e5e7eb' : '#111827';

  const updateNode = (
    node: TreeNode,
    path: number[],
    newName: string
  ) => {
    if (path.length === 0) return;

    const [index, ...rest] = path;
    if (!node.children) return;

    if (rest.length === 0) {
      node.children[index].name = newName;
    } else {
      updateNode(node.children[index], rest, newName);
    }
  };

  const getNodeAtPath = (node: TreeNode, path: number[]): TreeNode => {
    let current = node;
    for (const i of path) {
      if (!current.children) throw new Error('Invalid path');
      current = current.children[i];
    }
    return current;
  };

  const removeNodeAtPath = (
    node: TreeNode,
    path: number[]
  ): TreeNode => {
    const parentPath = path.slice(0, -1);
    const index = path[path.length - 1];

    const parent = getNodeAtPath(node, parentPath);
    if (!parent.children) throw new Error('No children');

    const [removed] = parent.children.splice(index, 1);
    return removed;
  };

  const insertNodeAtPath = (
    node: TreeNode,
    path: number[],
    newNode: TreeNode
  ) => {
    const target = getNodeAtPath(node, path);

    if (target.type !== 'folder') return;

    if (!target.children) target.children = [];
    target.children.push(newNode);
  };

  const moveNode = (
    tree: TreeNode,
    fromPath: number[],
    toPath: number[]
  ) => {
    if (JSON.stringify(fromPath) === JSON.stringify(toPath)) return;

    const node = removeNodeAtPath(tree, fromPath);
    insertNodeAtPath(tree, toPath, node);
  };

  return (
    <div className="overflow-auto text-sm" style={{ backgroundColor: bgColor, color: textColor }}>
      <ul className="pl-2">
        {tree.children?.map((child, i) => (
          <NodeItem
            key={i}
            node={child}
            path={[i]}
            root={tree}
            onChange={onChange}
            updateNode={updateNode}
            moveNode={moveNode}
          />
        ))}
      </ul>
    </div>
  );
}

interface NodeItemProps {
  node: TreeNode;
  path: number[];
  root: TreeNode;
  onChange: (tree: TreeNode) => void;
  updateNode: (
    node: TreeNode,
    path: number[],
    newName: string
  ) => void;
  moveNode: (
    tree: TreeNode,
    fromPath: number[],
    toPath: number[]
  ) => void;
}

function NodeItem({
  node,
  path,
  root,
  onChange,
  updateNode,
  moveNode,
}: NodeItemProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(node.name);
  const [isDragOver, setIsDragOver] = useState(false);

  const save = () => {
    updateNode(root, path, value);
    onChange({ ...root });
    setEditing(false);
  };

  const icon = node.type === 'folder' ? '📁' : '📄';

  return (
    <li
      className={`
        mb-1 px-2 py-1 rounded-md
        cursor-move select-none
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-colors
        ${isDragOver ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
      `}
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        e.dataTransfer.setData('path', JSON.stringify(path));
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const fromPath: number[] = JSON.parse(
          e.dataTransfer.getData('path')
        );

        if (JSON.stringify(fromPath) === JSON.stringify(path)) return;

        if (
          path.length >= fromPath.length &&
          path.slice(0, fromPath.length).every((v, i) => v === fromPath[i])
        ) {
          return;
        }

        moveNode(root, fromPath, path);
        onChange({ ...root });
      }}
    >
      <div className="flex items-center gap-1">
        {editing ? (
          <input
            className="
              px-2 py-1 rounded outline-none text-sm
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-100
            "
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') {
                setValue(node.name);
                setEditing(false);
              }
            }}
            autoFocus
          />
        ) : (
          <Tooltip content={node.type === 'folder' ? 'Folder' : 'File'}>
            <span
              onDoubleClick={() => setEditing(true)}
              className="flex items-center gap-1"
            >
              <span className="text-lg leading-none">{icon}</span>
              <span>{node.name}</span>
            </span>
          </Tooltip>
        )}
      </div>

      {node.children && node.children.length > 0 && (
        <ul className="pl-4 ml-1 border-l border-gray-300 dark:border-gray-700">
          {node.children.map((child, i) => (
            <NodeItem
              key={i}
              node={child}
              path={[...path, i]}
              root={root}
              onChange={onChange}
              updateNode={updateNode}
              moveNode={moveNode}
            />
          ))}
        </ul>
      )}
    </li>
  );
}