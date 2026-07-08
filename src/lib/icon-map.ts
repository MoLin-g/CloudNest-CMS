import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Map database icon name strings to lucide-react components
export function getIcon(name: string | undefined): LucideIcon {
  if (!name) return Icons.CircleHelp;
  const icon = (Icons as Record<string, LucideIcon>)[name];
  return icon || Icons.CircleHelp;
}
