import { Separator } from '@/components/ui/separator';

interface FooterProps {
  siteName: string;
}

export function Footer({ siteName }: FooterProps) {
  return (
    <>
      <Separator />
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {siteName}</p>
      </footer>
    </>
  );
}
