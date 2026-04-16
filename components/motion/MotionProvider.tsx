'use client';

import type { ReactNode } from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'motion/react';

interface MotionProviderProps {
  children: ReactNode;
  reducedMotion?: 'user' | 'always' | 'never';
}

export function MotionProvider({ children, reducedMotion = 'user' }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
    </LazyMotion>
  );
}
