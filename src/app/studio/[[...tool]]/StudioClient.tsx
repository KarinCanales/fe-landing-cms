'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

export default function StudioClient() {
  return (
    <div data-karin-studio>
      <NextStudio config={config} />
    </div>
  );
}
