import {
  Home,
  Film,
  Tv,
  Baby,
  Star,
  ChevronLeft,
  ChevronRight,
  Zap,
  Monitor,
  Library,
  AlertTriangle,
  Bookmark,
  type LucideIcon,
} from "lucide-react";

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export function Icon({ name, className = "", size = 24 }: IconProps) {
  const icons: Record<string, LucideIcon> = {
    home: Home,
    movie: Film,
    tv: Tv,
    teddy: Baby,
    star: Star,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    bolt: Zap,
    device: Monitor,
    library: Library,
    alert: AlertTriangle,
    bookmark: Bookmark,
  };

  const IconComponent = icons[name] || icons.alert;

  return <IconComponent size={size} className={className} />;
}
