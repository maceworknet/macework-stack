"use server";

import { redirect } from "next/navigation";
import {
  authenticateAdmin,
  createAdminSession,
  destroyCurrentSession,
} from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const user = await authenticateAdmin(email, password);
  if (!user) {
    redirect("/login?error=invalid");
  }

  await createAdminSession(user.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroyCurrentSession();
  redirect("/login");
}
