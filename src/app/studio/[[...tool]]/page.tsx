import type { Metadata } from 'next';
import StudioNoSSR from './StudioNoSSR';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Studio | Karin Cadenas',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function StudioPage() {
  return <StudioNoSSR />;
}
