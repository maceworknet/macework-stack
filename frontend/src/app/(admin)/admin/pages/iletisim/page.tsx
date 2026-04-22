import { saveContactSettingsAction } from "@/actions/admin/content";
import { AdminActionForm } from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  PageBackLink,
  PageSaveBar,
  PageSettingsSection,
  PageTextArea,
  PageTextField,
} from "@/components/admin/page-setting-fields";
import { getContactPage } from "@/lib/cms";

export default async function AdminContactPageSettings() {
  const settings = await getContactPage();

  return (
    <>
      <PageBackLink />
      <AdminPageHeader
        title="Iletisim Sayfasi"
        description="Ust alan, iletisim bilgileri, form metinleri ve marka seridi basligini yonetin."
      />

      <AdminActionForm
        action={saveContactSettingsAction}
        className="space-y-6"
        successMessage="Iletisim sayfasi kaydedildi."
        trackDirty
      >
        <PageSettingsSection title="Ust Alan">
          <PageTextField label="Rozet" name="eyebrow" defaultValue={settings.eyebrow} />
          <PageTextField label="Baslik" name="heading" defaultValue={settings.heading} />
          <PageTextArea
            label="Aciklama"
            name="subheading"
            defaultValue={settings.subheading}
          />
        </PageSettingsSection>

        <PageSettingsSection title="Iletisim Bilgileri">
          <PageTextField
            label="Blok basligi"
            name="info_heading"
            defaultValue={settings.info_heading}
          />
          <PageTextField
            label="Telefon etiketi"
            name="phone_label"
            defaultValue={settings.phone_label}
          />
          <PageTextField label="Telefon" name="phone" defaultValue={settings.phone} />
          <PageTextField
            label="E-posta etiketi"
            name="email_label"
            defaultValue={settings.email_label}
          />
          <PageTextField label="E-posta" name="email" defaultValue={settings.email} />
          <PageTextField
            label="Adres etiketi"
            name="address_label"
            defaultValue={settings.address_label}
          />
          <PageTextArea
            label="Blok aciklamasi"
            name="info_description"
            defaultValue={settings.info_description}
          />
          <PageTextArea label="Adres" name="address" defaultValue={settings.address} />
          <PageTextField
            label="WhatsApp numarasi"
            name="whatsapp_number"
            defaultValue={settings.whatsapp_number}
          />
          <PageTextField
            label="WhatsApp ust metni"
            name="whatsapp_intro"
            defaultValue={settings.whatsapp_intro}
          />
          <PageTextField
            label="WhatsApp metni"
            name="whatsapp_text"
            defaultValue={settings.whatsapp_text}
          />
        </PageSettingsSection>

        <PageSettingsSection title="Form">
          <PageTextField
            label="Form basligi"
            name="form_heading"
            defaultValue={settings.form_heading}
          />
          <PageTextField
            label="Buton metni"
            name="form_button_text"
            defaultValue={settings.form_button_text}
          />
          <PageTextArea
            label="Form aciklamasi"
            name="form_subheading"
            defaultValue={settings.form_subheading}
          />
          <PageTextField
            label="Ad soyad placeholder"
            name="form_placeholder_name"
            defaultValue={settings.form_placeholder_name}
          />
          <PageTextField
            label="Firma placeholder"
            name="form_placeholder_company"
            defaultValue={settings.form_placeholder_company}
          />
          <PageTextField
            label="E-posta placeholder"
            name="form_placeholder_email"
            defaultValue={settings.form_placeholder_email}
          />
          <PageTextArea
            label="Mesaj placeholder"
            name="form_placeholder_message"
            defaultValue={settings.form_placeholder_message}
          />
        </PageSettingsSection>

        <PageSettingsSection title="Marka Seridi">
          <PageTextField
            label="Baslik"
            name="trusted_brands_heading"
            defaultValue={settings.trusted_brands_heading}
          />
        </PageSettingsSection>

        <PageSaveBar label="Iletisim sayfasini kaydet" />
      </AdminActionForm>
    </>
  );
}
