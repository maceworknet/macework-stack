import { prisma, withDatabase } from "@/lib/prisma";
import { siteContent } from "@/content/site-content";
import type { LeadInput } from "@/lib/validations/lead";
export { resolveMediaUrl } from "@/lib/media";

type AnyRecord = Record<string, any>;
type ContentQueryOptions = {
  includeDrafts?: boolean;
};

function asArray(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function media(url?: string | null) {
  return url ? { url } : undefined;
}

function mediaList(value: unknown) {
  return asArray(value)
    .map((item) => {
      if (typeof item === "string") return { url: item };
      if (item && typeof item === "object" && "url" in item) return item;
      return null;
    })
    .filter(Boolean);
}

function uniqueCategoryObjects(names: Array<string | null | undefined>) {
  return Array.from(new Set(names.filter(Boolean))).map((name, index) => ({
    id: name,
    documentId: name,
    name,
    order: index,
  }));
}

function publishedFilter(includeDrafts?: boolean) {
  return includeDrafts ? {} : { published: true };
}

const menuIcons = new Map(
  siteContent.solutionsMegaMenu.columns
    .flatMap((column) => column.items)
    .map((item) => [item.slug, item.iconName])
);

const lucideNameMap: Record<string, string> = {
  layout: "Layout",
  brush: "Brush",
  "line-chart": "LineChart",
  "share-2": "Share2",
  code: "Code",
  "shopping-bag": "ShoppingBag",
  network: "Network",
  box: "Box",
  smartphone: "Smartphone",
  calculator: "Calculator",
  brain: "Brain",
  link: "Link",
};

function toLucideName(icon?: string | null) {
  if (!icon) return "Code";
  return lucideNameMap[icon] ?? icon;
}

const fallbackProcessSteps = siteContent.process.items.map((step) => ({
  step_number: step.step,
  title: step.title,
  description: step.description,
}));

const fallbackHomePage = {
  hero_badge: siteContent.hero.badge,
  hero_heading: siteContent.hero.title,
  hero_subheading: siteContent.hero.description,
  hero_cta_primary_label: siteContent.hero.primaryCta.label,
  hero_cta_primary_url: siteContent.hero.primaryCta.href,
  hero_cta_secondary_label: siteContent.hero.secondaryCta.label,
  hero_cta_secondary_url: siteContent.hero.secondaryCta.href,
  trusted_brands_heading: "REFERANSLARIMIZ & URUNLERIMIZ",
  products_section_heading: siteContent.products.sectionTitle,
  products_section_description: siteContent.products.sectionDescription,
  featured_product_slugs: [],
  solutions_section_heading: "Kapsamlı Dijital Çözümler",
  solutions_section_description:
    "İşletmenizin dijital dönüşüm yolculuğunda her adımda yanınızdayız. Stratejiden tasarıma, yazılımdan büyümeye kadar tam hizmet.",
  featured_solution_slugs: [],
  work_section_heading: siteContent.works.sectionTitle,
  work_section_description:
    "Dijitalde iz bırakan, problem çözen ve binlerce kullanıcıya ulaşan projelerimizden bazıları.",
  work_section_button_label: "Tüm Projeleri Gör",
  work_section_button_url: "/islerimiz",
  featured_project_slugs: [],
  process_section_heading: siteContent.process.sectionTitle,
  why_macework_heading: siteContent.reasons.sectionTitle,
  why_macework_description: siteContent.reasons.sectionDescription,
  why_macework_features: siteContent.reasons.items.map((item) => ({
    title: item.title,
    description: item.description,
    icon: item.iconName,
  })),
  why_macework_visual_mode: "card",
  why_macework_card_title: "Next-Gen Delivery",
  why_macework_card_subtitle: "Standardized Quality",
  why_macework_card_items: [
    { label: "Strateji", value: "Hazir" },
    { label: "Tasarim", value: "Devam" },
    { label: "Gelistirme", value: "Aktif" },
  ],
  why_macework_image: null,
  process_steps: fallbackProcessSteps,
  lead_section_heading: "Yeni Bir Projeye Başlayalım",
  lead_section_description:
    "Fikrinizi ürüne dönüştürmek veya markanızı dijitalde büyütmek için ilk adımı atın.",
  lead_button_label: "Teklif Al",
  trusted_brands_logos: [],
};

const fallbackGlobalSettings = {
  site_name: "Macework",
  seo_default_title: "Macework Creativ - Yaratıcı Teknoloji ve Ürün Stüdyosu",
  seo_default_description:
    "Macework Creativ, yenilikçi SaaS ürünleri, ölçeklenebilir dijital çözümler ve modern teknoloji altyapıları geliştiren kreatif stüdyodur.",
  footer_description: siteContent.footer.description,
  footer_email: siteContent.contact.email,
  footer_phone: siteContent.contact.phone,
  blog_page_title: "Dünyadan Haberler",
  blog_page_desc:
    "Teknoloji, tasarım ve dijital ürün dünyasından güncel içerikler, vaka analizleri ve ajans günlüğümüz.",
  projects_page_title: "Neler Yaptık?",
  projects_page_desc: siteContent.works.sectionTitle,
  templates_page_title: "Hazır Şablonlarımızı Keşfedin",
  templates_page_desc:
    "İşletmeniz için özelleştirilebilir, modern ve yüksek performanslı hazır web altyapıları.",
};

const fallbackContactPage = {
  eyebrow: "Iletisim",
  heading: "Bize Ulaşın",
  subheading:
    "Fikrinizi ürüne dönüştürmek veya markanızı dijitalde büyütmek için ilk adımı atın.",
  info_heading: "İletişim Bilgileri",
  info_description:
    "Markanızı dijitalde parlatmak ve yenilikçi teknoloji çözümlerimizle tanışmak için ekibimizle doğrudan iletişime geçin.",
  phone_label: "Telefon",
  email: siteContent.contact.email,
  email_label: "E-posta",
  phone: siteContent.contact.phone,
  address_label: "Adres",
  address: siteContent.contact.address,
  whatsapp_number: "905000000000",
  whatsapp_intro: "Hızlı cevap için",
  whatsapp_text: "WhatsApp'tan ulaşın.",
  form_heading: "Yeni Bir Projeye Başlayalım",
  form_subheading:
    "Fikrinizi ürüne dönüştürmek veya markanızı dijitalde büyütmek için ilk adımı atın.",
  form_placeholder_name: "Ad Soyad",
  form_placeholder_company: "Firma adı",
  form_placeholder_email: "iletisim@macework.com",
  form_placeholder_message: "Projenizden veya talebinizden bahsedin...",
  form_button_text: "Teklif Al",
  trusted_brands_heading: "GÜVENEN MARKALAR & PROJELERİMİZ",
};

const fallbackProjectsPage = {
  eyebrow: "İşlerimiz",
  heading: "Neler Yaptık?",
  description:
    "Dijitalde iz bırakan, problem çözen ve binlerce kullanıcıya ulaşan projelerimizden bazıları.",
  cta_heading: "Sizin Projeniz de Burada Olmalı mı?",
  cta_description:
    "Markanız için en doğru teknoloji stratejisini belirleyelim ve birlikte dijitalin kurallarını yeniden yazalım.",
  cta_button_label: "Proje Başlat",
  cta_button_url: "/iletisim",
};

const fallbackBlogPage = {
  eyebrow: "Blog & Haberler",
  heading: "Dunyadan Haberler",
  description:
    "Teknoloji, tasarım ve dijital ürün dünyasından güncel içerikler, vaka analizleri ve ajans günlüğümüz.",
};

const fallbackTemplatesPage = {
  eyebrow: "Şablon Kütüphanesi",
  heading: "Hazır Şablonlarımızı Keşfedin",
  description:
    "İşletmeniz için özelleştirilebilir, modern ve yüksek performanslı hazır web altyapıları.",
  cta_heading: "Size Özel Bir Şablona mı İhtiyacınız Var?",
  cta_description:
    "Şablonlarımızı projenize özel olarak özelleştirebilir veya sıfırdan markanıza uygun bir yapı inşa edebiliriz.",
  cta_button_label: "Bizimle İletişime Geçin",
  cta_button_url: "/iletisim",
};

const fallbackHeaderSettings = {
  logo_text: "Macework",
  navigation: siteContent.header.navigation.map((item, index) => ({
    label: item.label,
    href: item.href,
    target: "_self",
    type: item.label === "Çözümler" ? "mega" : "link",
    published: true,
    sortOrder: index,
  })),
  cta_label: siteContent.header.cta.label,
  cta_href: siteContent.header.cta.href,
  mega_menu_label: "Çözümler",
  mega_menu_columns: siteContent.solutionsMegaMenu.columns.map((column) => ({
    title: column.title,
    items: column.items.map((item, index) => ({
      title: item.title,
      description: item.description,
      icon: item.iconName,
      href: item.href,
      published: true,
      sortOrder: index,
    })),
  })),
};

const fallbackFooterSettings = {
  logo_text: "Macework",
  description: siteContent.footer.description,
  quick_links_heading: "Hızlı Linkler",
  quick_links: siteContent.header.navigation.map((item, index) => ({
    label: item.label,
    href: item.href,
    target: "_self",
    published: true,
    sortOrder: index,
  })),
  contact_heading: "İletişim",
  email: siteContent.contact.email,
  phone: siteContent.contact.phone,
  address: siteContent.contact.address,
  social_links: siteContent.contact.social.map((item, index) => ({
    platform: item.label,
    url: item.href,
    icon: item.icon,
    published: true,
    sortOrder: index,
  })),
  legal_links: [
    { label: "Gizlilik Politikası", href: "/gizlilik-politikasi", sortOrder: 0, published: true },
    { label: "Kullanım Koşulları", href: "/kullanim-kosullari", sortOrder: 1, published: true },
  ],
  copyright: siteContent.footer.copyright,
};

const fallbackAboutPage = {
  eyebrow: "Hakkimizda",
  heading: "Biz Kimiz?",
  about_description: siteContent.about.subtitle,
  story_heading: "Biz Kimiz",
  story: null,
  mission_heading: "Misyonumuz",
  mission: siteContent.about.mission,
  vision_heading: "Vizyonumuz",
  vision: siteContent.about.vision,
  stats: siteContent.about.stats,
  about_visual_mode: "card",
  about_image: null,
  team_heading: "Uzman Kadromuz",
  team_description: "Modern teknolojileri kullanan, yaratici ve enerjik ekibimizle tanisin.",
  cta_heading: "Birlikte Deger Yaratalim",
  cta_description: "Vizyonunuzu teknik mükemmeliyetle buluşturmak için buradayız.",
  cta_button_label: "Hemen Başlayalım",
  cta_button_url: "/iletisim",
};

const fallbackProducts: AnyRecord[] = siteContent.products.items.map((product, index) => ({
  ...product,
  id: product.id,
  documentId: product.id,
  badge: product.badge,
  tag: product.category,
  short_description: product.description,
  long_description: product.longDescription,
  platform_url: product.href,
  platform_type: "SaaS",
  version: "1.0.0",
  sortOrder: index,
  features: product.features,
}));

const fallbackSolutions: AnyRecord[] = siteContent.solutionsDetail.map((solution, index) => ({
  ...solution,
  id: solution.slug,
  documentId: solution.slug,
  badge_text: "Çözümlerimiz",
  short_description: solution.description,
  icon: toLucideName(menuIcons.get(solution.slug)),
  features: solution.features.map((title) => ({ title })),
  process_steps: fallbackProcessSteps,
  sortOrder: index,
}));

const fallbackProjects: AnyRecord[] = siteContent.works.items.map((project, index) => ({
  ...project,
  id: project.id,
  documentId: project.id,
  tags: project.technologies ?? [],
  project_category: { name: project.category ?? "Genel" },
  cover_image: media(project.gallery?.[0]),
  gallery: (project.gallery ?? []).map((url) => ({ url })),
  featured: index < 3,
  sortOrder: index,
}));

const fallbackBlogPosts: AnyRecord[] = siteContent.blog.items.map((post, index) => ({
  ...post,
  id: post.slug,
  documentId: post.slug,
  summary: post.excerpt,
  cover_image: media("https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000"),
  blog_category: { name: post.category },
  read_time: Number.parseInt(post.readTime, 10) || 5,
  publishedAt: new Date(2026, 2, 18 + index).toISOString(),
}));

const fallbackTemplates: AnyRecord[] = siteContent.templates.items.map((template, index) => ({
  ...template,
  id: template.id,
  documentId: template.id,
  slug: template.id,
  preview_image: media(template.image),
  cover_image: media(template.image),
  template_category: { name: template.category },
  demo_url: template.href,
  features: ["Yüksek Performans", "Mobil Uyumlu", "SEO Odaklı"],
  sortOrder: index,
}));

function settingObject(value: unknown, fallback: AnyRecord) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as AnyRecord;
  }
  return fallback;
}

