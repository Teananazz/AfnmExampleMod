//import { TButton } from '../Components/TButton';
import { TButton } from '../Components/TButton';
import { mountComponent } from '../Tools/Inject';
import log from '../log'

type ButtonTarget = string | HTMLElement;

export const attachEditButtons = (targets: ButtonTarget[]): void => {

  log.debug("Entered attachEditButtons");
  targets.forEach((target) => {
    // 1. Resolve string selector or direct element
    const btn = typeof target === 'string'
      ? document.querySelector<HTMLElement>(target)
      : target;

    if (!btn || !btn.parentElement) return;

    // this is the information we take from the element we are going to edit
    const nativeText = btn.textContent?.trim() || ""

    // 2. Check if the right button container already exists directly AFTER this element
    let container = btn.nextElementSibling as HTMLElement;

    if (!container || !container.classList.contains('t-button-right-wrapper')) {



      container = document.createElement('div');
      container.className = 't-button-right-wrapper';

      // Inline styles to align the element directly to the right of the target button
      container.style.display = 'inline-flex';
      container.style.alignItems = 'center';
      container.style.marginLeft = '6px';
      container.style.verticalAlign = 'middle';

      // Insert the container directly AFTER (to the right of) the button in the DOM
      btn.insertAdjacentElement('afterend', container);
    }

    log.debug("Mounting Component...");
    // 3. Mount your component inside the wrapper container
    mountComponent(
      container,
      <TButton targetName={nativeText} targetElement={btn} />,
      'replace'
    );
  });
};