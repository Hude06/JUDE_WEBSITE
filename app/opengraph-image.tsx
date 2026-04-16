import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Jude Makes Things — Websites, made simple.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

async function loadFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  return res.arrayBuffer();
}

export default async function Image() {
  // Fetch Instrument Serif + Inter directly from Google Fonts CSS endpoints
  const [instrument, inter] = await Promise.all([
    loadFont(
      'https://fonts.gstatic.com/s/instrumentserif/v4/jizDREVItHgj7M6zraUbfgU-ylN-m_O9yDXMarrxvR0.ttf',
    ),
    loadFont(
      'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.ttf',
    ),
  ]);

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
          fontFamily: 'Inter',
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
            fontFamily: 'Instrument Serif',
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
      fonts: [
        { name: 'Instrument Serif', data: instrument, style: 'normal', weight: 400 },
        { name: 'Inter', data: inter, style: 'normal', weight: 400 },
      ],
    },
  );
}
