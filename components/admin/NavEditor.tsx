'use client';

import type { NavLink } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NavEditorProps {
  nav: NavLink[];
  onChange: (nav: NavLink[]) => void;
  availablePages: { slug: string; title: string }[];
}

export function NavEditor({ nav, onChange, availablePages }: NavEditorProps) {
  function updateLink(index: number, updates: Partial<NavLink>) {
    const updated = nav.map((link, i) =>
      i === index ? { ...link, ...updates } : link
    );
    onChange(updated);
  }

  function removeLink(index: number) {
    onChange(nav.filter((_, i) => i !== index));
  }

  function moveLink(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= nav.length) return;
    const result = [...nav];
    [result[index], result[target]] = [result[target], result[index]];
    onChange(result);
  }

  function addFromPage(slug: string, title: string) {
    const href = slug === 'home' ? '/' : `/${slug}`;
    onChange([...nav, { label: title, href }]);
  }

  const linkedSlugs = nav.map((link) =>
    link.href === '/' ? 'home' : link.href.replace(/^\//, '')
  );
  const unlinkedPages = availablePages.filter(
    (p) => !linkedSlugs.includes(p.slug)
  );

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-semibold">Navigation Links</Label>
        <p className="text-xs text-muted-foreground mb-3">
          These links appear in the site header. Drag to reorder.
        </p>
      </div>

      <div className="space-y-2">
        {nav.map((link, index) => (
          <Card key={index} size="sm">
            <CardContent className="flex items-center gap-2 py-2">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => moveLink(index, -1)}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => moveLink(index, 1)}
                  disabled={index === nav.length - 1}
                >
                  ↓
                </Button>
              </div>
              <Input
                value={link.label}
                onChange={(e) => updateLink(index, { label: e.target.value })}
                placeholder="Label"
                className="flex-1"
              />
              <Input
                value={link.href}
                onChange={(e) => updateLink(index, { href: e.target.value })}
                placeholder="/path"
                className="w-28"
              />
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-destructive"
                onClick={() => removeLink(index)}
              >
                ✕
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {unlinkedPages.length > 0 && (
        <div>
          <Label className="text-xs text-muted-foreground">Add page to nav:</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {unlinkedPages.map((page) => (
              <Button
                key={page.slug}
                variant="outline"
                size="sm"
                onClick={() => addFromPage(page.slug, page.title)}
              >
                + {page.title}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
