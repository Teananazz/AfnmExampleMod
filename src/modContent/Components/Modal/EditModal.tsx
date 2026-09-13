import React, { useState, useEffect } from 'react';
import LivePreview from './LivePreview';
import ButtonNameInput from './ButtonNameInput';
import StyleDropDown from './styleDropDown';
import ModalActions from './ModalActions';

export interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonName: string;
  buttonStyles: Record<string, string>;
  targetElement: HTMLElement | null;
  onSave: (newName: string, newStyles: Record<string, string>) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  buttonName,
  buttonStyles,
  targetElement,
  onSave,
}) => {
  const [tempName, setTempName] = useState(buttonName);
  const [tempStyles, setTempStyles] = useState<Record<string, string>>(buttonStyles);

  useEffect(() => {
    if (isOpen) {
      setTempName(buttonName);
      setTempStyles(buttonStyles);
    }
  }, [isOpen, buttonName, buttonStyles]);

  if (!isOpen) return null;

  const handleStyleChange = (category: string, value: string) => {
    setTempStyles((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleStyleRemove = (category: string) => {
    setTempStyles((prev) => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
  };

  const handleDone = () => {
    onSave(tempName, tempStyles);
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

        <LivePreview
          isOpen={isOpen}
          targetElement={targetElement}
          tempName={tempName}
          tempStyles={tempStyles}
        />

        <ButtonNameInput value={tempName} onChange={setTempName} />

        <StyleDropDown
          styles={tempStyles}
          onChange={handleStyleChange}
          onRemove={handleStyleRemove}
        />

        <ModalActions onCancel={onClose} onDone={handleDone} />
      </div>
    </div>
  );
};

export default EditModal;