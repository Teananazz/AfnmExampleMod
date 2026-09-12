import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import log from '../log';

// Track active roots or mounted flags to prevent duplicate mounting
const mountedRoots = new Map<HTMLElement, any>();

export const mountComponent = (
  container: HTMLElement | string,
  reactElement: ReactNode,
  mode: 'replace' | 'append' = 'append'
): any => {
  const targetNode = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;

  if (!targetNode) return null;

  if (mountedRoots.has(targetNode)) {
    return mountedRoots.get(targetNode)!;
  }

  let mountPoint: HTMLElement = targetNode;

  if (mode === 'replace') {
    targetNode.innerHTML = '';
  } else if (mode === 'append') {
    mountPoint = document.createElement('div');
    mountPoint.className = 'mod-react-wrapper';
    targetNode.appendChild(mountPoint);
  }

  log.debug("Mounting React Component...");

  // 1. Try React 18 createRoot safely (via window.ReactDOM or import)
  const clientDOM = (window as any).ReactDOM || ReactDOM;

  if (clientDOM.createRoot) {
    const root = clientDOM.createRoot(mountPoint);
    root.render(reactElement);
    mountedRoots.set(targetNode, root);
    return root;
  } 

  // 2. Fallback to React 17 render method if createRoot is missing
  clientDOM.render(reactElement, mountPoint);
  mountedRoots.set(targetNode, true);
  return true;
};