import {
  deleteTeamMemberAction,
  saveAboutSettingsAction,
  saveTeamMemberAction,
} from "@/actions/admin/content";
import {
  AdminActionForm,
  AdminSubmitButton,
  ConfirmSubmitButton,
} from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaPickerField } from "@/components/admin/media-picker-field";
import {
  PageBackLink,
  PageSaveBar,
  PageSettingsSection,
  PageTextArea,
  PageTextField,
} from "@/components/admin/page-setting-fields";
import { getAboutPage, getMediaFiles, getTeamMembers } from "@/lib/cms";

function imageValue(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "url" in value) return String(value.url ?? "");
  return "";
}

function StatFields({ stats }: { stats: any[] }) {
  return (
    <>
      {Array.from({ length: 4 }, (_, index) => {
        const stat = stats[index] ?? {};

        return (
          <div key={index} className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-sm font-black">Istatistik {index + 1}</p>
            <div className="grid gap-3">
              <PageTextField
                label="Deger"
                name={`stat_value_${index}`}
                defaultValue={stat.value}
              />
              <PageTextField
                label="Etiket"
                name={`stat_label_${index}`}
                defaultValue={stat.label}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

function TeamMemberForm({
  member,
  mediaFiles,
}: {
  member?: any;
  mediaFiles: any[];
}) {
  const saved = Boolean(member?.id);

  return (
    <AdminActionForm
      action={saveTeamMemberAction}
      className="grid gap-4 md:grid-cols-2"
      successMessage={saved ? "Ekip karti guncellendi." : "Ekip karti eklendi."}
      trackDirty
    >
      {saved ? <input type="hidden" name="id" value={member.id} /> : null}
      <PageTextField label="Ad Soyad" name="name" defaultValue={member?.name} />
      <PageTextField label="Rol / Unvan" name="role" defaultValue={member?.role} />
      <PageTextField
        label="Sira"
        name="sortOrder"
        defaultValue={String(member?.sortOrder ?? 0)}
      />
      <label className="space-y-1.5">
        <span className="text-xs font-bold text-muted-foreground">Yayin durumu</span>
        <select
          name="published"
          defaultValue={member?.published === false ? "false" : "true"}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-macework"
        >
          <option value="true">Yayinda</option>
          <option value="false">Taslak</option>
        </select>
      </label>
      <PageTextArea label="Aciklama" name="bio" defaultValue={member?.bio} rows={3} />
      <MediaPickerField
        name="image"
        label="Kisi gorseli"
        mediaFiles={mediaFiles}
        value={member?.image}
      />
      <div className="flex flex-wrap gap-2 md:col-span-2">
        <AdminSubmitButton pendingChildren="Kaydediliyor">
          {saved ? "Ekip kartini guncelle" : "Ekip karti ekle"}
        </AdminSubmitButton>
        {saved ? (
          <ConfirmSubmitButton
            formAction={deleteTeamMemberAction}
            title="Ekip karti silinsin mi?"
            description="Bu kisi karti kalici olarak silinecek."
            pendingChildren="Siliniyor"
          >
            Sil
          </ConfirmSubmitButton>
        ) : null}
      </div>
    </AdminActionForm>
  );
}

export default async function AdminAboutPageSettings() {
  const [settings, team, mediaFiles] = await Promise.all([
    getAboutPage(),
    getTeamMembers({ includeDrafts: true }),
    getMediaFiles(),
  ]);

  return (
    <>
      <PageBackLink />
      <AdminPageHeader
        title="Hakkimizda Sayfasi"
        description="Kurumsal metinler, istatistikler, sag gorsel/kart alani, ekip kartlari ve CTA alanini yonetin."
      />

      <AdminActionForm
        action={saveAboutSettingsAction}
        className="space-y-6"
        successMessage="Hakkimizda sayfasi kaydedildi."
        trackDirty
      >
        <PageSettingsSection title="Ust Alan">
          <PageTextField label="Rozet" name="eyebrow" defaultValue={settings.eyebrow} />
          <PageTextField label="Baslik" name="heading" defaultValue={settings.heading} />
          <PageTextArea
            label="Aciklama"
            name="about_description"
            defaultValue={settings.about_description}
          />
        </PageSettingsSection>

        <PageSettingsSection title="Biz Kimiz / Misyon / Vizyon">
          <PageTextField
            label="Icerik basligi"
            name="story_heading"
            defaultValue={settings.story_heading}
          />
          <PageTextField
            label="Misyon basligi"
            name="mission_heading"
            defaultValue={settings.mission_heading}
          />
          <PageTextField
            label="Vizyon basligi"
            name="vision_heading"
            defaultValue={settings.vision_heading}
          />
          <PageTextArea label="Biz Kimiz icerigi" name="story" defaultValue={settings.story} />
          <PageTextArea label="Misyon metni" name="mission" defaultValue={settings.mission} />
          <PageTextArea label="Vizyon metni" name="vision" defaultValue={settings.vision} />
        </PageSettingsSection>

        <PageSettingsSection title="Istatistikler">
          <StatFields stats={settings.stats ?? []} />
        </PageSettingsSection>

        <PageSettingsSection title="Sag Alan">
          <div className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-bold text-muted-foreground">Sag alan tipi</span>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "card", label: "Kalp karti" },
                { value: "image", label: "Gorsel" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-bold"
                >
                  <input
                    type="radio"
                    name="about_visual_mode"
                    value={option.value}
                    defaultChecked={(settings.about_visual_mode ?? "card") === option.value}
                    className="accent-macework"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          <MediaPickerField
            name="about_image_url"
            label="Sag alan gorseli"
            mediaFiles={mediaFiles}
            value={imageValue(settings.about_image)}
          />
        </PageSettingsSection>

        <PageSettingsSection title="Uzman Kadromuz">
          <PageTextField
            label="Baslik"
            name="team_heading"
            defaultValue={settings.team_heading}
          />
          <PageTextArea
            label="Aciklama"
            name="team_description"
            defaultValue={settings.team_description}
          />
        </PageSettingsSection>

        <PageSettingsSection title="Birlikte Deger Yaratalim">
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

        <PageSaveBar label="Hakkimizda sayfasini kaydet" />
      </AdminActionForm>

      <section className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-black">Yeni ekip karti</h2>
        <div className="mt-5 border-t border-border pt-5">
          <TeamMemberForm mediaFiles={mediaFiles} />
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-black">Ekip kartlari</h2>
        <div className="mt-5 grid gap-4">
          {team.map((member: any) => (
            <details key={member.id ?? member.name} className="rounded-lg border border-border bg-background p-4">
              <summary className="cursor-pointer text-sm font-black">
                {member.name} - {member.role}
              </summary>
              <div className="mt-4 border-t border-border pt-4">
                <TeamMemberForm member={member} mediaFiles={mediaFiles} />
              </div>
            </details>
          ))}
          {team.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
              Henuz ekip karti yok.
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
