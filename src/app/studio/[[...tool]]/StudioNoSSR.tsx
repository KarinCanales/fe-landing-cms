'use client';

import dynamic from 'next/dynamic';

const StudioClient = dynamic(() => import('./StudioClient'), {
  ssr: false,
  loading: () => (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#11130f',
        color: '#e5e0d8',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      Cargando panel de edición...
    </main>
  ),
});

export default function StudioNoSSR() {
  return <StudioClient />;
}