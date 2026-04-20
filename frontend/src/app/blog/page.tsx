import { SubPageHeader } from "@/components/subpage-header";
import { fetchStrapi } from "@/lib/strapi";
import { BlogList } from "@/components/blog-list";

export const metadata = {
  title: "Blog & Haberler | Macework",
  description: "Teknoloji, tasarım ve dijital ürün dünyasından güncel içerikler, vaka analizleri ve ajans günlüğümüz."
};

export default async function BlogPage() {
  const [posts, categories, globalSettings] = await Promise.all([
    fetchStrapi<any[]>("blog-posts", { populate: ['blog_category', 'tags', 'cover_image'] }),
    fetchStrapi<any[]>("blog-categories", { populate: '*' }).catch(() => []),
    fetchStrapi<any>("global-setting", { populate: '*' }).catch(() => null)
  ]);

  return (
    <main className="min-h-screen">
      <SubPageHeader 
        badge="Blog & Haberler"
        title={globalSettings?.blog_page_title || "Dünyadan Haberler"}
        description={globalSettings?.blog_page_desc || "Teknoloji, tasarım ve dijital ürün dünyasından güncel içerikler, vaka analizleri ve ajans günlüğümüz."}
      />

      <section className="py-20 bg-background">
        <div className="container">
          <BlogList posts={posts} categories={categories} />

        </div>
      </section>
    </main>
  );
}
