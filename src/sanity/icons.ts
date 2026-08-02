import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarHeart,
  Camera,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Crown,
  ExternalLink,
  Flower2,
  Globe2,
  Handshake,
  Heart,
  HeartHandshake,
  Image as ImageIcon,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Play,
  Quote,
  Send,
  Sparkles,
  Star,
  User,
  Utensils,
} from 'lucide-react';
import React, { type ComponentType, type SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  strokeWidth?: number;
};

export type ResolvedIcon = ComponentType<IconProps>;

function InstagramIcon({ size = 24, strokeWidth = 2, ...props }: IconProps) {
  return React.createElement(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': 'true',
      ...props,
    },
    React.createElement('rect', {width: 18, height: 18, x: 3, y: 3, rx: 5}),
    React.createElement('circle', {cx: 12, cy: 12, r: 4}),
    React.createElement('circle', {cx: 17.5, cy: 6.5, r: 0.85, fill: 'currentColor', stroke: 'none'}),
  );
}

function FacebookIcon({ size = 24, ...props }: IconProps) {
  return React.createElement(
    'svg',
    {width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true', ...props},
    React.createElement('path', {d: 'M13.7 21v-7.7h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.6-1.5H17V4.2c-.8-.1-1.6-.2-2.4-.2-2.4 0-4.1 1.5-4.1 4.2v2.1H7.8v3h2.7V21h3.2Z'}),
  );
}

function TikTokIcon({ size = 24, ...props }: IconProps) {
  return React.createElement(
    'svg',
    {width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true', ...props},
    React.createElement('path', {d: 'M15.9 3c.3 2.2 1.6 3.5 3.8 3.7v3.1a7 7 0 0 1-3.7-1.1v5.9c0 3.8-2.4 6.4-5.9 6.4A5.7 5.7 0 0 1 4.3 15c0-3.4 2.6-5.8 6-5.8.5 0 .9 0 1.3.1v3.2c-.4-.1-.8-.2-1.3-.2-1.6 0-2.7 1.1-2.7 2.6s1 2.7 2.6 2.7c1.7 0 2.7-1 2.7-3.2V3h3Z'}),
  );
}

function XTwitterIcon({ size = 24, ...props }: IconProps) {
  return React.createElement(
    'svg',
    {width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true', ...props},
    React.createElement('path', {d: 'M17.7 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.4L2 3h6.4l4.4 5.8L17.7 3Zm-1.1 16.2h1.7L7.5 4.7H5.7l10.9 14.5Z'}),
  );
}

const iconMap: Record<string, ResolvedIcon> = {
  'web': Globe2,
  'globe': Globe2,
  'link': ExternalLink,
  'generic-link': ExternalLink,
  'sparkles': Sparkles,
  'calendar': Calendar,
  'calendar-clock': CalendarClock,
  'calendar-heart': CalendarHeart,
  'calendar-check': CalendarCheck,
  'flower2': Flower2,
  'clipboard-list': ClipboardList,
  'heart': Heart,
  'heart-handshake': HeartHandshake,
  'crown': Crown,
  'utensils': Utensils,
  'handshake': Handshake,
  'email': Mail,
  'mail': Mail,
  'phone': Phone,
  'location': MapPin,
  'map-pin': MapPin,
  'clock3': Clock3,
  'instagram': InstagramIcon,
  'facebook': FacebookIcon,
  'tiktok': TikTokIcon,
  'youtube': Play,
  'whatsapp': MessageCircle,
  'message-circle': MessageCircle,
  'x': XTwitterIcon,
  'x-twitter': XTwitterIcon,
  'twitter': XTwitterIcon,
  'catalog': ImageIcon,
  'camera': Camera,
  'quote': Quote,
  'star': Star,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  'send': Send,
  'user': User,
  'check-circle-2': CheckCircle2,
  'image': ImageIcon,
  'play': Play,
  'menu': Menu,
};

/**
 * Resolve a Sanity icon name to a lucide-react component.
 * Returns the fallback icon if the name is not found.
 */
export function resolveIcon(
  name: string | undefined | null,
  fallback: ResolvedIcon = Sparkles
): ResolvedIcon {
  if (!name) return fallback;
  return iconMap[name] ?? fallback;
}

export function renderIcon(
  name: string | undefined | null,
  props: IconProps = {},
  fallback: ResolvedIcon = Sparkles,
) {
  return React.createElement(resolveIcon(name, fallback), props);
}
