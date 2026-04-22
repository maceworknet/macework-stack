import Link from "next/link";
import {
  Archive,
  Building2,
  CalendarDays,
  CheckCircle2,
  Inbox,
  Mail,
  MailOpen,
  MessageSquareText,
  Tag,
  Trash2,
} from "lucide-react";
import { deleteLeadAction, updateLeadStatusAction } from "@/actions/admin/content";
import {
  AdminActionForm,
  AdminSubmitButton,
  ConfirmSubmitButton,
} from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getLeads } from "@/lib/cms";
import { cn } from "@/lib/utils";
import type { RawSearchParams } from "@/lib/admin-listing";

type LeadStatusValue = "NEW" | "READ" | "ARCHIVED";

const statusConfig: Record<
  LeadStatusValue,
  {
    label: string;
    detailLabel: string;
    className: string;
    icon: typeof Inbox;
  }
> = {
  NEW: {
    label: "Yeni",
    detailLabel: "Yeni mesaj",
    className: "bg-amber-500/10 text-amber-700 ring-amber-500/20",
    icon: Inbox,
  },
  READ: {
    label: "Okundu",
    detailLabel: "Okundu",
    className: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
    icon: CheckCircle2,
  },
  ARCHIVED: {
    label: "Arşiv",
    detailLabel: "Arşivlendi",
    className: "bg-muted text-muted-foreground ring-border",
    icon: Archive,
  },
};

