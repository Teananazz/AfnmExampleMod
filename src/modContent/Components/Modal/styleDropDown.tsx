import React, { useState } from 'react';
import { STYLE_CONFIG } from './styleOptions';

export interface StyleDropDownProps {
  styles: Record<string, string>;
  onChange: (category: string, value: string) => void;
  onRemove?: (category: string) => void;
}

const ensureHexColor = (value: string): string => {
  if (!value) return '#ffffff';
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) return value;
  if (/^#[0-9A-Fa-f]{3}$/.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return '#ffffff';
};

export const StyleDropDown: React.FC<StyleDropDownProps> = ({ styles, onChange, onRemove }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    Object.keys(STYLE_CONFIG)[0]
  );

  const handleAddCategory = () => {
    if (!selectedCategory || styles[selectedCategory] !== undefined) return;
    const defaultConfig = STYLE_CONFIG[selectedCategory];
    onChange(selectedCategory, defaultConfig.defaultValue);
  };

  const handleRemoveCategory = (categoryKey: string) => {
    if (onRemove) {
      onRemove(categoryKey);
    } else {
      onChange(categoryKey, '');
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 10px',
            fontSize: '13px',
            backgroundColor: '#313244',
            border: '1px solid #45475a',
            borderRadius: '4px',
            color: '#cdd6f4',
            outline: 'none',
          }}
        >
          {Object.entries(STYLE_CONFIG).map(([key, config]) => (
            <option key={key} value={key} disabled={styles[key] !== undefined}>
              {config.label} {styles[key] !== undefined ? '(Added)' : ''}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAddCategory}
          style={{
            padding: '8px 14px',
            backgroundColor: '#89b4fa',
            color: '#11111b',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {Object.entries(styles).map(([categoryKey, value]) => {
          const config = STYLE_CONFIG[categoryKey];
          if (!config || value === undefined) return null;

          const inputValue = config.inputType === 'color' ? ensureHexColor(value) : value;

          return (
            <div
              key={categoryKey}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                backgroundColor: '#313244',
                border: '1px solid #45475a',
                borderRadius: '4px',
              }}
            >
              <label
                style={{
                  flex: 1,
                  fontSize: '12px',
                  color: '#bac2de',
                  fontWeight: 600,
                }}
              >
                {config.label}
              </label>
              <input
                type={config.inputType}
                value={inputValue}
                onChange={(e) => onChange(categoryKey, e.target.value)}
                style={{
                  width: config.inputType === 'color' ? '40px' : '140px',
                  height: '28px',
                  padding: config.inputType === 'color' ? '0px' : '4px 8px',
                  fontSize: '12px',
                  backgroundColor: '#181825',
                  border: '1px solid #45475a',
                  borderRadius: '4px',
                  color: '#cdd6f4',
                  outline: 'none',
                  cursor: config.inputType === 'color' ? 'pointer' : 'text',
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveCategory(categoryKey)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f38ba8',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '0 4px',
                }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StyleDropDown;