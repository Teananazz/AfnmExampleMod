import React, { useState, useMemo } from 'react';
import { detectElementStyles, getLivePropertyValue } from './styleOptions';

export interface StyleDropDownProps {
  styles: Record<string, string>;
  targetElement: HTMLElement | null;
  onChange: (cssProperty: string, value: string) => void;
  onRemove?: (cssProperty: string) => void;
}

const ensureHexColor = (value: string): string => {
  if (!value || value.includes('gradient')) return '#ffffff';
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) return value;
  if (/^#[0-9A-Fa-f]{3}$/.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return '#ffffff';
};

export const StyleDropDown: React.FC<StyleDropDownProps> = ({
  styles,
  targetElement,
  onChange,
  onRemove,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const detectedConfigs = useMemo(() => {
    return detectElementStyles(targetElement);
  }, [targetElement]);

  const filteredProperties = useMemo(() => {
    const allProps = Object.keys(detectedConfigs).sort();
    if (!searchTerm.trim()) return allProps;

    const term = searchTerm.toLowerCase();
    return allProps.filter((prop) => {
      const config = detectedConfigs[prop];
      return (
        prop.toLowerCase().includes(term) ||
        config.label.toLowerCase().includes(term)
      );
    });
  }, [detectedConfigs, searchTerm]);

  const [selectedProp, setSelectedProp] = useState<string>('');

  const currentSelectValue = filteredProperties.includes(selectedProp)
    ? selectedProp
    : filteredProperties[0] || '';

  const handleAddCategory = () => {
    const propToAdd = currentSelectValue;
    if (!propToAdd || styles[propToAdd] !== undefined) return;

    const liveValue = getLivePropertyValue(targetElement, propToAdd);
    onChange(propToAdd, liveValue);
  };

  const handleRemoveCategory = (prop: string) => {
    if (onRemove) {
      onRemove(prop);
    } else {
      onChange(prop, '');
    }
  };

  return (
    <div style={{ marginBottom: '16px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '8px' }}>
        <input
          type="text"
          placeholder="Search style property (e.g., color, padding)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '6px 10px',
            fontSize: '12px',
            backgroundColor: '#181825',
            border: '1px solid #45475a',
            borderRadius: '4px',
            color: '#cdd6f4',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', width: '100%' }}>
        <select
          value={currentSelectValue}
          onChange={(e) => setSelectedProp(e.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '6px 8px',
            fontSize: '12px',
            backgroundColor: '#313244',
            border: '1px solid #45475a',
            borderRadius: '4px',
            color: '#cdd6f4',
            outline: 'none',
            textOverflow: 'ellipsis',
          }}
        >
          {filteredProperties.length === 0 ? (
            <option value="" disabled>
              No matching properties found
            </option>
          ) : (
            filteredProperties.map((prop) => {
              const config = detectedConfigs[prop];
              return (
                <option key={prop} value={prop} disabled={styles[prop] !== undefined}>
                  {config.label} ({prop}) {styles[prop] !== undefined ? '✓ Added' : ''}
                </option>
              );
            })
          )}
        </select>
        <button
          type="button"
          onClick={handleAddCategory}
          disabled={!currentSelectValue || styles[currentSelectValue] !== undefined}
          style={{
            padding: '6px 12px',
            backgroundColor:
              !currentSelectValue || styles[currentSelectValue] !== undefined
                ? '#45475a'
                : '#89b4fa',
            color:
              !currentSelectValue || styles[currentSelectValue] !== undefined
                ? '#a6adc8'
                : '#11111b',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor:
              !currentSelectValue || styles[currentSelectValue] !== undefined
                ? 'not-allowed'
                : 'pointer',
            flexShrink: 0,
          }}
        >
          +
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '200px',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {Object.entries(styles).map(([prop, value]) => {
          const config = detectedConfigs[prop] || {
            label: prop,
            cssProperty: prop,
            inputType: prop.includes('color') ? 'color' : 'text',
          };

          if (value === undefined) return null;

          const isGradient = typeof value === 'string' && value.includes('gradient');

          return (
            <div
              key={prop}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                backgroundColor: '#313244',
                border: '1px solid #45475a',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
            >
              <label
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: '11px',
                  color: '#bac2de',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={`${config.label} (${prop})`}
              >
                {config.label}
              </label>

              {isGradient ? (
                // Render custom visual gradient swatch square + full text input for gradients
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <div
                    title={value}
                    style={{
                      width: '26px',
                      height: '26px',
                      background: value,
                      border: '1px solid #45475a',
                      borderRadius: '4px',
                      flexShrink: 0,
                    }}
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(prop, e.target.value)}
                    style={{
                      width: '110px',
                      height: '26px',
                      padding: '2px 6px',
                      fontSize: '11px',
                      backgroundColor: '#181825',
                      border: '1px solid #45475a',
                      borderRadius: '4px',
                      color: '#cdd6f4',
                      outline: 'none',
                    }}
                  />
                </div>
              ) : config.inputType === 'color' ? (
                <input
                  type="color"
                  value={ensureHexColor(value)}
                  onChange={(e) => onChange(prop, e.target.value)}
                  style={{
                    width: '36px',
                    height: '26px',
                    padding: '0px',
                    backgroundColor: '#181825',
                    border: '1px solid #45475a',
                    borderRadius: '4px',
                    outline: 'none',
                    flexShrink: 0,
                    cursor: 'pointer',
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(prop, e.target.value)}
                  style={{
                    width: '110px',
                    height: '26px',
                    padding: '2px 6px',
                    fontSize: '11px',
                    backgroundColor: '#181825',
                    border: '1px solid #45475a',
                    borderRadius: '4px',
                    color: '#cdd6f4',
                    outline: 'none',
                    flexShrink: 0,
                  }}
                />
              )}

              <button
                type="button"
                onClick={() => handleRemoveCategory(prop)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f38ba8',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: '0 2px',
                  flexShrink: 0,
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