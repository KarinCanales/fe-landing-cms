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
  Flower2,
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
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
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
  'mail': Mail,
  'phone': Phone,
  'map-pin': MapPin,
  'clock3': Clock3,
  'instagram': MessageCircle, // fallback — custom SVGs used in footer
  'facebook': MessageCircle,  // fallback — custom SVGs used in footer
  'message-circle': MessageCircle,
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
  fallback: LucideIcon = Sparkles
): LucideIcon {
  if (!name) return fallback;
  return iconMap[name] ?? fallback;
}
