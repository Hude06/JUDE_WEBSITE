import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Radio } from '@/components/ui/radio';
import { Switch } from '@/components/ui/switch';
import { Kbd } from '@/components/ui/kbd';

const BUTTON_VARIANTS = [
  'default',
  'outline',
  'ghost',
  'secondary',
  'destructive',
  'link',
] as const;

const BUTTON_SIZES = ['sm', 'default', 'lg'] as const;

const BADGE_VARIANTS = [
  'default',
  'secondary',
  'outline',
  'destructive',
  'ghost',
  'link',
] as const;

export const UI_PRIMITIVE_TYPES = [
  'button',
  'badge',
  'card',
  'form',
  'separator',
  'kbd',
] as const;

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-[9rem_1fr] md:items-center">
      <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function Exhibit({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li id={`ui-${title}`} className="scroll-mt-8">
      <header className="mb-6 flex items-baseline justify-between gap-4 border-b border-border pb-3">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs text-muted-foreground">
            {String(index).padStart(2, '0')}
          </span>
          <h3 className="font-heading text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {title}
          </h3>
        </div>
        <a
          href={`#ui-${title}`}
          className="font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          #ui-{title}
        </a>
      </header>
      <div className="space-y-6 rounded-xl border border-dashed border-border p-6 md:p-10">
        {children}
      </div>
    </li>
  );
}

export function UiShowcase() {
  return (
    <ol className="space-y-16">
      <Exhibit index={1} title="button">
        {BUTTON_VARIANTS.map((variant) => (
          <Row key={variant} label={variant}>
            {BUTTON_SIZES.map((size) => (
              <Button key={size} variant={variant} size={size}>
                {variant}
              </Button>
            ))}
          </Row>
        ))}
        <Row label="icon">
          <Button size="icon-xs" aria-label="xs">
            +
          </Button>
          <Button size="icon-sm" aria-label="sm">
            +
          </Button>
          <Button size="icon" aria-label="md">
            +
          </Button>
          <Button size="icon-lg" aria-label="lg">
            +
          </Button>
        </Row>
        <Row label="disabled">
          <Button disabled>Primary</Button>
          <Button variant="outline" disabled>
            Outline
          </Button>
          <Button variant="ghost" disabled>
            Ghost
          </Button>
        </Row>
      </Exhibit>

      <Exhibit index={2} title="badge">
        <Row label="variants">
          {BADGE_VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </Row>
      </Exhibit>

      <Exhibit index={3} title="card">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Default card</CardTitle>
              <CardDescription>
                Supporting copy describing the card.
              </CardDescription>
            </CardHeader>
            <CardContent>Body content lives here.</CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Small card</CardTitle>
              <CardDescription>Tighter padding.</CardDescription>
            </CardHeader>
            <CardContent>Body content lives here.</CardContent>
          </Card>
        </div>
      </Exhibit>

      <Exhibit index={4} title="form">
        <div className="grid max-w-md gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="showcase-name">Name</Label>
            <Input id="showcase-name" placeholder="Ada Lovelace" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="showcase-email">Email</Label>
            <Input
              id="showcase-email"
              type="email"
              placeholder="ada@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="showcase-message">Message</Label>
            <Textarea
              id="showcase-message"
              rows={3}
              placeholder="Tell me more..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="showcase-sub" defaultChecked />
            <Label htmlFor="showcase-sub">Subscribe to updates</Label>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Radio id="showcase-r1" name="showcase-radio" defaultChecked />
              <Label htmlFor="showcase-r1">One</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio id="showcase-r2" name="showcase-radio" />
              <Label htmlFor="showcase-r2">Two</Label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="showcase-switch" defaultChecked />
            <Label htmlFor="showcase-switch">Ship it</Label>
          </div>
        </div>
      </Exhibit>

      <Exhibit index={5} title="separator">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Horizontal</p>
          <Separator />
          <div className="flex h-8 items-center gap-3 text-sm text-muted-foreground">
            <span>Vertical</span>
            <Separator orientation="vertical" />
            <span>Divided</span>
          </div>
        </div>
      </Exhibit>

      <Exhibit index={6} title="kbd">
        <Row label="shortcuts">
          <span className="text-sm text-muted-foreground">
            Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search, <Kbd>Esc</Kbd> to close.
          </span>
        </Row>
      </Exhibit>
    </ol>
  );
}
