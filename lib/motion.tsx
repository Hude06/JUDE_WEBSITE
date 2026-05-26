'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'motion/react';
import { useAnimationEngine } from '@/components/motion/AnimationEngineProvider';
import { loadGsapRuntime } from '@/lib/gsap-runtime';
import type { MotionEngine } from '@/lib/types';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface EngineProp {
  engine?: MotionEngine;
}

export interface RevealProps extends EngineProp {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: RevealDirection;
  distance?: number;
  once?: boolean;
  className?: string;
}

export interface StaggerProps extends EngineProp {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  once?: boolean;
  className?: string;
}

export interface StaggerItemProps extends EngineProp {
  children: ReactNode;
  direction?: RevealDirection;
  distance?: number;
  className?: string;
}

export interface ParallaxProps extends EngineProp {
  children: ReactNode;
  offset?: number;
  className?: string;
}

function getHiddenOffset(direction: RevealDirection, distance: number): { x?: number; y?: number } {
  switch (direction) {
    case 'up':
      return { y: distance };
    case 'down':
      return { y: -distance };
    case 'left':
      return { x: distance };
    case 'right':
      return { x: -distance };
    case 'none':
    default:
      return {};
  }
}

function buildRevealVariants(
  direction: RevealDirection,
  distance: number,
  reduced: boolean,
): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  }
  return {
    hidden: { opacity: 0, ...getHiddenOffset(direction, distance) },
    visible: { opacity: 1, x: 0, y: 0 },
  };
}

function resolveEngine(override: MotionEngine | undefined, context: MotionEngine): MotionEngine {
  return override ?? context;
}

