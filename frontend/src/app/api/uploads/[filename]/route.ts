import { NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { getUploadDir } from "@/lib/upload";

export const runtime = "nodejs";

// Desteklenen MIME tipleri ve uzantı eşleşmeleri
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Dizin geçişi saldırılarına karşı güvenlik kontrolü
  const safe = path.basename(filename);
  if (!safe || safe !== filename || safe.startsWith(".")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const uploadDir = getUploadDir();
  const filePath = path.join(uploadDir, safe);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const fileStat = await stat(filePath);
    const ext = path.extname(safe).toLowerCase();
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

    const stream = createReadStream(filePath);
    const webStream = Readable.toWeb(stream) as ReadableStream;

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(fileStat.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Read error" }, { status: 500 });
  }
}
