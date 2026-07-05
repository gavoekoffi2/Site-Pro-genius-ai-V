import {
  AudioWaveform,
  Bot,
  Compass,
  GraduationCap,
  Layers,
  Network,
  Smartphone,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  layers: Layers,
  bot: Bot,
  workflow: Workflow,
  network: Network,
  smartphone: Smartphone,
  "audio-waveform": AudioWaveform,
  "graduation-cap": GraduationCap,
  compass: Compass,
};

export default function ServiceIcon({
  name,
  size = 22,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = icons[name] ?? Layers;
  return <Icon size={size} strokeWidth={1.6} className={className} />;
}
