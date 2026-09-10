import { LOG_PREFIX } from "../Tools/Constants";



let targetBgUrl: string | null = null;

export const setBackgroundImage = (imageAsset: string): void => {
  // Extract default if bundler returned an ES Module object ({ default: "..." })
  const resolvedUrl = typeof imageAsset === 'object' && imageAsset !== null && 'default' in imageAsset
    ? (imageAsset as { default: string }).default
    : imageAsset;

  targetBgUrl = resolvedUrl;
  console.log(`${LOG_PREFIX} Target background URL set:`, resolvedUrl);
};

export const syncBackgroundImage = (): void => {
  if (!targetBgUrl) return;

  const bgImg = document.getElementById('backgroundImage') as HTMLImageElement | null;
  if (!bgImg) return;

  // 1. Get raw attribute string before browser resolves it to an absolute URL
  const rawSrc = bgImg.getAttribute('src');

  // 2. Check if the ends match or if the raw attribute equals the target
  const isAlreadySet = 
    rawSrc === targetBgUrl || 
    bgImg.src === targetBgUrl || 
    (bgImg.src && bgImg.src.endsWith(targetBgUrl));

  if (!isAlreadySet) {
    console.log(`${LOG_PREFIX} Updating #backgroundImage src once.`);
    
    // Assign new URL
    bgImg.src = targetBgUrl;
    
    // Explicitly set raw attribute to prevent MutationObserver false-positives
    bgImg.setAttribute('src', targetBgUrl);
  }
};