const statusFilters: Array<{ label: string; value: LeadStatusValue | ""; icon: typeof Inbox }> = [
  { label: "Tümü", value: "", icon: Inbox },
  { label: "Yeni", value: "NEW", icon: Mail },
  { label: "Okundu", value: "READ", icon: MailOpen },
  { label: "Arşiv", value: "ARCHIVED", icon: Archive },
];

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function isLeadStatus(value: string): value is LeadStatusValue {
  return value === "NEW" || value === "READ" || value === "ARCHIVED";
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

function formatDateTime(value: unknown) {
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Tarih yok";

  return date.toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function messagePreview(message?: string | null) {
  const cleanMessage = String(message ?? "").replace(/\s+/g, " ").trim();
  if (!cleanMessage) return "Mesaj içeriği yok.";

  return cleanMessage.length > 92 ? `${cleanMessage.slice(0, 92)}...` : cleanMessage;
}

function buildMessagesUrl(status: LeadStatusValue | "", id?: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (id) params.set("id", id);

  const query = params.toString();
  return query ? `/admin/messages?${query}` : "/admin/messages";
}

function StatusBadge({ status }: { status: LeadStatusValue }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black ring-1",
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function StatusActionButton({
  id,
  status,
  children,
  variant = "default",
}: {
  id: string;
  status: LeadStatusValue;
  children: React.ReactNode;
  variant?: "default" | "primary";
}) {
  return (
    <AdminActionForm action={updateLeadStatusAction} successMessage="Mesaj durumu güncellendi.">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <AdminSubmitButton
        pendingChildren="Güncelleniyor"
        className={cn(
          "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-black transition-colors",
          variant === "primary"
            ? "border-macework bg-macework text-white hover:bg-macework/90"
            : "border-border bg-background hover:bg-muted"
        )}
      >
        {children}
      </AdminSubmitButton>
    </AdminActionForm>
  );
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const requestedStatus = firstValue(params.status).trim();
  const activeStatus = isLeadStatus(requestedStatus) ? requestedStatus : "";
  const selectedId = firstValue(params.id).trim();

  const leads = await getLeads();
  const visibleLeads = activeStatus
    ? leads.filter((lead: any) => lead.status === activeStatus)
    : leads;
  const selectedLead =
    visibleLeads.find((lead: any) => lead.id === selectedId) ?? visibleLeads[0] ?? null;

  const statusCounts = leads.reduce(
    (counts: Record<LeadStatusValue, number>, lead: any) => {
      if (isLeadStatus(lead.status)) counts[lead.status] += 1;
      return counts;
    },
    { NEW: 0, READ: 0, ARCHIVED: 0 }
  );

  return (
    <>
      <AdminPageHeader
        title="Mesajlar"
        description="İletişim ve teklif formlarından gelen talepleri inbox görünümünde takip edin."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {statusFilters.map((filter) => {
          const isActive = activeStatus === filter.value;
          const Icon = filter.icon;
          const count = filter.value ? statusCounts[filter.value] : leads.length;

          return (
            <Link
              key={filter.label}
              href={buildMessagesUrl(filter.value)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-black transition-colors",
                isActive
                  ? "border-macework bg-macework text-white"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{filter.label}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-black",
                  isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="grid min-h-[620px] lg:grid-cols-[minmax(20rem,25rem)_1fr]">
          <aside className="border-b border-border lg:border-b-0 lg:border-r">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <div>
                <p className="text-sm font-black">Gelen kutusu</p>
                <p className="text-xs font-medium text-muted-foreground">
                  {visibleLeads.length} mesaj gösteriliyor
                </p>
              </div>
              <MessageSquareText className="h-5 w-5 text-macework" />
            </div>

            <div className="max-h-[560px] overflow-y-auto">
              {visibleLeads.map((lead: any) => {
                const status = isLeadStatus(lead.status) ? lead.status : "NEW";
                const isSelected = selectedLead?.id === lead.id;

                return (
                  <Link
                    key={lead.id}
                    href={buildMessagesUrl(activeStatus, lead.id)}
                    className={cn(
                      "block border-b border-border px-4 py-4 text-left transition-colors last:border-0 hover:bg-muted/60",
                      isSelected ? "bg-macework/10" : "bg-card",
                      status === "NEW" ? "font-bold" : "font-medium"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-foreground">{lead.name}</p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-muted-foreground">
                        {formatDate(lead.createdAt)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="truncate text-xs font-bold text-muted-foreground">
                        {lead.interest ?? "Genel talep"}
                      </span>
                      <StatusBadge status={status} />
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {messagePreview(lead.message)}
                    </p>
                  </Link>
                );
              })}

              {visibleLeads.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 text-sm font-bold">Bu filtrede mesaj yok.</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Farklı bir durum filtresi seçebilirsiniz.
                  </p>
                </div>
              ) : null}
            </div>
          </aside>

          <section className="min-w-0">
            {selectedLead ? (
              <div className="flex h-full flex-col">
                <div className="border-b border-border px-5 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge
                          status={isLeadStatus(selectedLead.status) ? selectedLead.status : "NEW"}
                        />
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDateTime(selectedLead.createdAt)}
                        </span>
                      </div>
                      <h2 className="mt-4 text-2xl font-black tracking-tight">
                        {selectedLead.name}
                      </h2>
                      <p className="mt-2 text-sm font-medium text-muted-foreground">
                        {statusConfig[
                          isLeadStatus(selectedLead.status) ? selectedLead.status : "NEW"
                        ].detailLabel}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedLead.status !== "READ" ? (
                        <StatusActionButton
                          id={selectedLead.id}
                          status="READ"
                          variant="primary"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Okundu yap
                        </StatusActionButton>
                      ) : null}
                      {selectedLead.status !== "NEW" ? (
                        <StatusActionButton id={selectedLead.id} status="NEW">
                          <Mail className="h-4 w-4" />
                          Yeni yap
                        </StatusActionButton>
                      ) : null}
                      {selectedLead.status !== "ARCHIVED" ? (
                        <StatusActionButton id={selectedLead.id} status="ARCHIVED">
                          <Archive className="h-4 w-4" />
                          Arşivle
                        </StatusActionButton>
                      ) : null}
                    </div>
                  </div>
                </div>

                <dl className="grid gap-4 border-b border-border px-5 py-5 md:grid-cols-3">
                  <div className="min-w-0">
                    <dt className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      E-posta
                    </dt>
                    <dd className="mt-2 truncate text-sm font-bold">
                      <a href={`mailto:${selectedLead.email}`} className="hover:text-macework">
                        {selectedLead.email}
                      </a>
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" />
                      Firma
                    </dt>
                    <dd className="mt-2 truncate text-sm font-bold">
                      {selectedLead.company ?? "-"}
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      <Tag className="h-3.5 w-3.5" />
                      İlgi
                    </dt>
                    <dd className="mt-2 truncate text-sm font-bold">
                      {selectedLead.interest ?? "Genel talep"}
                    </dd>
                  </div>
                </dl>

                <div className="flex-1 px-5 py-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                    Mesaj içeriği
                  </h3>
                  <p className="mt-4 whitespace-pre-line text-base leading-8 text-foreground">
                    {selectedLead.message}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Son güncelleme: {formatDateTime(selectedLead.updatedAt)}
                  </p>
                  <AdminActionForm action={deleteLeadAction} successMessage="Mesaj silindi.">
                    <input type="hidden" name="id" value={selectedLead.id} />
                    <ConfirmSubmitButton
                      title="Mesaj silinsin mi?"
                      description="Bu mesaj kalıcı olarak silinir ve inbox listesinden kaldırılır."
                      confirmLabel="Sil"
                      pendingChildren="Siliniyor"
                      className="inline-flex h-10 items-center gap-2 rounded-md border border-red-200 bg-background px-4 text-sm font-black text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Sil
                    </ConfirmSubmitButton>
                  </AdminActionForm>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[560px] flex-col items-center justify-center px-6 text-center">
                <Inbox className="h-10 w-10 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-black">Henüz mesaj yok.</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  İletişim formundan gelen talepler burada listelenecek.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
