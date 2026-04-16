interface MarqueeProps {
  items: string[];
  className?: string;
}

/**
 * Pure-CSS infinite marquee. Content is duplicated once so the
 * translate(-50%) keyframe produces a seamless loop.
 */
export function Marquee({ items, className }: MarqueeProps) {
  const track = [...items, ...items];
  return (
    <div
      className={`marquee border-y border-[color:var(--color-hairline)] bg-[color:var(--color-surface)] py-5 ${className ?? ''}`}
      aria-hidden
    >
      <div className="marquee__track">
        {track.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center whitespace-nowrap px-8 font-display leading-none text-[color:var(--color-fg)]"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}
          >
            {item}
            <span
              className="ml-8 inline-block h-2 w-2 rounded-full bg-[color:var(--color-accent-ink)]"
              aria-hidden
            />
          </span>
        ))}
      </div>
    </div>
  );
}
