import React, { useState } from 'react';
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
  const [buttonStyle, setButtonStyle] = useState('option1');

  const handleNameChange = (newName: string) => {
    setButtonName(newName);
    if (targetElement) {
      targetElement.textContent = newName;
    }
  };

  const handleStyleChange = (newStyle: string) => {
  setButtonStyle(newStyle);
  if (targetElement) {
    if (newStyle === 'option1') {
      // Revert back to native MUI styles
      targetElement.style.removeProperty('background-color');
      targetElement.style.removeProperty('background-image');
      targetElement.style.removeProperty('background');
    } else if (newStyle === 'option2') {
      // Override MUI's specificity rules and background gradients
      targetElement.style.setProperty('background-color', '#8b0000', 'important');
      targetElement.style.setProperty('background-image', 'none', 'important');
    }
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
        onButtonNameChange={handleNameChange}
        buttonStyle={buttonStyle}
        onButtonStyleChange={handleStyleChange}
      />
    </>
  );
};

export default TButton;