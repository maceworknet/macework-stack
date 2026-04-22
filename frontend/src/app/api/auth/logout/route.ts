import { NextResponse } from "next/server";
import { destroyCurrentSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await destroyCurrentSession();
  return NextResponse.redirect(new URL("/login", request.url));
}
