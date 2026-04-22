"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

export function LayoutChrome({
  children,
  settings,
  headerSettings,
  footerSettings,
}: {
  children: React.ReactNode;
  settings?: any;
  headerSettings?: any;
  footerSettings?: any;
}) {
  const pathname = usePathname();
  const isAdminArea = pathname === "/login" || pathname.startsWith("/admin");

  if (isAdminArea) {
    return <>{children}</>;
  }

  return (
    <>
      <Header settings={headerSettings} footerSettings={footerSettings} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer settings={{ ...settings, ...footerSettings }} />
      <ScrollToTop />
    </>
  );
}
