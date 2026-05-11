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
import { Zap, Shield, Battery as BatteryIcon, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

export default function Home() {
  const { data: banners } = useListBanners({ active: true }, { query: { queryKey: getListBannersQueryKey({ active: true }) } });
  const { data: featuredBatteries } = useListBatteries({ featured: true }, { query: { queryKey: getListBatteriesQueryKey({ featured: true }) } });
  const { data: popups } = useListPopups({ active: true }, { query: { queryKey: getListPopupsQueryKey({ active: true }) } });
  const { data: hero } = useGetHeroSettings({ query: { queryKey: getGetHeroSettingsQueryKey() } });

  const [emblaRef] = useEmblaCarousel({ loop: true });
  const [activePopup, setActivePopup] = useState<any>(null);

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

  return (
    <div className="flex flex-col w-full">
      {/* Hero Carousel */}
      <section className="relative w-full h-[600px] md:h-[800px] bg-black overflow-hidden border-b border-border">
        {banners && banners.length > 0 ? (
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {banners.map((banner) => (
                <div key={banner.id} className="relative flex-[0_0_100%] min-w-0 h-full">
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ 
                      backgroundImage: `url(${banner.imageUrl || '/images/hero-1.png'})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  </div>
                  <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 uppercase">
                      {banner.title}
                    </h1>
                    {banner.subtitle && (
                      <p className="text-lg md:text-2xl text-gray-300 mb-8 max-w-2xl font-mono">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.linkUrl && banner.linkText && (
                      <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-none font-bold tracking-widest border border-primary-border">
                        <Link href={banner.linkUrl}>{banner.linkText}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div 
            className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${hero?.bgImageUrl || '/images/hero-1.png'})` }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10">
              {hero?.title && (
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 uppercase">
                  {hero.title}
                </h1>
              )}
              {hero?.subtitle && (
                <p className="text-xl text-gray-300 mb-8 max-w-2xl font-mono mx-auto">
                  {hero.subtitle}
                </p>
              )}
              <div className="flex gap-4 justify-center">
                {hero?.cta1Text && hero?.cta1Link && (
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none">
                    <Link href={hero.cta1Link}>{hero.cta1Text}</Link>
                  </Button>
                )}
                {hero?.cta2Text && hero?.cta2Link && (
                  <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-black rounded-none">
                    <Link href={hero.cta2Link}>{hero.cta2Text}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12 border-b border-border pb-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">Öne Çıkan Ürünler</h2>
              <p className="text-muted-foreground font-mono text-sm">En çok tercih edilen Skyrich modelleri</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex text-primary hover:text-primary hover:bg-primary/10">
              <Link href="/urunler" className="flex items-center gap-2">
                Tümünü Gör <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBatteries?.map((battery) => (
              <Card key={battery.id} className="group bg-card border-border hover:border-primary/50 transition-all rounded-none overflow-hidden flex flex-col">
                <CardContent className="p-0 flex-1 flex flex-col">
                  <div className="aspect-square bg-muted/30 relative flex items-center justify-center p-6 border-b border-border">
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 uppercase tracking-wider">
                      {battery.technology}
                    </div>
                    {battery.imageUrl ? (
                      <img src={battery.imageUrl} alt={battery.name} className="w-full h-full object-contain mix-blend-screen drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 bg-background border border-border h-24 w-full">
                        <BatteryIcon size={24} className="text-muted-foreground mb-1" />
                        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{battery.modelCode}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-xs font-mono text-muted-foreground mb-2">{battery.modelCode}</div>
                    <h3 className="text-lg font-bold uppercase mb-4 flex-1">{battery.name}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm font-mono bg-background p-3 mb-6 border border-border">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-[10px] uppercase">Voltaj</span>
                        <span className="font-bold">{battery.voltage || '-'}V</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-[10px] uppercase">Kapasite</span>
                        <span className="font-bold">{battery.capacity || '-'}Ah</span>
                      </div>
                    </div>
                    <Button asChild className="w-full bg-secondary hover:bg-primary text-secondary-foreground hover:text-primary-foreground rounded-none uppercase tracking-wider">
                      <Link href={`/urunler/${battery.id}`}>İncele</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Highlights */}
      <section className="py-24 bg-card border-y border-border relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('/images/factory.png')] bg-cover bg-center opacity-10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">Neden Skyrich?</h2>
            <p className="text-muted-foreground font-mono">Endüstri standartlarını belirleyen teknoloji ve güvenilirlik.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background border border-border p-8 hover:border-primary transition-colors">
              <Zap className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-xl font-bold uppercase mb-3">Hafif Lityum Teknolojisi</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Powersport araçlar için geliştirilmiş lityum iyon akü teknolojisi.
              </p>
            </div>
            <div className="bg-background border border-border p-8 hover:border-primary transition-colors">
              <Shield className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-xl font-bold uppercase mb-3">Bakım Gerektirmeyen Kullanım</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Düşük kendi kendine deşarz oranı ile uzun süre güvenilir performans.
              </p>
            </div>
            <div className="bg-background border border-border p-8 hover:border-primary transition-colors">
              <BatteryIcon className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-xl font-bold uppercase mb-3">Teknik Destek</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Uyumlu model seçimi ve teknik bilgi için yetkili distribütör desteği.
              </p>
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
