interface FooterProps {
  siteName: string;
}

export function Footer({ siteName }: FooterProps) {
  return (
    <footer className="text-center py-8 border-t border-slate-200 text-slate-500 text-sm">
      <p>&copy; {new Date().getFullYear()} {siteName}</p>
    </footer>
  );
}
