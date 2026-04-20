import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
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

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ThemeProvider } from "@/components/theme-provider";
import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchStrapi('global-setting', { populate: '*' }).catch(() => null);
  
  const title = settings?.seo_default_title || "Macework Creativ - Yaratıcı Teknoloji ve Ürün Stüdyosu";
  const desc = settings?.seo_default_description || "Macework Creativ, yenilikçi SaaS ürünleri, ölçeklenebilir dijital çözümler ve modern teknoloji altyapıları geliştiren kreatif stüdyodur.";
  const icon = settings?.favicon?.url ? getStrapiMedia(settings.favicon.url) : "/favicon.ico";

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
  const settings = await fetchStrapi('global-setting', { populate: '*' }).catch(() => null);

  return (
    <html
      lang="tr"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer settings={settings} />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
