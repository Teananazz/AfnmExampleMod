const LOG_PREFIX = '[Mod Debug]';

// --- Title Sync Engine ---
let titleParent: HTMLElement | null = null;
let targetTitleText: string | null = null;

export const syncTitle = (): void => {
  if (!targetTitleText) return;

  // Search for the parent container if null or removed from DOM during screen switch
  if (!titleParent || !document.body.contains(titleParent)) {
    const matchingP = Array.from(document.querySelectorAll<HTMLParagraphElement>('p'))
      .find((el) => {
        const text = el.textContent?.trim().toLowerCase() || '';
        return (
          text.includes('ascend from nine mountains') ||
          text === targetTitleText?.toLowerCase()
        );
      });

    if (matchingP) {
      titleParent = matchingP.parentElement;
      console.log(`${LOG_PREFIX} Found title parent container:`, titleParent);
    }
  }

  // Update all three child <p> elements inside the title container
  if (titleParent) {
    const paragraphs = titleParent.querySelectorAll<HTMLParagraphElement>('p');
    paragraphs.forEach((p) => {
      if (p.textContent !== targetTitleText) {
        p.textContent = targetTitleText;
      }
    });
  }
};



export const setTitle = (newTitle: string): void => {
  targetTitleText = newTitle;
  console.log(`${LOG_PREFIX} Target title set to: "${newTitle}"`);
};
