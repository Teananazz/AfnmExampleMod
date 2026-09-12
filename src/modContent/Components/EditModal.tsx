import React, { useState, useEffect, useRef } from 'react';

export interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonName: string;
  buttonStyle: string;
  targetElement: HTMLElement | null;
  onSave: (newName: string, newStyle: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  buttonName,
  buttonStyle,
  targetElement,
  onSave,
}) => {
  const [tempName, setTempName] = useState(buttonName);
  const [tempStyle, setTempStyle] = useState(buttonStyle);
  
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const clonedElementRef = useRef<HTMLElement | null>(null);

  // 1. Clone the real native element and append it to the preview box when modal opens
  useEffect(() => {
    if (isOpen && targetElement && previewContainerRef.current) {
      setTempName(buttonName);
      setTempStyle(buttonStyle);

      // Deep clone the actual game element
      const clone = targetElement.cloneNode(true) as HTMLElement;
      
      // Strip dynamic event listeners / ids to avoid conflicts
      clone.removeAttribute('id');
      clone.style.pointerEvents = 'none'; // Prevent preview clicks from triggering game actions
      clone.style.margin = '0 auto';

      // Clear existing preview and insert clone
      previewContainerRef.current.innerHTML = '';
      previewContainerRef.current.appendChild(clone);
      clonedElementRef.current = clone;

      // Apply initial styling/text state to clone
      updateClone(clone, buttonName, buttonStyle);
    }
  }, [isOpen, targetElement]);

  // 2. Dynamically update the preview clone whenever temp settings change
  useEffect(() => {
    if (clonedElementRef.current) {
      updateClone(clonedElementRef.current, tempName, tempStyle);
    }
  }, [tempName, tempStyle]);

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

  if (!isOpen) return null;

  const handleDone = () => {
    onSave(tempName, tempStyle);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '420px',
          padding: '20px',
          backgroundColor: '#1e1e2e',
          border: '1px solid #45475a',
          borderRadius: '8px',
          color: '#cdd6f4',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#f5e0dc' }}>Mod Window Settings</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#a6adc8', fontSize: '16px', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Live DOM Clone Preview Container */}
        <div style={{ marginBottom: '20px', textAlign: 'center', padding: '16px', backgroundColor: '#181825', borderRadius: '6px' }}>
          <span style={{ display: 'block', fontSize: '11px', color: '#a6adc8', marginBottom: '12px' }}>LIVE PREVIEW</span>
          <div ref={previewContainerRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
        </div>

        {/* Settings Controls */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#bac2de', fontWeight: 600 }}>
            Button Name
          </label>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              fontSize: '13px',
              backgroundColor: '#313244',
              border: '1px solid #45475a',
              borderRadius: '4px',
              color: '#cdd6f4',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#bac2de', fontWeight: 600 }}>
            Style
          </label>
          <select
            value={tempStyle}
            onChange={(e) => setTempStyle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              fontSize: '13px',
              backgroundColor: '#313244',
              border: '1px solid #45475a',
              borderRadius: '4px',
              color: '#cdd6f4',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          >
            <option value="option1">Option 1 (Default)</option>
            <option value="option2">Option 2 (Dark Red)</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{ padding: '6px 14px', backgroundColor: '#45475a', color: '#cdd6f4', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            style={{ padding: '6px 14px', backgroundColor: '#89b4fa', color: '#11111b', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;