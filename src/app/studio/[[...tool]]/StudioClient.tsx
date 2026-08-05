'use client';

import {useEffect} from 'react';
import {NextStudio} from 'next-sanity/studio';
import config from '../../../../sanity.config';

export default function StudioClient() {
  useEffect(() => {
    document.documentElement.dataset.karinStudio = 'true';
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
    document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');

    return () => {
      delete document.documentElement.dataset.karinStudio;
    };
  }, []);

  return (
    <div data-karin-studio-root="true">
      <NextStudio config={config} />
    </div>
  );
}
