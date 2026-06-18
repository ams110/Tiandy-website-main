import {
  Store,
  Building2,
  Factory,
  Landmark,
  GraduationCap,
  TrainFront,
  ShieldCheck,
  Cpu,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  Camera,
  Globe2,
  Headset,
  type LucideIcon,
} from 'lucide-react'

// Single source of truth mapping content keys → clean line icons, so the rest
// of the app references icons by name (kept out of data files) for one
// consistent, premium icon style.
const REGISTRY: Record<string, LucideIcon> = {
  // solutions
  retail: Store,
  city: Building2,
  industry: Factory,
  banking: Landmark,
  education: GraduationCap,
  transport: TrainFront,
  // value props
  reliability: ShieldCheck,
  ai: Cpu,
  global: Globe,
  // contact
  phone: Phone,
  mail: Mail,
  address: MapPin,
  clock: Clock,
  // misc UI
  camera: Camera,
  region: Globe2,
  support: Headset,
}

export default function Icon({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name: string
  className?: string
  strokeWidth?: number
}) {
  const Cmp = REGISTRY[name]
  if (!Cmp) return null
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden />
}
