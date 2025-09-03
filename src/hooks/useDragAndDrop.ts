import { useState, useCallback } from 'react';

export interface DragData {
  type: string;
  data: any;
}

export interface DropZone {
  id: string;
  accepts: string[];
  onDrop: (data: DragData) => void;
}

export function useDragAndDrop() {
  const [dragData, setDragData] = useState<DragData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);

  const startDrag = useCallback((data: DragData) => {
    setDragData(data);
    setIsDragging(true);
  }, []);

  const endDrag = useCallback(() => {
    setDragData(null);
    setIsDragging(false);
    setDragOverZone(null);
  }, []);

  const handleDragOver = useCallback((zoneId: string) => {
    setDragOverZone(zoneId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverZone(null);
  }, []);

  const handleDrop = useCallback((zone: DropZone) => {
    if (dragData && zone.accepts.includes(dragData.type)) {
      zone.onDrop(dragData);
    }
    endDrag();
  }, [dragData, endDrag]);

  return {
    dragData,
    isDragging,
    dragOverZone,
    startDrag,
    endDrag,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