function mapProduct(product: AnyRecord) {
  return {
    ...product,
    documentId: product.id,
    short_description: product.shortDescription ?? product.description,
    long_description: product.longDescription,
    platform_url: product.platformUrl,
    platform_type: product.platformType,
    cover_image: media(product.coverImage),
    features: asArray(product.features),
    content_blocks: product.contentBlocks,
    tag: product.tag ?? product.category,
  };
}

function mapSolution(solution: AnyRecord) {
  return {
    ...solution,
    documentId: solution.id,
    badge_text: solution.badgeText,
    short_description: solution.shortDescription ?? solution.description,
    cover_image: media(solution.coverImage),
    features: asArray(solution.features),
    process_steps: asArray(solution.processSteps),
  };
}

function mapProject(project: AnyRecord) {
  return {
    ...project,
    documentId: project.id,
    live_url: project.liveUrl,
    cta_button_label: project.ctaButtonLabel,
    cta_button_url: project.ctaButtonUrl,
    cover_image: media(project.coverImage),
    gallery: mediaList(project.gallery),
    tags: asArray(project.tags),
    project_category: { name: project.category ?? "Genel" },
  };
}

function mapBlogPost(post: AnyRecord) {
  return {
    ...post,
    documentId: post.id,
    cover_image: media(post.coverImage),
    blog_category: { name: post.category ?? "Haber" },
    tags: asArray(post.tags).map((tag) =>
      typeof tag === "string" ? { id: tag, name: tag } : tag
    ),
    read_time: post.readTime,
    publishedAt: post.publishedAt?.toISOString?.() ?? post.publishedAt,
  };
}

