import React from 'react';
import StyleDropDown from '../Modal/styleDropDown';

export interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonName: string;
  buttonStyles: Record<string, string>;
  buttonAttributes?: Record<string, string>;
  targetElement: HTMLElement | null;
  onChangeDraft?: (name: string, styles: Record<string, string>, attrs: Record<string, string>) => void;
  onSave: (newName: string, newStyles: Record<string, string>, tagAttributes?: Record<string, string>) => void;
  embedded?: boolean;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  buttonName,
  buttonStyles,
  buttonAttributes = {},
  targetElement,
  onChangeDraft,
  onSave,
  embedded = false,
}) => {
  if (!isOpen || !targetElement) return null;

  const tagName = targetElement.tagName.toLowerCase();

  const handleNameChange = (val: string) => {
    if (onChangeDraft) onChangeDraft(val, buttonStyles, buttonAttributes);
  };

  const handleAttributeChange = (key: string, value: string) => {
    if (onChangeDraft) {
      onChangeDraft(buttonName, buttonStyles, { ...buttonAttributes, [key]: value });
    }
  };

  const handleStyleChange = (prop: string, val: string) => {
    if (onChangeDraft) {
      onChangeDraft(buttonName, { ...buttonStyles, [prop]: val }, buttonAttributes);
    }
  };

  const handleStyleRemove = (prop: string) => {
    if (onChangeDraft) {
      const nextStyles = { ...buttonStyles };
      delete nextStyles[prop];
      onChangeDraft(buttonName, nextStyles, buttonAttributes);
    }
  };

  const handleSave = () => {
    onSave(buttonName, buttonStyles, buttonAttributes);
    if (!embedded) onClose();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
      {tagName !== 'img' && (
        <div>
          <label style={labelStyle}>Element HTML / Text Content</label>
          <input
            type="text"
            value={buttonName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Text or HTML content..."
            style={inputStyle}
          />
        </div>
      )}

      {tagName === 'img' && (
        <div style={sectionBoxStyle}>
          <label style={sectionHeaderStyle}>⚙️ Unique &lt;img&gt; Attributes</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <label style={labelStyle}>Image Source URL (src)</label>
              <input
                type="text"
                value={buttonAttributes.src || ''}
                onChange={(e) => handleAttributeChange('src', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Alt Text (alt)</label>
              <input
                type="text"
                value={buttonAttributes.alt || ''}
                onChange={(e) => handleAttributeChange('alt', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Width (px)</label>
                <input
                  type="text"
                  value={buttonAttributes.width || ''}
                  onChange={(e) => handleAttributeChange('width', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Height (px)</label>
                <input
                  type="text"
                  value={buttonAttributes.height || ''}
                  onChange={(e) => handleAttributeChange('height', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {tagName === 'a' && (
        <div style={sectionBoxStyle}>
          <label style={sectionHeaderStyle}>⚙️ Unique &lt;a&gt; Attributes</label>
          <div>
            <label style={labelStyle}>Destination URL (href)</label>
            <input
              type="text"
              value={buttonAttributes.href || ''}
              onChange={(e) => handleAttributeChange('href', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
      )}

      <div>
        <label style={labelStyle}>CSS Styles</label>
        <StyleDropDown
          styles={buttonStyles}
          targetElement={targetElement}
          onChange={handleStyleChange}
          onRemove={handleStyleRemove}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'auto' }}>
        <button
          type="button"
          onClick={handleSave}
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: '#89b4fa',
            color: '#11111b',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', color: '#a6adc8', marginBottom: '4px', fontWeight: 600 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', fontSize: '12px', backgroundColor: '#181825', border: '1px solid #45475a', borderRadius: '6px', color: '#cdd6f4', outline: 'none', boxSizing: 'border-box' };
const sectionBoxStyle: React.CSSProperties = { padding: '12px', backgroundColor: '#181825', borderRadius: '8px', border: '1px solid #313244' };
const sectionHeaderStyle: React.CSSProperties = { display: 'block', fontSize: '11px', color: '#89b4fa', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' };

export default EditModal;