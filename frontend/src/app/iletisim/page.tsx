import { getContactPage, getHomePage } from '@/lib/cms';
import ContactClient from './contact-client';

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'İletişim | Macework',
  description: 'Fikrinizi ürüne dönüştürmek veya markanızı dijitalde büyütmek için ilk adımı atın.'
};

export default async function ContactPage() {
  const [contactPage, homePage] = await Promise.all([
    getContactPage(),
    getHomePage()
  ]);
  
  return (
    <ContactClient
      settings={{
        ...contactPage,
        trusted_brands_logos: homePage.trusted_brands_logos,
      }}
    />
  );
}
