import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-mono text-2xl font-bold tracking-tighter text-primary">SKYRICH</span>
              <span className="text-sm font-semibold tracking-widest text-muted-foreground">POWER</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Yüksek performanslı lityum ve AGM motosiklet aküleri. Türkiye'nin gücü.
            </p>
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
              <li><Link href="/urunler?category=AGM" className="hover:text-primary transition-colors">AGM Aküler</Link></li>
              <li><Link href="/urunler?category=GEL" className="hover:text-primary transition-colors">Jel Aküler</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">İletişim</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>info@skyrichbattery.com.tr</li>
              <li>+90 (212) 555 00 00</li>
              <li>İstanbul, Türkiye</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Skyrich Battery Türkiye. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/admin" className="hover:text-primary transition-colors">Yönetici Girişi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
