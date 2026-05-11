import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAdminStats, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { LogOut, Battery, Image as ImageIcon, MessageSquare } from "lucide-react";
import { AdminBatteries } from "./components/admin-batteries";
import { AdminBanners } from "./components/admin-banners";
import { AdminPopups } from "./components/admin-popups";
import { AdminSiteSettings } from "./components/admin-site-settings";
import { AdminHeroSettings } from "./components/admin-hero-settings";
import { AdminPageContents } from "./components/admin-page-contents";

export default function AdminPanel() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLocation("/admin");
  };

  const { data: stats } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey() } });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="font-mono text-xl font-bold tracking-tighter text-primary">SKYRICH <span className="text-muted-foreground text-sm font-semibold">ADMIN</span></div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground">
            <Link href="/" target="_blank">Siteyi Görüntüle</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-none border-border">
            <LogOut size={16} className="mr-2" /> Çıkış Yap
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-4 border border-primary/20"><Battery className="text-primary" size={24} /></div>
            <div>
              <div className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-1">Toplam Akü</div>
              <div className="text-3xl font-mono font-bold">{stats?.totalBatteries || 0}</div>
            </div>
          </div>
          <div className="bg-card border border-border p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-4 border border-primary/20"><Battery className="text-primary" size={24} /></div>
            <div>
              <div className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-1">Aktif Akü</div>
              <div className="text-3xl font-mono font-bold">{stats?.activeBatteries || 0}</div>
            </div>
          </div>
          <div className="bg-card border border-border p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-4 border border-primary/20"><ImageIcon className="text-primary" size={24} /></div>
            <div>
              <div className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-1">Aktif Banner</div>
              <div className="text-3xl font-mono font-bold">{stats?.activeBanners || 0}</div>
            </div>
          </div>
          <div className="bg-card border border-border p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-4 border border-primary/20"><MessageSquare className="text-primary" size={24} /></div>
            <div>
              <div className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-1">Aktif Popup</div>
              <div className="text-3xl font-mono font-bold">{stats?.activePopups || 0}</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="batteries" className="w-full">
          <TabsList className="bg-card border border-border rounded-none p-1 h-12 mb-6 w-full justify-start overflow-x-auto flex-wrap sm:flex-nowrap min-h-max">
            <TabsTrigger value="batteries" className="rounded-none uppercase tracking-wider font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Aküler</TabsTrigger>
            <TabsTrigger value="banners" className="rounded-none uppercase tracking-wider font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Bannerlar</TabsTrigger>
            <TabsTrigger value="popups" className="rounded-none uppercase tracking-wider font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Popuplar</TabsTrigger>
            <TabsTrigger value="site" className="rounded-none uppercase tracking-wider font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Site Ayarları</TabsTrigger>
            <TabsTrigger value="hero" className="rounded-none uppercase tracking-wider font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Hero Ayarları</TabsTrigger>
            <TabsTrigger value="pages" className="rounded-none uppercase tracking-wider font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sayfa İçerikleri</TabsTrigger>
          </TabsList>
          
          <TabsContent value="batteries">
            <AdminBatteries />
          </TabsContent>
          
          <TabsContent value="banners">
            <AdminBanners />
          </TabsContent>
          
          <TabsContent value="popups">
            <AdminPopups />
          </TabsContent>

          <TabsContent value="site">
            <AdminSiteSettings />
          </TabsContent>

          <TabsContent value="hero">
            <AdminHeroSettings />
          </TabsContent>

          <TabsContent value="pages">
            <AdminPageContents />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
