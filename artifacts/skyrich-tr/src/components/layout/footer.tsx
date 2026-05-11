import { Link } from "wouter";
import { useGetSiteSettings, getGetSiteSettingsQueryKey, useGetPageContent, getGetPageContentQueryKey } from "@workspace/api-client-react";

export function Footer() {
  const { data: settings } = useGetSiteSettings({ query: { queryKey: getGetSiteSettingsQueryKey() } });
  const { data: footerContent } = useGetPageContent("footer-description", { query: { queryKey: getGetPageContentQueryKey("footer-description") } });

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-mono text-2xl font-bold tracking-tighter text-primary">SKYRICH</span>
              <span className="text-sm font-semibold tracking-widest text-muted-foreground">POWER</span>
            </Link>
            {footerContent?.content && (
              <p className="text-sm text-muted-foreground">
                {footerContent.content}
              </p>
            )}
            <div className="flex gap-4 pt-2 text-muted-foreground">
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Instagram
                </a>
              )}
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Facebook
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/urunler" className="hover:text-primary transition-colors">Tüm Ürünler</Link></li>
              <li><Link href="/hakkimizda" className="hover:text-primary transition-colors">Hakkımızda</Link></li>
              <li><Link href="/iletisim" className="hover:text-primary transition-colors">İletişim</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Kategoriler</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/urunler?category=Lithium" className="hover:text-primary transition-colors">Lityum Aküler</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">İletişim</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {settings?.email && <li>{settings.email}</li>}
              {settings?.phone && <li>{settings.phone}</li>}
              {settings?.whatsapp && <li>Whatsapp: {settings.whatsapp}</li>}
              {settings?.address && <li>{settings.address}</li>}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Skyrich Battery Türkiye. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
