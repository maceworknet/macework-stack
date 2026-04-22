import { AdminShell } from "@/components/admin/admin-shell";
import { AdminFeedbackProvider } from "@/components/admin/admin-feedback";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <AdminFeedbackProvider>
      <AdminShell user={user}>{children}</AdminShell>
    </AdminFeedbackProvider>
  );
}
