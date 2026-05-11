import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAdminLogin } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useAdminLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    loginMutation.mutate({ data: { password } }, {
      onSuccess: (data) => {
        if (data.success && data.token) {
          localStorage.setItem("admin_token", data.token);
          toast({
            title: "Giriş Başarılı",
            description: "Yönetici paneline yönlendiriliyorsunuz.",
          });
          setLocation("/admin/panel");
        } else {
          toast({
            title: "Giriş Başarısız",
            description: "Geçersiz şifre.",
            variant: "destructive",
          });
        }
      },
      onError: () => {
        toast({
          title: "Hata",
          description: "Sunucu bağlantı hatası.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 left-4">
        <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={16} /> Siteye Dön
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md rounded-none border-border bg-card shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-8 border-b border-border">
          <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <ShieldAlert size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold uppercase tracking-widest">Yönetici Girişi</CardTitle>
          <CardDescription className="font-mono">Skyrich Sistem Yönetimi</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="pt-8 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Erişim Şifresi</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-none border-border bg-background h-12 text-center font-mono text-lg tracking-widest"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="pb-8">
            <Button 
              type="submit" 
              className="w-full rounded-none h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
