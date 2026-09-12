import React, { useState } from 'react';
import EditModal from './Modal/EditModal';

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

  // Single commit point that updates state AND native target element together
  const handleSave = (newName: string, newStyle: string) => {
    setButtonName(newName);
    setButtonStyle(newStyle);

    if (targetElement) {
      // 1. Commit Name Change
      targetElement.textContent = newName;

      // 2. Commit Style Change (with MUI overriding flags)
      if (newStyle === 'option1') {
        targetElement.style.removeProperty('background-color');
        targetElement.style.removeProperty('background-image');
        targetElement.style.removeProperty('background');
      } else if (newStyle === 'option2') {
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
        buttonStyle={buttonStyle}
        targetElement={targetElement}
        onSave={handleSave}
      />
    </>
  );
};

export default TButton;