import type { ComponentType, SVGProps } from "react";
import { Routes } from "@/lib/routes";
import {
  HomeIcon,
  PersonIcon,
  ReceiptIcon,
  CarIcon,
  TuneIcon,
  BellIcon,
  BoltIcon,
} from "@/components/ui/icons";

export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  /** Oturum gerektirir (guest tıklarsa middleware login'e yönlendirir). */
  authRequired?: boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Anasayfa", href: Routes.home, icon: HomeIcon },
  { label: "İlanlarım", href: Routes.myListings, icon: ReceiptIcon, authRequired: true },
  { label: "Araç Bul", href: Routes.findCar, icon: CarIcon },
  { label: "Tercihler", href: Routes.preferences, icon: TuneIcon },
  { label: "Bildirimler", href: Routes.notifications, icon: BellIcon },
  { label: "Enndipten Al", href: Routes.buyFromEnndip, icon: BoltIcon },
  { label: "Hesabım", href: Routes.account, icon: PersonIcon, authRequired: true },
];

/** Sidebar aktif durumu — listing akışı Araç Bul altında kalır. */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === Routes.home) return pathname === Routes.home;
  if (href === Routes.findCar) {
    return pathname === Routes.findCar || pathname.startsWith("/listing/");
  }
  if (href !== Routes.home && pathname.startsWith(`${href}/`)) return true;
  return pathname === href;
}

export const FOOTER_NAV = [
  { label: "İletişim", href: Routes.contact },
  { label: "Nasıl Çalışır?", href: Routes.howItWorks },
];
