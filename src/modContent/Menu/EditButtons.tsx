import React from 'react';
import { TGlobalEditor } from '../Components/TGlobalEditor';
import { mountComponent } from '../Tools/Inject';
import log from '../log';

/**
 * Mounts the single global element editor trigger onto the page.
 * @param container Optional target DOM node to attach the editor trigger to. Defaults to body.
 */
export const attachGlobalEditor = (container?: HTMLElement | null): void => {
  log.debug("Entered attachGlobalEditor");

  const targetContainer = container || document.body;

  let wrapper = document.getElementById('t-global-editor-root');

  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = 't-global-editor-root';
    targetContainer.appendChild(wrapper);
  }

  log.debug("Mounting Global Editor Component...");
  
  mountComponent(
    wrapper,
    <TGlobalEditor rootElement={targetContainer} />,
    'replace'
  );
};