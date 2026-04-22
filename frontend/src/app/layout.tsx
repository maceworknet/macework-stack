import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

import { ThemeProvider } from "@/components/theme-provider";
import { LayoutChrome } from "@/components/layout-chrome";
import {
  getFooterSettings,
  getGlobalSettings,
  getHeaderSettings,
  resolveMediaUrl,
} from "@/lib/cms";

const stripExtensionHydrationAttributes = `
(function () {
  var attributeName = "bis_skin_checked";

  function strip(root) {
    if (!root) return;

    if (root.nodeType === 1 && root.hasAttribute && root.hasAttribute(attributeName)) {
      root.removeAttribute(attributeName);
    }

    if (root.querySelectorAll) {
      root.querySelectorAll("[" + attributeName + "]").forEach(function (node) {
        node.removeAttribute(attributeName);
      });
    }
  }

  strip(document.documentElement);

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "attributes" && mutation.attributeName === attributeName) {
        mutation.target.removeAttribute(attributeName);
      }

      mutation.addedNodes.forEach(strip);
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [attributeName],
    childList: true,
    subtree: true
  });

  window.addEventListener("load", function () {
    strip(document.documentElement);
    window.setTimeout(function () {
      strip(document.documentElement);
      observer.disconnect();
    }, 1000);
  }, { once: true });
})();
`;

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();
  
  const title = settings?.seo_default_title || "Macework Creativ - Yaratıcı Teknoloji ve Ürün Stüdyosu";
  const desc = settings?.seo_default_description || "Macework Creativ, yenilikçi SaaS ürünleri, ölçeklenebilir dijital çözümler ve modern teknoloji altyapıları geliştiren kreatif stüdyodur.";
  const icon = settings?.favicon?.url ? resolveMediaUrl(settings.favicon.url) : "/favicon.ico";

  return {
    title: {
      template: "%s | " + (settings?.site_name || "Macework Creativ"),
      default: title,
    },
    description: desc,
    openGraph: {
      title: title,
      description: desc,
      url: "https://macework.com",
      siteName: settings?.site_name || "Macework Creativ",
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: desc,
    },
    icons: {
      icon: icon,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, headerSettings, footerSettings] = await Promise.all([
    getGlobalSettings(),
    getHeaderSettings(),
    getFooterSettings(),
  ]);

  return (
    <html
      lang="tr"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script
          id="strip-extension-hydration-attributes"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: stripExtensionHydrationAttributes }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutChrome
            settings={settings}
            headerSettings={headerSettings}
            footerSettings={footerSettings}
          >
            {children}
          </LayoutChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
