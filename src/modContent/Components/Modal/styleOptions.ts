export interface DynamicStyleConfig {
  label: string;
  cssProperty: string;
  inputType: 'color' | 'text';
  currentValue: string;
}

const formatLabel = (prop: string): string => {
  return prop
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const rgbToHex = (val: string): string => {
  if (!val) return '#ffffff';
  if (val.startsWith('#')) {
    if (val.length === 4) {
      return `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}`;
    }
    return val;
  }

  const rgbValues = val.match(/\d+/g);
  if (rgbValues && rgbValues.length >= 3) {
    const r = parseInt(rgbValues[0], 10).toString(16).padStart(2, '0');
    const g = parseInt(rgbValues[1], 10).toString(16).padStart(2, '0');
    const b = parseInt(rgbValues[2], 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return '#ffffff';
};

/**
 * Captures full gradients or solid background colors, traversing up the DOM if transparent.
 */
const getActualBackgroundColor = (element: HTMLElement): string => {
  let curr: HTMLElement | null = element;
  while (curr) {
    const computed = window.getComputedStyle(curr);
    const bgImage = computed.getPropertyValue('background-image');
    const bgColor = computed.getPropertyValue('background-color');

    // Return the full gradient string if present
    if (bgImage && bgImage !== 'none' && bgImage.includes('gradient')) {
      return bgImage;
    }

    if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
      return rgbToHex(bgColor);
    }
    curr = curr.parentElement;
  }
  return '#ffffff';
};

const getActualTextColor = (element: HTMLElement): string => {
  const computed = window.getComputedStyle(element);
  const color = computed.getPropertyValue('color');

  if (color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') {
    return rgbToHex(color);
  }

  const child = element.querySelector('span, p, a, div');
  if (child) {
    const childColor = window.getComputedStyle(child).getPropertyValue('color');
    if (childColor && childColor !== 'transparent' && childColor !== 'rgba(0, 0, 0, 0)') {
      return rgbToHex(childColor);
    }
  }

  return '#000000';
};

export const getLivePropertyValue = (
  element: HTMLElement | null,
  prop: string
): string => {
  if (!element) return '';

  if (prop === 'background-color' || prop === 'background') {
    return getActualBackgroundColor(element);
  }
  if (prop === 'color') return getActualTextColor(element);

  const computed = window.getComputedStyle(element);
  const rawVal = computed.getPropertyValue(prop).trim();

  if (rawVal.includes('gradient')) {
    return rawVal;
  }

  if (prop.includes('color') || prop === 'fill' || prop === 'stroke') {
    return rgbToHex(rawVal);
  }

  return rawVal;
};

export const detectElementStyles = (
  element: HTMLElement | null
): Record<string, DynamicStyleConfig> => {
  if (!element) return {};

  const computed = window.getComputedStyle(element);
  const detected: Record<string, DynamicStyleConfig> = {};

  for (let i = 0; i < computed.length; i++) {
    const prop = computed[i];
    if (prop.startsWith('-') || prop.startsWith('webkit')) continue;

    const rawVal = computed.getPropertyValue(prop).trim();
    if (!rawVal || rawVal === 'none' || rawVal === 'initial') continue;

    const isGradient = rawVal.includes('gradient');
    const isColor = !isGradient && (prop.includes('color') || prop === 'fill' || prop === 'stroke');

    detected[prop] = {
      label: formatLabel(prop),
      cssProperty: prop,
      inputType: isColor ? 'color' : 'text',
      currentValue: rawVal,
    };
  }

  return detected;
};

export const applyElementUpdates = (
  element: HTMLElement,
  name: string,
  styles: Record<string, string>
) => {
  if (!element) return;

  if (name !== undefined) {
    let textUpdated = false;
    const walk = (n: Node) => {
      if (n.nodeType === Node.TEXT_NODE) {
        if (n.textContent && n.textContent.trim() !== '') {
          n.textContent = name;
          textUpdated = true;
        }
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        const el = n as HTMLElement;
        if (
          el.tagName.toLowerCase() === 'svg' ||
          (el.className && typeof el.className === 'string' && el.className.includes('TouchRipple'))
        ) {
          return;
        }
        for (let i = 0; i < n.childNodes.length; i++) {
          if (textUpdated) break;
          walk(n.childNodes[i]);
        }
      }
    };
    walk(element);
  }

  if (typeof (element as any)._originalStyles === 'undefined') {
    (element as any)._originalStyles = element.style.cssText;
  } else {
    element.style.cssText = (element as any)._originalStyles;
  }

  Object.entries(styles).forEach(([prop, value]) => {
    if (value !== undefined && value !== '') {
      let finalVal = value;

      if (
        !isNaN(Number(value)) &&
        ['margin', 'padding', 'width', 'height', 'font-size', 'radius', 'gap', 'top', 'bottom', 'left', 'right'].some(
          (k) => prop.includes(k)
        )
      ) {
        finalVal = `${value}px`;
      }

      if (prop === 'background-color' || prop === 'background') {
        if (finalVal.includes('gradient')) {
          element.style.setProperty('background', finalVal, 'important');
          element.style.setProperty('background-color', 'transparent', 'important');
        } else {
          element.style.setProperty('background-color', finalVal, 'important');
          element.style.setProperty('background-image', 'none', 'important');
        }
      } else {
        element.style.setProperty(prop, finalVal, 'important');
      }
    }
  });
};