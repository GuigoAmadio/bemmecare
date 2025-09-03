"use client";

import { useState } from "react";

interface DropZoneProps {
  onDrop: (data: any) => void;
  children: React.ReactNode;
  className?: string;
  accepts?: string[];
  dropIndicatorClass?: string;
}

export default function DropZone({
  onDrop,
  children,
  className = "",
  accepts = ["schedule"],
  dropIndicatorClass = "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50",
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const dropData = JSON.parse(e.dataTransfer.getData("application/json"));
      
      if (accepts.includes(dropData.type)) {
        onDrop(dropData.data);
      }
    } catch (error) {
      console.error("Erro ao processar drop:", error);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        ${className}
        ${isDragOver ? dropIndicatorClass : ""}
        transition-all duration-200
      `}
    >
      {children}
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
            Soltar aqui
          </div>
        </div>
      )}
    </div>
  );
}
