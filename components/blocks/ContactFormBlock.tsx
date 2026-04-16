import type { ContactFormBlock as ContactFormBlockType } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface ContactFormBlockProps {
  block: ContactFormBlockType;
}

const DEFAULT_FIELDS: Array<'name' | 'email' | 'subject' | 'message'> = [
  'name',
  'email',
  'message',
];

export function ContactFormBlock({ block }: ContactFormBlockProps) {
  const fields = block.fields ?? DEFAULT_FIELDS;
  const action = block.action ?? '';
  const submitLabel = block.submitLabel ?? 'Send message';
  const method = action.startsWith('mailto:') ? 'get' : 'post';

  return (
    <section className="my-16 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
      <div>
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
        {block.description && (
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            {block.description}
          </p>
        )}
      </div>
      <form
        action={action || undefined}
        method={method}
        className="space-y-5 rounded-xl border border-border bg-background p-8"
      >
        {fields.includes('name') && (
          <div className="space-y-1.5">
            <Label htmlFor={`${block.id}-name`}>Name</Label>
            <Input
              id={`${block.id}-name`}
              name="name"
              required
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
        )}
        {fields.includes('email') && (
          <div className="space-y-1.5">
            <Label htmlFor={`${block.id}-email`}>Email</Label>
            <Input
              id={`${block.id}-email`}
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        )}
        {fields.includes('subject') && (
          <div className="space-y-1.5">
            <Label htmlFor={`${block.id}-subject`}>Subject</Label>
            <Input
              id={`${block.id}-subject`}
              name="subject"
              placeholder="What is this about?"
            />
          </div>
        )}
        {fields.includes('message') && (
          <div className="space-y-1.5">
            <Label htmlFor={`${block.id}-message`}>Message</Label>
            <Textarea
              id={`${block.id}-message`}
              name="message"
              required
              rows={5}
              placeholder="Tell us more..."
            />
          </div>
        )}
        <button
          type="submit"
          className={cn(
            buttonVariants({ variant: 'default', size: 'lg' }),
            'group/submit w-full',
          )}
        >
          {submitLabel}
          <ArrowRight className="ml-2 size-4 transition-transform group-hover/submit:translate-x-1" />
        </button>
      </form>
    </section>
  );
}
