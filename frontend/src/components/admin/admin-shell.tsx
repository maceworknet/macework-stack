"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth/login";
import { adminNavigation } from "@/lib/permissions";

const STORAGE_KEY = "macework-admin-sidebar";

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string | null; email: string; role: string };
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActivePath(href: string) {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "collapsed") {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-background transition-all duration-300 lg:flex lg:flex-col ${
          collapsed ? "w-[4.75rem]" : "w-72"
        }`}
      >
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between gap-3">
            {!collapsed ? (
              <div>
                <Link href="/admin" className="text-xl font-black tracking-tight">
                  Macework<span className="text-macework">.</span>
                </Link>
                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  Local CMS Admin
                </p>
              </div>
            ) : (
              <Link
                href="/admin"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-macework/10 text-sm font-black text-macework"
                title="Macework Admin"
              >
                M
              </Link>
            )}

            <button
              type="button"
              onClick={() => setCollapsed((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title={collapsed ? "Sidebar'\u0131 geni\u015flet" : "Sidebar'\u0131 daralt"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 p-3">
          {adminNavigation.map((item) => {
            const isActive = isActivePath(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-macework text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${collapsed ? "justify-center px-0" : ""}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <div
            className={`mb-3 rounded-lg bg-muted ${
              collapsed ? "flex h-11 items-center justify-center" : "p-3"
            }`}
          >
            {!collapsed ? (
              <>
                <p className="truncate text-sm font-bold">{user.name ?? user.email}</p>
                <p className="truncate text-xs text-muted-foreground">{user.role}</p>
              </>
            ) : (
              <span className="text-sm font-black">
                {(user.name ?? user.email).charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <form action={logoutAction}>
            <button
              className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-bold transition-colors hover:bg-muted ${
                collapsed ? "px-0" : ""
              }`}
              title={collapsed ? "\u00c7\u0131k\u0131\u015f yap" : undefined}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed ? <span>{"\u00c7\u0131k\u0131\u015f yap"}</span> : null}
            </button>
          </form>
        </div>
      </aside>

      <div
        className={`transition-all duration-300 ${collapsed ? "lg:pl-[4.75rem]" : "lg:pl-72"}`}
      >
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-black">
              Macework<span className="text-macework">.</span>
            </Link>
            <form action={logoutAction}>
              <button className="rounded-md border border-border px-3 py-2 text-xs font-bold">
                {"\u00c7\u0131k\u0131\u015f"}
              </button>
            </form>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-bold ${
                    isActive ? "bg-macework text-white" : "bg-muted text-muted-foreground"
                  }`}
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
