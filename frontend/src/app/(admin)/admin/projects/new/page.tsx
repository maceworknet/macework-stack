import { saveProjectAction } from "@/actions/admin/content";
import { AdminEditChrome } from "@/components/admin/admin-edit-chrome";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectForm } from "@/components/admin/content-forms";
import { getMediaFiles } from "@/lib/cms";

export default async function AdminNewProjectPage() {
  const mediaFiles = await getMediaFiles();

  return (
    <>
      <AdminEditChrome parentHref="/admin/projects" parentLabel="Projeler" currentLabel="Yeni proje" />
      <AdminPageHeader
        title="Yeni proje"
        description="Proje kartı, medya galerisi, hikaye ve yayın ayarlarını tek ekranda hazırlayın."
      />
      <div className="rounded-lg border border-border bg-card p-5">
        <ProjectForm action={saveProjectAction} submitLabel="Projeyi kaydet" mediaFiles={mediaFiles} />
      </div>
    </>
  );
}
