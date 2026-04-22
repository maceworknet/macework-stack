"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { SubPageHeader } from "@/components/subpage-header";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resolveMediaUrl } from "@/lib/media";

export default function ContactClient({ settings }: { settings?: any }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setFeedbackMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      ...Object.fromEntries(formData.entries()),
      interest: String(formData.get("interest") ?? "SaaS Ürünleri"),
      source: "contact-page-form",
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.stored) {
        throw new Error(body?.error ?? "Gönderim başarısız oldu");
      }

      form.reset();
      setFeedbackMessage("Mesajınız başarıyla gönderildi ve panelde Mesajlar alanına düştü.");
      setStatus("success");
    } catch(err) {
      console.error(err);
      setFeedbackMessage(
        err instanceof Error
          ? err.message
          : "Mesaj gönderilemedi. Lütfen birkaç dakika sonra tekrar deneyin."
      );
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden">
      <SubPageHeader 
        badge={settings?.eyebrow || "İletişim"}
        title={settings?.heading || "Bize Ulaşın"}
        description={settings?.subheading || "Fikrinizi ürüne dönüştürmek veya markanızı dijitalde büyütmek için ilk adımı atın. Kahve eşliğinde stratejinizi konuşalım."}
      />

      <section className="py-20 bg-background overflow-hidden">
        <div className="container overflow-visible">
          {/* Main Contact Card */}
          <div className="max-w-6xl mx-auto bg-card border border-border/60 rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row">
            
            {/* Left Side: Contact Information (Dark) */}
            <div className="lg:w-[400px] bg-zinc-900 dark:bg-zinc-950 p-10 lg:p-12 text-zinc-50 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-macework/20 blur-[100px] -mr-32 -mt-32"></div>
                
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-3xl font-bold tracking-tight">
                          {settings?.info_heading || "İletişim Bilgileri"}
                        </h3>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            {settings?.info_description ||
                              "Markanızı dijitalde parlatmak ve yenilikçi teknoloji çözümlerimizle tanışmak için ekibimizle doğrudan iletişime geçin."}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-5 group">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-macework group-hover:scale-110 transition-transform">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                  {settings?.phone_label || "Telefon"}
                                </span>
                                <a href={`tel:${(settings?.phone || "0 (850) 123 45 67")}`} className="text-base font-bold hover:text-macework transition-colors">{(settings?.phone || "0 (850) 123 45 67")}</a>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 group">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-macework group-hover:scale-110 transition-transform">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                  {settings?.email_label || "E-posta"}
                                </span>
                                <a href={`mailto:${(settings?.email || "iletisim@macework.com")}`} className="text-base font-bold hover:text-macework transition-colors">{(settings?.email || "iletisim@macework.com")}</a>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 group">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-macework group-hover:scale-110 transition-transform">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                  {settings?.address_label || "Adres"}
                                </span>
                                <span className="text-sm font-medium text-zinc-300 leading-relaxed whitespace-pre-line">{(settings?.address || "Macework Technology\nTeknopark Istanbul, Pendik")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-12 flex gap-4">
                    <a href={`https://wa.me/${(settings?.whatsapp_number || "905000000000").replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-[#25D366] transition-colors cursor-pointer text-zinc-400 hover:text-white group">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                        </svg>
                    </a>
                    <p className="text-[10px] text-zinc-500 font-medium whitespace-pre-line">
                      {settings?.whatsapp_intro
                        ? `${settings.whatsapp_intro}\n${settings?.whatsapp_text ?? ""}`
                        : settings?.whatsapp_text || "Hızlı cevap için\nWhatsApp'tan ulaşın."}
                    </p>
                </div>
            </div>

            {/* Right Side: Form (Homepage Build Style) */}
            <div className="flex-1 p-10 lg:p-14 bg-card relative">
                {status === "success" ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12"
                    >
                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                             <h3 className="text-2xl font-bold">Mesajınız Alındı!</h3>
                             <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                {feedbackMessage || "Uzman ekibimiz talebinizi inceleyip en kısa sürede sizinle iletişime geçecektir."}
                             </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setStatus("idle");
                            setFeedbackMessage("");
                          }}
                          className="rounded-full"
                        >
                          Yeni Form Gönder
                        </Button>
                    </motion.div>
                ) : (
                    <>
                    <div className="space-y-6 relative z-10 mb-8">
                        <div className="space-y-2">
                             <h3 className="text-2xl font-bold tracking-tight">{settings?.form_heading || "Yeni Bir Projeye Başlayalım"}</h3>
                             <p className="text-muted-foreground text-sm leading-relaxed">
                                 {settings?.form_subheading || "Fikrinizi ürüne dönüştürmek veya markanızı dijitalde büyütmek için ilk adımı atın."}
                             </p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        {status === "error" ? (
                          <div
                            role="alert"
                            className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                          >
                            {feedbackMessage || "Mesaj gönderilemedi. Lütfen tekrar deneyin."}
                          </div>
                        ) : null}
                        <div className="space-y-2">
                          <Label htmlFor="name">Ad Soyad</Label>
                          <Input 
                            id="name" name="name" required
                            placeholder={settings?.form_placeholder_name || "Yaser Köse"}
                            className="h-11 rounded-md"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="company">Firma Adı</Label>
                          <Input 
                            id="company" name="company"
                            placeholder={settings?.form_placeholder_company || "Macework"}
                            className="h-11 rounded-md"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">E-posta</Label>
                          <Input 
                            id="email" name="email" required type="email" 
                            placeholder={settings?.form_placeholder_email || "iletisim@macework.com"}
                            className="h-11 rounded-md"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="interest">İlgilendiğiniz Alan</Label>
                          <Select name="interest" defaultValue="SaaS Ürünleri">
                            <SelectTrigger id="interest" className="h-11 rounded-md">
                              <SelectValue placeholder="Bir alan seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SaaS Ürünleri">SaaS Ürünleri</SelectItem>
                              <SelectItem value="Web Tasarım & Yazılım">Web Tasarım & Yazılım</SelectItem>
                              <SelectItem value="E-Ticaret">E-Ticaret</SelectItem>
                              <SelectItem value="Dijital Pazarlama">Dijital Pazarlama</SelectItem>
                              <SelectItem value="Diger">Diğer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="message">Mesajınız</Label>
                          <Textarea 
                            id="message" name="message" required rows={4}
                            placeholder={settings?.form_placeholder_message || "Projenizden veya talebinizden bahsedin..."}
                            className="rounded-md resize-none"
                          />
                        </div>

                        <div className="md:col-span-2 pt-4">
                          <Button 
                            type="submit"
                            disabled={status === "submitting"}
                            className="w-full h-12 font-bold bg-macework hover:bg-macework-hover text-white transition-all shadow-none"
                          >
                            {status === "submitting" ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              <>
                                {settings?.form_button_text || "Teklif Al"}
                                <Send className="ml-2 w-4 h-4" />
                              </>
                            )}
                          </Button>
                        </div>
                    </form>
                    </>
                )}
            </div>

          </div>

          {/* Brands Slider Section - Fixed Overflow */}
          <div className="mt-32 w-full max-w-5xl mx-auto pt-10 border-t border-border/50 overflow-hidden">
             <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50 mb-12 text-center">
               {settings?.trusted_brands_heading || "GÜVENEN MARKALAR & PROJELERİMİZ"}
             </p>
             <div className="relative group/slider overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
                <div className="flex w-fit gap-20 items-center animate-marquee whitespace-nowrap">
                   {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex gap-20 items-center">
                         {settings?.trusted_brands_logos?.length > 0 ? (
                            settings.trusted_brands_logos.map((logo: any, j: number) => {
                               const image = (
                                 <img
                                   src={resolveMediaUrl(logo.url)}
                                   alt={logo.alternativeText || `Brand ${j}`}
                                   className="h-8 max-w-[140px] object-contain opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                                 />
                               );

                               return logo.href ? (
                                 <a key={`${i}-${j}`} href={logo.href} target="_blank" rel="noreferrer">
                                   {image}
                                 </a>
                               ) : (
                                 <span key={`${i}-${j}`}>{image}</span>
                               );
                            })
                         ) : (
                            ["Qrgetir", "Carigetir", "SociaMind", "byoo.pro"].map((p, j) => (
                               <span key={`${i}-${j}`} className="text-2xl md:text-3xl font-bold tracking-tighter text-foreground/20 hover:text-macework transition-colors cursor-default select-none">
                                  {p}
                               </span>
                            ))
                         )}
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}

