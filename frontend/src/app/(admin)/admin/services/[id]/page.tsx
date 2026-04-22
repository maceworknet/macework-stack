import { notFound } from "next/navigation";
import { deleteSolutionAction, saveSolutionAction } from "@/actions/admin/content";
import { AdminEditChrome } from "@/components/admin/admin-edit-chrome";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SolutionForm } from "@/components/admin/content-forms";
import { getMediaFiles, getSolutions } from "@/lib/cms";

export default async function AdminEditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const [services, mediaFiles] = await Promise.all([
    getSolutions({ includeDrafts: true }),
    getMediaFiles(),
  ]);
  const service = services.find(
    (item: any) =>
      String(item.id) === decodedId ||
      String(item.documentId) === decodedId ||
      String(item.slug) === decodedId
  );

  if (!service) return notFound();

  return (
    <>
      <AdminEditChrome
        parentHref="/admin/services"
        parentLabel="Çözümler"
        currentLabel={service.title}
      />
      <AdminPageHeader
        title={service.title}
        description="Çözüm kartını, detay içeriğini, görselini ve yayın ayarlarını tam ekranda düzenleyin."
      />
      <div className="rounded-lg border border-border bg-card p-5">
        <SolutionForm
          solution={service}
          action={saveSolutionAction}
          submitLabel="Güncelle"
          mediaFiles={mediaFiles}
          deleteAction={deleteSolutionAction}
        />
      </div>
    </>
  );
}
