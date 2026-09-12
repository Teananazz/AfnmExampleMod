import React, { useState, useEffect } from 'react';
import EditModal from './EditModal';

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

  // Synchronize input changes with the native game button's text
  const handleNameChange = (newName: string) => {
    setButtonName(newName);
    if (targetElement) {
      targetElement.textContent = newName;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      {/* Mod button always displays "Edit" */}
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
        onButtonNameChange={handleNameChange}
      />
    </>
  );
};

export default TButton;