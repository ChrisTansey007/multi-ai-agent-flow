import { useEffect, useRef } from 'react';

interface UseAccessibilityOptions {
  announceChanges?: boolean;
  focusManagement?: boolean;
}

export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const { announceChanges = false, focusManagement = false } = options;
  const announcementRef = useRef<HTMLDivElement>(null);

  // Screen reader announcements
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announceChanges || !announcementRef.current) return;
    
    announcementRef.current.setAttribute('aria-live', priority);
    announcementRef.current.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = '';
      }
    }, 1000);
  };

  // Focus management
  const focusElement = (selector: string) => {
    if (!focusManagement) return;
    
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  };

  // Keyboard navigation helper
  const handleKeyNavigation = (
    event: KeyboardEvent,
    handlers: Record<string, () => void>
  ) => {
    const handler = handlers[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  };

  // Setup screen reader announcement area
  useEffect(() => {
    if (!announceChanges) return;

    const announcementArea = document.createElement('div');
    announcementArea.setAttribute('aria-live', 'polite');
    announcementArea.setAttribute('aria-atomic', 'true');
    announcementArea.className = 'sr-only';
    document.body.appendChild(announcementArea);
    announcementRef.current = announcementArea;

    return () => {
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, [announceChanges]);

  return {
    announce,
    focusElement,
    handleKeyNavigation,
  };
};