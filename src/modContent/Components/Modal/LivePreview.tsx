import React from 'react';

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
  if (!isOpen) return null;

  // Extract baseline styling or computed styles from the target element for preview matching
  const computed = targetElement ? window.getComputedStyle(targetElement) : null;
  
  const baseBgImage = computed ? computed.getPropertyValue('background-image') : 'none';
  const baseBgColor = computed ? computed.getPropertyValue('background-color') : '#2b2d42';
  const baseColor = computed ? computed.getPropertyValue('color') : '#ffffff';
  const basePadding = computed ? computed.getPropertyValue('padding') : '6px 12px';
  const baseBorder = computed ? computed.getPropertyValue('border') : '1px solid #4a4e69';
  const baseRadius = computed ? computed.getPropertyValue('border-radius') : '4px';
  const baseFontSize = computed ? computed.getPropertyValue('font-size') : '13px';
  const baseFontWeight = computed ? computed.getPropertyValue('font-weight') : '600';

  // Build temporary style overrides based on what the user is editing in the modal
  const previewStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: basePadding,
    fontSize: baseFontSize,
    fontWeight: baseFontWeight ? (baseFontWeight as any) : 600,
    color: baseColor,
    background: baseBgImage !== 'none' ? baseBgImage : baseBgColor,
    border: baseBorder,
    borderRadius: baseRadius,
    cursor: 'pointer',
    transition: 'all 0.1s ease',
  };

  // Apply real-time overrides from tempStyles
  Object.entries(tempStyles).forEach(([prop, value]) => {
    if (value === undefined || value === '') return;

    let finalVal = value;
    if (
      !isNaN(Number(value)) &&
      ['margin', 'padding', 'width', 'height', 'font-size', 'radius', 'gap', 'top', 'bottom', 'left', 'right'].some(
        (k) => prop.includes(k)
      )
    ) {
      finalVal = `${value}px`;
    }

    if (prop === 'background-color') {
      // If user explicitly changes the background via the color picker tool, override image layer
      previewStyle.backgroundColor = finalVal;
      previewStyle.backgroundImage = 'none';
    } else if (prop === 'background' || prop === 'background-image') {
      previewStyle.background = finalVal;
    } else if (prop === 'color') {
      previewStyle.color = finalVal;
    } else if (prop === 'border') {
      previewStyle.border = finalVal;
    } else if (prop.includes('radius')) {
      previewStyle.borderRadius = finalVal;
    } else if (prop === 'font-size') {
      previewStyle.fontSize = finalVal;
    } else if (prop === 'padding') {
      previewStyle.padding = finalVal;
    }
  });

  return (
    <div
      style={{
        marginBottom: '16px',
        padding: '16px',
        backgroundColor: '#11111b',
        borderRadius: '6px',
        border: '1px solid #45475a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span style={{ fontSize: '11px', color: '#a6adc8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Live Preview
      </span>
      <div
        style={{
          padding: '16px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          background: '#181825',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div style={previewStyle}>
          {tempName || 'Button'}
        </div>
      </div>
    </div>
  );
};

export default LivePreview;