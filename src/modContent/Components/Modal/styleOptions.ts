export interface StyleOption {
  label: string;
  styles: Record<string, string>;
}

// Map of categories and their available choices
export const STYLE_CONFIG: Record<string, { label: string; options: Record<string, StyleOption> }> = {
  bgStyle: {
    label: 'Background Style',
    options: {
      option1: { label: 'Option 1 (Default)', styles: { 'background-color': '', 'background-image': '', background: '' } },
      option2: { label: 'Option 2 (Dark Red)', styles: { 'background-color': '#8b0000', 'background-image': 'none' } },
    },
  },
  marginStyle: {
    label: 'Margin Style',
    options: {
      option1: { label: 'Option 1 (Default)', styles: { margin: '' } },
      option2: { label: 'Option 2 (Custom 12px)', styles: { margin: '12px' } },
    },
  },
};

// Default initial state object
export const DEFAULT_STYLES: Record<string, string> = {
  bgStyle: 'option1',
  marginStyle: 'option1',
};

/**
 * Single function that receives an element, button text, and the full styles object.
 */
export const applyElementUpdates = (
  element: HTMLElement,
  name: string,
  styles: Record<string, string>
) => {
  // Update button text
  element.textContent = name;

  // Merge and apply all CSS properties across all active style selections
  Object.entries(styles).forEach(([category, optionKey]) => {
    const categoryConfig = STYLE_CONFIG[category];
    if (!categoryConfig) return;

    const optionStyles = categoryConfig.options[optionKey]?.styles || {};
    Object.entries(optionStyles).forEach(([property, value]) => {
      if (value) {
        element.style.setProperty(property, value, 'important');
      } else {
        element.style.removeProperty(property);
      }
    });
  });
};