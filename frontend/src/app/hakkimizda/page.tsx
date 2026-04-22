import { getAboutPage, getTeamMembers } from '@/lib/cms';
import AboutClient from './about-client';

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Hakkımızda | Macework',
  description: 'Yenilikçi Teknoloji ve Tasarım Tutkusu.'
};

export default async function AboutPage() {
  const [data, team] = await Promise.all([
    getAboutPage(),
    getTeamMembers()
  ]);
  
  return <AboutClient data={data} team={team} />;
}
