'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_MOTION_ENGINE } from '@/lib/motion-engine';
import type { MotionEngine } from '@/lib/types';

const AnimationEngineContext = createContext<MotionEngine>(DEFAULT_MOTION_ENGINE);

interface AnimationEngineProviderProps {
  engine: MotionEngine;
  children: ReactNode;
}

export function AnimationEngineProvider({ engine, children }: AnimationEngineProviderProps) {
  return <AnimationEngineContext.Provider value={engine}>{children}</AnimationEngineContext.Provider>;
}

export function useAnimationEngine(): MotionEngine {
  return useContext(AnimationEngineContext);
}
