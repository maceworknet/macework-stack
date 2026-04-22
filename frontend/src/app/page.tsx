import { Hero } from "@/components/hero";
import { ProductsSection } from "@/components/products-section";
import { SolutionsSection } from "@/components/solutions-section";
import { WorkSection } from "@/components/work-section";
import { WhyMaceworkSection } from "@/components/why-macework-section";
import { ProcessSection } from "@/components/process-section";
import { LeadForm } from "@/components/lead-form";
import {
  getContactPage,
  getHomePage,
  getProjects,
  getProducts,
  getSolutions,
} from "@/lib/cms";

export const dynamic = "force-dynamic";

function selectedSlugs(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : [];
}

function pickBySlugs<T extends { slug?: string | null }>(items: T[], value: unknown) {
  const slugs = selectedSlugs(value);
  if (!slugs.length) return items;

  const bySlug = new Map(items.map((item) => [item.slug, item]));
  const picked = slugs.map((slug) => bySlug.get(slug)).filter(Boolean) as T[];

  return picked.length ? picked : items;
}

function pickFeaturedProjects(projects: any[], value: unknown) {
  const selected = pickBySlugs(projects, value);
  if (selected !== projects) return selected;

  const featured = projects.filter((project) => project.featured).slice(0, 3);
  return featured.length ? featured : projects.slice(0, 3);
}

export default async function Home() {
  const [homePage, solutions, products, projects, contactPage] = await Promise.all([
    getHomePage(),
    getSolutions(),
    getProducts(),
    getProjects(),
    getContactPage()
  ]);
  const visibleProducts = pickBySlugs(products, homePage?.featured_product_slugs);
  const visibleSolutions = pickBySlugs(solutions, homePage?.featured_solution_slugs);
  const visibleProjects = pickFeaturedProjects(projects, homePage?.featured_project_slugs);
  const leadSettings = {
    ...contactPage,
    form_heading: homePage?.lead_section_heading ?? contactPage?.form_heading,
    form_subheading: homePage?.lead_section_description ?? contactPage?.form_subheading,
    form_button_text: homePage?.lead_button_label ?? contactPage?.form_button_text,
  };

  return (
    <>
      <Hero data={homePage} />
      <ProductsSection
        products={visibleProducts}
        heading={homePage?.products_section_heading}
        description={homePage?.products_section_description}
      />
      <SolutionsSection
        solutions={visibleSolutions}
        heading={homePage?.solutions_section_heading}
        description={homePage?.solutions_section_description}
      />
      <WorkSection
        works={visibleProjects}
        heading={homePage?.work_section_heading}
        description={homePage?.work_section_description}
        buttonLabel={homePage?.work_section_button_label}
        buttonUrl={homePage?.work_section_button_url}
      />
      <WhyMaceworkSection data={homePage} />
      <ProcessSection steps={homePage?.process_steps || []} heading={homePage?.process_section_heading} />
      <LeadForm contactSettings={leadSettings} />
    </>
  );
}
