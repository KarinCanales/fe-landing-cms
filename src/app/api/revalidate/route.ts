import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const SANITY_TAG = 'sanity';
const HOME_PATH = '/';
const KNOWN_SANITY_TYPES = new Set([
  'siteSettings',
  'navbarSettings',
  'heroSection',
  'benefitsSection',
  'servicesSection',
  'catalogSection',
  'testimonialsSection',
  'contactSection',
  'footerSection',
]);

type RevalidateBody = {
  _type?: string;
  type?: string;
  secret?: string;
};

async function readBody(request: NextRequest): Promise<RevalidateBody> {
  try {
    return (await request.json()) as RevalidateBody;
  } catch {
    return {};
  }
}

function getProvidedSecret(request: NextRequest, body: RevalidateBody) {
  const auth = request.headers.get('authorization') || '';
  const bearer = auth.match(/^Bearer\s+(.+)$/i)?.[1];

  return (
    request.nextUrl.searchParams.get('secret') ||
    request.headers.get('x-revalidate-secret') ||
    request.headers.get('x-sanity-revalidate-secret') ||
    bearer ||
    body.secret ||
    ''
  );
}

function getSanityType(body: RevalidateBody) {
  const rawType = body._type || body.type || '';
  return KNOWN_SANITY_TYPES.has(rawType) ? rawType : undefined;
}

async function revalidate(request: NextRequest) {
  const body = await readBody(request);
  const configuredSecret = process.env.SANITY_REVALIDATE_SECRET;
  const providedSecret = getProvidedSecret(request, body);

  if (!configuredSecret) {
    return NextResponse.json(
      { revalidated: false, message: 'Missing SANITY_REVALIDATE_SECRET environment variable.' },
      { status: 500 },
    );
  }

  if (providedSecret !== configuredSecret) {
    return NextResponse.json(
      { revalidated: false, message: 'Invalid revalidation secret.' },
      { status: 401 },
    );
  }

  const type = getSanityType(body);

  revalidatePath(HOME_PATH);
  revalidateTag(SANITY_TAG, { expire: 0 });

  if (type) {
    revalidateTag(type, { expire: 0 });
  }

  return NextResponse.json({
    revalidated: true,
    path: HOME_PATH,
    tag: SANITY_TAG,
    type: type || null,
    now: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  return revalidate(request);
}

export async function POST(request: NextRequest) {
  return revalidate(request);
}
