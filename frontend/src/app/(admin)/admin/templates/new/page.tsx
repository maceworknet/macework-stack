import { saveTemplateAction } from "@/actions/admin/content";
import { AdminEditChrome } from "@/components/admin/admin-edit-chrome";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TemplateForm } from "@/components/admin/content-forms";
import { getMediaFiles } from "@/lib/cms";

export default async function AdminNewTemplatePage() {
  const mediaFiles = await getMediaFiles();

  return (
    <>
      <AdminEditChrome
        parentHref="/admin/templates"
        parentLabel="Şablonlar"
        currentLabel="Yeni şablon"
      />
      <AdminPageHeader
        title="Yeni şablon"
        description="Şablonun görsellerini, demo bağlantısını, içerik ve yayın ayarlarını hazırlayın."
      />
      <div className="rounded-lg border border-border bg-card p-5">
        <TemplateForm
          action={saveTemplateAction}
          submitLabel="Şablonu kaydet"
          mediaFiles={mediaFiles}
        />
      </div>
    </>
  );
}
