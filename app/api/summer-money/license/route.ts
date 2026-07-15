import { NextResponse } from 'next/server';
import { createPrivateKey, sign } from 'node:crypto';

export const dynamic = 'force-dynamic';

// Issues a Summer Money license key for a paid Stripe Checkout session.
// Called by judemakes.com/summer-money/thanks.html after the Payment Link
// redirect (?session_id={CHECKOUT_SESSION_ID}).
//
// Stateless: the key is an Ed25519 signature over the buyer's email +
// session id, so the same session always yields the same key and there is
// nothing to store. The app verifies the signature offline against the
// embedded public key.
//
// Env:
//   SM_STRIPE_KEY           — restricted Stripe key, Checkout Sessions: Read
//   SM_LICENSE_PRIVATE_KEY  — Ed25519 private key, PKCS8 DER base64

const STRIPE_API = 'https://api.stripe.com/v1/checkout/sessions/';

function b64url(buf: Buffer): string {
  return buf.toString('base64url');
}

export async function GET(request: Request) {
  const stripeKey = process.env.SM_STRIPE_KEY;
  const signingKey = process.env.SM_LICENSE_PRIVATE_KEY;
  if (!stripeKey || !signingKey) {
    return NextResponse.json(
      { success: false, error: 'License service is not configured.' },
      { status: 503 }
    );
  }

  const sessionId = new URL(request.url).searchParams.get('session_id');
  if (!sessionId || !/^cs_(live|test)_[A-Za-z0-9]+$/.test(sessionId)) {
    return NextResponse.json(
      { success: false, error: 'Missing or invalid session_id.' },
      { status: 400 }
    );
  }

  let session: {
    payment_status?: string;
    status?: string;
    customer_details?: { email?: string | null } | null;
  };
  try {
    const res = await fetch(STRIPE_API + encodeURIComponent(sessionId), {
      headers: { Authorization: `Bearer ${stripeKey}` },
      cache: 'no-store',
    });
    if (res.status === 404) {
      return NextResponse.json(
        { success: false, error: 'Checkout session not found.' },
        { status: 404 }
      );
    }
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: 'Could not verify the purchase with Stripe.' },
        { status: 502 }
      );
    }
    session = await res.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Could not reach Stripe.' },
      { status: 502 }
    );
  }

  if (session.payment_status !== 'paid') {
    return NextResponse.json(
      { success: false, error: 'This checkout session has not been paid.' },
      { status: 402 }
    );
  }

  const email = session.customer_details?.email ?? '';
  const payload = Buffer.from(
    JSON.stringify({ v: 1, email, sid: sessionId }),
    'utf8'
  );

  let signature: Buffer;
  try {
    const key = createPrivateKey({
      key: Buffer.from(signingKey, 'base64'),
      format: 'der',
      type: 'pkcs8',
    });
    signature = sign(null, payload, key);
  } catch {
    return NextResponse.json(
      { success: false, error: 'License service is misconfigured.' },
      { status: 500 }
    );
  }

  const licenseKey = `SM1.${b64url(payload)}.${b64url(signature)}`;
  return NextResponse.json({
    success: true,
    data: { key: licenseKey, email },
  });
}