function mapTemplate(template: AnyRecord) {
  return {
    ...template,
    documentId: template.id,
    preview_image: media(template.previewImage),
    cover_image: media(template.coverImage),
    template_category: { name: template.category ?? "Sablon" },
    demo_url: template.demoUrl,
    features: asArray(template.features),
  };
}

export async function getGlobalSettings(): Promise<AnyRecord> {
  return withDatabase(async () => {
    const settings = await prisma.siteSetting.findUnique({ where: { key: "global" } });
    return settingObject(settings?.value, fallbackGlobalSettings);
  }, fallbackGlobalSettings);
}

export async function getHomePage(): Promise<AnyRecord> {
  return withDatabase(async () => {
    const settings = await prisma.siteSetting.findUnique({ where: { key: "home" } });
    return { ...fallbackHomePage, ...settingObject(settings?.value, {}) };
  }, fallbackHomePage);
}

export async function getContactPage(): Promise<AnyRecord> {
  return withDatabase(async () => {
    const settings = await prisma.siteSetting.findUnique({ where: { key: "contact" } });
    return { ...fallbackContactPage, ...settingObject(settings?.value, {}) };
  }, fallbackContactPage);
}

export async function getProjectsPageSettings(): Promise<AnyRecord> {
  return withDatabase(async () => {
    const [settings, globalSettings] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: "projects_page" } }),
      prisma.siteSetting.findUnique({ where: { key: "global" } }),
    ]);
    const legacy = settingObject(globalSettings?.value, {});
    const fallback = {
      ...fallbackProjectsPage,
      heading: legacy.projects_page_title ?? fallbackProjectsPage.heading,
      description: legacy.projects_page_desc ?? fallbackProjectsPage.description,
    };

    return { ...fallback, ...settingObject(settings?.value, {}) };
  }, fallbackProjectsPage);
}

