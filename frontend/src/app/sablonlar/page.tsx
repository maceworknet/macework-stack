import { getTemplateCategories, getTemplates, getTemplatesPageSettings } from '@/lib/cms';
import TemplatesClient from './templates-client';

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Şablon Kütüphanesi | Macework',
  description: 'İşletmeniz için özelleştirilebilir, modern ve yüksek performanslı hazır web altyapıları.'
};

export default async function TemplatesPage() {
  const [templates, categories, pageSettings] = await Promise.all([
    getTemplates(),
    getTemplateCategories(),
    getTemplatesPageSettings()
  ]);
  
  return <TemplatesClient templates={templates} categories={categories} globalSettings={pageSettings} />;
}
