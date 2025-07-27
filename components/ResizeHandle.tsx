
import React, { useCallback } from 'react';
import { useReactFlow, useStoreApi, Node } from 'reactflow';
import { IconDimensions } from './Icons';

interface ResizeHandleProps {
  onResize: (width: number, height: number) => void;
  minWidth?: number;
  minHeight?: number;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResize, minWidth = 350, minHeight = 250 }) => {
  const { setNodes } = useReactFlow();
  const store = useStoreApi();

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const nodeId = (e.target as HTMLElement).closest('.react-flow__node')?.getAttribute('data-id');
    if (!nodeId) return;

    const { nodeInternals } = store.getState();
    const allNodes = Array.from(nodeInternals.values());
    const node = allNodes.find((n: Node) => n.id === nodeId);
    if (!node) return;
    
    const initialWidth = node.width!;
    const initialHeight = node.height!;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(minWidth, initialWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(minHeight, initialHeight + (moveEvent.clientY - startY));

      setNodes(nds => nds.map(n => 
        n.id === nodeId ? { ...n, style: { ...n.style, width: newWidth, height: newHeight } } : n
      ));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      // Defer the final state update to the next paint cycle to avoid ResizeObserver loops.
      requestAnimationFrame(() => {
        const { nodeInternals } = store.getState();
        const finalNode = Array.from(nodeInternals.values()).find((n: Node) => n.id === nodeId);
        if (finalNode && finalNode.width && finalNode.height) {
          onResize(finalNode.width, finalNode.height);
        }
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

  }, [store, setNodes, onResize, minWidth, minHeight]);

  return (
    <div
      onMouseDown={onMouseDown}
      className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize text-[var(--agent-accent-color)]/50 hover:text-[var(--agent-accent-color)] nodrag"
    >
      <IconDimensions className="w-full h-full" />
    </div>
  );
};

export default ResizeHandle;