export async function getBlogPageSettings(): Promise<AnyRecord> {
  return withDatabase(async () => {
    const [settings, globalSettings] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: "blog_page" } }),
      prisma.siteSetting.findUnique({ where: { key: "global" } }),
    ]);
    const legacy = settingObject(globalSettings?.value, {});
    const fallback = {
      ...fallbackBlogPage,
      heading: legacy.blog_page_title ?? fallbackBlogPage.heading,
      description: legacy.blog_page_desc ?? fallbackBlogPage.description,
    };

    return { ...fallback, ...settingObject(settings?.value, {}) };
  }, fallbackBlogPage);
}

export async function getTemplatesPageSettings(): Promise<AnyRecord> {
  return withDatabase(async () => {
    const [settings, globalSettings] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: "templates_page" } }),
      prisma.siteSetting.findUnique({ where: { key: "global" } }),
    ]);
    const legacy = settingObject(globalSettings?.value, {});
    const fallback = {
      ...fallbackTemplatesPage,
      heading: legacy.templates_page_title ?? fallbackTemplatesPage.heading,
      description: legacy.templates_page_desc ?? fallbackTemplatesPage.description,
    };

    return { ...fallback, ...settingObject(settings?.value, {}) };
  }, fallbackTemplatesPage);
}

export async function getHeaderSettings(): Promise<AnyRecord> {
  return withDatabase(async () => {
    const settings = await prisma.siteSetting.findUnique({ where: { key: "header" } });
    return { ...fallbackHeaderSettings, ...settingObject(settings?.value, {}) };
  }, fallbackHeaderSettings);
}

