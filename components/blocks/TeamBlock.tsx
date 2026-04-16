import type { TeamBlock as TeamBlockType } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';

interface TeamBlockProps {
  block: TeamBlockType;
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function TeamBlock({ block }: TeamBlockProps) {
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
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {block.members.map((member, i) => {
          const inner = (
            <>
              <div className="relative overflow-hidden rounded-xl bg-muted">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center font-heading text-5xl text-muted-foreground">
                    {initials(member.name)}
                  </div>
                )}
                {member.link && (
                  <div className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90 opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowUpRight className="size-4" strokeWidth={1.75} />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-heading text-xl leading-tight">{member.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                {member.bio && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>
                )}
              </div>
            </>
          );
          return member.link ? (
            <a key={i} href={member.link} className="group block no-underline">
              {inner}
            </a>
          ) : (
            <div key={i} className="group">
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
