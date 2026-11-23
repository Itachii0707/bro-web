import { useEffect } from 'react';

/**
 * Traps keyboard focus within an active modal container (WCAG 2.1 AA / AAA standard).
 * Restores focus to the triggering element upon closure.
 */
export function useFocusTrap(containerRef, isActive, onClose) {
  useEffect(() => {
    if (!isActive) return;

    // Save current active element
    const previousActiveElement = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    // Find all focusable elements
    const getFocusableElements = () => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ];
      return Array.from(container.querySelectorAll(focusableSelectors.join(',')))
        .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    };

    const focusables = getFocusableElements();
    if (focusables.length > 0) {
      // Focus first focusable element or pre-specified auto-focus
      const autoFocusTarget = container.querySelector('[data-autofocus]') || focusables[0];
      autoFocusTarget.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (onClose) onClose();
        return;
      }

      if (e.key === 'Tab') {
        const currentFocusables = getFocusableElements();
        if (currentFocusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = currentFocusables[0];
        const last = currentFocusables[currentFocusables.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // Tab
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus on cleanup
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [containerRef, isActive, onClose]);
}
