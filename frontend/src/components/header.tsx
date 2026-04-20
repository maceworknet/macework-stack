"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteContent } from "../content/site-content";
import { cn } from "../lib/utils";
import { MegaMenu } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import { ArrowRight, Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);
      
      if (currentScrollY > lastScrollY && currentScrollY > 150 && !isMobileMenuOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Drawer */}
      <MobileNav isOpen={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} />

      <div className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
        <AnimatePresence>
          {isVisible && (
            <motion.header
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "w-full max-w-7xl h-14 rounded-full transition-all duration-300 border border-border/40 backdrop-blur-md pointer-events-auto",
                scrolled
                  ? "bg-background/80 shadow-sm"
                  : "bg-background/40"
              )}
            >
              <div className="container h-full flex items-center justify-between px-6">
                {/* Logo */}
                <div className="flex-1 lg:flex-none">
                  <Link href="/" className="flex items-center gap-2 group notranslate" translate="no">
                    <span className="text-lg font-bold tracking-tighter">
                      Macework<span className="text-macework">.</span>
                    </span>
                  </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1">
                    {siteContent.header.navigation.map((item) => (
                      item.label === "Çözümler" ? (
                        <MegaMenu key={item.label} label={item.label} />
                      ) : (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="text-sm font-medium px-4 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all font-sans"
                        >
                          {item.label}
                        </Link>
                      )
                    ))}
                  </div>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-1 lg:flex-none justify-end">
                  <ModeToggle />
                  <Button asChild size="sm" className="hidden md:flex rounded-full px-5 text-sm">
                    <Link href={siteContent.header.cta.href}>
                      {siteContent.header.cta.label}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>

                  {/* Mobile Nav Button */}
                  <div className="lg:hidden">
                    <Button 
                       variant="ghost"
                       size="icon-sm"
                       onClick={() => setIsMobileMenuOpen(true)}
                       className="rounded-full"
                    >
                       <Menu className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

