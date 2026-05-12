import { Link } from "wouter";
import { useGetSiteSettings, getGetSiteSettingsQueryKey, useGetPageContent, getGetPageContentQueryKey } from "@workspace/api-client-react";
import { Logo } from "@/components/brand/logo";

export function Footer() {
  const { data: settings } = useGetSiteSettings({ query: { queryKey: getGetSiteSettingsQueryKey() } });
  const { data: footerContent } = useGetPageContent("footer-description", { query: { queryKey: getGetPageContentQueryKey("footer-description") } });

  return (
    <footer className="border-t border-border/50 bg-tonal-panel relative overflow-hidden">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="premium-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-8 lg:col-span-1">
            <Link href="/" className="inline-flex items-center group">
              <Logo variant="footer" className="h-10 max-w-[200px] md:h-12 md:max-w-[240px] transition-transform duration-300 group-hover:scale-105" alt="Skyrich Battery Türkiye" />
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed">
              {footerContent?.content || "Skyrich Battery Türkiye, lityum akü modelleri için katalog ve teknik destek odaklı resmi distribütör web sitesidir."}
            </p>
            {settings?.instagram && (
              <div className="pt-2">
                <a 
                  href={settings.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-text-secondary hover:text-primary transition-colors font-medium"
                >
                  Instagram
                </a>
              </div>
            )}
          </div>

          {/* Quick Links - Catalog */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-sm mb-6 text-text-muted">Katalog</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/urunler" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link href="/aku-bulucu" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Akü Bulucu
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links - Corporate */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-sm mb-6 text-text-muted">Kurumsal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/hakkimizda" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm text-text-secondary hover:text-primary transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-sm mb-6 text-text-muted">İletişim</h3>
            <ul className="space-y-4 text-sm text-text-secondary">
              {settings?.phone && (
                <li className="font-mono hover:text-primary transition-colors">
                  <a href={`tel:${settings.phone.replace(/\D/g, '')}`}>
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="font-mono hover:text-primary transition-colors break-all">
                  <a href={`mailto:${settings.email}`}>
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="whitespace-pre-wrap">{settings.address}</li>
              )}
              {!settings?.phone && !settings?.email && !settings?.address && (
                <li className="text-text-muted italic">
                  İletişim bilgileri admin panelinden eklendiğinde burada görüntülenecek.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-text-muted">
            {new Date().getFullYear()} Skyrich Battery Türkiye. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-8 text-sm text-text-muted">
            <Link href="/hakkimizda" className="hover:text-primary transition-colors">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="hover:text-primary transition-colors">
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
