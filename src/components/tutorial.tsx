'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface TutorialStep {
  elementId: string;
  title: string;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
  steps: TutorialStep[];
}

export default function Tutorial({ isOpen, onClose, steps }: TutorialProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (!isOpen || !currentStep) {
      setHighlightStyle({ opacity: 0, pointerEvents: 'none' });
      setTooltipStyle({ opacity: 0, pointerEvents: 'none' });
      return;
    }

    const positionElements = () => {
      const element = document.getElementById(currentStep.elementId);
      const tooltipEl = tooltipRef.current;

      if (!element || !tooltipEl) return;
      
      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltipEl.getBoundingClientRect();
      
      const padding = 10;

      setHighlightStyle({
        width: `${rect.width + padding}px`,
        height: `${rect.height + padding}px`,
        top: `${rect.top - padding / 2}px`,
        left: `${rect.left - padding / 2}px`,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
        borderRadius: 'var(--radius)',
        position: 'fixed',
        transition: 'all 0.3s ease-in-out',
        pointerEvents: 'none',
        zIndex: 100,
        opacity: 1,
      });
      
      const position = currentStep.position || 'bottom';
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = rect.top - tooltipRect.height - padding;
          left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
          left = rect.left - tooltipRect.width - padding;
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
          left = rect.right + padding;
          break;
        default: // 'bottom'
          top = rect.bottom + padding;
          left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
          break;
      }
      
      const margin = 10;
      if (left < margin) left = margin;
      if (left + tooltipRect.width > window.innerWidth - margin) left = window.innerWidth - tooltipRect.width - margin;
      if (top < margin) top = margin;
      if (top + tooltipRect.height > window.innerHeight - margin) top = window.innerHeight - tooltipRect.height - margin;

      setTooltipStyle({
          position: 'fixed',
          zIndex: 101,
          top: `${top}px`,
          left: `${left}px`,
          opacity: 1,
          transition: 'opacity 0.3s ease-in-out, top 0.3s ease-in-out, left 0.3s ease-in-out'
      });
    };
    
    // Hide everything and render tooltip invisibly so we can measure it.
    setHighlightStyle({ opacity: 0, pointerEvents: 'none' });
    setTooltipStyle({ position: 'fixed', zIndex: 101, opacity: 0, pointerEvents: 'none' });

    let rafId: number;
    let start: number | null = null;
    const duration = 500; // ms

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      
      positionElements();

      if (elapsed < duration) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    window.addEventListener('resize', positionElements);
    window.addEventListener('scroll', positionElements, true);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', positionElements);
      window.removeEventListener('scroll', positionElements, true);
    }
  }, [currentStep, isOpen]);
  
  if (!isOpen || !currentStep) {
    return null;
  }

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleClose = () => {
    setCurrentStepIndex(0);
    onClose();
  }

  return (
    <div>
        <div style={highlightStyle}></div>
        <div ref={tooltipRef} style={tooltipStyle} className="bg-card p-4 rounded-lg shadow-2xl max-w-xs w-full">
            <div className="flex justify-between items-start mb-2">
                 <h3 className="text-lg font-bold text-card-foreground">{currentStep.title}</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <p className="text-sm text-card-foreground/80 mb-4">{currentStep.text}</p>
            <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{`${currentStepIndex + 1} / ${steps.length}`}</span>
                <div className="flex gap-2">
                    {currentStepIndex > 0 && <Button variant="outline" size="sm" onClick={handlePrev}>Назад</Button>}
                    <Button size="sm" onClick={handleNext}>
                        {currentStepIndex < steps.length - 1 ? 'Далее' : 'Завершить'}
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
