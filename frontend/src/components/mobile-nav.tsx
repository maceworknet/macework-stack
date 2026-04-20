"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, X } from "lucide-react";
import { siteContent } from "../content/site-content";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

interface MobileNavProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ isOpen, onOpenChange }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Menu Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[350px] bg-background border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <span className="text-lg font-bold tracking-tighter">
                Macework<span className="text-macework">.</span>
              </span>
              <Button 
                variant="ghost"
                size="icon-sm"
                onClick={() => onOpenChange(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-8 px-6 space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground ml-2">Menü</p>
                <nav className="space-y-1">
                  {siteContent.header.navigation.map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-all group"
                        onClick={() => onOpenChange(false)}
                      >
                        <span className="text-lg font-medium tracking-tight font-sans">{item.label}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-macework" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              <div className="pt-8 border-t border-border space-y-6">
                <div className="space-y-4 ml-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">İletişim</p>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{siteContent.contact.email}</p>
                    <p className="text-sm text-muted-foreground">{siteContent.contact.phone}</p>
                  </div>
                </div>

                <Button asChild className="w-full h-12 rounded-lg" onClick={() => onOpenChange(false)}>
                  <Link href={siteContent.header.cta.href}>
                    {siteContent.header.cta.label}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-border/50">
               <p className="text-[10px] text-muted-foreground font-medium">{siteContent.footer.copyright}</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

