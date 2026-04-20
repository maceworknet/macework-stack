import type { Core } from '@strapi/strapi';

const COLLECTION_TYPES = [
  'api::solution.solution',
  'api::project.project',
  'api::blog-post.blog-post',
  'api::blog-category.blog-category',
  'api::product.product',
  'api::team-member.team-member',
  'api::template.template',
  'api::template-category.template-category',
  'api::project-category.project-category',
  'api::tag.tag',
];

const SINGLE_TYPES = [
  'api::global-setting.global-setting',
  'api::home-page.home-page',
  'api::about-page.about-page',
  'api::contact-page.contact-page',
];

// Seed data updated to match new schema field names
const SOLUTIONS_SEED: any[] = [
  {
    title: 'Web Tasarım',
    slug: 'web-tasarim',
    badge_text: 'ÇÖZÜMLERİMİZ',
    short_description: 'Markanızı dijital dünyada en iyi şekilde temsil edecek, kullanıcı odaklı ve estetik web siteleri tasarlıyoruz.',
    icon: 'Monitor',
    solution_category: 'dijital',
    order: 1,
    cta_label: 'Web Tasarım Hakkında Bilgi Al',
    cta_url: '/iletisim',
    features: [
      { title: 'Mobil Uyumlu Tasarım', description: 'Tüm cihazlarda mükemmel görünen responsive tasarımlar.', icon: 'Smartphone' },
      { title: 'Hız Optimizasyonu', description: 'Core Web Vitals puanlarını maksimize eden hızlı yüklenen sayfalar.', icon: 'Zap' },
    ],
  },
  {
    title: 'Web Yazılım',
    slug: 'web-yazilim',
    badge_text: 'ÇÖZÜMLERİMİZ',
    short_description: 'İşletmenizin özel ihtiyaçlarına yönelik güçlü ve ölçeklenebilir web uygulamaları geliştiriyoruz.',
    icon: 'Code',
    solution_category: 'teknoloji',
    order: 5,
    cta_label: 'Web Yazılım Hakkında Bilgi Al',
    cta_url: '/iletisim',
    features: [
      { title: 'Full Stack Geliştirme', description: 'React, Next.js, Node.js ile modern web uygulamaları.', icon: 'Layers' },
    ],
  },
];

const PROJECTS_SEED: any[] = [
  {
    title: 'Lux Estate Portal',
    slug: 'lux-estate-portal',
    description: 'Lüks gayrimenkul sektörü için geliştirilen premium portföy ve müşteri yönetim portali.',
    client: 'Lux Estate',
    year: 2025,
    featured: true,
  },
];

const SINGLE_TYPE_DEFAULTS: Record<string, any> = {
  'api::global-setting.global-setting': {
    site_name: 'Macework Creative',
    footer_description: 'Ölçeklenebilir dijital altyapılar ve inovatif SaaS ürünleri geliştiren 360 derece teknoloji ajansı.',
    footer_email: 'iletisim@macework.com',
  },
  'api::home-page.home-page': {
    hero_badge: 'Yaratıcı Teknoloji Stüdyosu',
    hero_heading: 'Sadece hizmet değil, birlikte öne çıkan ürünler geliştiriyoruz.',
    hero_subheading: 'Macework Creative, ölçeklenebilir dijital altyapılar ve kendi inovatif SaaS ürünlerini tasarlayan bir ajanstır.',
    hero_cta_primary_label: 'Çözümleri İncele',
    hero_cta_primary_url: '/#cozumler',
    solutions_section_heading: 'Çözümlerimiz',
    products_section_heading: 'Kendi Ürünlerimiz',
    work_section_heading: 'Öne Çıkan Projeler',
  },
};

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await setPublicPermissions(strapi);
      await seedSingleTypes(strapi);
      await seedCollections(strapi);
      strapi.log.info('[Bootstrap] ✅ Başlatma başarıyla tamamlandı.');
    } catch (err) {
      strapi.log.error('[Bootstrap] ❌ Başlatma hatası:', err);
    }
  },
};

async function setPublicPermissions(strapi: Core.Strapi) {
  try {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    for (const uid of COLLECTION_TYPES) {
      const actions = ['find', 'findOne'];
      for (const action of actions) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action: `${uid}.${action}`, role: publicRole.id }
        }).catch(() => {}); // Catch if already exists
      }
    }
  } catch (err) {}
}

async function seedSingleTypes(strapi: Core.Strapi) {
  for (const uid of SINGLE_TYPES) {
    try {
      const existing = await (strapi.documents as any)(uid).findFirst({});
      if (!existing) {
        await (strapi.documents as any)(uid).create({ data: SINGLE_TYPE_DEFAULTS[uid] || {} });
      }
    } catch (err) {}
  }
}

async function seedCollections(strapi: Core.Strapi) {
  try {
    const solutionCount = await strapi.documents('api::solution.solution').count({});
    if (solutionCount === 0) {
      for (const item of SOLUTIONS_SEED) {
        await strapi.documents('api::solution.solution').create({ data: item, status: 'published' });
      }
    }

    const projectCount = await strapi.documents('api::project.project').count({});
    if (projectCount === 0) {
      for (const item of PROJECTS_SEED) {
        await strapi.documents('api::project.project').create({ data: item, status: 'published' });
      }
    }
  } catch (err) {}
}
