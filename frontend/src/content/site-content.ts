export const siteContent = {
  header: {
    navigation: [
      { label: "Çözümler", href: "/#cozumler" },
      { label: "İşlerimiz", href: "/islerimiz" },
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Blog", href: "/blog" },
      { label: "İletişim", href: "/iletisim" },
    ],
    cta: {
      label: "Şablonlar",
      href: "/sablonlar",
    },
  },

  hero: {
    badge: "Yaratıcı Teknoloji Stüdyosu",
    title: "Sadece hizmet değil,\nbirlikte öne çıkan\nürünler geliştiriyoruz.",
    description: "Macework Creative, ölçeklenebilir dijital altyapılar ve kendi inovatif SaaS ürünlerini tasarlayan, aynı vizyonu markanıza da taşıyan 360 derece teknoloji ajansıdır.",
    primaryCta: { label: "Çözümleri İncele", href: "/#cozumler" },
    secondaryCta: { label: "Ürünlere Göz At", href: "/#urunler" },
  },

  products: {
    sectionTitle: "Öne Çıkan Ürünlerimiz",
    sectionDescription: "Kendi laboratuvarımızdan çıkan ve binlerce işletme tarafından kullanılan dijital SaaS projelerimiz.",
    items: [
      {
        id: "qrgetir",
        slug: "qrgetir",
        title: "Qrgetir",
        description: "Restoranlar için yeni nesil QR menü ve dijital sipariş yönetim sistemi.",
        longDescription: "Qrgetir, restoran ve kafelerin dijitalleşme sürecindeki en büyük yardımcısıdır. Temassız sipariş, dijital ödeme entegrasyonu ve akıllı mutfak yönetimi ile operasyonel verimliliği maksimuma çıkarır.",
        features: ["Dijital Menü Yönetimi", "Garson Çağırma Sistemi", "Online Sipariş & Ödeme", "Mutfak Yönetim Paneli", "Analiz & Raporlama"],
        badge: "SaaS",
        href: "https://qrgetir.com",
        category: "Dijital Menü",
      },
      {
        id: "carigetir",
        slug: "carigetir",
        title: "Carigetir",
        description: "KOBİ'ler için hızlı, güvenli ve akıllı cari hesap yönetim uygulaması.",
        longDescription: "Carigetir, karmaşık muhasebe süreçlerini basitleştirerek KOBİ'lerin finansal sağlıklarını her an her yerden takip edebilmelerini sağlar. Otomatik hatırlatmalar ve raporlar ile tahsilat süreçlerini hızlandırır.",
        features: ["Cari Takibi", "Gelir-Gider Yönetimi", "Otomatik Tahsilat Hatırlatma", "Bulut Tabanlı Veri Saklama", "Pro Analiz Modülü"],
        badge: "SaaS",
        href: "https://carigetir.com",
        category: "Fintek",
      },
      {
        id: "sociamind",
        slug: "sociamind",
        title: "SociaMind",
        description: "Yapay zeka destekli sosyal medya planlama ve içerik otomasyonu.",
        longDescription: "SociaMind, sosyal medya yöneticilerinin ve markaların içerik üretim yükünü yapay zeka ile hafifletir. Trend analizi yaparak en etkili paylaşım zamanlarını ve görselleri sizin yerinize optimize eder.",
        features: ["AI İçerik Üretimi", "Akıllı Zamanlama", "Rakip Analizi", "Otomatik Görsel Tasarım", "Haftalık Performans Özeti"],
        badge: "AI",
        href: "https://sociamind.app",
        category: "Pazarlama Otomasyonu",
      },
      {
        id: "byoo",
        slug: "byoo",
        title: "byoo.pro",
        description: "Profesyoneller için gelişmiş kişisel bio link ve dijital profil aracı.",
        longDescription: "byoo.pro, dijital dünyadaki tüm varlığınızı tek bir şık ve profesyonel linkte toplamanızı sağlar. Kişiselleştirilebilir temalar ve analiz araçları ile dijital kimliğinizi güçlendirin.",
        features: ["Full Özelleştirilebilir Temalar", "Gelişmiş Ziyaretçi Analizi", "CRM & Form Entegrasyonu", "Özel QR Kod Oluşturma", "Ödeme Alma Linkleri"],
        badge: "Link in Bio",
        href: "https://byoo.pro",
        category: "Dijital Profil",
      },
    ],
  },
  
  templates: {
    items: [
      {
        id: "t1",
        title: "Restoran Pro",
        category: "Restoran",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800",
        href: "/urunler/qrgetir",
      },
      {
        id: "t2",
        title: "Eco-Shop",
        category: "E-Ticaret",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800",
        href: "/cozumler/e-ticaret",
      },
      {
        id: "t3",
        title: "Corporate Flow",
        category: "Kurumsal",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800",
        href: "/cozumler/web-yazilim",
      },
      {
        id: "t4",
        title: "SaaS Analytics",
        category: "SaaS",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
        href: "/cozumler/saas-gelistirme",
      },
      {
        id: "t5",
        title: "Creative Studio",
        category: "Portföy",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800",
        href: "/islerimiz",
      },
      {
       id: "t6",
       title: "Real Estate Pro",
       category: "Kurumsal",
       image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800",
       href: "/islerimiz/lux-estate",
      }
    ],
    categories: ["Hepsi", "E-Ticaret", "Kurumsal", "SaaS", "Portföy", "Restoran"]
  },

  solutionsMegaMenu: {
    columns: [
      {
        title: "Dijital Çözümler",
        items: [
          { slug: "web-tasarim", title: "Web Tasarım", description: "Premium ve kullanıcı odaklı arayüzler", href: "/cozumler/web-tasarim", iconName: "layout" },
          { slug: "kurumsal-kimlik", title: "Kurumsal Kimlik", description: "Modern ve akılda kalıcı marka vizyonu", href: "/cozumler/kurumsal-kimlik", iconName: "brush" },
          { slug: "seo-stratejisi", title: "SEO Stratejisi", description: "Veri odaklı arama motoru optimizasyonu", href: "/cozumler/seo-stratejisi", iconName: "line-chart" },
          { slug: "sosyal-medya", title: "Sosyal Medya", description: "Yaratıcı etkileşim ve iletişim", href: "/cozumler/sosyal-medya", iconName: "share-2" },
        ],
      },
      {
        title: "Teknoloji Çözümleri",
        items: [
          { slug: "web-yazilim", title: "Web Yazılım", description: "Güvenli ve ölçeklenebilir altyapılar", href: "/cozumler/web-yazilim", iconName: "code" },
          { slug: "e-ticaret", title: "E-Ticaret", description: "Dönüşüm odaklı online satış sistemleri", href: "/cozumler/e-ticaret", iconName: "shopping-bag" },
          { slug: "api-integrasyonlari", title: "API Entegrasyonları", description: "Kusursuz sistem bağlantıları", href: "/cozumler/api-integrasyonlari", iconName: "network" },
          { slug: "saas-gelistirme", title: "SaaS Geliştirme", description: "Fikirden ürüne özel yazılım projeleri", href: "/cozumler/saas-gelistirme", iconName: "box" },
        ],
      },
      {
        title: "Ürünlerimiz",
        items: [
          { slug: "qrgetir", title: "Qrgetir.com", description: "Yeni nesil dijital menü", href: "/urunler/qrgetir", iconName: "smartphone" },
          { slug: "carigetir", title: "Carigetir.com", description: "Akıllı bulut ön muhasebe", href: "/urunler/carigetir", iconName: "calculator" },
          { slug: "sociamind", title: "SociaMind.app", description: "Yapay zeka asistanı", href: "/urunler/sociamind", iconName: "brain" },
          { slug: "byoo", title: "byoo.pro", description: "Dijital kartvizit ve profil", href: "/urunler/byoo", iconName: "link" },
        ],
      },
    ],
  },

  solutionsDetail: [
    {
      slug: "web-tasarim",
      title: "Premium Web Tasarım",
      description: "Markanızı dijitalde parlatacak, kullanıcı deneyimini merkeze koyan modern web tasarım süreçleri.",
      features: ["UX/UI Tasarım", "Responsive Mimari", "Etkileşimli Deneyim", "Branding Entegrasyonu"],
    },
    {
      slug: "web-yazilim",
      title: "Özel Web Yazılım",
      description: "İhtiyacınıza özel, modern teknolojilerle (Next.js, Node.js) inşa edilmiş güvenli ve hızlı yazılım çözümleri.",
      features: ["Modern Stack Geliştirme", "Yüksek Performans", "API Tasarımı", "Veri Güvenliği"],
    },
    {
      slug: "kurumsal-kimlik",
      title: "Kurumsal Kimlik & Branding",
      description: "Markanızın ruhunu yansıtan, profesyonel ve modern görsel kimlik tasarımı.",
      features: ["Logo Tasarımı", "Marka Kitabı", "Kartvizit & Antetli Kağıt", "Renk Teorisi Deneyimi"],
    },
    {
      slug: "e-ticaret",
      title: "E-Ticaret Çözümleri",
      description: "Dönüşüm oranları optimize edilmiş, mobil uyumlu ve hızlı e-ticaret altyapıları.",
      features: ["Shopify & Custom Entegrasyon", "Ödeme Sistemleri", "Stok Yönetimi", "SEO Odaklı Kategori Yapısı"],
    },
    {
      slug: "seo-stratejisi",
      title: "SEO Stratejisi",
      description: "Arama motorlarında görünürlüğünüzü artıracak veri odaklı optimizasyon süreçleri.",
      features: ["Anahtar Kelime Analizi", "Teknik SEO", "İçerik Stratejisi", "Backlink Yönetimi"],
    },
    {
      slug: "sosyal-medya",
      title: "Sosyal Medya Yönetimi",
      description: "Markanızın dijital sesini güçlendiren, etkileşim odaklı içerik ve topluluk yönetimi.",
      features: ["İçerik Planlama", "Grafik Tasarım", "Reklam Yönetimi", "Moderasyon"],
    },
    {
      slug: "api-integrasyonlari",
      title: "API Entegrasyonları",
      description: "Sistemleriniz arasında kusursuz ve güvenli veri akışı sağlayan modern entegrasyon çözümleri.",
      features: ["3. Parti Servis Bağlantıları", "Custom API Geliştirme", "Veri Senkronizasyonu", "Webhook Yönetimi"],
    },
    {
      slug: "saas-gelistirme",
      title: "SaaS Geliştirme",
      description: "Fikrinizi ölçeklenebilir ve sürdürülebilir bir yazılım ürününe dönüştüren uçtan uca geliştirme süreçleri.",
      features: ["MVP Tasarımı", "Multi-tenant Mimari", "Ödeme Entegrasyonu", "Cloud Optimization"],
    }
  ],

  blog: {
    items: [
      {
        slug: "saas-ux-tasarimi",
        title: "SaaS Dünyasında UX Tasarımının Dönüşüm Oranlarına Etkisi",
        excerpt: "Neden bazı SaaS ürünleri milyonlarca kullanıcıya ulaşırken bazıları ilk ayda veda ediyor? Yanıt kullanıcı deneyiminde gizli.",
        content: `
            <p>SaaS (Software as a Service) modellerinde kullanıcıyı elde tutmak (retention) ve dönüşümü artırmak için uygulanan tasarım prensipleri, projenin geleceğini belirler. Kullanıcı deneyimi, sadece bir arayüz tasarımından ibaret değildir; kullanıcının problemine ne kadar hızlı ve zahmetsiz yanıt verdiğinizdir.</p>
            <br/>
            <h3 class="text-2xl font-bold">1. Onboarding Sürecinde Basitlik</h3>
            <p>Kullanıcıların ürünü ilk açtığı andaki deneyim, ürünü kullanmaya devam edip etmeyeceklerini belirleyen en kritik andır. Karmaşık formlar ve uzun eğitim videoları yerine, "interaktif adımlar" (guided tours) sunmak dönüşümü %40 oranında artırabilir.</p>
            <br/>
            <h3 class="text-2xl font-bold">2. Veri Görselleştirme</h3>
            <p>Karmaşık verileri anlamlı tablolara ve grafiklere dönüştürmek, kullanıcının değer algısını güçlendirir. Özellikle analitik araçlarında bu durum hayati önem taşır.</p>
        `,
        date: "25 Mart 2026",
        author: "Yaser Köse",
        category: "Tasarım",
        readTime: "6 dk okuma"
      },
      {
        slug: "nextjs-16-gelecek",
        title: "Next.js 16 ile Geleceğin Web Uygulamalarını İnşa Etmek",
        excerpt: "Modern web geliştirme süreçlerinde performans ve SEO dengesi nasıl kurulur? Next.js'in yeni özelliklerini inceliyoruz.",
        content: `
            <p>Web teknolojileri her geçen gün hızlanıyor. Takip etmesi güç olsa da, Next.js ekosistemi sunduğu yeniliklerle geliştiricilere muazzam bir esneklik sağlıyor. Özellikle Turbopack entegrasyonu ve gelişmiş RSC (React Server Components) desteği, Next.js 16 sürümünü bugüne kadarki en güçlü sürüm yapıyor.</p>
            <br/>
            <h3 class="text-2xl font-bold">Hız Her Şeydir</h3>
            <p>Kullanıcılar 3 saniyeden uzun süren açılışlardan hoşlanmıyor. Yeni nesil render stratejileri ile biz Macework olarak projelerimizde milisaniyeler seviyesinde ilk boyama sürelerini hedefliyoruz.</p>
        `,
        date: "18 Mart 2026",
        author: "Macework Tech Team",
        category: "Teknoloji",
        readTime: "8 dk okuma"
      }
    ]
  },

  works: {
    sectionTitle: "Seçkin İşlerimiz",
    items: [
      {
        id: "lux-estate",
        slug: "lux-estate",
        title: "Lux Estate Portal",
        category: "Tasarım",
        description: "Yapay zeka tabanlı gayrimenkul değerleme ve listeleme platformu.",
        longDescription: "Lüks gayrimenkul pazarı için geliştirilen bu portal, veri analitiği ve 3D tur entegrasyonu ile sektörde fark yaratan bir platformdur.",
        technologies: ["Next.js", "Python AI", "Three.js", "MongoDB"],
        year: "2025",
        gallery: [
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200",
            "https://images.unsplash.com/photo-1460317442991-0ec239f33649?q=80&w=1200",
            "https://images.unsplash.com/photo-1582408921715-18e7806365c1?q=80&w=1200"
        ]
      },
      {
        id: "global-logistics",
        slug: "global-logistics",
        title: "Global Lojistik Takip",
        category: "Yazılım",
        description: "Uluslararası konteyner takip ve rota optimizasyon sistemi.",
        longDescription: "Gerçek zamanlı lokasyon takibi ve maliyet optimizasyonu algoritmalarıyla donatılmış modern lojistik yönetim yazılımı.",
        technologies: ["React Native", "Go", "PostgreSQL", "Google Maps API"],
        year: "2024",
        gallery: [
            "https://images.unsplash.com/photo-1586528116311-ad86d7c7ce80?q=80&w=1200",
            "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?q=80&w=1200",
            "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200"
        ]
      },
      {
        id: "health-hub",
        slug: "health-hub",
        title: "HealthHub Pro",
        category: "Yazılım",
        description: "Özel klinikler için randevu ve hasta takip otomasyonu.",
        longDescription: "Doktor ve hastalar arasındaki iletişimi dijitalleştiren, online konsültasyon ve randevu takip modülleri içeren kapsamlı sağlık platformu.",
        technologies: ["React", "FastAPI", "Redis", "Supabase"],
        year: "2025"
      },
      {
        id: "eco-style",
        slug: "eco-style",
        title: "Eco Style Branding",
        category: "Branding",
        description: "Sürdürülebilir moda markası için kapsamlı marka kimliği çalışması.",
        longDescription: "Doğa dostu tekstil üreticisi için logo, kurumsal kimlik ve dijital varlık tasarımı.",
        technologies: ["Adobe CC", "Figma", "Branding Strategy"],
        year: "2024"
      },
      {
        id: "smart-marketing",
        slug: "smart-marketing",
        title: "Smart Marketing Ads",
        category: "Pazarlama",
        description: "E-ticaret siteleri için yeni nesil reklam yönetim ve optimizasyon paneli.",
        longDescription: "Reklam harcamalarını optimize eden ve yatırım getirisini artıran akıllı pazarlama aracı.",
        technologies: ["Node.js", "React", "Google Ads API"],
        year: "2025"
      }
    ]
  },

  reasons: {
    sectionTitle: "Neden Macework?",
    sectionDescription: "Biz sıradan bir ajans değiliz. İhtiyaçlarınızı, ürün vizyonuyla ele alan yaratıcı teknoloji partneriniziz.",
    items: [
      { title: "Ürün Odaklılık", description: "Problem çözen, son kullaniciya hazır SaaS mantığında projeler teslim ederiz.", iconName: "layers" },
      { title: "Ölçeklenebilir Mimari", description: "Büyüdükçe tıkanmayan, sağlam ve modern teknoloji yığınları kullanırız.", iconName: "server" },
      { title: "Hız ve Güven", description: "Taahhüt ettiğimiz kaliteyi, şeffaf süreçlerle zamanında canlıya alırız.", iconName: "zap" },
      { title: "Kreatif & Teknik Denge", description: "Hem mükemmel görünen hem de kusursuz çalışan hibrit yapılar inşa ederiz.", iconName: "palette" },
    ],
  },

  process: {
    sectionTitle: "Nasıl Çalışırız?",
    items: [
      { step: "01", title: "İhtiyaç Analizi", description: "Projeyi, hedeflerinizi ve vizyonunuzu en ince ayrıntısına kadar dinliyoruz." },
      { step: "02", title: "Çözüm Tasarımı", description: "Size özel mimariyi, kullanici deneyimini ve ürün rotasını çiziyoruz." },
      { step: "03", title: "Geliştirme", description: "Modern teknolojilerle güvenilir, hızlı ve ölçeklenebilir ürününüzü inşa ediyoruz." },
      { step: "04", title: "Yayına Alma & Büyütme", description: "Projenizi sorunsuz şekilde yayına alıyor ve büyüme yolculuğunda yanınızda oluyoruz." },
    ],
  },

  contact: {
    email: "iletisim@macework.com",
    phone: "+90 (212) 000 0000",
    address: "Ihsaniye Mah. Sultan Sok. No: 12\nBursa / Türkiye",
    social: [
      { label: "LinkedIn", href: "#", icon: "linkedin" },
      { label: "Twitter", href: "#", icon: "twitter" },
      { label: "Instagram", href: "#", icon: "instagram" },
    ]
  },

  footer: {
    description: "Macework Creative, yenilikçi dijital ürünler geliştiren ve kurumlar için yeni nesil teknoloji çözümleri üreten kreatif bir stüdyodur.",
    copyright: "© 2026 Macework Creative. Tüm hakları saklıdır."
  },
  
  about: {
    title: "Biz Kimiz?",
    subtitle: "Yaratıcılık ve teknolojinin kesişim noktasında, geleceği bugünden inşa ediyoruz.",
    description: "Macework Creative, 2020 yılında dijital dünyada fark yaratmak isteyen markalara yenilikçi çözümler sunmak amacıyla kuruldu. Sadece bir yazılım ajansı değil, aynı zamanda kendi SaaS ürünlerini geliştiren bir teknoloji stüdyosuyuz.",
    mission: "Misyonumuz, karmaşık teknolojik süreçleri sadeleştirerek markaların dijital potansiyellerini en üst düzeye çıkarmaktır.",
    vision: "Vizyonumuz, küresel ölçekte ses getiren dijital ürünler tasarlayan lider bir kreatif teknoloji stüdyosu olmaktır.",
    stats: [
      { label: "Tamamlanan Proje", value: "150+" },
      { label: "Mutlu Müşteri", value: "80+" },
      { label: "Geliştirilen Ürün", value: "5+" },
      { label: "Uzman Ekip", value: "12" }
    ],
    team: [
      { name: "Yaser Köse", role: "Founder & Creative Director", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yaser" },
      { name: "Alican Demir", role: "CTO / Lead Developer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alican" },
      { name: "Selin Yılmaz", role: "Senior UI/UX Designer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Selin" },
      { name: "Mert Aydın", role: "Backend Developer", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mert" }
    ]
  }
};
