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
      className={`site-marquee ${className ?? ''}`}
      aria-hidden
    >
      <div className="site-marquee__track">
        {track.map((item, i) => (
          <span
            key={i}
            className="site-marquee__item"
          >
            {item}
            <span
              className="site-marquee__dot"
              aria-hidden
            />
          </span>
        ))}
      </div>
    </div>
  );
}
