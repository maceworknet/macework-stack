import { notFound } from "next/navigation";
import { deleteProjectAction, saveProjectAction } from "@/actions/admin/content";
import { AdminEditChrome } from "@/components/admin/admin-edit-chrome";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectForm } from "@/components/admin/content-forms";
import { getMediaFiles, getProjects } from "@/lib/cms";

export default async function AdminEditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const [projects, mediaFiles] = await Promise.all([
    getProjects({ includeDrafts: true }),
    getMediaFiles(),
  ]);
  const project = projects.find(
    (item: any) =>
      String(item.id) === decodedId ||
      String(item.documentId) === decodedId ||
      String(item.slug) === decodedId
  );

  if (!project) return notFound();

  return (
    <>
      <AdminEditChrome
        parentHref="/admin/projects"
        parentLabel="Projeler"
        currentLabel={project.title}
      />
      <AdminPageHeader
        title={project.title}
        description="Proje detayını, galerisini, yayın durumunu ve SEO alanlarını düzenleyin."
      />
      <div className="rounded-lg border border-border bg-card p-5">
        <ProjectForm
          project={project}
          action={saveProjectAction}
          submitLabel="Güncelle"
          mediaFiles={mediaFiles}
          deleteAction={deleteProjectAction}
        />
      </div>
    </>
  );
}
