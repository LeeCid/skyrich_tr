import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  useListBanners, getListBannersQueryKey, 
  useListBatteries, getListBatteriesQueryKey, 
  useListPopups, getListPopupsQueryKey,
  useGetHeroSettings, getGetHeroSettingsQueryKey
} from "@workspace/api-client-react";
import { Zap, Shield, Battery as BatteryIcon, ArrowRight, MessageCircle, CheckCircle2, Users, Info, Search } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { ProductCard } from "@/components/products/product-card";
import { ProductImageStage } from "@/components/products/product-image-stage";
import { hasVerifiedImage } from "@/lib/product-image-resolver";

export default function Home() {
  const { data: banners } = useListBanners({ active: true }, { query: { queryKey: getListBannersQueryKey({ active: true }) } });
  const { data: featuredBatteries } = useListBatteries({ featured: true }, { query: { queryKey: getListBatteriesQueryKey({ featured: true }) } });
  const { data: popups } = useListPopups({ active: true }, { query: { queryKey: getListPopupsQueryKey({ active: true }) } });
  const { data: hero } = useGetHeroSettings({ query: { queryKey: getGetHeroSettingsQueryKey() } });

  // Ensure featuredBatteries is an array
  const batteryList = Array.isArray(featuredBatteries) ? featuredBatteries : [];

  // Filter featured batteries to only include clean, high-confidence SKUs
  const safeFeaturedBatteries = batteryList.filter(b => 
    b.active && b.featured && hasVerifiedImage(b.modelCode) &&
    ['HJTX9-FP', 'HJTX14H-FP', 'HJ51913-FP', 'HJT9B-FP', 'HJTZ14S-FP'].includes(b.modelCode)
  ) || [];

  // Prioritize default featured SKUs
  const defaultSKUs = ['HJTX9-FP', 'HJTX14H-FP', 'HJ51913-FP'];
  const sortedFeaturedBatteries = [...safeFeaturedBatteries].sort((a, b) => {
    const aIndex = defaultSKUs.indexOf(a.modelCode);
    const bIndex = defaultSKUs.indexOf(b.modelCode);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  // Take first 3 for homepage
  const homepageFeaturedBatteries = sortedFeaturedBatteries.slice(0, 3);

  const [emblaRef] = useEmblaCarousel({ loop: true });
  const [activePopup, setActivePopup] = useState<any>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Skyrich Battery Türkiye",
      url: "https://www.skyrichbattery.com.tr",
      logo: "https://www.skyrichbattery.com.tr/favicon.svg",
      description: "Skyrich lityum akülerinin Türkiye distribütörü.",
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  useEffect(() => {
    if (!popups || popups.length === 0) return;

    const popup = popups[0];
    const now = new Date();

    if (popup.startDate && new Date(popup.startDate) > now) return;
    if (popup.endDate && new Date(popup.endDate) < now) return;
    if (popup.frequency === 'disabled') return;
    if (popup.frequency === 'once-per-session') {
      const hasSeen = sessionStorage.getItem(`popup_session_${popup.id}`);
      if (hasSeen) return;
    }

    const timer = setTimeout(() => {
      setActivePopup(popup);
      if (popup.frequency === 'once-per-session') {
        sessionStorage.setItem(`popup_session_${popup.id}`, 'true');
      }
    }, (popup.delaySeconds || 0) * 1000);

    return () => clearTimeout(timer);
  }, [popups]);

  const heroTitle = hero?.title || "Skyrich Lityum Akü Modelleri";
  const heroSubtitle = hero?.subtitle || "Powersport araçlar için Skyrich lityum akü modellerini inceleyin; uyumlu model seçimi için teknik destek alın.";
  const heroEyebrow = "Lityum Akü Kataloğu";
  const cta1Text = hero?.cta1Text || "Ürünleri İncele";
  const cta1Link = hero?.cta1Link || "/urunler";
  const cta2Text = hero?.cta2Text || "Uyumlu Aküyü Sor";
  const cta2Link = hero?.cta2Link || "/aku-bulucu";

  return (
    <div className="flex flex-col w-full">
      {/* Hero Carousel */}
      <section className="relative w-full h-[700px] md:h-[850px] bg-background overflow-hidden border-b border-border">
        {banners && banners.length > 0 ? (
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {banners.map((banner, idx) => (
                <div key={banner.id} className="relative flex-[0_0_100%] min-w-0 h-full editorial-section">
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${banner.imageUrl || '/images/hero/hero-1.png'})`,
                    }}
                  >
                    {/* Layered cinematic overlay - lighter than before */}
                    <div className="absolute inset-0 hero-overlay" />
                    <div className="absolute inset-0 hero-overlay-bottom" />
                  </div>
                  <div className="relative h-full flex flex-col items-start justify-center text-left px-4 md:px-16 lg:px-24 z-10 max-w-5xl mx-auto">
                    <div className="space-y-8">
                      {/* Eyebrow - draws in with delay */}
                      <div className={`inline-block ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: `${idx * 100 + 100}ms` }}>
                        <span className="section-eyebrow red-accent-line">
                          {heroEyebrow}
                        </span>
                      </div>
                      {/* Title - reveals with slight upward movement after eyebrow */}
                      <h1 className={`display-title text-white mb-6 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: `${idx * 100 + 200}ms` }}>
                        {banner.title}
                      </h1>
                      {/* Subtitle - fades in after title */}
                      {banner.subtitle && (
                        <p className={`text-lg md:text-xl text-text-secondary mb-10 max-w-2xl leading-relaxed font-light ${!prefersReducedMotion ? 'reveal-fade' : ''}`} style={{ animationDelay: `${idx * 100 + 300}ms` }}>
                          {banner.subtitle}
                        </p>
                      )}
                      {/* CTAs - reveal after subtitle */}
                      {banner.linkUrl && banner.linkText && (
                        <div className={`flex gap-4 flex-wrap ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: `${idx * 100 + 400}ms` }}>
                          <Button asChild size="lg" className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-12 py-6 rounded-none font-bold tracking-widest border border-primary-border shadow-premium">
                            <Link href={banner.linkUrl} className="flex items-center gap-3">
                              {banner.linkText}
                              <ArrowRight size={20} />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="relative h-full flex flex-col items-start justify-center text-left px-4 md:px-16 lg:px-24 z-10 bg-cover bg-center editorial-section"
            style={{ backgroundImage: `url(${hero?.bgImageUrl || '/images/hero/hero-1.png'})` }}
          >
            {/* Layered cinematic overlay */}
            <div className="absolute inset-0 hero-overlay" />
            <div className="absolute inset-0 hero-overlay-bottom" />
            <div className="relative z-10 max-w-5xl">
              <div className={`space-y-10 ${!prefersReducedMotion ? 'reveal-up' : ''}`}>
                <div className="inline-block">
                  <span className="section-eyebrow">
                    {heroEyebrow}
                  </span>
                </div>
                <h1 className="display-title text-white mb-6">
                  {heroTitle}
                </h1>
                <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl leading-relaxed font-light">
                  {heroSubtitle}
                </p>
                <div className="flex gap-4 flex-wrap">
                  {hero?.cta1Text && hero?.cta1Link && (
                    <Button asChild size="lg" className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-none shadow-premium">
                      <Link href={hero.cta1Link} className="flex items-center gap-3">
                        {hero.cta1Text}
                        <ArrowRight size={20} />
                      </Link>
                    </Button>
                  )}
                  {hero?.cta2Text && hero?.cta2Link && (
                    <Button asChild size="lg" variant="outline" className="btn-premium rounded-none border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <Link href={hero.cta2Link} className="flex items-center gap-3">
                        {hero.cta2Text}
                        <MessageCircle size={20} />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust Strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border">
          <div className="premium-container py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
              <div className={`flex items-center gap-3 justify-center md:justify-start ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '500ms' }}>
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-text-secondary font-mono">12 onaylı model</span>
              </div>
              <div className={`flex items-center gap-3 justify-center md:justify-start ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '600ms' }}>
                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-text-secondary font-mono">Teknik destek</span>
              </div>
              <div className={`flex items-center gap-3 justify-center md:justify-start ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '700ms' }}>
                <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-text-secondary font-mono">WhatsApp hızlı yönlendirme</span>
              </div>
              <div className={`flex items-center gap-3 justify-center md:justify-start ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '800ms' }}>
                <Info className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-text-secondary font-mono">Doğrulanmış bilgi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Clean Premium Catalog */}
      <section className="premium-section bg-tonal-soft relative overflow-hidden py-20 md:py-24 border-t border-border">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-primary via-primary/50 to-transparent" />
        <div className="premium-container relative z-10">
          {/* Section Header */}
          <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '100ms' }}>
            <div className="space-y-3">
              <span className="section-eyebrow red-accent-line text-sm">Öne Çıkanlar</span>
              <h2 className="editorial-title text-3xl md:text-4xl">Öne Çıkan Modeller</h2>
              <p className="text-text-secondary max-w-xl leading-relaxed text-sm md:text-base">
                Seçili Skyrich lityum akü modellerini teknik katalog yapısıyla inceleyin.
              </p>
            </div>
            <Button asChild className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest px-6 py-4 border border-primary/30 text-sm">
              <Link href="/urunler" className="flex items-center gap-2">
                Tüm Katalog <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          {/* Product Grid - 3 Clean Cards */}
          {homepageFeaturedBatteries && homepageFeaturedBatteries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homepageFeaturedBatteries.map((battery, idx) => (
                <div key={battery.id} className={`reveal-up ${!prefersReducedMotion ? '' : ''}`} style={{ animationDelay: `${150 + idx * 100}ms` }}>
                  <ProductCard battery={battery} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 industrial-panel bg-gradient-to-br from-background to-muted/10">
              <BatteryIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold uppercase mb-2">Ürünler Yakında Eklenecek</h3>
              <p className="text-muted-foreground font-mono">Teknik katalog yapısında ürün modelleri hazırlanıyor.</p>
            </div>
          )}
        </div>
      </section>

      {/* Tech Highlights - Asymmetric Layout */}
      <section className="premium-section bg-card border-t border-border relative overflow-hidden editorial-gradient py-24 md:py-32">
        <div className="premium-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={`space-y-8 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '100ms' }}>
              <div>
                <span className="section-eyebrow">Teknoloji</span>
                <h2 className="editorial-title mb-6">Neden Skyrich?</h2>
                <p className="text-text-secondary leading-relaxed max-w-lg">
                  Endüstri standartlarını belirleyen teknoloji ve güvenilirlik. Powersport araçlar için geliştirilmiş lityum iyon akü çözümleri.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/30 flex-shrink-0">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase mb-2">Hafif Lityum Teknolojisi</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Geleneksel kurşun-asit akülere göre %70 daha hafif, daha yüksek performans.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/30 flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase mb-2">Bakım Gerektirmeyen</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Düşük kendi kendine deşarj oranı ile uzun süre güvenilir performans.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/30 flex-shrink-0">
                    <BatteryIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase mb-2">Teknik Destek</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Uyumlu model seçimi ve teknik bilgi için yetkili distribütör desteği.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`relative ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl" />
              <div className="relative industrial-panel p-8 border-metallic">
                <div className="aspect-square bg-muted/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/images/factory.png')] bg-cover bg-center opacity-20" />
                  <div className="relative z-10 text-center">
                    <div className="text-6xl font-bold text-primary mb-2">12+</div>
                    <div className="text-sm uppercase tracking-widest text-text-secondary">Onaylı Model</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Battery Finder CTA - Dramatic Section */}
      <section className="premium-section bg-tonal-highlight relative overflow-hidden py-32 md:py-40">
        <div className="absolute inset-0 hero-overlay opacity-50" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="premium-container relative z-10">
          <div className={`max-w-3xl mx-auto text-center space-y-10 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '100ms' }}>
            <div>
              <span className="section-eyebrow">Araç Uyumluluğu</span>
              <h2 className="display-title text-white mb-6">Aracınıza Uygun Skyrich Modelini Bulun</h2>
              <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
                Marka, model ve yıl bilgisiyle doğru ürüne daha hızlı ulaşın. WhatsApp ile teknik destek alabilirsiniz.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild size="lg" className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest px-12 py-7 text-lg shadow-premium-lg">
                <Link href="/aku-bulucu" className="flex items-center justify-center gap-3">
                  <Search className="w-5 h-5" />
                  Akü Bulucuya Git
                  <ArrowRight size={22} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn-premium rounded-none border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest px-12 py-7 text-lg">
                <Link href="/iletisim" className="flex items-center justify-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  Teknik Destek
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popup */}
      <Dialog open={!!activePopup} onOpenChange={() => setActivePopup(null)}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border p-0 overflow-hidden rounded-none">
          {activePopup?.imageUrl && (
            <div className="w-full h-48 bg-muted relative">
              <img src={activePopup.imageUrl} alt={activePopup.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl uppercase tracking-tight">{activePopup?.title}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground text-sm">{activePopup?.content}</p>
            </div>
            {activePopup?.buttonUrl && activePopup?.buttonText && (
              <div className="flex justify-end">
                <Button asChild className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider">
                  {activePopup.buttonUrl.startsWith('https://wa.me/') ? (
                    <a href={activePopup.buttonUrl} target="_blank" rel="noopener noreferrer">{activePopup.buttonText}</a>
                  ) : (
                    <Link href={activePopup.buttonUrl}>{activePopup.buttonText}</Link>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
