import type { FeatureGridBlock as FeatureGridBlockType } from '@/lib/types';
import {
  Zap,
  Shield,
  Star,
  Heart,
  Check,
  Sparkles,
  Rocket,
  Layers,
  Compass,
  Globe,
  Lock,
  Clock,
  Target,
  Award,
  TrendingUp,
  Users,
  Code,
  Palette,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  shield: Shield,
  star: Star,
  heart: Heart,
  check: Check,
  sparkles: Sparkles,
  rocket: Rocket,
  layers: Layers,
  compass: Compass,
  globe: Globe,
  lock: Lock,
  clock: Clock,
  target: Target,
  award: Award,
  'trending-up': TrendingUp,
  users: Users,
  code: Code,
  palette: Palette,
};

interface FeatureGridBlockProps {
  block: FeatureGridBlockType;
}

export function FeatureGridBlock({ block }: FeatureGridBlockProps) {
  const columns = block.columns ?? 3;
  const colClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <section className="my-16">
      {(block.eyebrow || block.heading) && (
        <div className="mb-12 max-w-2xl">
          {block.eyebrow && (
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="font-heading text-4xl leading-tight tracking-tight md:text-5xl">
              {block.heading}
            </h2>
          )}
        </div>
      )}
      <div className={cn('grid gap-px overflow-hidden rounded-xl bg-border', colClass)}>
        {block.items.map((item, i) => {
          const Icon = item.icon ? (iconMap[item.icon] ?? Sparkles) : Sparkles;
          return (
            <div
              key={i}
              className="group relative flex flex-col gap-3 bg-background p-8 transition-colors hover:bg-muted/30"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-foreground/5 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="font-heading text-xl leading-snug">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
