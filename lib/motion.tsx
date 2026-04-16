'use client';

import { useRef, type ReactNode } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'motion/react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: RevealDirection;
  distance?: number;
  once?: boolean;
  className?: string;
}

export interface StaggerProps {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  once?: boolean;
  className?: string;
}

export interface StaggerItemProps {
  children: ReactNode;
  direction?: RevealDirection;
  distance?: number;
  className?: string;
}

export interface ParallaxProps {
  children: ReactNode;
  offset?: number;
  className?: string;
}

function getHiddenOffset(direction: RevealDirection, distance: number) {
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

export function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 24,
  once = true,
  className,
}: RevealProps) {
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

export function Stagger({
  children,
  delay = 0,
  stagger = 0.08,
  once = true,
  className,
}: StaggerProps) {
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

export function StaggerItem({
  children,
  direction = 'up',
  distance = 20,
  className,
}: StaggerItemProps) {
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

export function Parallax({ children, offset = 50, className }: ParallaxProps) {
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
