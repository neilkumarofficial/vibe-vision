import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  Music,
  Mic2,
  Video,
  Youtube,
  Instagram,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Bell,
} from "lucide-react";

import type { LucideIcon, LucideProps } from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  logo: Command,
  google: Google,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  gitHub: Github,
  twitter: Twitter,
  check: Check,
  music: Music,
  mic: Mic2,
  video: Video,
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook, // Corrected capitalization
  mail: Mail,
  lock: Lock,
  eye: Eye,
  eyeOff: EyeOff,
  logout: LogOut,
  bell: Bell,
} as const;

// Custom Google icon component
export function Google({ ...props }: LucideProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      className={props.className}
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      />
    </svg>
  );
}

export function Github({ ...props }: LucideProps) {
  return (
    <svg
      className={cn("w-5 h-5 group-hover:-translate-y-1 duration-300 transition-all")}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_910_21)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.0005 1C18.303 1.00296 12.7923 3.02092 8.45374 6.69305..."
        />
        {/* Additional paths */}
      </g>
      <defs>
        <clipPath id="clip0_910_21">
          <rect width="48" height="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function Facebook({ ...props }: LucideProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      className={props.className}
      {...props}
    >
      <path
        fill="currentColor"
        d="M279.14 288l14.22-92.66h-88.91V127.25c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S257.91 0 225.36 0C141.09 0 89.46 54.53 89.46 155.84v51.5H0v92.66h89.46V512h107.1V288z"
      />
    </svg>
  );
}

export { type LucideProps };