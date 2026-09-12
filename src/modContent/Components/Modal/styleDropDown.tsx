import React from 'react';

export interface StyleDropDownProps {
  value: string;
  onChange: (newStyle: string) => void;
}

export const StyleDropDown: React.FC<StyleDropDownProps> = ({
  value,
  onChange,
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label
        style={{
          display: 'block',
          fontSize: '12px',
          marginBottom: '6px',
          color: '#bac2de',
          fontWeight: 600,
        }}
      >
        Style
      </label>
      <select
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
      >
        <option value="option1">Option 1 (Default)</option>
        <option value="option2">Option 2 (Dark Red)</option>
      </select>
    </div>
  );
};

export default StyleDropDown;