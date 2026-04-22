import { SubPageHeader } from "@/components/subpage-header";
import { BlogList } from "@/components/blog-list";
import { getBlogCategories, getBlogPageSettings, getBlogPosts } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog & Haberler | Macework",
  description: "Teknoloji, tasarım ve dijital ürün dünyasından güncel içerikler, vaka analizleri ve ajans günlüğümüz."
};

export default async function BlogPage() {
  const [posts, categories, pageSettings] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
    getBlogPageSettings()
  ]);

  return (
    <main className="min-h-screen">
      <SubPageHeader 
        badge={pageSettings?.eyebrow || "Blog & Haberler"}
        title={pageSettings?.heading || "Dünyadan Haberler"}
        description={pageSettings?.description || "Teknoloji, tasarım ve dijital ürün dünyasından güncel içerikler, vaka analizleri ve ajans günlüğümüz."}
      />

      <section className="py-20 bg-background">
        <div className="container">
          <BlogList posts={posts} categories={categories} />

        </div>
      </section>
    </main>
  );
}
