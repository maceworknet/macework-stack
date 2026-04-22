import { redirect } from "next/navigation";
import { loginAction } from "@/actions/auth/login";
import { getCurrentUser } from "@/lib/auth";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-bold text-macework">Macework Admin</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Giriş yap</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Local CMS paneline erişmek için admin hesabını kullanın.
          </p>
        </div>

        {params.error ? (
          <div className="mb-5 rounded-md border border-macework/30 bg-macework/10 px-4 py-3 text-sm font-bold text-macework">
            E-posta veya şifre hatalı.
          </div>
        ) : null}

        <form action={loginAction} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold">
              E-posta
            </label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-bold">
              Şifre
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <button className="h-11 w-full rounded-md bg-macework text-sm font-black text-white transition-colors hover:bg-macework-hover">
            Giriş yap
          </button>
        </form>
      </div>
    </main>
  );
}
