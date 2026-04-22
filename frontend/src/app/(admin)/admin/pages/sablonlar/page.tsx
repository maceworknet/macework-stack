import { saveTemplatesPageSettingsAction } from "@/actions/admin/content";
import { AdminActionForm } from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  PageBackLink,
  PageSaveBar,
  PageSettingsSection,
  PageTextArea,
  PageTextField,
} from "@/components/admin/page-setting-fields";
import { getTemplatesPageSettings } from "@/lib/cms";

export default async function AdminTemplatesPageSettings() {
  const settings = await getTemplatesPageSettings();

  return (
    <>
      <PageBackLink />
      <AdminPageHeader
        title="Sablonlar Sayfasi"
        description="Sablon kutuphanesi ust alani ve alt CTA bolumunu yonetin."
      />

      <AdminActionForm
        action={saveTemplatesPageSettingsAction}
        className="space-y-6"
        successMessage="Sablonlar sayfasi kaydedildi."
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

        <PageSettingsSection title="Alt CTA">
          <PageTextField
            label="Baslik"
            name="cta_heading"
            defaultValue={settings.cta_heading}
          />
          <PageTextField
            label="Buton metni"
            name="cta_button_label"
            defaultValue={settings.cta_button_label}
          />
          <PageTextField
            label="Buton linki"
            name="cta_button_url"
            defaultValue={settings.cta_button_url}
          />
          <PageTextArea
            label="Aciklama"
            name="cta_description"
            defaultValue={settings.cta_description}
          />
        </PageSettingsSection>

        <PageSaveBar label="Sablonlar sayfasini kaydet" />
      </AdminActionForm>
    </>
  );
}
