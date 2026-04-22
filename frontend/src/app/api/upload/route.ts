import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, withDatabase } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  try {
    const saved = await saveUploadedFile(file);
    const record = await withDatabase(
      () =>
        prisma.mediaFile.create({
          data: saved,
        }),
      null
    );

    return NextResponse.json({ ok: true, file: record ?? saved });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 }
    );
  }
}
