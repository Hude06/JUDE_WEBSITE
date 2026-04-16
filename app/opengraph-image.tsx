import { ImageResponse } from 'next/og';

// Force dynamic rendering — don't prerender at build time.
// Font fetches can fail during build and break the whole deploy.
export const dynamic = 'force-dynamic';

export const alt = 'Jude Makes Things — Websites, made simple.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

async function tryLoadFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    // Basic sanity check — TTF/OTF starts with specific bytes, not HTML.
    const view = new Uint8Array(buf.slice(0, 4));
    const isHtml = view[0] === 0x3c; // '<'
    if (isHtml) return null;
    return buf;
  } catch {
    return null;
  }
}

export default async function Image() {
  const [instrument, inter] = await Promise.all([
    tryLoadFont(
      'https://fonts.gstatic.com/s/instrumentserif/v4/jizDREVItHgj7M6zraUbfgU-ylN-m_O9yDXMarrxvR0.ttf',
    ),
    tryLoadFont(
      'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.ttf',
    ),
  ]);

  const fonts = [];
  if (instrument) {
    fonts.push({
      name: 'Instrument Serif',
      data: instrument,
      style: 'normal' as const,
      weight: 400 as const,
    });
  }
  if (inter) {
    fonts.push({
      name: 'Inter',
      data: inter,
      style: 'normal' as const,
      weight: 400 as const,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          padding: '72px 88px',
          fontFamily: inter ? 'Inter' : 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: '#777777',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          Jude Hill · Website Designer
        </div>

        <div
          style={{
            fontSize: 168,
            letterSpacing: '-0.03em',
            color: '#1a1a1a',
            lineHeight: 0.92,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: instrument ? 'Instrument Serif' : 'serif',
          }}
        >
          <span>Websites,</span>
          <span>made simple.</span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            fontSize: 22,
            color: '#777777',
            borderTop: '1px solid #e6e6e6',
            paddingTop: 28,
          }}
        >
          <span>Eugene, Oregon</span>
          <span>judemakes.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      ...(fonts.length > 0 ? { fonts } : {}),
    },
  );
}
