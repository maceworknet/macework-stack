import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm, AdminSubmitButton } from "@/components/admin/admin-feedback";
import {
  saveContactSettingsAction,
  saveGlobalSettingsAction,
  saveHomeSettingsAction,
} from "@/actions/admin/content";
import { getContactPage, getGlobalSettings, getHomePage } from "@/lib/cms";

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-macework"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
}) {
  return (
    <label className="space-y-1.5 md:col-span-2">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-macework"
      />
    </label>
  );
}

function SaveButton() {
  return (
    <AdminSubmitButton pendingChildren="Kaydediliyor">
      Kaydet
    </AdminSubmitButton>
  );
}

export default async function AdminSettingsPage() {
  const [globalSettings, homeSettings, contactSettings] = await Promise.all([
    getGlobalSettings(),
    getHomePage(),
    getContactPage(),
  ]);

  const checks = [
    { label: "DATABASE_URL", ok: Boolean(process.env.DATABASE_URL) },
    { label: "AUTH_SECRET", ok: Boolean(process.env.AUTH_SECRET) },
    { label: "NEXT_PUBLIC_SITE_URL", ok: Boolean(process.env.NEXT_PUBLIC_SITE_URL) },
  ];

  return (
    <>
      <AdminPageHeader
        title="Ayarlar"
        description="Site genel ayarlarını, ana sayfa hero alanını ve iletişim bilgilerini buradan düzenleyin."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {checks.map((check) => (
          <div key={check.label} className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-black">{check.label}</p>
            <p
              className={
                check.ok
                  ? "mt-3 text-sm font-bold text-green-600"
                  : "mt-3 text-sm font-bold text-macework"
              }
            >
              {check.ok ? "Hazır" : "Eksik"}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-black">Genel site ayarları</h2>
        <AdminActionForm
          action={saveGlobalSettingsAction}
          className="mt-5 grid gap-4 md:grid-cols-2"
          successMessage="Genel site ayarları kaydedildi."
          trackDirty
        >
          <Field label="Site adı" name="site_name" defaultValue={globalSettings.site_name} />
          <Field label="Footer e-posta" name="footer_email" defaultValue={globalSettings.footer_email} />
          <Field label="Footer telefon" name="footer_phone" defaultValue={globalSettings.footer_phone} />
          <Field label="SEO başlığı" name="seo_default_title" defaultValue={globalSettings.seo_default_title} />
          <TextArea
            label="SEO açıklaması"
            name="seo_default_description"
            defaultValue={globalSettings.seo_default_description}
          />
          <TextArea
            label="Footer açıklaması"
            name="footer_description"
            defaultValue={globalSettings.footer_description}
          />
          <div className="md:col-span-2">
            <SaveButton />
          </div>
        </AdminActionForm>
      </section>

      <section className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-black">Ana sayfa</h2>
        <AdminActionForm
          action={saveHomeSettingsAction}
          className="mt-5 grid gap-4 md:grid-cols-2"
          successMessage="Ana sayfa ayarları kaydedildi."
          trackDirty
        >
          <Field label="Hero rozeti" name="hero_badge" defaultValue={homeSettings.hero_badge} />
          <Field
            label="Birincil buton metni"
            name="hero_cta_primary_label"
            defaultValue={homeSettings.hero_cta_primary_label}
          />
          <Field
            label="Birincil buton linki"
            name="hero_cta_primary_url"
            defaultValue={homeSettings.hero_cta_primary_url}
          />
          <Field
            label="İkincil buton metni"
            name="hero_cta_secondary_label"
            defaultValue={homeSettings.hero_cta_secondary_label}
          />
          <Field
            label="İkincil buton linki"
            name="hero_cta_secondary_url"
            defaultValue={homeSettings.hero_cta_secondary_url}
          />
          <Field
            label="Ürün bölümü başlığı"
            name="products_section_heading"
            defaultValue={homeSettings.products_section_heading}
          />
          <Field
            label="Çözüm bölümü başlığı"
            name="solutions_section_heading"
            defaultValue={homeSettings.solutions_section_heading}
          />
          <Field
            label="İşler bölümü başlığı"
            name="work_section_heading"
            defaultValue={homeSettings.work_section_heading}
          />
          <TextArea label="Hero başlığı" name="hero_heading" defaultValue={homeSettings.hero_heading} rows={3} />
          <TextArea label="Hero açıklaması" name="hero_subheading" defaultValue={homeSettings.hero_subheading} />
          <div className="md:col-span-2">
            <SaveButton />
          </div>
        </AdminActionForm>
      </section>

      <section className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-black">İletişim</h2>
        <AdminActionForm
          action={saveContactSettingsAction}
          className="mt-5 grid gap-4 md:grid-cols-2"
          successMessage="İletişim ayarları kaydedildi."
          trackDirty
        >
          <Field label="Sayfa başlığı" name="heading" defaultValue={contactSettings.heading} />
          <Field label="E-posta" name="email" defaultValue={contactSettings.email} />
          <Field label="Telefon" name="phone" defaultValue={contactSettings.phone} />
          <Field
            label="WhatsApp numarası"
            name="whatsapp_number"
            defaultValue={contactSettings.whatsapp_number}
          />
          <Field
            label="Form başlığı"
            name="form_heading"
            defaultValue={contactSettings.form_heading}
          />
          <TextArea label="Sayfa açıklaması" name="subheading" defaultValue={contactSettings.subheading} />
          <TextArea label="Adres" name="address" defaultValue={contactSettings.address} />
          <TextArea label="WhatsApp metni" name="whatsapp_text" defaultValue={contactSettings.whatsapp_text} />
          <TextArea
            label="Form açıklaması"
            name="form_subheading"
            defaultValue={contactSettings.form_subheading}
          />
          <div className="md:col-span-2">
            <SaveButton />
          </div>
        </AdminActionForm>
      </section>
    </>
  );
}
