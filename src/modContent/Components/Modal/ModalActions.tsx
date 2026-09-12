import React from 'react';

export interface ModalActionsProps {
  onCancel: () => void;
  onDone: () => void;
}

export const ModalActions: React.FC<ModalActionsProps> = ({
  onCancel,
  onDone,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
      <button
        onClick={onCancel}
        style={{
          padding: '6px 14px',
          backgroundColor: '#45475a',
          color: '#cdd6f4',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
      <button
        onClick={onDone}
        style={{
          padding: '6px 14px',
          backgroundColor: '#89b4fa',
          color: '#11111b',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Done
      </button>
    </div>
  );
};

export default ModalActions;