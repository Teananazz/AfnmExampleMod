import React, { useState, useEffect } from 'react';
import EditModal from './Modal/EditModal';
import LivePreview from './Modal/LivePreview';
import { applyElementUpdates } from './Modal/styleOptions';

export interface TGlobalEditorProps {
  rootElement?: HTMLElement | null;
}

export const TGlobalEditor: React.FC<TGlobalEditorProps> = ({ rootElement = null }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editableElements, setEditableElements] = useState<HTMLElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

  const [elementStates, setElementStates] = useState<
    Map<HTMLElement, { name: string; styles: Record<string, string>; tagAttributes?: Record<string, string> }>
  >(new Map());

  // Single source of truth for the live drafts
  const [tempName, setTempName] = useState<string>('');
  const [tempStyles, setTempStyles] = useState<Record<string, string>>({});
  const [tempAttributes, setTempAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;

    const root = rootElement || document.body;
    const query = 'button, img, #backgroundImage, h1, h2, h3, p, a, [data-editable]';
    const found = Array.from(root.querySelectorAll(query)) as HTMLElement[];

    const filtered = found.filter((el) => !el.closest('#t-global-editor-modal'));
    setEditableElements(filtered);

    if (filtered.length > 0 && !selectedElement) {
      setSelectedElement(filtered[0]);
    }
  }, [isOpen, rootElement]);

  // Read the original state into the drafts when selecting a new element
  useEffect(() => {
    if (!selectedElement) return;

    const existingState = elementStates.get(selectedElement);
    const tagName = selectedElement.tagName.toLowerCase();

    // Use innerHTML so we don't destroy SVGs/spans inside buttons during live edit
    const initialName = existingState?.name ?? selectedElement.innerHTML ?? '';
    const initialStyles = existingState?.styles ?? {};
    
    const initialAttrs: Record<string, string> = { ...(existingState?.tagAttributes ?? {}) };
    
    if (tagName === 'img') {
      const img = selectedElement as HTMLImageElement;
      initialAttrs.src = initialAttrs.src ?? (img.getAttribute('src') || img.src || '');
      initialAttrs.alt = initialAttrs.alt ?? (img.getAttribute('alt') || '');
      initialAttrs.width = initialAttrs.width ?? (img.getAttribute('width') || '');
      initialAttrs.height = initialAttrs.height ?? (img.getAttribute('height') || '');
    } else if (tagName === 'a') {
      const a = selectedElement as HTMLAnchorElement;
      initialAttrs.href = initialAttrs.href ?? (a.getAttribute('href') || a.href || '');
    }

    setTempName(initialName);
    setTempStyles(initialStyles);
    setTempAttributes(initialAttrs);
  }, [selectedElement, elementStates]);

  const handleSave = (
    newName: string,
    newStyles: Record<string, string>,
    tagAttributes?: Record<string, string>
  ) => {
    if (!selectedElement) return;

    setElementStates((prev) => {
      const next = new Map(prev);
      next.set(selectedElement, { name: newName, styles: newStyles, tagAttributes });
      return next;
    });

    applyElementUpdates(selectedElement, newName, newStyles);

    if (tagAttributes) {
      Object.entries(tagAttributes).forEach(([attrKey, attrVal]) => {
        if (attrVal !== undefined && attrVal !== '') {
          selectedElement.setAttribute(attrKey, attrVal);
        } else {
          selectedElement.removeAttribute(attrKey);
        }
      });
    }
  };

  return (
    <div id="t-global-editor-wrapper" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 99999 }}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          padding: '10px 16px',
          fontSize: '13px',
          fontWeight: 700,
          backgroundColor: '#89b4fa',
          color: '#11111b',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        ✏️ Edit Page Elements
      </button>

      {isOpen && (
        <div
          id="t-global-editor-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(17, 17, 27, 0.85)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000000,
          }}
        >
          <div
            style={{
              width: '860px',
              maxWidth: '95vw',
              height: '800px',
              maxHeight: '92vh',
              backgroundColor: '#11111b',
              border: '1px solid #45475a',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #313244',
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: '#181825',
              }}
            >
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#cdd6f4' }}>Page Element Inspector</span>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#a6adc8', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div
                style={{
                  width: '280px',
                  borderRight: '1px solid #313244',
                  overflowY: 'auto',
                  padding: '12px',
                  backgroundColor: '#181825',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#a6adc8', marginBottom: '4px' }}>Select Element</div>
                {editableElements.map((el, idx) => {
                  const tag = el.tagName.toLowerCase();
                  const isSelected = selectedElement === el;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedElement(el)}
                      style={{
                        padding: '10px 12px',
                        fontSize: '12px',
                        backgroundColor: isSelected ? '#313244' : 'transparent',
                        color: isSelected ? '#89b4fa' : '#cdd6f4',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        border: isSelected ? '1px solid #45475a' : '1px solid transparent',
                      }}
                    >
                      <strong style={{ color: '#f5e0dc', marginRight: '4px' }}>&lt;{tag}&gt;</strong>
                      {el.textContent?.trim() || tag}
                    </div>
                  );
                })}
              </div>

              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedElement && (
                  <>
                    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
                      <EditModal
                        key={editableElements.indexOf(selectedElement)}
                        isOpen={true}
                        onClose={() => {}}
                        embedded={true}
                        buttonName={tempName}
                        buttonStyles={tempStyles}
                        buttonAttributes={tempAttributes}
                        targetElement={selectedElement}
                        onChangeDraft={(name, styles, attrs) => {
                          setTempName(name);
                          setTempStyles({ ...styles }); // Force re-render reactivity
                          setTempAttributes({ ...attrs });
                        }}
                        onSave={handleSave}
                      />
                    </div>
                    <LivePreview
                      isOpen={true}
                      targetElement={selectedElement}
                      tempName={tempName}
                      tempStyles={tempStyles}
                      tempAttributes={tempAttributes}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TGlobalEditor;