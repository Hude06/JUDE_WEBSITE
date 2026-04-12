'use client';

interface PreviewPanelProps {
  slug: string | null;
  refreshKey: number;
}

export function PreviewPanel({ slug, refreshKey }: PreviewPanelProps) {
  if (!slug) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a page to preview
      </div>
    );
  }

  const src = slug === 'home' ? '/' : `/${slug}`;

  return (
    <div className="flex-1 border-l">
      <iframe
        key={`${slug}-${refreshKey}`}
        src={src}
        className="w-full h-full border-0"
        title="Page preview"
      />
    </div>
  );
}
