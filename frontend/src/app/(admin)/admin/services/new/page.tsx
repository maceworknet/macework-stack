import { saveSolutionAction } from "@/actions/admin/content";
import { AdminEditChrome } from "@/components/admin/admin-edit-chrome";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SolutionForm } from "@/components/admin/content-forms";
import { getMediaFiles } from "@/lib/cms";

export default async function AdminNewServicePage() {
  const mediaFiles = await getMediaFiles();

  return (
    <>
      <AdminEditChrome
        parentHref="/admin/services"
        parentLabel="Çözümler"
        currentLabel="Yeni çözüm"
      />
      <AdminPageHeader
        title="Yeni çözüm"
        description="Çözüm kartını, kapak görselini, detay içeriğini ve yayın ayarlarını tek ekranda hazırlayın."
      />
      <div className="rounded-lg border border-border bg-card p-5">
        <SolutionForm
          action={saveSolutionAction}
          submitLabel="Çözümü kaydet"
          mediaFiles={mediaFiles}
        />
      </div>
    </>
  );
}
