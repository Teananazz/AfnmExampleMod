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
  const clonedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && targetElement && previewContainerRef.current) {
      const clone = targetElement.cloneNode(true) as HTMLElement;
      clone.removeAttribute('id');
      clone.style.pointerEvents = 'none';

      previewContainerRef.current.innerHTML = '';
      previewContainerRef.current.appendChild(clone);
      clonedElementRef.current = clone;

      applyElementUpdates(clone, tempName, tempStyles);
    }
  }, [isOpen, targetElement]);

  useEffect(() => {
    if (clonedElementRef.current) {
      applyElementUpdates(clonedElementRef.current, tempName, tempStyles);
    }
  }, [tempName, tempStyles]);

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