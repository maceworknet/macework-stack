import { fetchStrapi } from '@/lib/strapi';
import AboutClient from './about-client';

export const metadata = {
  title: 'Hakkımızda | Macework',
  description: 'Yenilikçi Teknoloji ve Tasarım Tutkusu.'
};

export default async function AboutPage() {
  const data = await fetchStrapi<any>('about-page', { 
    populate: {
      stats: '*',
      about_image: '*',
      story: '*',
      seo: '*'
    }
  }).catch(() => null);
  const team = await fetchStrapi<any[]>('team-members', { populate: '*' }).catch(() => []);
  
  return <AboutClient strapiData={data} strapiTeam={team} />;
}
