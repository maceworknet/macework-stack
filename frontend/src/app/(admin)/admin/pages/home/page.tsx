import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { saveHomeSettingsAction } from "@/actions/admin/content";
import { AdminActionForm, AdminSubmitButton } from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaGalleryField, MediaPickerField } from "@/components/admin/media-picker-field";
import {
  getHomePage,
  getMediaFiles,
  getProducts,
  getProjects,
  getSolutions,
} from "@/lib/cms";

type SelectableItem = {
  id?: string | null;
  slug?: string | null;
  title?: string | null;
  published?: boolean | null;
  tag?: string | null;
  category?: string | null;
  project_category?: { name?: string | null } | null;
};

function selectedSet(value: unknown) {
  return new Set(
    Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : []
  );
}

function logoUrls(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "url" in item) return String(item.url ?? "");
      return "";
    })
    .filter(Boolean);
}

function logoAltText(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((item) => {
      if (item && typeof item === "object" && "alternativeText" in item) {
        return String(item.alternativeText ?? "");
      }
      return "";
    })
    .join("\n");
}

function logoLinks(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((item) => {
      if (item && typeof item === "object" && "href" in item) {
        return String(item.href ?? "");
      }
      return "";
    })
    .join("\n");
}

function pairListText(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const label = "label" in item ? String(item.label ?? "") : "";
      const pairValue = "value" in item ? String(item.value ?? "") : "";
      return `${label}|${pairValue}`;
    })
    .filter(Boolean)
    .join("\n");
}

