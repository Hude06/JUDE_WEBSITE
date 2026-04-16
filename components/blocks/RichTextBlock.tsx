import type { RichTextBlock as RichTextBlockType } from '@/lib/types';
import type { ReactNode } from 'react';

interface RichTextBlockProps {
  block: RichTextBlockType;
}

type Inline =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'link'; value: string; href: string };

function parseInline(text: string): Inline[] {
  const tokens: Inline[] = [];
  let i = 0;
  while (i < text.length) {
    const rest = text.slice(i);
    const bold = rest.match(/^\*\*(.+?)\*\*/);
    if (bold) {
      tokens.push({ type: 'bold', value: bold[1] });
      i += bold[0].length;
      continue;
    }
    const italic = rest.match(/^\*([^*]+)\*/);
    if (italic) {
      tokens.push({ type: 'italic', value: italic[1] });
      i += italic[0].length;
      continue;
    }
    const link = rest.match(/^\[(.+?)\]\((.+?)\)/);
    if (link) {
      tokens.push({ type: 'link', value: link[1], href: link[2] });
      i += link[0].length;
      continue;
    }
    const last = tokens[tokens.length - 1];
    if (last && last.type === 'text') {
      last.value += text[i];
    } else {
      tokens.push({ type: 'text', value: text[i] });
    }
    i += 1;
  }
  return tokens;
}

function renderInline(tokens: Inline[]): ReactNode[] {
  return tokens.map((t, i) => {
    if (t.type === 'bold') return <strong key={i}>{t.value}</strong>;
    if (t.type === 'italic') return <em key={i}>{t.value}</em>;
    if (t.type === 'link')
      return (
        <a
          key={i}
          href={t.href}
          className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
        >
          {t.value}
        </a>
      );
    return <span key={i}>{t.value}</span>;
  });
}

export function RichTextBlock({ block }: RichTextBlockProps) {
  const paragraphs = block.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto my-12 max-w-2xl space-y-6 text-lg leading-relaxed text-foreground/90">
      {paragraphs.map((para, i) => {
        if (para.startsWith('### ')) {
          return (
            <h3
              key={i}
              className="font-heading text-2xl leading-tight tracking-tight text-foreground"
            >
              {renderInline(parseInline(para.slice(4)))}
            </h3>
          );
        }
        if (para.startsWith('## ')) {
          return (
            <h2
              key={i}
              className="font-heading text-3xl leading-tight tracking-tight text-foreground"
            >
              {renderInline(parseInline(para.slice(3)))}
            </h2>
          );
        }
        if (para.startsWith('> ')) {
          return (
            <blockquote
              key={i}
              className="border-l-2 border-foreground pl-6 font-heading text-2xl italic leading-snug"
            >
              {renderInline(parseInline(para.slice(2)))}
            </blockquote>
          );
        }
        if (/^(-|\*)\s+/.test(para)) {
          const items = para.split('\n').map((l) => l.replace(/^(-|\*)\s+/, ''));
          return (
            <ul key={i} className="list-disc space-y-2 pl-6 marker:text-muted-foreground">
              {items.map((item, j) => (
                <li key={j}>{renderInline(parseInline(item))}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{renderInline(parseInline(para))}</p>;
      })}
    </article>
  );
}
