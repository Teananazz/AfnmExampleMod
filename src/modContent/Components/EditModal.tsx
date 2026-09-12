import React from 'react';

export interface ModModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonName: string;
  onButtonNameChange: (newName: string) => void;
}

export const EditModal: React.FC<ModModalProps> = ({
  isOpen,
  onClose,
  buttonName,
  onButtonNameChange,
}) => {
  if (!isOpen) return null;

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
          width: '400px',
          padding: '20px',
          backgroundColor: '#1e1e2e',
          border: '1px solid #45475a',
          borderRadius: '8px',
          color: '#cdd6f4',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px', color: '#f5e0dc' }}>
            Mod Window Settings
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#a6adc8',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Button Name Setting Input */}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="button-name-input"
            style={{
              display: 'block',
              fontSize: '12px',
              marginBottom: '6px',
              color: '#bac2de',
              fontWeight: 600,
            }}
          >
            Button Name
          </label>
          <input
            id="button-name-input"
            type="text"
            value={buttonName}
            onChange={(e) => onButtonNameChange(e.target.value)}
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

        <button
          onClick={onClose}
          style={{
            padding: '6px 14px',
            backgroundColor: '#89b4fa',
            color: '#11111b',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            float: 'right',
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default EditModal;