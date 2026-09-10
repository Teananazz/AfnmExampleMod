import { ModAPI } from 'afnm-types';
// Direct import from relative assets directory (handles Vite/Webpack module resolution)
import customBg from '../assets/new_background.jpg';
import { setTitle, syncTitle } from './title';
import { setBackgroundImage, syncBackgroundImage } from './background';
import { registerPersistentButton, syncButtons } from './start_menu_buttons';


const LOG_PREFIX = '[Mod Debug]';









// --- Combined Observer & Boot Engine ---
const startDOMObserver = (): void => {
  const runSync = () => {
    syncTitle();
    syncBackgroundImage();
    syncButtons();
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

  console.log(`${LOG_PREFIX} DOM Observer engine online.`);
};

// --- Mod Entry Point ---
export const init = (modAPI: ModAPI): void => {
  console.log(`${LOG_PREFIX} Initializing mod...`);

  // 1. Change title across all 3 child <p> elements
  setTitle('My Custom Title');

  // 2. Pass imported relative asset path directly
  setBackgroundImage(customBg);

  // 3. Register buttons to toggle text on click persistently
  registerPersistentButton('Settings', 'Preferences');
  registerPersistentButton('Quit', 'Are you sure?');

  // 4. Start synchronization engine
  startDOMObserver();
};

init(window.modAPI)

export default init;