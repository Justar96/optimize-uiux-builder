
import { useRef, useEffect } from 'react';

// This hook adds animation specifically for sidebar elements
export const useSidebarAnimation = (isOpen: boolean, delay: number = 0) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    if (isOpen) {
      // Animate in
      element.style.opacity = '0';
      element.style.transform = 'translateX(-20px)';
      
      const timer = setTimeout(() => {
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      // Animate out
      element.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      element.style.opacity = '0';
      element.style.transform = 'translateX(-20px)';
    }
  }, [isOpen, delay]);
  
  return ref;
};

export default useSidebarAnimation;
