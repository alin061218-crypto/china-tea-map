const nodeToContent = new Map<string, string>();
const contentToNode = new Map<string, string>();

export function bindNodeToContent(nodeId: string, contentId: string): void {
  if (!nodeId || !contentId) {
    throw new Error('Node/content binding requires both nodeId and contentId.');
  }

  const previousContentId = nodeToContent.get(nodeId);
  if (previousContentId) contentToNode.delete(previousContentId);

  const previousNodeId = contentToNode.get(contentId);
  if (previousNodeId) nodeToContent.delete(previousNodeId);

  nodeToContent.set(nodeId, contentId);
  contentToNode.set(contentId, nodeId);
}

export function getContentByNode(nodeId: string): string | null {
  return nodeToContent.get(nodeId) ?? null;
}

export function getNodeByContent(contentId: string): string | null {
  return contentToNode.get(contentId) ?? null;
}

export function clearContentBindings(): void {
  nodeToContent.clear();
  contentToNode.clear();
}
