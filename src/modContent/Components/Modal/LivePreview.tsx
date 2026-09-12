import React, { useEffect, useRef } from 'react';

export interface LivePreviewProps {
  isOpen: boolean;
  targetElement: HTMLElement | null;
  tempName: string;
  tempStyle: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  isOpen,
  targetElement,
  tempName,
  tempStyle,
}) => {
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const clonedElementRef = useRef<HTMLElement | null>(null);

  // Helper to apply text and style mutations to the clone
  const updateClone = (element: HTMLElement, name: string, style: string) => {
    element.textContent = name;

    if (style === 'option1') {
      element.style.removeProperty('background-color');
      element.style.removeProperty('background-image');
      element.style.removeProperty('background');
    } else if (style === 'option2') {
      element.style.setProperty('background-color', '#8b0000', 'important');
      element.style.setProperty('background-image', 'none', 'important');
    }
  };

  // Clone the real native DOM element when modal opens
  useEffect(() => {
    if (isOpen && targetElement && previewContainerRef.current) {
      const clone = targetElement.cloneNode(true) as HTMLElement;

      // Prevent interactive side effects on the clone
      clone.removeAttribute('id');
      clone.style.pointerEvents = 'none';
      clone.style.margin = '0 auto';

      previewContainerRef.current.innerHTML = '';
      previewContainerRef.current.appendChild(clone);
      clonedElementRef.current = clone;

      updateClone(clone, tempName, tempStyle);
    }
  }, [isOpen, targetElement]);

  // Update preview when temp inputs change
  useEffect(() => {
    if (clonedElementRef.current) {
      updateClone(clonedElementRef.current, tempName, tempStyle);
    }
  }, [tempName, tempStyle]);

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
      <span
        style={{
          display: 'block',
          fontSize: '11px',
          color: '#a6adc8',
          marginBottom: '12px',
        }}
      >
        LIVE PREVIEW
      </span>
      <div
        ref={previewContainerRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </div>
  );
};

export default LivePreview;