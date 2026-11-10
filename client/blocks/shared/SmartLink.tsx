import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface SmartLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: ReactNode;
}

/**
 * Plain <a> for every link. External http(s) links open in a new tab with
 * safe target/rel applied automatically; site links ("/...", "#...") and
 * mailto:/tel: stay in the same tab.
 */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
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
