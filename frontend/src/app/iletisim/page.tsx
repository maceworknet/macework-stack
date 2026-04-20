import { fetchStrapi, getStrapiMedia } from '@/lib/strapi';
import ContactClient from './contact-client';

export const metadata = {
  title: 'İletişim | Macework',
  description: 'Fikrinizi ürüne dönüştürmek veya markanızı dijitalde büyütmek için ilk adımı atın.'
};

export default async function ContactPage() {
  const [contactPage, homePage] = await Promise.all([
    fetchStrapi("contact-page", { populate: '*' }).catch(() => null),
    fetchStrapi("home-page", { populate: 'trusted_brands_logos' }).catch(() => null)
  ]);
  
  return <ContactClient strapiSettings={{ ...contactPage, ...homePage }} />;
}
