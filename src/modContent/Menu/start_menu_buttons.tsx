import { LOG_PREFIX } from "../Tools/Constants";


// --- Persistent Button Sync Engine ---
interface ButtonState {
  originalText: string;
  toggledText: string;
  isToggled: boolean;
}



const buttonRegistry: Map<string, ButtonState> = new Map();

// --- Safe Text Node Mutator ---
export const setElementText = (element: HTMLElement, newText: string): void => {
  const textNode = Array.from(element.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE
  );

  if (textNode) {
    if (textNode.nodeValue !== newText) {
      textNode.nodeValue = newText;
    }
  } else if (element.textContent !== newText) {
    element.textContent = newText;
  }
};




export const registerPersistentButton = (
  originalText: string,
  toggledText: string
): void => {
  buttonRegistry.set(originalText.toLowerCase(), {
    originalText,
    toggledText,
    isToggled: false,
  });
  console.log(`${LOG_PREFIX} Registered button: "${originalText}" -> "${toggledText}"`);
};

export const syncButtons = (): void => {
  buttonRegistry.forEach((state) => {
    const origLower = state.originalText.toLowerCase();
    const toggleLower = state.toggledText.toLowerCase();

    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('button')
    ).filter((btn) => {
      const text = btn.textContent?.trim().toLowerCase() || '';
      return text.includes(origLower) || text.includes(toggleLower);
    });

    buttons.forEach((button) => {
      const activeText = state.isToggled ? state.toggledText : state.originalText;
      setElementText(button, activeText);

      if (button.dataset.modBound !== 'true') {
        button.dataset.modBound = 'true';
        console.log(`${LOG_PREFIX} Attached persistent click listener to button: "${state.originalText}"`);

        button.addEventListener('click', () => {
          state.isToggled = !state.isToggled;
          const newText = state.isToggled ? state.toggledText : state.originalText;
          setElementText(button, newText);
          console.log(`${LOG_PREFIX} Button toggled to: "${newText}"`);
        });
      }
    });
  });
};