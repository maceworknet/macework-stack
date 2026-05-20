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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        className="mb-8 rounded-xl border border-border bg-card p-5 shadow-sm"
        successMessage="Başlangıç içerikleri veritabanına aktarıldı."
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold">Başlangıç içeriklerini aktar</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Mevcut statik ürün, çözüm, proje, blog ve şablon içeriklerini MySQL&apos;e kaydeder.
            </p>
          </div>
          <AdminSubmitButton pendingChildren="Aktarılıyor">
            Veritabanına aktar
          </AdminSubmitButton>
        </div>
      </AdminActionForm>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/admin/messages?status=NEW"
          className="group relative overflow-hidden rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 transition-all hover:border-amber-500/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-amber-800">Yanıt bekleyen mesaj</p>
            <BellRing className="h-5 w-5 text-amber-700" />
          </div>
          <p className="mt-3 text-4xl font-black tracking-tight">{pendingLeads.length}</p>
          <p className="mt-2 text-xs font-semibold text-amber-800/80">
            Yeni durumundaki talepleri aç
          </p>
        </Link>

        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-macework/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-muted-foreground">{card.label}</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="mt-3 text-4xl font-black tracking-tight">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Content + Quick Actions */}
      <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 border-b border-border pb-4">
            <div>
              <CardTitle className="text-lg font-black">Son güncellenen içerikler</CardTitle>
              <CardDescription className="mt-1">
                İçerik tarafında en son dokunulan kayıtlar.
              </CardDescription>
            </div>
            <Clock3 className="h-5 w-5 shrink-0 text-macework" />
          </CardHeader>

          <CardContent className="divide-y divide-border p-0">
            {latestContent.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.href}
                className="grid gap-3 px-5 py-4 transition-colors hover:bg-muted/50 md:grid-cols-[1fr_auto]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-macework/10 text-macework hover:bg-macework/20"
                    >
                      {item.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        item.published
                          ? "border-emerald-200 bg-emerald-500/10 text-emerald-700"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.published ? "Yayında" : "Taslak"}
                    </Badge>
                  </div>
                  <p className="mt-2 truncate font-bold">{item.title}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground md:justify-end">
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
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 border-b border-border pb-4">
            <div>
              <CardTitle className="text-lg font-black">Hızlı ekle</CardTitle>
              <CardDescription className="mt-1">Sık kullanılan oluşturma akışları.</CardDescription>
            </div>
            <PlusCircle className="h-5 w-5 shrink-0 text-macework" />
          </CardHeader>

          <CardContent className="grid divide-y divide-border p-0">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-macework/10 text-macework">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold">{action.label}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {action.description}
                      </span>
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Message tracking */}
      <Card className="mt-6 overflow-hidden shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 border-b border-border pb-4">
          <div>
            <CardTitle className="text-lg font-black">Mesaj takibi</CardTitle>
            <CardDescription className="mt-1">
              Öncelik yeni mesajlarda; yeni yoksa son gelen talepler gösterilir.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 gap-2">
            <Link href="/admin/messages" className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Tümünü gör
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="grid gap-4 p-5 md:grid-cols-3">
          {latestLeads.map((lead: any) => (
            <Link
              key={lead.id}
              href={`/admin/messages?id=${lead.id}`}
              className="rounded-xl border border-border bg-background p-4 transition-all hover:border-macework/40 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold">{lead.name}</p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{lead.email}</p>
                </div>
                {lead.status === "NEW" ? (
                  <Badge className="shrink-0 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20">
                    Yeni
                  </Badge>
                ) : null}
              </div>
              <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {lead.message}
              </p>
            </Link>
          ))}

          {latestLeads.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-border p-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-semibold text-muted-foreground">Henüz mesaj yok.</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}
