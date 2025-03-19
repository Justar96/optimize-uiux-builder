
import { useRef, useEffect } from 'react';

// This hook adds animation specifically for sidebar elements
export const useSidebarAnimation = (isOpen: boolean, delay: number = 0) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    if (isOpen) {
      // Animate in - smoother transition
      element.style.opacity = '0';
      element.style.transform = 'translateX(-12px)';
      
      const timer = setTimeout(() => {
        element.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      // Animate out - quicker transition
      element.style.transition = 'opacity 0.25s ease-in, transform 0.25s ease-in';
      element.style.opacity = '0';
      element.style.transform = 'translateX(-12px)';
    }
  }, [isOpen, delay]);
  
  return ref;
};

export default useSidebarAnimation;
