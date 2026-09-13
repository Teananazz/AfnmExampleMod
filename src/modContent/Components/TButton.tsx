import React, { useState, useRef, useEffect } from 'react';
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonName, setButtonName] = useState(targetName);
  const [buttonStyles, setButtonStyles] = useState<Record<string, string>>(DEFAULT_STYLES);

  // Determine the actual element to modify (the passed MUI button, or this button itself)
  const actualTarget = targetElement || buttonRef.current;

  // Sync initial button name if target element exists
  useEffect(() => {
    if (actualTarget) {
      const currentText = actualTarget.textContent?.trim();
      // Ignore syncing if the target is just this "Edit" button itself
      if (currentText && currentText !== 'Edit') {
        setButtonName(currentText);
      }
    }
  }, [actualTarget]);

  const handleSave = (newName: string, newStyles: Record<string, string>) => {
    setButtonName(newName);
    setButtonStyles(newStyles);

    // Apply updates directly to the real DOM node so "Done" instantly saves it
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
        {/* Reverted to just saying "Edit" */}
        <span>Edit</span>
      </button>

      <EditModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        buttonName={buttonName}
        buttonStyles={buttonStyles}
        targetElement={actualTarget} // Pass the resolved target to the modal
        onSave={handleSave}
      />
    </>
  );
};

export default TButton;