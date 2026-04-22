import { saveFooterSettingsAction } from "@/actions/admin/content";
import { AdminActionForm } from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  PageBackLink,
  PageSaveBar,
  PageSettingsSection,
  PageTextArea,
  PageTextField,
} from "@/components/admin/page-setting-fields";
import { getFooterSettings } from "@/lib/cms";

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue ?? options[0]?.value}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-macework"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function slots<T>(items: T[] | undefined, count: number) {
  return Array.from({ length: count }, (_, index) => items?.[index] ?? {});
}

export default async function AdminFooterPageSettings() {
  const settings = await getFooterSettings();
  const quickLinks = slots(settings.quick_links, 6);
  const socialLinks = slots(settings.social_links, 5);
  const legalLinks = slots(settings.legal_links, 4);

  return (
    <>
      <PageBackLink />
      <AdminPageHeader
        title="Footer Yapisi"
        description="Logo aciklamasi, hizli linkler, iletisim, sosyal medya ve yasal alanlari yonetin."
      />

      <AdminActionForm
        action={saveFooterSettingsAction}
        className="space-y-6"
        successMessage="Footer ayarlari kaydedildi."
        trackDirty
      >
        <PageSettingsSection title="Logo ve Aciklama">
          <PageTextField label="Logo metni" name="logo_text" defaultValue={settings.logo_text} />
          <PageTextArea
            label="Aciklama"
            name="description"
            defaultValue={settings.description}
          />
        </PageSettingsSection>

        <PageSettingsSection title="Hizli Linkler">
          <PageTextField
            label="Menu basligi"
            name="quick_links_heading"
            defaultValue={settings.quick_links_heading}
          />
          {quickLinks.map((link: any, index) => (
            <div key={index} className="rounded-lg border border-border bg-background p-4 md:col-span-2">
              <p className="mb-3 text-sm font-black">Hizli link {index + 1}</p>
              <div className="grid gap-3 md:grid-cols-3">
                <PageTextField label="Etiket" name={`quick_label_${index}`} defaultValue={link.label} />
                <PageTextField label="Link" name={`quick_href_${index}`} defaultValue={link.href} />
                <PageTextField
                  label="Sira"
                  name={`quick_sort_${index}`}
                  defaultValue={String(link.sortOrder ?? index)}
                />
                <SelectField
                  label="Hedef"
                  name={`quick_target_${index}`}
                  defaultValue={link.target ?? "_self"}
                  options={[
                    { label: "Ayni sekme", value: "_self" },
                    { label: "Yeni sekme", value: "_blank" },
                  ]}
                />
                <SelectField
                  label="Durum"
                  name={`quick_published_${index}`}
                  defaultValue={link.published === false ? "false" : "true"}
                  options={[
                    { label: "Yayinda", value: "true" },
                    { label: "Taslak", value: "false" },
                  ]}
                />
              </div>
            </div>
          ))}
        </PageSettingsSection>

        <PageSettingsSection title="Iletisim">
          <PageTextField
            label="Baslik"
            name="contact_heading"
            defaultValue={settings.contact_heading}
          />
          <PageTextField label="E-posta" name="email" defaultValue={settings.email} />
          <PageTextField label="Telefon" name="phone" defaultValue={settings.phone} />
          <PageTextArea label="Adres" name="address" defaultValue={settings.address} />
        </PageSettingsSection>

        <PageSettingsSection title="Sosyal Medya">
          {socialLinks.map((link: any, index) => (
            <div key={index} className="rounded-lg border border-border bg-background p-4 md:col-span-2">
              <p className="mb-3 text-sm font-black">Sosyal link {index + 1}</p>
              <div className="grid gap-3 md:grid-cols-3">
                <PageTextField
                  label="Platform"
                  name={`social_platform_${index}`}
                  defaultValue={link.platform}
                />
                <PageTextField
                  label="URL"
                  name={`social_url_${index}`}
                  defaultValue={link.url}
                />
                <PageTextField
                  label="Ikon"
                  name={`social_icon_${index}`}
                  defaultValue={link.icon}
                />
                <PageTextField
                  label="Sira"
                  name={`social_sort_${index}`}
                  defaultValue={String(link.sortOrder ?? index)}
                />
                <SelectField
                  label="Durum"
                  name={`social_published_${index}`}
                  defaultValue={link.published === false ? "false" : "true"}
                  options={[
                    { label: "Yayinda", value: "true" },
                    { label: "Taslak", value: "false" },
                  ]}
                />
              </div>
            </div>
          ))}
        </PageSettingsSection>

        <PageSettingsSection title="Alt Yasal Alan">
          <PageTextField label="Telif metni" name="copyright" defaultValue={settings.copyright} />
          {legalLinks.map((link: any, index) => (
            <div key={index} className="rounded-lg border border-border bg-background p-4 md:col-span-2">
              <p className="mb-3 text-sm font-black">Yasal link {index + 1}</p>
              <div className="grid gap-3 md:grid-cols-3">
                <PageTextField label="Etiket" name={`legal_label_${index}`} defaultValue={link.label} />
                <PageTextField label="Link" name={`legal_href_${index}`} defaultValue={link.href} />
                <PageTextField
                  label="Sira"
                  name={`legal_sort_${index}`}
                  defaultValue={String(link.sortOrder ?? index)}
                />
                <SelectField
                  label="Durum"
                  name={`legal_published_${index}`}
                  defaultValue={link.published === false ? "false" : "true"}
                  options={[
                    { label: "Yayinda", value: "true" },
                    { label: "Taslak", value: "false" },
                  ]}
                />
              </div>
            </div>
          ))}
        </PageSettingsSection>

        <PageSaveBar label="Footer ayarlarini kaydet" />
      </AdminActionForm>
    </>
  );
}
