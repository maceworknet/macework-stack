import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

function getUploadLimit() {
  const fromEnv = Number(process.env.UPLOAD_MAX_BYTES);
  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : DEFAULT_MAX_FILE_SIZE;
}

function safeExtension(fileName: string) {
  const ext = path.extname(fileName).toLowerCase().replace(/[^a-z0-9.]/g, "");
  return ext || ".bin";
}

export async function saveUploadedFile(file: File) {
  if (!file || file.size === 0) {
    throw new Error("Empty file");
  }

  if (file.size > getUploadLimit()) {
    throw new Error("File is too large");
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Unsupported file type");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filename = `${randomUUID()}${safeExtension(file.name)}`;
  const filePath = path.join(uploadDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, bytes);

  return {
    filename,
    originalName: file.name,
    url: `/uploads/${filename}`,
    mimeType: file.type,
    size: file.size,
  };
}
