
import { useRef, useEffect } from 'react';

// This hook adds animation specifically for sidebar elements
export const useSidebarAnimation = (isOpen: boolean, delay: number = 0) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    if (isOpen) {
      // Animate in - smooth transition with perfect easing
      element.style.opacity = '0';
      element.style.transform = 'translateX(-6px)';
      
      const timer = setTimeout(() => {
        element.style.transition = 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      // Animate out - quick and smooth transition
      element.style.transition = 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
      element.style.opacity = '0';
      element.style.transform = 'translateX(-6px)';
    }
  }, [isOpen, delay]);
  
  return ref;
};

export default useSidebarAnimation;
