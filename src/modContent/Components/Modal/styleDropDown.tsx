import React from 'react';
import { STYLE_CONFIG } from './styleOptions';

export interface StyleDropDownProps {
  styles: Record<string, string>;
  onChange: (category: string, value: string) => void;
}

export const StyleDropDown: React.FC<StyleDropDownProps> = ({ styles, onChange }) => {
  return (
    <>
      {Object.entries(STYLE_CONFIG).map(([categoryKey, category]) => (
        <div key={categoryKey} style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              marginBottom: '6px',
              color: '#bac2de',
              fontWeight: 600,
            }}
          >
            {category.label}
          </label>
          <select
            value={styles[categoryKey] || 'option1'}
            onChange={(e) => onChange(categoryKey, e.target.value)}
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
            {Object.entries(category.options).map(([optionKey, option]) => (
              <option key={optionKey} value={optionKey}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </>
  );
};

export default StyleDropDown;