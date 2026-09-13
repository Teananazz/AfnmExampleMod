import { ModAPI } from 'afnm-types';
// Direct import from relative assets directory (handles Vite/Webpack module resolution)
import customBg from '../assets/new_background.jpg';
import { setTitle, syncTitle } from './Menu/title';
import { setBackgroundImage, syncBackgroundImage } from './Menu/background';
import { registerPersistentButton, syncButtons } from './Menu/start_menu_buttons';

import { attachGlobalEditor } from './Menu/EditButtons';
import log from './log';



let isModifyingDOM = false;

// Standard usage


// --- Combined Observer & Boot Engine ---
const startDOMObserver = (): void => {
  const runSync = () => {



  };

  // Immediate sync + 200ms boot interval to handle early race conditions
  runSync();
  const bootInterval = setInterval(runSync, 200);
  setTimeout(() => clearInterval(bootInterval), 5000);

  // MutationObserver handles dynamic navigation and re-renders
  const observer = new MutationObserver(runSync);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
  });

};


// --- Mod Entry Point ---
export const init = (modAPI: ModAPI): void => {





  log.debug('Initializing Element Search...');

  // initial screen is the menu
  const buttons: HTMLButtonElement[] = Array.from(
    document.querySelectorAll<HTMLButtonElement>('button')
  )
  const title_elements: HTMLParagraphElement[] = Array.from(
    document.querySelectorAll<HTMLParagraphElement>('p')
  ).filter((el) => {
    const text = el.textContent?.trim().toLowerCase() || '';
    return text.includes('ascend from nine mountains');
  });
  const background_element: HTMLImageElement = document.getElementById('backgroundImage') as HTMLImageElement;


  attachGlobalEditor();









  // // 1. Change title across all 3 child <p> elements
  // setTitle('My Custom Title');

  // // 2. Pass imported relative asset path directly
  // setBackgroundImage(customBg);

  // // 3. Register buttons to toggle text on click persistently
  // registerPersistentButton('Settings', 'Preferences');
  // registerPersistentButton('Quit', 'Are you sure?');

  // 4. Start synchronization engine
  startDOMObserver();
};

log.debug('[Mod Engine] Initializing Mod...');

init(window.modAPI)

export default init;