export type ManagedPageGroup = "page" | "layout";

export type ManagedPageDefinition = {
  id: string;
  title: string;
  description: string;
  publicHref: string | null;
  adminHref: string;
  group: ManagedPageGroup;
  phase: string;
  sections: string[];
};

export const managedPages = [
  {
    id: "home",
    title: "Ana Sayfa",
    description: "Hero, logolar, secili kartlar, surec ve proje baslatma alanlari.",
    publicHref: "/",
    adminHref: "/admin/pages/home",
    group: "page",
    phase: "Faz 11B",
    sections: [
      "Hero baslik, aciklama, buton metinleri ve linkleri",
      "Referanslarimiz & Urunlerimiz logo alani",
      "One Cikan Urunlerimiz baslik, aciklama ve urun secimi",
      "Kapsamli Dijital Cozumler baslik, aciklama ve cozum kartlari",
      "Seckin Islerimiz baslik, aciklama, buton ve is kartlari",
      "Neden Macework icerigi, sag kart veya gorsel secimi",
      "Nasil Calisiriz adimlari ve Yeni Bir Projeye Baslayalim alani",
    ],
  },
  {
    id: "islerimiz",
    title: "Islerimiz",
    description: "Ust alan metinleri, proje listesi girisi ve alt CTA metinleri.",
    publicHref: "/islerimiz",
    adminHref: "/admin/pages/islerimiz",
    group: "page",
    phase: "Faz 11C",
    sections: [
      "Ust alan rozet, baslik ve aciklama",
      "Alt CTA baslik ve aciklama",
      "Alt CTA buton metni ve linki",
    ],
  },
  {
    id: "hakkimizda",
    title: "Hakkimizda",
    description: "Kurumsal metinler, istatistikler, ekip kartlari ve gorsel alan.",
    publicHref: "/hakkimizda",
    adminHref: "/admin/pages/hakkimizda",
    group: "page",
    phase: "Faz 11D",
    sections: [
      "Ust alan rozet, baslik ve aciklama",
      "Biz Kimiz, Misyonumuz ve Vizyonumuz icerikleri",
      "Tamamlanan Proje, Mutlu Musteri, Gelistirilen Urun ve Uzman Ekip istatistikleri",
      "Sag buyuk alan icin kart veya gorsel secimi",
      "Uzman Kadromuz metinleri ve ekip kisi kartlari",
      "Birlikte Deger Yaratalim CTA alani",
    ],
  },
  {
    id: "blog",
    title: "Blog",
    description: "Blog & Haberler ust alan metinleri.",
    publicHref: "/blog",
    adminHref: "/admin/pages/blog",
    group: "page",
    phase: "Faz 11C",
    sections: ["Ust alan rozet, baslik ve aciklama"],
  },
  {
    id: "iletisim",
    title: "Iletisim",
    description: "Iletisim bilgileri, form metinleri, placeholderlar ve marka seridi.",
    publicHref: "/iletisim",
    adminHref: "/admin/pages/iletisim",
    group: "page",
    phase: "Faz 11C",
    sections: [
      "Ust alan rozet, baslik ve aciklama",
      "Iletisim Bilgileri baslik ve aciklama",
      "Telefon, e-posta, adres ve WhatsApp alanlari",
      "Form basligi, aciklamasi, placeholderlari ve buton metni",
      "Guvenen Markalar & Projelerimiz basligi ve ortak logo kaynagi",
    ],
  },
  {
    id: "sablonlar",
    title: "Sablonlar",
    description: "Sablon kutuphanesi ust alanlari ve alt CTA bolumu.",
    publicHref: "/sablonlar",
    adminHref: "/admin/pages/sablonlar",
    group: "page",
    phase: "Faz 11C",
    sections: [
      "Ust alan rozet, baslik ve aciklama",
      "Alt CTA baslik, aciklama, buton metni ve linki",
    ],
  },
  {
    id: "header",
    title: "Header",
    description: "Logo, ana menu, Sablonlar butonu ve Cozumler mega menu yapisi.",
    publicHref: null,
    adminHref: "/admin/pages/header",
    group: "layout",
    phase: "Faz 11E",
    sections: [
      "Logo ve marka metni",
      "Ana menu ogeleri, linkleri, hedefleri ve yayin durumlari",
      "Sablonlar butonu metni ve linki",
      "Cozumler mega menu kolonlari, ogeleri, aciklamalari, ikonlari ve linkleri",
      "Mobil menu baglantisi",
    ],
  },
  {
    id: "footer",
    title: "Footer",
    description: "Logo aciklamasi, hizli linkler, iletisim, sosyal medya ve yasal alanlar.",
    publicHref: null,
    adminHref: "/admin/pages/footer",
    group: "layout",
    phase: "Faz 11E",
    sections: [
      "Logo ve aciklama metni",
      "Hizli Linkler basligi ve menu ogeleri",
      "Iletisim basligi, e-posta, telefon ve adres alanlari",
      "Sosyal medya linkleri, ikonlari ve yayin durumlari",
      "Alt yasal linkler ve telif metni",
    ],
  },
] as const satisfies readonly ManagedPageDefinition[];

export type ManagedPageId = (typeof managedPages)[number]["id"];

export function getManagedPage(id: string) {
  return managedPages.find((page) => page.id === id) ?? null;
}

export function getManagedPagesByGroup(group: ManagedPageGroup) {
  return managedPages.filter((page) => page.group === group);
}

export function pageSettingKey(id: string) {
  return `page:${id}`;
}
