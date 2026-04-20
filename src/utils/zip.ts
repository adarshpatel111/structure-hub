import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { TreeNode } from './types';

export async function downloadZip(tree: TreeNode) {
  const zip = new JSZip();

  function add(node: TreeNode, folder: any) {
    node.children?.forEach((child) => {
      if (child.type === 'folder') {
        const newFolder = folder.folder(child.name);
        add(child, newFolder);
      } else {
        folder.file(child.name, '');
      }
    });
  }

  add(tree, zip);

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'structure.zip');
}