function MotionReveal({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 24,
  once = true,
  className,
}: Omit<RevealProps, 'engine'>) {
  const reduced = useReducedMotion() ?? false;
  const variants = buildRevealVariants(direction, distance, reduced);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={variants}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MotionStagger({
  children,
  delay = 0,
  stagger = 0.08,
  once = true,
  className,
}: Omit<StaggerProps, 'engine'>) {
  const reduced = useReducedMotion() ?? false;
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

function MotionStaggerItem({
  children,
  direction = 'up',
  distance = 20,
  className,
}: Omit<StaggerItemProps, 'engine'>) {
  const reduced = useReducedMotion() ?? false;
  const variants = buildRevealVariants(direction, distance, reduced);

  return (
    <motion.div
      className={className}
      variants={variants}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MotionParallax({ children, offset = 50, className }: Omit<ParallaxProps, 'engine'>) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

function GsapReveal({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 24,
  once = true,
  className,
}: Omit<RevealProps, 'engine'>) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let active = true;
    let revertContext: (() => void) | null = null;
    let killTrigger: (() => void) | null = null;

    void loadGsapRuntime().then((runtime) => {
      if (!active || !node || !runtime) return;
      const { gsap, ScrollTrigger } = runtime;
      const hiddenOffset = getHiddenOffset(direction, distance);
      const fromVars: Record<string, unknown> = {
        opacity: reduced ? 1 : 0,
      };
      if (!reduced) {
        if (hiddenOffset.x !== undefined) fromVars.x = hiddenOffset.x;
        if (hiddenOffset.y !== undefined) fromVars.y = hiddenOffset.y;
      }

      const toVars: Record<string, unknown> = {
        opacity: 1,
        x: 0,
        y: 0,
        duration: reduced ? 0 : duration,
        delay: reduced ? 0 : delay,
        ease: 'power3.out',
        overwrite: 'auto',
      };

      const context = gsap.context(() => {
        gsap.set(node, fromVars);
        const tween = gsap.to(node, toVars) as { pause?: () => void; play?: () => void };
        tween.pause?.();

        const trigger = ScrollTrigger.create({
          trigger: node,
          start: 'top 85%',
          once,
          onEnter: () => tween.play?.(),
          onEnterBack: () => {
            if (!once) tween.play?.();
          },
        });
        killTrigger = () => trigger.kill();
      }, node);

      revertContext = () => context.revert();
    });

    return () => {
      active = false;
      killTrigger?.();
      revertContext?.();
    };
  }, [delay, direction, distance, duration, once, reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function GsapStagger({
  children,
  delay = 0,
  stagger = 0.08,
  once = true,
  className,
}: Omit<StaggerProps, 'engine'>) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let active = true;
    let revertContext: (() => void) | null = null;
    let killTrigger: (() => void) | null = null;

    void loadGsapRuntime().then((runtime) => {
      if (!active || !node || !runtime) return;
      const { gsap, ScrollTrigger } = runtime;
      const items = Array.from(node.children) as HTMLElement[];
      if (items.length === 0) return;

      const context = gsap.context(() => {
        gsap.set(items, {
          opacity: reduced ? 1 : 0,
          x: (_index: number, target: Element) => {
            const direction = ((target as HTMLElement).dataset.gsapDirection ?? 'up') as RevealDirection;
            const distance = Number((target as HTMLElement).dataset.gsapDistance ?? 20);
            return getHiddenOffset(direction, distance).x ?? 0;
          },
          y: (_index: number, target: Element) => {
            const direction = ((target as HTMLElement).dataset.gsapDirection ?? 'up') as RevealDirection;
            const distance = Number((target as HTMLElement).dataset.gsapDistance ?? 20);
            return getHiddenOffset(direction, distance).y ?? 0;
          },
        });

        const tween = gsap.to(items, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: reduced ? 0 : 0.5,
          delay: reduced ? 0 : delay,
          stagger: reduced ? 0 : stagger,
          ease: 'power3.out',
          overwrite: 'auto',
        }) as { pause?: () => void; play?: (position?: number) => void };

        tween.pause?.();
        const trigger = ScrollTrigger.create({
          trigger: node,
          start: 'top 88%',
          once,
          onEnter: () => tween.play?.(0),
          onEnterBack: () => {
            if (!once) tween.play?.(0);
          },
        });
        killTrigger = () => trigger.kill();
      }, node);

      revertContext = () => context.revert();
    });

    return () => {
      active = false;
      killTrigger?.();
      revertContext?.();
    };
  }, [delay, once, reduced, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function GsapStaggerItem({
  children,
  direction = 'up',
  distance = 20,
  className,
}: Omit<StaggerItemProps, 'engine'>) {
  return (
    <div data-gsap-direction={direction} data-gsap-distance={distance} className={className}>
      {children}
    </div>
  );
}

function GsapParallax({ children, offset = 50, className }: Omit<ParallaxProps, 'engine'>) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let active = true;
    let revertContext: (() => void) | null = null;

    void loadGsapRuntime().then((runtime) => {
      if (!active || !node || !runtime) return;
      const { gsap } = runtime;
      const yStart = reduced ? 0 : offset;
      const yEnd = reduced ? 0 : -offset;

      const context = gsap.context(() => {
        gsap.fromTo(
          node,
          { y: yStart },
          {
            y: yEnd,
            ease: 'none',
            overwrite: 'auto',
            scrollTrigger: {
              trigger: node,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }, node);

      revertContext = () => context.revert();
    });

    return () => {
      active = false;
      revertContext?.();
    };
  }, [offset, reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function Reveal(props: RevealProps) {
  const contextEngine = useAnimationEngine();
  const engine = resolveEngine(props.engine, contextEngine);
  return engine === 'gsap' ? <GsapReveal {...props} /> : <MotionReveal {...props} />;
}

export function Stagger(props: StaggerProps) {
  const contextEngine = useAnimationEngine();
  const engine = resolveEngine(props.engine, contextEngine);
  return engine === 'gsap' ? <GsapStagger {...props} /> : <MotionStagger {...props} />;
}

export function StaggerItem(props: StaggerItemProps) {
  const contextEngine = useAnimationEngine();
  const engine = resolveEngine(props.engine, contextEngine);
  return engine === 'gsap' ? <GsapStaggerItem {...props} /> : <MotionStaggerItem {...props} />;
}

export function Parallax(props: ParallaxProps) {
  const contextEngine = useAnimationEngine();
  const engine = resolveEngine(props.engine, contextEngine);
  return engine === 'gsap' ? <GsapParallax {...props} /> : <MotionParallax {...props} />;
}
