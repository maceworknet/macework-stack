import { fetchStrapi, getStrapiMedia } from '@/lib/strapi';
import TemplatesClient from './templates-client';

export const metadata = {
  title: 'Şablon Kütüphanesi | Macework',
  description: 'İşletmeniz için özelleştirilebilir, modern ve yüksek performanslı hazır web altyapıları.'
};

export default async function TemplatesPage() {
  const [templates, categories, globalSettings] = await Promise.all([
    fetchStrapi<any[]>("templates", { populate: '*' }).catch(() => []),
    fetchStrapi<any[]>("template-categories", { populate: '*' }).catch(() => []),
    fetchStrapi<any>("global-setting", { populate: '*' }).catch(() => null)
  ]);
  
  return <TemplatesClient strapiTemplates={templates} categories={categories} globalSettings={globalSettings} />;
}
