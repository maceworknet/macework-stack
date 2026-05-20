"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LogOut, Menu } from "lucide-react";
import { logoutAction } from "@/actions/auth/login";
import { adminNavigation } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "macework-admin-sidebar";

function SidebarContent({
  user,
  collapsed,
  onToggle,
}: {
  user: { name: string | null; email: string; role: string };
  collapsed: boolean;
  onToggle?: () => void;
}) {
  const pathname = usePathname();

  function isActivePath(href: string) {
    if (href === "/admin") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const displayName = user.name ?? user.email;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        {!collapsed ? (
          <Link href="/admin" className="text-xl font-black tracking-tight">
            Macework<span className="text-macework">.</span>
          </Link>
        ) : (
          <Link
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-macework/10 text-sm font-black text-macework"
            title="Macework Admin"
          >
            M
          </Link>
        )}

        {onToggle && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={onToggle}
            title={collapsed ? "Sidebar'ı genişlet" : "Sidebar'ı daralt"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-1">
          <TooltipProvider delay={0}>
            {adminNavigation.map((item) => {
              const isActive = isActivePath(item.href);
              const Icon = item.icon;

              const link = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-macework text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger render={link} />
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }

              return link;
            })}
          </TooltipProvider>
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <Separator className="mb-3" />
        <div
          className={cn(
            "mb-3 flex items-center gap-3 rounded-lg bg-muted px-3 py-2",
            collapsed && "justify-center px-2"
          )}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-macework/10 text-sm font-black text-macework">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{user.role}</p>
            </div>
          )}
        </div>

        <form action={logoutAction}>
          <Button
            variant="outline"
            className={cn("w-full gap-2", collapsed && "px-0")}
            title={collapsed ? "Çıkış yap" : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Çıkış yap</span>}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string | null; email: string; role: string };
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActivePath(href: string) {
    if (href === "/admin") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "collapsed") setCollapsed(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  // Close mobile sheet on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-background transition-all duration-300 lg:flex lg:flex-col",
          collapsed ? "w-[4.75rem]" : "w-72"
        )}
      >
        <SidebarContent
          user={user}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
      </aside>

      {/* Content */}
      <div
        className={cn(
          "transition-all duration-300",
          collapsed ? "lg:pl-[4.75rem]" : "lg:pl-72"
        )}
      >
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="font-black">
              Macework<span className="text-macework">.</span>
            </Link>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger render={
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Menu className="h-4 w-4" />
                </Button>
              } />
              <SheetContent side="left" className="w-72 p-0">
                <SidebarContent user={user} collapsed={false} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile quick nav tabs */}
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-bold transition-colors",
                    isActive
                      ? "bg-macework text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="px-4 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
