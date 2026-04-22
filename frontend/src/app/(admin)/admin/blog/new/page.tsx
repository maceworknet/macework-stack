import { saveBlogPostAction } from "@/actions/admin/content";
import { AdminEditChrome } from "@/components/admin/admin-edit-chrome";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BlogForm } from "@/components/admin/content-forms";
import { getMediaFiles } from "@/lib/cms";

export default async function AdminNewBlogPostPage() {
  const mediaFiles = await getMediaFiles();

  return (
    <>
      <AdminEditChrome parentHref="/admin/blog" parentLabel="Blog" currentLabel="Yeni yazı" />
      <AdminPageHeader
        title="Yeni blog yazısı"
        description="Yazı başlığı, kapak görseli, zengin metin içeriği ve yayın ayarlarını hazırlayın."
      />
      <div className="rounded-lg border border-border bg-card p-5">
        <BlogForm action={saveBlogPostAction} submitLabel="Yazıyı kaydet" mediaFiles={mediaFiles} />
      </div>
    </>
  );
}
