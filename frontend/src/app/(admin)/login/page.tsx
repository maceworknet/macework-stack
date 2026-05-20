import { redirect } from "next/navigation";
import { loginAction } from "@/actions/auth/login";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, LogIn } from "lucide-react";

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
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-macework/10 text-2xl font-black text-macework">
            M
          </div>
          <p className="mt-3 text-sm font-bold text-muted-foreground">Macework Admin</p>
        </div>

        <Card className="shadow-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-black tracking-tight">Giriş yap</CardTitle>
            <CardDescription>
              Local CMS paneline erişmek için admin hesabını kullanın.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {params.error ? (
              <Alert variant="destructive" className="mb-5">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>E-posta veya şifre hatalı.</AlertDescription>
              </Alert>
            ) : null}

            <form action={loginAction} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@sirket.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                className="w-full gap-2 bg-macework text-white hover:bg-macework-hover"
                size="lg"
              >
                <LogIn className="h-4 w-4" />
                Giriş yap
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
