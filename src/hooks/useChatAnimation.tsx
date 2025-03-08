
import { useRef, useEffect } from 'react';

// This hook adds staggered animation to chat elements
export const useChatAnimation = (delay: number = 0) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    // Set initial state
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    // Trigger animation after delay
    const timer = setTimeout(() => {
      element.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return ref;
};

export default useChatAnimation;
