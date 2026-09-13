import React, { useEffect, useRef } from 'react';

export interface LivePreviewProps {
  isOpen: boolean;
  targetElement: HTMLElement | null;
  tempName: string;
  tempStyles: Record<string, string>;
  tempAttributes?: Record<string, string>;
}

const toKebabCase = (str: string) => {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};

export const LivePreview: React.FC<LivePreviewProps> = ({
  isOpen,
  targetElement,
  tempName,
  tempStyles,
  tempAttributes = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !targetElement || !containerRef.current) return;

    const updatePreview = () => {
      if (!containerRef.current) return;
      
      // Deep clone the element to capture all current classes and structure
      const clone = targetElement.cloneNode(true) as HTMLElement;
      const tagName = clone.tagName.toLowerCase();

      // Fix: Only update innerHTML if the text actually changed.
      // Re-assigning identical HTML destroys internal React/MUI bindings and spans inside the clone.
      if (tagName !== 'img' && tempName !== undefined && tempName !== targetElement.innerHTML) {
        clone.innerHTML = tempName;
      }

      // Apply attribute modifications (src, href, width, height, alt)
      Object.entries(tempAttributes).forEach(([key, val]) => {
        if (val !== undefined && val !== '') {
          clone.setAttribute(key, val);
        } else {
          clone.removeAttribute(key);
        }
      });

      // Apply inline style adjustments forcefully with !important
      Object.entries(tempStyles).forEach(([key, val]) => {
        const cssKey = key.includes('-') ? key : toKebabCase(key);
        if (val) {
          clone.style.setProperty(cssKey, val, 'important');
          
          // Fix: MUI and game buttons often use 'background' instead of 'background-color'. 
          // We force override both to ensure visibility over gradients and internal layers.
          if (cssKey === 'background-color') {
            clone.style.setProperty('background', val, 'important');
          }
        } else {
          clone.style.removeProperty(cssKey);
          if (cssKey === 'background-color') {
            clone.style.removeProperty('background');
          }
        }
      });

      // Neutralize layout breaking constraints for sandbox preview container
      clone.style.setProperty('position', 'relative', 'important');
      clone.style.setProperty('top', 'auto', 'important');
      clone.style.setProperty('left', 'auto', 'important');
      clone.style.setProperty('right', 'auto', 'important');
      clone.style.setProperty('bottom', 'auto', 'important');
      clone.style.setProperty('transform', 'none', 'important');
      clone.style.setProperty('margin', '0', 'important');
      clone.style.setProperty('max-width', '100%', 'important');
      clone.style.setProperty('pointer-events', 'none', 'important');

      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(clone);
    };

    // Use requestAnimationFrame to prevent dropped paint frames during rapid color-picker updates
    const rafId = requestAnimationFrame(updatePreview);
    return () => cancelAnimationFrame(rafId);
    
  }, [isOpen, targetElement, tempName, tempStyles, tempAttributes]);

  if (!isOpen || !targetElement) return null;

  return (
    <div
      style={{
        padding: '12px 16px',
        backgroundColor: '#181825',
        border: '1px solid #313244',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexShrink: 0,
      }}
    >
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#a6adc8', textTransform: 'uppercase' }}>
        👁️ Live Preview (&lt;{targetElement.tagName.toLowerCase()}&gt;)
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '90px',
          maxHeight: '220px',
          padding: '12px',
          backgroundColor: '#11111b',
          borderRadius: '6px',
          border: '1px dashed #45475a',
          overflow: 'auto',
        }}
        ref={containerRef}
      />
    </div>
  );
};

export default LivePreview;