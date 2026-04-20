import { Hero } from "@/components/hero";
import { ProductsSection } from "@/components/products-section";
import { SolutionsSection } from "@/components/solutions-section";
import { WorkSection } from "@/components/work-section";
import { WhyMaceworkSection } from "@/components/why-macework-section";
import { ProcessSection } from "@/components/process-section";
import { LeadForm } from "@/components/lead-form";
import { fetchStrapi } from "@/lib/strapi";

export default async function Home() {
  const [homePage, solutions, products, projects, contactPage] = await Promise.all([
    fetchStrapi("home-page", {
      populate: {
        hero_badge: true,
        hero_heading: true,
        trusted_brands_logos: true,
        featured_projects: { populate: '*' },
        why_macework_features: true,
        why_macework_image: true,
        process_steps: true,
      }
    }),
    fetchStrapi("solutions", { populate: '*' }),
    fetchStrapi("products", { populate: '*' }),
    fetchStrapi("projects", { populate: 'cover_image' }),
    fetchStrapi("contact-page", { populate: '*' })
  ]);

  const worksData = homePage?.featured_projects?.length > 0 ? homePage.featured_projects : projects.slice(0, 3);

  return (
    <>
      <Hero data={homePage} />
      <ProductsSection products={products} heading={homePage?.products_section_heading} />
      <SolutionsSection solutions={solutions} heading={homePage?.solutions_section_heading} />
      <WorkSection works={worksData} heading={homePage?.work_section_heading} />
      <WhyMaceworkSection data={homePage} />
      <ProcessSection steps={homePage?.process_steps || []} heading={homePage?.process_section_heading} />
      <LeadForm contactSettings={contactPage} />
    </>
  );
}
