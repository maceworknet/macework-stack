"use client";

import Link from "next/link";
import { siteContent } from "../content/site-content";
import { SocialIcon } from 'react-social-icons';

export function Footer({ settings }: { settings?: any }) {
  const description =
    settings?.description || settings?.footer_description || siteContent.footer.description;
  const email = settings?.email || settings?.footer_email || siteContent.contact.email;
  const phone = settings?.phone || settings?.footer_phone || siteContent.contact.phone;
  const quickLinks = (settings?.quick_links?.length
    ? settings.quick_links
    : siteContent.header.navigation
  ).filter((item: any) => item.published !== false);
  const legalLinks = (settings?.legal_links?.length
    ? settings.legal_links
    : [
        { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
        { label: "Kullanım Koşulları", href: "/kullanim-kosullari" },
      ]
  ).filter((item: any) => item.published !== false);

  const socialLinks: any[] = [];
  if (settings?.social_links?.length) {
    socialLinks.push(
      ...settings.social_links
        .filter((item: any) => item.published !== false)
        .map((item: any) => ({
          href: item.url,
          icon: item.icon,
          label: item.platform,
        }))
    );
  } else if (settings) {
    if (settings.social_instagram) socialLinks.push({ href: settings.social_instagram, icon: 'instagram', label: 'Instagram' });
    if (settings.social_twitter) socialLinks.push({ href: settings.social_twitter, icon: 'twitter', label: 'Twitter' });
    if (settings.social_linkedin) socialLinks.push({ href: settings.social_linkedin, icon: 'linkedin', label: 'LinkedIn' });
    if (settings.social_youtube) socialLinks.push({ href: settings.social_youtube, icon: 'youtube', label: 'YouTube' });
  }
  
  const finalSocials = socialLinks.length > 0 ? socialLinks : siteContent.contact.social;

  return (
    <footer className="border-t border-border/50 bg-background pt-20 pb-12 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="inline-block group notranslate" translate="no">
              <span className="text-xl font-bold tracking-tighter">
                {settings?.logo_text || settings?.site_name || "Macework"}
                <span className="text-macework">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed font-normal">
              {description}
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-widest">
              {settings?.quick_links_heading || "Hızlı Linkler"}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((nav: any, i: number) => (
                <li key={i}>
                  <Link
                    href={nav.href}
                    target={nav.target === "_blank" ? "_blank" : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans"
                  >
                    {nav.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-widest">
              {settings?.contact_heading || "İletişim"}
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="font-medium text-foreground">{email}</li>
              <li>{phone}</li>
              {settings?.address ? <li className="whitespace-pre-line">{settings.address}</li> : null}
            </ul>
            <div className="flex items-center gap-4 pt-2">
              {finalSocials.map((social, i) => (
                <SocialIcon 
                  key={i} 
                  url={social.href} 
                  network={social.icon} 
                  className="!w-8 !h-8 hover:scale-110 active:scale-90 transition-all" 
                  bgColor="transparent" 
                  fgColor="currentColor"
                  title={social.label}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 pt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-medium">
            {settings?.copyright || siteContent.footer.copyright}
          </p>
          <div className="flex gap-6">
             {legalLinks.map((link: any) => (
               <Link
                 key={link.href}
                 href={link.href}
                 className="text-xs text-muted-foreground hover:text-foreground transition-colors"
               >
                 {link.label}
               </Link>
             ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
