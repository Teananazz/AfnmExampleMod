import React, { useState, useRef, useEffect } from 'react';
import EditModal from './Modal/EditModal';
import { applyElementUpdates } from './Modal/styleOptions';

export interface TButtonProps {
  targetName?: string;
  targetElement?: HTMLElement | null;
}

export const TButton: React.FC<TButtonProps> = ({
  targetName = 'Settings',
  targetElement = null
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonName, setButtonName] = useState(targetName);
  // Initialize with an empty object so no styles are forced or pre-populated by default
  const [buttonStyles, setButtonStyles] = useState<Record<string, string>>({});

  const actualTarget = targetElement || buttonRef.current;

  useEffect(() => {
    if (actualTarget) {
      const currentText = actualTarget.textContent?.trim();
      if (currentText && currentText !== 'Edit') {
        setButtonName(currentText);
      }
    }
  }, [actualTarget]);

  const handleSave = (newName: string, newStyles: Record<string, string>) => {
    setButtonName(newName);
    setButtonStyles(newStyles);

    if (actualTarget) {
      applyElementUpdates(actualTarget, newName, newStyles);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <button
        ref={buttonRef} 
        onClick={handleClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 6px',
          fontSize: '11px',
          fontWeight: 600,
          color: '#fff',
          backgroundColor: '#2b2d42',
          border: '1px solid #4a4e69',
          borderRadius: '3px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span>Edit</span>
      </button>

      <EditModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        buttonName={buttonName}
        buttonStyles={buttonStyles}
        targetElement={actualTarget}
        onSave={handleSave}
      />
    </>
  );
};

export default TButton;