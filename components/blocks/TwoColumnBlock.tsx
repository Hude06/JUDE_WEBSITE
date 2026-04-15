import type { TwoColumnBlock as TwoColumnBlockType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TwoColumnBlockProps {
  block: TwoColumnBlockType;
}

type ColumnData = TwoColumnBlockType['left'];

function Column({ data }: { data: ColumnData }) {
  if (data.image) {
    return (
      <div className="overflow-hidden rounded-xl bg-muted">
        <img
          src={data.image}
          alt={data.heading ?? ''}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {data.heading && (
        <h3 className="font-heading text-3xl leading-tight tracking-tight md:text-4xl">
          {data.heading}
        </h3>
      )}
      <p className="text-base leading-relaxed text-muted-foreground">{data.text}</p>
    </div>
  );
}

export function TwoColumnBlock({ block }: TwoColumnBlockProps) {
  return (
    <section
      className={cn(
        'my-16 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16',
        block.reverse && 'lg:[&>*:first-child]:order-2',
      )}
    >
      <Column data={block.left} />
      <Column data={block.right} />
    </section>
  );
}
