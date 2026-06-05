import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface SmartLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: ReactNode;
}

function isInternal(href: string): boolean {
  return href.startsWith('/') || href.startsWith('#');
}

/**
 * Renders next/link for in-app routes ("/...", "#...") so they get prefetch +
 * client-side navigation, and a plain <a> for external/protocol links
 * (http(s), mailto:, tel:) with safe target/rel applied automatically.
 */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  if (isInternal(href)) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  const opensNewTab = href.startsWith('http');
  return (
    <a
      href={href}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noopener noreferrer' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
