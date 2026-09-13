export interface StyleCategoryConfig {
  label: string;
  cssProperty: string;
  inputType: 'color' | 'text';
  defaultValue: string;
}

export const STYLE_CONFIG: Record<string, StyleCategoryConfig> = {
  bgStyle: {
    label: 'Background Color',
    cssProperty: 'background-color',
    inputType: 'color',
    defaultValue: '#8b0000',
  },
  marginStyle: {
    label: 'Margin',
    cssProperty: 'margin',
    inputType: 'text',
    defaultValue: '12px',
  },
  paddingStyle: {
    label: 'Padding',
    cssProperty: 'padding',
    inputType: 'text',
    defaultValue: '16px',
  },
  widthStyle: {
    label: 'Width',
    cssProperty: 'width',
    inputType: 'text',
    defaultValue: '100%',
  },
  heightStyle: {
    label: 'Height',
    cssProperty: 'height',
    inputType: 'text',
    defaultValue: 'auto',
  },
  borderStyle: {
    label: 'Border',
    cssProperty: 'border',
    inputType: 'text',
    defaultValue: '1px solid #45475a',
  },
  shadowStyle: {
    label: 'Box Shadow',
    cssProperty: 'box-shadow',
    inputType: 'text',
    defaultValue: '0 4px 6px -1px rgba(0,0,0,0.1)',
  },
  opacityStyle: {
    label: 'Opacity',
    cssProperty: 'opacity',
    inputType: 'text',
    defaultValue: '0.9',
  },
};

export const DEFAULT_STYLES: Record<string, string> = {};

export const applyElementUpdates = (
  element: HTMLElement,
  name: string,
  styles: Record<string, string>
) => {
  if (!element) return;

  // 1. SAFELY update text inside MUI button structure
  if (name !== undefined) {
    const replaceTextContent = (node: Node): boolean => {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];

        if (
          child.nodeType === Node.ELEMENT_NODE &&
          (child as HTMLElement).className?.includes('TouchRipple')
        ) {
          continue;
        }

        if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim() !== '') {
          child.textContent = name;
          return true;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (replaceTextContent(child)) return true;
        }
      }
      return false;
    };

    const foundText = replaceTextContent(element);
    if (!foundText) {
      element.innerText = name;
    }
  }

  // 2. Clear managed style properties
  Object.values(STYLE_CONFIG).forEach((config) => {
    element.style.removeProperty(config.cssProperty);
  });
  element.style.removeProperty('background-image');

  // 3. Apply active styles directly
  Object.entries(STYLE_CONFIG).forEach(([categoryKey, config]) => {
    let value = styles[categoryKey];

    if (value !== undefined && value !== '') {
      if (categoryKey === 'bgStyle') {
        element.style.setProperty('background-color', value, 'important');
        element.style.setProperty('background-image', 'none', 'important');
      } else {
        // Auto-append px to numeric values for properties like padding, margin, width, height
        if (
          !isNaN(Number(value)) &&
          ['marginStyle', 'paddingStyle', 'widthStyle', 'heightStyle'].includes(categoryKey)
        ) {
          value = `${value}px`;
        }
        element.style.setProperty(config.cssProperty, value, 'important');
      }
    }
  });
};