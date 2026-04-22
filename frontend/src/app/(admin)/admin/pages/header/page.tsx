import { saveHeaderSettingsAction } from "@/actions/admin/content";
import { AdminActionForm } from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  PageBackLink,
  PageSaveBar,
  PageSettingsSection,
  PageTextArea,
  PageTextField,
} from "@/components/admin/page-setting-fields";
import { getHeaderSettings } from "@/lib/cms";

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

export default async function AdminHeaderPageSettings() {
  const settings = await getHeaderSettings();
  const navigation = slots(settings.navigation, 6);
  const columns = slots(settings.mega_menu_columns, 3);

  return (
    <>
      <PageBackLink />
      <AdminPageHeader
        title="Header Yapisi"
        description="Logo, ana menu, Sablonlar butonu ve Cozumler mega menu yapisini yonetin."
      />

      <AdminActionForm
        action={saveHeaderSettingsAction}
        className="space-y-6"
        successMessage="Header ayarlari kaydedildi."
        trackDirty
      >
        <PageSettingsSection title="Logo ve Buton">
          <PageTextField label="Logo metni" name="logo_text" defaultValue={settings.logo_text} />
          <PageTextField label="Buton metni" name="cta_label" defaultValue={settings.cta_label} />
          <PageTextField label="Buton linki" name="cta_href" defaultValue={settings.cta_href} />
          <PageTextField
            label="Mega menu etiketi"
            name="mega_menu_label"
            defaultValue={settings.mega_menu_label}
          />
        </PageSettingsSection>

        <PageSettingsSection title="Ana Menu Ogeleri">
          {navigation.map((item: any, index) => (
            <div key={index} className="rounded-lg border border-border bg-background p-4 md:col-span-2">
              <p className="mb-3 text-sm font-black">Menu ogesi {index + 1}</p>
              <div className="grid gap-3 md:grid-cols-3">
                <PageTextField label="Etiket" name={`nav_label_${index}`} defaultValue={item.label} />
                <PageTextField label="Link" name={`nav_href_${index}`} defaultValue={item.href} />
                <PageTextField
                  label="Sira"
                  name={`nav_sort_${index}`}
                  defaultValue={String(item.sortOrder ?? index)}
                />
                <SelectField
                  label="Tip"
                  name={`nav_type_${index}`}
                  defaultValue={item.type ?? "link"}
                  options={[
                    { label: "Normal link", value: "link" },
                    { label: "Mega menu", value: "mega" },
                  ]}
                />
                <SelectField
                  label="Hedef"
                  name={`nav_target_${index}`}
                  defaultValue={item.target ?? "_self"}
                  options={[
                    { label: "Ayni sekme", value: "_self" },
                    { label: "Yeni sekme", value: "_blank" },
                  ]}
                />
                <SelectField
                  label="Durum"
                  name={`nav_published_${index}`}
                  defaultValue={item.published === false ? "false" : "true"}
                  options={[
                    { label: "Yayinda", value: "true" },
                    { label: "Taslak", value: "false" },
                  ]}
                />
              </div>
            </div>
          ))}
        </PageSettingsSection>

        <PageSettingsSection title="Cozumler Mega Menu">
          {columns.map((column: any, columnIndex) => {
            const items = slots(column.items, 4);

            return (
              <div
                key={columnIndex}
                className="rounded-lg border border-border bg-background p-4 md:col-span-2"
              >
                <PageTextField
                  label={`Kolon ${columnIndex + 1} basligi`}
                  name={`mega_column_title_${columnIndex}`}
                  defaultValue={column.title}
                />
                <div className="mt-4 grid gap-4">
                  {items.map((item: any, itemIndex) => (
                    <div key={itemIndex} className="rounded-lg border border-border bg-card p-4">
                      <p className="mb-3 text-sm font-black">Alt menu {itemIndex + 1}</p>
                      <div className="grid gap-3 md:grid-cols-3">
                        <PageTextField
                          label="Baslik"
                          name={`mega_item_title_${columnIndex}_${itemIndex}`}
                          defaultValue={item.title}
                        />
                        <PageTextField
                          label="Ikon"
                          name={`mega_item_icon_${columnIndex}_${itemIndex}`}
                          defaultValue={item.icon ?? item.iconName}
                        />
                        <PageTextField
                          label="Link"
                          name={`mega_item_href_${columnIndex}_${itemIndex}`}
                          defaultValue={item.href}
                        />
                        <PageTextField
                          label="Sira"
                          name={`mega_item_sort_${columnIndex}_${itemIndex}`}
                          defaultValue={String(item.sortOrder ?? itemIndex)}
                        />
                        <SelectField
                          label="Durum"
                          name={`mega_item_published_${columnIndex}_${itemIndex}`}
                          defaultValue={item.published === false ? "false" : "true"}
                          options={[
                            { label: "Yayinda", value: "true" },
                            { label: "Taslak", value: "false" },
                          ]}
                        />
                        <PageTextArea
                          label="Aciklama"
                          name={`mega_item_description_${columnIndex}_${itemIndex}`}
                          defaultValue={item.description}
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </PageSettingsSection>

        <PageSaveBar label="Header ayarlarini kaydet" />
      </AdminActionForm>
    </>
  );
}
