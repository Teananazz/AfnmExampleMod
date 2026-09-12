import React, { useState } from 'react';
import EditModal from './Modal/EditModal';
import { applyElementUpdates, DEFAULT_STYLES } from './Modal/styleOptions';

export interface TButtonProps {
  targetName?: string;
  targetElement?: HTMLElement | null;
}

export const TButton: React.FC<TButtonProps> = ({ 
  targetName = 'Settings',
  targetElement = null 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonName, setButtonName] = useState(targetName);
  const [buttonStyles, setButtonStyles] = useState<Record<string, string>>(DEFAULT_STYLES);

  const handleSave = (newName: string, newStyles: Record<string, string>) => {
    setButtonName(newName);
    setButtonStyles(newStyles);

    if (targetElement) {
      applyElementUpdates(targetElement, newName, newStyles);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <button
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
        targetElement={targetElement}
        onSave={handleSave}
      />
    </>
  );
};

export default TButton;