import { notFound } from "next/navigation";
import { deleteTemplateAction, saveTemplateAction } from "@/actions/admin/content";
import { AdminEditChrome } from "@/components/admin/admin-edit-chrome";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TemplateForm } from "@/components/admin/content-forms";
import { getMediaFiles, getTemplates } from "@/lib/cms";

export default async function AdminEditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const [templates, mediaFiles] = await Promise.all([
    getTemplates({ includeDrafts: true }),
    getMediaFiles(),
  ]);
  const template = templates.find(
    (item: any) =>
      String(item.id) === decodedId ||
      String(item.documentId) === decodedId ||
      String(item.slug) === decodedId
  );

  if (!template) return notFound();

  return (
    <>
      <AdminEditChrome
        parentHref="/admin/templates"
        parentLabel="Şablonlar"
        currentLabel={template.title}
      />
      <AdminPageHeader
        title={template.title}
        description="Şablon içeriğini, görsellerini, demo bağlantısını ve yayın durumunu düzenleyin."
      />
      <div className="rounded-lg border border-border bg-card p-5">
        <TemplateForm
          template={template}
          action={saveTemplateAction}
          submitLabel="Güncelle"
          mediaFiles={mediaFiles}
          deleteAction={deleteTemplateAction}
        />
      </div>
    </>
  );
}