export async function getFooterSettings(): Promise<AnyRecord> {
  return withDatabase(async () => {
    const settings = await prisma.siteSetting.findUnique({ where: { key: "footer" } });
    return { ...fallbackFooterSettings, ...settingObject(settings?.value, {}) };
  }, fallbackFooterSettings);
}

export async function getAboutPage(): Promise<AnyRecord> {
  return withDatabase(async () => {
    const settings = await prisma.siteSetting.findUnique({ where: { key: "about" } });
    return { ...fallbackAboutPage, ...settingObject(settings?.value, {}) };
  }, fallbackAboutPage);
}

export async function getTeamMembers(options: ContentQueryOptions = {}): Promise<AnyRecord[]> {
  return withDatabase(async () => {
    const team = await prisma.teamMember.findMany({
      where: publishedFilter(options.includeDrafts),
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return team.length ? team : options.includeDrafts ? [] : siteContent.about.team;
  }, siteContent.about.team as AnyRecord[]);
}

export async function getProducts(options: ContentQueryOptions = {}): Promise<AnyRecord[]> {
  return withDatabase(async () => {
    const products = await prisma.product.findMany({
      where: publishedFilter(options.includeDrafts),
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return products.length ? products.map(mapProduct) : fallbackProducts;
  }, fallbackProducts);
}

export async function getProductBySlug(slug: string): Promise<AnyRecord | null> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getSolutions(options: ContentQueryOptions = {}): Promise<AnyRecord[]> {
  return withDatabase(async () => {
    const solutions = await prisma.solution.findMany({
      where: publishedFilter(options.includeDrafts),
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return solutions.length ? solutions.map(mapSolution) : fallbackSolutions;
  }, fallbackSolutions);
}

export async function getSolutionBySlug(slug: string): Promise<AnyRecord | null> {
  const solutions = await getSolutions();
  return solutions.find((solution) => solution.slug === slug) ?? null;
}

export async function getProjects(options: ContentQueryOptions = {}): Promise<AnyRecord[]> {
  return withDatabase(async () => {
    const projects = await prisma.project.findMany({
      where: publishedFilter(options.includeDrafts),
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return projects.length ? projects.map(mapProject) : fallbackProjects;
  }, fallbackProjects);
}

export async function getFeaturedProjects(): Promise<AnyRecord[]> {
  const projects = await getProjects();
  const featured = projects.filter((project) => project.featured).slice(0, 3);
  return featured.length ? featured : projects.slice(0, 3);
}

export async function getProjectBySlug(slug: string): Promise<AnyRecord | null> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getProjectCategories(): Promise<AnyRecord[]> {
  const projects = await getProjects();
  return uniqueCategoryObjects(projects.map((project) => project.project_category?.name));
}

export async function getBlogPosts(options: ContentQueryOptions = {}): Promise<AnyRecord[]> {
  return withDatabase(async () => {
    const posts = await prisma.blogPost.findMany({
      where: publishedFilter(options.includeDrafts),
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return posts.length ? posts.map(mapBlogPost) : fallbackBlogPosts;
  }, fallbackBlogPosts);
}

export async function getBlogPostBySlug(slug: string): Promise<AnyRecord | null> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getBlogCategories(): Promise<AnyRecord[]> {
  const posts = await getBlogPosts();
  return uniqueCategoryObjects(posts.map((post) => post.blog_category?.name ?? post.category));
}

export async function getTemplates(options: ContentQueryOptions = {}): Promise<AnyRecord[]> {
  return withDatabase(async () => {
    const templates = await prisma.template.findMany({
      where: publishedFilter(options.includeDrafts),
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return templates.length ? templates.map(mapTemplate) : fallbackTemplates;
  }, fallbackTemplates);
}

export async function getTemplateBySlug(slug: string): Promise<AnyRecord | null> {
  const templates = await getTemplates();
  return templates.find((template) => template.slug === slug || template.id === slug) ?? null;
}

export async function getTemplateCategories(): Promise<AnyRecord[]> {
  const templates = await getTemplates();
  return uniqueCategoryObjects(templates.map((template) => template.template_category?.name));
}

export async function createLead(input: LeadInput) {
  return withDatabase(
    () =>
      prisma.lead.create({
        data: {
          name: input.name,
          company: input.company || null,
          email: input.email,
          interest: input.interest || null,
          message: input.message,
          source: input.source || "site",
        },
      }),
    null
  );
}

export async function getLeads() {
  return withDatabase(
    () =>
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    []
  );
}

export async function getMediaFiles() {
  return withDatabase(
    () =>
      prisma.mediaFile.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    []
  );
}

export async function getAdminDashboardStats() {
  return withDatabase(async () => {
    const [products, solutions, projects, templates, posts, leads, media] = await Promise.all([
      prisma.product.count(),
      prisma.solution.count(),
      prisma.project.count(),
      prisma.template.count(),
      prisma.blogPost.count(),
      prisma.lead.count(),
      prisma.mediaFile.count(),
    ]);

    return { products, solutions, projects, templates, posts, leads, media };
  }, {
    products: fallbackProducts.length,
    solutions: fallbackSolutions.length,
    projects: fallbackProjects.length,
    templates: fallbackTemplates.length,
    posts: fallbackBlogPosts.length,
    leads: 0,
    media: 0,
  });
}
