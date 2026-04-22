import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Briefcase,
  Clock3,
  FileText,
  Image,
  LayoutTemplate,
  Mail,
  Package,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { seedDefaultContentAction } from "@/actions/admin/content";
import { AdminActionForm, AdminSubmitButton } from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  getAdminDashboardStats,
  getBlogPosts,
  getLeads,
  getProducts,
  getProjects,
  getSolutions,
  getTemplates,
} from "@/lib/cms";
import { cn } from "@/lib/utils";

type DashboardContentItem = {
  id: string;
  title: string;
  type: string;
  href: string;
  updatedAt: unknown;
  published?: boolean | null;
};

function toTimestamp(value: unknown) {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatDate(value: unknown) {
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Tarih yok";

  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function sortByUpdatedAt(items: DashboardContentItem[]) {
  return [...items].sort(
    (left, right) => toTimestamp(right.updatedAt) - toTimestamp(left.updatedAt)
  );
}

export default async function AdminDashboardPage() {
  const [stats, leads, products, solutions, projects, posts, templates] = await Promise.all([
    getAdminDashboardStats(),
    getLeads(),
    getProducts({ includeDrafts: true }),
    getSolutions({ includeDrafts: true }),
    getProjects({ includeDrafts: true }),
    getBlogPosts({ includeDrafts: true }),
    getTemplates({ includeDrafts: true }),
  ]);

  const pendingLeads = leads.filter((lead: any) => lead.status === "NEW");
  const latestLeads = pendingLeads.length ? pendingLeads.slice(0, 3) : leads.slice(0, 3);

  const cards = [
    { label: "Ürün", value: stats.products, href: "/admin/products" },
    { label: "Çözüm", value: stats.solutions, href: "/admin/services" },
    { label: "Proje", value: stats.projects, href: "/admin/projects" },
    { label: "Şablon", value: stats.templates, href: "/admin/templates" },
    { label: "Blog", value: stats.posts, href: "/admin/blog" },
    { label: "Mesaj", value: stats.leads, href: "/admin/messages" },
    { label: "Medya", value: stats.media, href: "/admin/media" },
  ];

  const latestContent = sortByUpdatedAt([
    ...products.map((item: any) => ({
      id: item.id,
      title: item.title,
      type: "Ürün",
      href: "/admin/products",
      updatedAt: item.updatedAt ?? item.createdAt,
      published: item.published,
    })),
    ...solutions.map((item: any) => ({
      id: item.id,
      title: item.title,
      type: "Çözüm",
      href: "/admin/services",
      updatedAt: item.updatedAt ?? item.createdAt,
      published: item.published,
    })),
    ...projects.map((item: any) => ({
      id: item.id,
      title: item.title,
      type: "Proje",
      href: item.id ? `/admin/projects/${item.id}` : "/admin/projects",
      updatedAt: item.updatedAt ?? item.createdAt,
      published: item.published,
    })),
    ...posts.map((item: any) => ({
      id: item.id,
      title: item.title,
      type: "Blog",
      href: item.id ? `/admin/blog/${item.id}` : "/admin/blog",
      updatedAt: item.updatedAt ?? item.publishedAt ?? item.createdAt,
      published: item.published,
    })),
    ...templates.map((item: any) => ({
      id: item.id,
      title: item.title,
      type: "Şablon",
      href: item.id ? `/admin/templates/${item.id}` : "/admin/templates",
      updatedAt: item.updatedAt ?? item.createdAt,
      published: item.published,
    })),
  ]).slice(0, 7);

  const quickActions = [
    {
      label: "Ürün ekle",
      description: "Ürün kataloğuna yeni kayıt aç",
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Proje ekle",
      description: "Portfolyo için yeni iş oluştur",
      href: "/admin/projects/new",
      icon: Briefcase,
    },
    {
      label: "Blog ekle",
      description: "Yeni içerik veya duyuru yaz",
      href: "/admin/blog/new",
      icon: FileText,
    },
    {
      label: "Şablon ekle",
      description: "Hazır şablon kataloğunu büyüt",
      href: "/admin/templates/new",
      icon: LayoutTemplate,
    },
    {
      label: "Medya yükle",
      description: "Görsel ve dosya kütüphanesini aç",
      href: "/admin/media",
      icon: Image,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Yönetim Paneli"
        description="Tek Next.js uygulaması içindeki local CMS, mesaj ve medya yönetimi."
      />

      <AdminActionForm
        action={seedDefaultContentAction}
        className="mb-8 rounded-lg border border-border bg-card p-5"
        successMessage="Başlangıç içerikleri veritabanına aktarıldı."
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-black">Başlangıç içeriklerini aktar</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Mevcut statik ürün, çözüm, proje, blog ve şablon içeriklerini MySQL&apos;e kaydeder.
            </p>
          </div>
          <AdminSubmitButton pendingChildren="Aktarılıyor">
            Veritabanına aktar
          </AdminSubmitButton>
        </div>
      </AdminActionForm>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/admin/messages?status=NEW"
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-6 transition-colors hover:border-amber-500/50"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-black text-amber-800">Yanıt bekleyen mesaj</p>
            <BellRing className="h-5 w-5 text-amber-700" />
          </div>
          <p className="mt-3 text-4xl font-black tracking-tight">{pendingLeads.length}</p>
          <p className="mt-2 text-xs font-bold text-amber-800/80">
            Yeni durumundaki talepleri aç
          </p>
        </Link>

        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-macework/50"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-muted-foreground">{card.label}</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-4xl font-black tracking-tight">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
        <section className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-lg font-black">Son güncellenen içerikler</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                İçerik tarafında en son dokunulan kayıtlar.
              </p>
            </div>
            <Clock3 className="h-5 w-5 text-macework" />
          </div>

          <div className="divide-y divide-border">
            {latestContent.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.href}
                className="grid gap-3 px-5 py-4 transition-colors hover:bg-muted/50 md:grid-cols-[1fr_auto]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-macework/10 px-2.5 py-1 text-xs font-black text-macework">
                      {item.type}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-bold",
                        item.published
                          ? "bg-emerald-500/10 text-emerald-700"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.published ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                  <p className="mt-2 truncate font-black">{item.title}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground md:justify-end">
                  <Clock3 className="h-4 w-4" />
                  {formatDate(item.updatedAt)}
                </div>
              </Link>
            ))}

            {latestContent.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground">
                Henüz güncellenmiş içerik bulunamadı.
              </p>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-lg font-black">Hızlı ekle</h2>
              <p className="mt-1 text-sm text-muted-foreground">Sık kullanılan oluşturma akışları.</p>
            </div>
            <PlusCircle className="h-5 w-5 text-macework" />
          </div>

          <div className="grid divide-y divide-border">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-macework/10 text-macework">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black">{action.label}</span>
                      <span className="mt-1 block truncate text-xs font-medium text-muted-foreground">
                        {action.description}
                      </span>
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-black">Mesaj takibi</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Öncelik yeni mesajlarda; yeni yoksa son gelen talepler gösterilir.
            </p>
          </div>
          <Link
            href="/admin/messages"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
          >
            <Mail className="h-4 w-4" />
            Tümünü gör
          </Link>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-3">
          {latestLeads.map((lead: any) => (
            <Link
              key={lead.id}
              href={`/admin/messages?id=${lead.id}`}
              className="rounded-lg border border-border bg-background p-4 transition-colors hover:border-macework/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-black">{lead.name}</p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{lead.email}</p>
                </div>
                {lead.status === "NEW" ? (
                  <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-black text-amber-700">
                    Yeni
                  </span>
                ) : null}
              </div>
              <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {lead.message}
              </p>
            </Link>
          ))}

          {latestLeads.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-border p-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-bold text-muted-foreground">Henüz mesaj yok.</p>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
