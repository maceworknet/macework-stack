import {
  FolderKanban,
  Image,
  LayoutDashboard,
  Lightbulb,
  Mail,
  Package,
  PanelsTopLeft,
  Settings,
  FileText,
  FileEdit,
  type LucideIcon,
} from "lucide-react";

export function isAdminRole(role?: string | null) {
  return role === "ADMIN" || role === "EDITOR";
}

export type AdminNavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const adminNavigation: AdminNavigationItem[] = [
  { label: "Panel", href: "/admin", icon: LayoutDashboard },
  { label: "Sayfalar", href: "/admin/pages", icon: PanelsTopLeft },
  { label: "\u00dcr\u00fcnler", href: "/admin/products", icon: Package },
  { label: "\u00c7\u00f6z\u00fcmler", href: "/admin/services", icon: Lightbulb },
  { label: "Projeler", href: "/admin/projects", icon: FolderKanban },
  { label: "\u015eablonlar", href: "/admin/templates", icon: FileEdit },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Mesajlar", href: "/admin/messages", icon: Mail },
  { label: "Medya", href: "/admin/media", icon: Image },
  { label: "Ayarlar", href: "/admin/settings", icon: Settings },
];