function imageValue(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "url" in value) return String(value.url ?? "");
  return "";
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input
        type={type}
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

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-black">{title}</h2>
        {description ? (
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function SelectionGrid({
  name,
  items,
  selected,
}: {
  name: string;
  items: SelectableItem[];
  selected: Set<string>;
}) {
  return (
    <div className="md:col-span-2">
      <input type="hidden" name={name} value="" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const slug = item.slug ?? item.id ?? "";
          const meta = item.project_category?.name ?? item.category ?? item.tag ?? "";

          return (
            <label
              key={slug}
              className="flex min-h-24 cursor-pointer gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:border-macework/40"
            >
              <input
                type="checkbox"
                name={name}
                value={slug}
                defaultChecked={selected.has(slug)}
                className="mt-1 h-4 w-4 accent-macework"
              />
              <span className="min-w-0">
                <span className="block text-sm font-black">{item.title}</span>
                {meta ? (
                  <span className="mt-1 block text-xs font-bold text-muted-foreground">
                    {meta}
                  </span>
                ) : null}
                <span className="mt-3 inline-flex rounded-full bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">
                  /{slug}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function WhyFeatureFields({ features }: { features: any[] }) {
  return (
    <>
      {Array.from({ length: 4 }, (_, index) => {
        const feature = features[index] ?? {};

        return (
          <div key={index} className="rounded-lg border border-border bg-background p-4 md:col-span-2">
            <p className="mb-3 text-sm font-black">Icerik karti {index + 1}</p>
            <div className="grid gap-3 md:grid-cols-3">
              <Field
                label="Ikon"
                name={`why_feature_icon_${index}`}
                defaultValue={feature.icon ?? feature.iconName ?? "zap"}
              />
              <Field
                label="Baslik"
                name={`why_feature_title_${index}`}
                defaultValue={feature.title}
              />
              <Field
                label="Aciklama"
                name={`why_feature_description_${index}`}
                defaultValue={feature.description}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

function ProcessStepFields({ steps }: { steps: any[] }) {
  return (
    <>
      {Array.from({ length: 4 }, (_, index) => {
        const step = steps[index] ?? {};

        return (
          <div key={index} className="rounded-lg border border-border bg-background p-4 md:col-span-2">
            <p className="mb-3 text-sm font-black">Adim {index + 1}</p>
            <div className="grid gap-3 md:grid-cols-[120px_minmax(0,1fr)]">
              <Field
                label="Numara"
                name={`process_step_number_${index}`}
                defaultValue={step.step_number ?? step.step ?? String(index + 1).padStart(2, "0")}
              />
              <Field
                label="Baslik"
                name={`process_step_title_${index}`}
                defaultValue={step.title}
              />
              <TextArea
                label="Aciklama"
                name={`process_step_description_${index}`}
                defaultValue={step.description}
                rows={3}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default async function AdminHomePageSettings() {
  const [homeSettings, mediaFiles, products, solutions, projects] = await Promise.all([
    getHomePage(),
    getMediaFiles(),
    getProducts({ includeDrafts: true }),
    getSolutions({ includeDrafts: true }),
    getProjects({ includeDrafts: true }),
  ]);

  return (
    <>
      <Link
        href="/admin/pages"
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Sayfalara don
      </Link>

      <AdminPageHeader
        title="Ana Sayfa Yonetimi"
        description="Hero, logo seridi, secili kartlar, icerik bloklari ve proje baslatma alanini buradan yonetin."
      />

      <AdminActionForm
        action={saveHomeSettingsAction}
        className="space-y-6"
        successMessage="Ana sayfa ayarlari kaydedildi."
        trackDirty
      >
        <FormSection title="Hero" description="Baslik, aciklama ve iki CTA butonu.">
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
            label="Ikincil buton metni"
            name="hero_cta_secondary_label"
            defaultValue={homeSettings.hero_cta_secondary_label}
          />
          <Field
            label="Ikincil buton linki"
            name="hero_cta_secondary_url"
            defaultValue={homeSettings.hero_cta_secondary_url}
          />
          <TextArea
            label="Hero basligi"
            name="hero_heading"
            defaultValue={homeSettings.hero_heading}
            rows={3}
          />
          <TextArea
            label="Hero aciklamasi"
            name="hero_subheading"
            defaultValue={homeSettings.hero_subheading}
          />
        </FormSection>

        <FormSection title="Referanslarimiz & Urunlerimiz" description="Hero altindaki logo seridi.">
          <Field
            label="Serit basligi"
            name="trusted_brands_heading"
            defaultValue={homeSettings.trusted_brands_heading}
          />
          <MediaGalleryField
            name="trusted_brands_logo_urls"
            label="Logo gorselleri"
            mediaFiles={mediaFiles}
            value={logoUrls(homeSettings.trusted_brands_logos)}
          />
          <TextArea
            label="Logo alt metinleri"
            name="trusted_brands_logo_alt_texts"
            defaultValue={logoAltText(homeSettings.trusted_brands_logos)}
            rows={3}
          />
          <TextArea
            label="Logo linkleri"
            name="trusted_brands_logo_links"
            defaultValue={logoLinks(homeSettings.trusted_brands_logos)}
            rows={3}
          />
        </FormSection>

        <FormSection title="One Cikan Urunlerimiz">
          <Field
            label="Baslik"
            name="products_section_heading"
            defaultValue={homeSettings.products_section_heading}
          />
          <TextArea
            label="Aciklama"
            name="products_section_description"
            defaultValue={homeSettings.products_section_description}
          />
          <SelectionGrid
            name="featured_product_slugs"
            items={products}
            selected={selectedSet(homeSettings.featured_product_slugs)}
          />
        </FormSection>

        <FormSection title="Kapsamli Dijital Cozumler">
          <Field
            label="Baslik"
            name="solutions_section_heading"
            defaultValue={homeSettings.solutions_section_heading}
          />
          <TextArea
            label="Aciklama"
            name="solutions_section_description"
            defaultValue={homeSettings.solutions_section_description}
          />
          <SelectionGrid
            name="featured_solution_slugs"
            items={solutions}
            selected={selectedSet(homeSettings.featured_solution_slugs)}
          />
        </FormSection>

        <FormSection title="Seckin Islerimiz">
          <Field
            label="Baslik"
            name="work_section_heading"
            defaultValue={homeSettings.work_section_heading}
          />
          <Field
            label="Buton metni"
            name="work_section_button_label"
            defaultValue={homeSettings.work_section_button_label}
          />
          <Field
            label="Buton linki"
            name="work_section_button_url"
            defaultValue={homeSettings.work_section_button_url}
          />
          <TextArea
            label="Aciklama"
            name="work_section_description"
            defaultValue={homeSettings.work_section_description}
          />
          <SelectionGrid
            name="featured_project_slugs"
            items={projects}
            selected={selectedSet(homeSettings.featured_project_slugs)}
          />
        </FormSection>

        <FormSection title="Neden Macework">
          <Field
            label="Baslik"
            name="why_macework_heading"
            defaultValue={homeSettings.why_macework_heading}
          />
          <TextArea
            label="Aciklama"
            name="why_macework_description"
            defaultValue={homeSettings.why_macework_description}
          />
          <WhyFeatureFields features={homeSettings.why_macework_features ?? []} />
          <div className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-bold text-muted-foreground">Sag alan tipi</span>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "card", label: "Kart" },
                { value: "image", label: "Gorsel" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-bold"
                >
                  <input
                    type="radio"
                    name="why_macework_visual_mode"
                    value={option.value}
                    defaultChecked={(homeSettings.why_macework_visual_mode ?? "card") === option.value}
                    className="accent-macework"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          <MediaPickerField
            name="why_macework_image_url"
            label="Sag alan gorseli"
            mediaFiles={mediaFiles}
            value={imageValue(homeSettings.why_macework_image)}
          />
          <Field
            label="Kart basligi"
            name="why_macework_card_title"
            defaultValue={homeSettings.why_macework_card_title}
          />
          <Field
            label="Kart alt metni"
            name="why_macework_card_subtitle"
            defaultValue={homeSettings.why_macework_card_subtitle}
          />
          <TextArea
            label="Kart satirlari"
            name="why_macework_card_items"
            defaultValue={pairListText(homeSettings.why_macework_card_items)}
            rows={3}
          />
        </FormSection>

        <FormSection title="Nasil Calisiriz?">
          <Field
            label="Baslik"
            name="process_section_heading"
            defaultValue={homeSettings.process_section_heading}
          />
          <ProcessStepFields steps={homeSettings.process_steps ?? []} />
        </FormSection>

        <FormSection title="Yeni Bir Projeye Baslayalim">
          <Field
            label="Baslik"
            name="lead_section_heading"
            defaultValue={homeSettings.lead_section_heading}
          />
          <Field
            label="Buton metni"
            name="lead_button_label"
            defaultValue={homeSettings.lead_button_label}
          />
          <TextArea
            label="Aciklama"
            name="lead_section_description"
            defaultValue={homeSettings.lead_section_description}
          />
        </FormSection>

        <div className="sticky bottom-4 z-30 rounded-lg border border-border bg-background/95 p-3 shadow-lg backdrop-blur">
          <AdminSubmitButton pendingChildren="Kaydediliyor">
            <Save className="h-4 w-4" />
            Ana sayfayi kaydet
          </AdminSubmitButton>
        </div>
      </AdminActionForm>
    </>
  );
}
