import React, { useState, useRef, useEffect, useMemo } from 'react';
import { detectElementStyles, getLivePropertyValue } from './styleOptions';

export interface StyleDropDownProps {
  styles: Record<string, string>;
  targetElement: HTMLElement | null;
  onChange: (cssProperty: string, value: string) => void;
  onRemove?: (cssProperty: string) => void;
}

const extractHex = (val: string): string => {
  if (!val) return '#ffffff';
  if (val.startsWith('#')) return val.slice(0, 7);
  const match = val.match(/#[0-9a-fA-F]{3,6}/);
  if (match) return match[0];
  const rgb = val.match(/\d+/g);
  if (rgb && rgb.length >= 3) {
    const r = parseInt(rgb[0], 10).toString(16).padStart(2, '0');
    const g = parseInt(rgb[1], 10).toString(16).padStart(2, '0');
    const b = parseInt(rgb[2], 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return '#ffffff';
};

const CustomColorPicker: React.FC<{ value: string; onChange: (val: string) => void }> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const swatchRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!isOpen && swatchRef.current) {
      const rect = swatchRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 6,
        left: Math.max(10, rect.right - 260), // Adjusted width to 260px for comfortable gradient editing
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(targetNode) &&
        swatchRef.current &&
        !swatchRef.current.contains(targetNode)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleToggle, true);
      window.addEventListener('resize', handleToggle);
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleToggle, true);
      window.removeEventListener('resize', handleToggle);
    };
  }, [isOpen]);

  const isGradient = typeof value === 'string' && value.includes('gradient');
  const hexVal = extractHex(value);

  return (
    <>
      <div
        ref={swatchRef}
        onClick={handleToggle}
        style={{
          width: '36px',
          height: '26px',
          background: value,
          border: '1px solid #45475a',
          borderRadius: '4px',
          cursor: 'pointer',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
        title="Click to open color / gradient editor"
      />

      {isOpen && (
        <div
          ref={popoverRef}
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: '260px',
            padding: '12px',
            backgroundColor: '#181825',
            border: '1px solid #45475a',
            borderRadius: '6px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.8)',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontFamily: 'sans-serif',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#a6adc8', fontWeight: 600 }}>
              {isGradient ? 'Gradient / Color Editor' : 'Color Picker'}
            </span>
            {!isGradient && (
              <label style={{ fontSize: '11px', color: '#89b4fa', cursor: 'pointer', textDecoration: 'underline' }}>
                Open Wheel
                <input
                  type="color"
                  value={hexVal}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                  style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                />
              </label>
            )}
          </div>

          <textarea
            value={value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            placeholder="#HEX or gradient(...)"
            rows={3}
            style={{
              width: '100%',
              padding: '6px 8px',
              fontSize: '11px',
              backgroundColor: '#313244',
              border: '1px solid #45475a',
              borderRadius: '4px',
              color: '#cdd6f4',
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {['#1976d2', '#2b2d42', '#ffffff', '#000000', '#f38ba8', '#a6e3a1', '#f9e2af', '#fab387'].map((preset: string) => (
              <div
                key={preset}
                onClick={() => onChange(preset)}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: preset,
                  border: '1px solid #45475a',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
                title={preset}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export const StyleDropDown: React.FC<StyleDropDownProps> = ({
  styles,
  targetElement,
  onChange,
  onRemove,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const detectedConfigs = useMemo(() => {
    return detectElementStyles(targetElement);
  }, [targetElement]);

  const filteredProperties = useMemo<string[]>(() => {
    const allProps = Object.keys(detectedConfigs).sort();
    if (!searchTerm.trim()) return allProps;

    const term = searchTerm.toLowerCase();
    return allProps.filter((prop: string) => {
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedProp(e.target.value)}
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
            filteredProperties.map((prop: string) => {
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
        {Object.entries(styles).map(([prop, value]: [string, string]) => {
          const config = detectedConfigs[prop] || {
            label: prop,
            cssProperty: prop,
            inputType: prop.includes('color') || prop.includes('background') ? 'color' : 'text',
          };

          if (value === undefined) return null;

          const isColorType = config.inputType === 'color' || prop.includes('color') || prop.includes('background');

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

              {isColorType ? (
                <CustomColorPicker value={value} onChange={(newVal: string) => onChange(prop, newVal)} />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(prop, e.target.value)}
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