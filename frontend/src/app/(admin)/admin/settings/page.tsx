import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm, AdminSubmitButton } from "@/components/admin/admin-feedback";
import {
  saveContactSettingsAction,
  saveGlobalSettingsAction,
  saveHomeSettingsAction,
} from "@/actions/admin/content";
import { getContactPage, getGlobalSettings, getHomePage } from "@/lib/cms";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


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
    <div className="space-y-2">
      <span className="text-sm font-semibold text-foreground/80">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
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
    <div className="space-y-2 md:col-span-2">
      <span className="text-sm font-semibold text-foreground/80">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

function SaveButton() {
  return (
    <AdminSubmitButton
      pendingChildren="Kaydediliyor"
      className={buttonVariants({
        className: "bg-macework hover:bg-macework/90 text-white font-bold"
      })}
    >
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
          <Card key={check.label} className="border-border bg-card shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <span className="text-sm font-bold text-muted-foreground">{check.label}</span>
              <Badge
                variant={check.ok ? "default" : "destructive"}
                className={
                  check.ok
                    ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 border-none"
                    : "bg-red-500/10 text-red-700 hover:bg-red-500/15 border-none"
                }
              >
                {check.ok ? "Hazır" : "Eksik"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border bg-muted/10 p-6">
          <CardTitle className="text-lg font-bold text-foreground">Genel site ayarları</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AdminActionForm
            action={saveGlobalSettingsAction}
            className="grid gap-4 md:grid-cols-2"
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
            <div className="md:col-span-2 pt-2">
              <SaveButton />
            </div>
          </AdminActionForm>
        </CardContent>
      </Card>

      <Card className="mt-8 border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border bg-muted/10 p-6">
          <CardTitle className="text-lg font-bold text-foreground">Ana sayfa</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AdminActionForm
            action={saveHomeSettingsAction}
            className="grid gap-4 md:grid-cols-2"
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
            <div className="md:col-span-2 pt-2">
              <SaveButton />
            </div>
          </AdminActionForm>
        </CardContent>
      </Card>

      <Card className="mt-8 border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border bg-muted/10 p-6">
          <CardTitle className="text-lg font-bold text-foreground">İletişim</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AdminActionForm
            action={saveContactSettingsAction}
            className="grid gap-4 md:grid-cols-2"
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
            <div className="md:col-span-2 pt-2">
              <SaveButton />
            </div>
          </AdminActionForm>
        </CardContent>
      </Card>
    </>
  );
}
