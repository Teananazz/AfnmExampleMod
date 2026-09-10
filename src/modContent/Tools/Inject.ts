import React, { ReactNode } from 'react';
import { createRoot, Root } from 'react-dom/client';

// Track active roots to prevent duplicate mounting on the same container
const mountedRoots = new Map<HTMLElement, Root>();

/**
 * Mounts a React element into a specified target container.
 * 
 * @param container - Target HTMLElement or CSS selector string
 * @param reactElement - The React component or JSX to render
 * @param mode - 'replace' clears existing children; 'append' adds a new mount node
 */
export const mountComponent = (
    container: HTMLElement | string,
    reactElement: ReactNode,
    mode: 'replace' | 'append' = 'append'
): Root | null => {
    // Resolve target element if string selector was passed
    const targetNode = typeof container === 'string'
        ? document.querySelector<HTMLElement>(container)
        : container;

    if (!targetNode) return null;

    // Return existing root if already mounted on this specific node
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

    const root = createRoot(mountPoint);
    root.render(reactElement);

    // Store root reference attached to the target DOM node
    mountedRoots.set(targetNode, root);

    return root;
};