import React, { useEffect, useRef } from 'react';
import { applyElementUpdates } from './styleOptions';

export interface LivePreviewProps {
  isOpen: boolean;
  targetElement: HTMLElement | null;
  tempName: string;
  tempStyles: Record<string, string>;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  isOpen,
  targetElement,
  tempName,
  tempStyles,
}) => {
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLElement | null>(null);

  // 1. Create the clone ONCE when the modal opens
  useEffect(() => {
    if (!isOpen || !previewContainerRef.current) return;

    previewContainerRef.current.innerHTML = '';

    let clone: HTMLElement;
    if (targetElement) {
      clone = targetElement.cloneNode(true) as HTMLElement;
    } else {
      // Fallback if target element is missing
      clone = document.createElement('button');
      clone.style.padding = '8px 16px';
      clone.style.borderRadius = '4px';
      clone.style.border = '1px solid #ccc';
      clone.style.backgroundColor = '#2b2d42';
      clone.style.color = '#fff';
    }

    clone.removeAttribute('id');
    clone.style.pointerEvents = 'none'; // prevent clicking in preview
    cloneRef.current = clone;
    
    previewContainerRef.current.appendChild(clone);

    return () => {
      cloneRef.current = null;
    };
  }, [isOpen, targetElement]);

  // 2. Apply updates instantly whenever tempStyles/tempName changes
  useEffect(() => {
    if (cloneRef.current) {
      applyElementUpdates(cloneRef.current, tempName, tempStyles);
    }
  }, [tempName, tempStyles, isOpen]);

  return (
    <div
      style={{
        marginBottom: '20px',
        textAlign: 'center',
        padding: '16px',
        backgroundColor: '#181825',
        borderRadius: '6px',
      }}
    >
      <span style={{ display: 'block', fontSize: '11px', color: '#a6adc8', marginBottom: '12px' }}>
        LIVE PREVIEW
      </span>
      <div ref={previewContainerRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
    </div>
  );
};

export default LivePreview;