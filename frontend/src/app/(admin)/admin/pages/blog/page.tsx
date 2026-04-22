import { saveBlogPageSettingsAction } from "@/actions/admin/content";
import { AdminActionForm } from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  PageBackLink,
  PageSaveBar,
  PageSettingsSection,
  PageTextArea,
  PageTextField,
} from "@/components/admin/page-setting-fields";
import { getBlogPageSettings } from "@/lib/cms";

export default async function AdminBlogPageSettings() {
  const settings = await getBlogPageSettings();

  return (
    <>
      <PageBackLink />
      <AdminPageHeader
        title="Blog Sayfasi"
        description="Blog & Haberler ust alan metinlerini yonetin."
      />

      <AdminActionForm
        action={saveBlogPageSettingsAction}
        className="space-y-6"
        successMessage="Blog sayfasi kaydedildi."
        trackDirty
      >
        <PageSettingsSection title="Ust Alan">
          <PageTextField label="Rozet" name="eyebrow" defaultValue={settings.eyebrow} />
          <PageTextField label="Baslik" name="heading" defaultValue={settings.heading} />
          <PageTextArea
            label="Aciklama"
            name="description"
            defaultValue={settings.description}
          />
        </PageSettingsSection>

        <PageSaveBar label="Blog sayfasini kaydet" />
      </AdminActionForm>
    </>
  );
}
