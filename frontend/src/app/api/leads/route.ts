import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createLead, getLeads } from "@/lib/cms";
import { getCurrentUser } from "@/lib/auth";
import { leadSchema } from "@/lib/validations/lead";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await getLeads();
  return NextResponse.json({ data: leads });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const payload = body?.data ?? body;
  const parsed = leadSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid lead payload", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const lead = await createLead(parsed.data);
  if (!lead) {
    return NextResponse.json(
      { error: "Lead could not be stored" },
      { status: 503 }
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/messages");

  return NextResponse.json({ ok: true, stored: Boolean(lead), data: lead });
}
