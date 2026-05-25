import Link from 'next/link';
import { Container, Heading, Stack, Text } from '@/lib/ui';

/**
 * Client-owned 404 component.
 *
 * Edit this in a client site when you need custom 404 copy or design.
 */
export function SiteNotFound() {
  return (
    <div style={{ paddingBlock: 'var(--space-24)' }}>
      <Container width="narrow">
        <Stack gap={4} align="center">
          <Heading level={1} size="display" align="center">
            404
          </Heading>
          <Text size="lg" tone="muted" align="center">
            This page could not be found.
          </Text>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              padding: 'var(--space-3) var(--space-5)',
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              borderRadius: 'var(--radius)',
              fontWeight: 'var(--weight-medium)',
            }}
          >
            Go home
          </Link>
        </Stack>
      </Container>
    </div>
  );
}
