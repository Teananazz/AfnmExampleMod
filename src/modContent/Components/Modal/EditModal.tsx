import React, { useState, useEffect } from 'react';
import LivePreview from './LivePreview';
import ButtonNameInput from './ButtonNameInput';
import StyleDropDown from './styleDropDown';
import ModalActions from './ModalActions'

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

  useEffect(() => {
    if (isOpen) {
      setTempName(buttonName);
      setTempStyle(buttonStyle);
    }
  }, [isOpen, buttonName, buttonStyle]);

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

        {/* Modular Child Components */}
        <LivePreview
          isOpen={isOpen}
          targetElement={targetElement}
          tempName={tempName}
          tempStyle={tempStyle}
        />

        <ButtonNameInput
          value={tempName}
          onChange={setTempName}
        />

        <StyleDropDown
          value={tempStyle}
          onChange={setTempStyle}
        />

        <ModalActions
          onCancel={onClose}
          onDone={handleDone}
        />
      </div>
    </div>
  );
};

export default EditModal;