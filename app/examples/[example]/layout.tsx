import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadExampleSiteConfig } from '@/lib/example-content';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface ExampleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ example: string }>;
}

export default async function ExampleLayout({
  children,
  params,
}: ExampleLayoutProps) {
  const { example } = await params;

  let config;
  try {
    config = loadExampleSiteConfig(example);
  } catch {
    notFound();
  }

  const themePreset = config.theme?.preset;
  const appearance = config.theme?.appearance ?? 'light';

  return (
    <div
      data-theme={themePreset}
      data-appearance={appearance}
      className={appearance === 'dark' ? 'dark' : undefined}
    >
      <div className="bg-background text-foreground">
        <ExampleBanner exampleName={config.siteName} />
        <Header siteName={config.siteName} nav={config.nav} />
        <main className="flex-1 w-full">{children}</main>
        <Footer siteName={config.siteName} />
      </div>
    </div>
  );
}

function ExampleBanner({ exampleName }: { exampleName: string }) {
  return (
    <div className="border-b border-border bg-muted/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 text-xs md:px-8">
        <span className="font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Example · {exampleName}
        </span>
        <Link
          href="/"
          className="font-mono uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Framework reference
        </Link>
      </div>
    </div>
  );
}
