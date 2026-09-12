import React from 'react';

export interface ButtonNameInputProps {
  value: string;
  onChange: (newValue: string) => void;
}

export const ButtonNameInput: React.FC<ButtonNameInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label
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
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
  );
};

export default ButtonNameInput;