import { notFound } from "next/navigation";
import { deleteBlogPostAction, saveBlogPostAction } from "@/actions/admin/content";
import { AdminEditChrome } from "@/components/admin/admin-edit-chrome";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BlogForm } from "@/components/admin/content-forms";
import { getBlogPosts, getMediaFiles } from "@/lib/cms";

export default async function AdminEditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const [posts, mediaFiles] = await Promise.all([
    getBlogPosts({ includeDrafts: true }),
    getMediaFiles(),
  ]);
  const post = posts.find(
    (item: any) =>
      String(item.id) === decodedId ||
      String(item.documentId) === decodedId ||
      String(item.slug) === decodedId
  );

  if (!post) return notFound();

  return (
    <>
      <AdminEditChrome parentHref="/admin/blog" parentLabel="Blog" currentLabel={post.title} />
      <AdminPageHeader
        title={post.title}
        description="Blog içeriğini, kapak görselini, yayın durumunu ve SEO alanlarını düzenleyin."
      />
      <div className="rounded-lg border border-border bg-card p-5">
        <BlogForm
          post={post}
          action={saveBlogPostAction}
          submitLabel="Güncelle"
          mediaFiles={mediaFiles}
          deleteAction={deleteBlogPostAction}
        />
      </div>
    </>
  );
}
