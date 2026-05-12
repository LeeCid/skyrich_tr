import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useGetPageContent, getGetPageContentQueryKey } from "@workspace/api-client-react";
import { ArrowRight, CheckCircle, Database, MessageCircle, Search, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const { data: pageContent } = useGetPageContent("hakkimizda", { query: { queryKey: getGetPageContentQueryKey("hakkimizda") } });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Premium Page Hero */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center text-center px-4 bg-tonal-soft border-b border-border overflow-hidden">
        <div className="absolute inset-0 hero-overlay opacity-30" />
        <div className="absolute inset-0 bg-[url('/images/factory.png')] bg-cover bg-center opacity-10" />
        <div className={`relative z-10 max-w-4xl mx-auto space-y-6 ${!prefersReducedMotion ? 'reveal-up' : ''}`}>
          <span className="section-eyebrow red-accent-line">Hakkımızda</span>
          <h1 className="display-title text-white mb-4">
            Teknik Doğrulama ve Güvenilir Destek
          </h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Skyrich lityum akü modelleri için powersport odaklı teknik katalog ve uyumlu model seçimi desteği.
          </p>
        </div>
      </section>

      {/* Editorial Split Section */}
      <section className="premium-section bg-background">
        <div className="premium-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={`space-y-8 ${!prefersReducedMotion ? 'reveal-left' : ''}`} style={{ animationDelay: '100ms' }}>
              <span className="section-eyebrow">Distribütör Yaklaşımı</span>
              <h2 className="editorial-title">
                Kaynaklı Bilgi, Teknik Doğrulama
              </h2>
              <div className="space-y-6 text-text-secondary leading-relaxed text-lg">
                {pageContent?.content ? (
                  pageContent.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>
                    Skyrich Battery Türkiye, lityum akü modelleri için katalog ve teknik destek odaklı resmi distribütör web sitesidir. Ürün bilgileri kaynaklı olarak doğrulanır ve uyumluluk yönlendirmeleri teknik destek ekibiyle sağlanır.
                  </p>
                )}
              </div>
            </div>
            <div className={`bg-tonal-panel border border-border p-8 space-y-6 ${!prefersReducedMotion ? 'reveal-right' : ''}`} style={{ animationDelay: '200ms' }}>
              <div className={`flex items-start gap-4 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '250ms' }}>
                <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold uppercase mb-2">Kaynaklı Ürün Bilgisi</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Ürün teknik özellikleri ve araç uyumluluk bilgileri kaynaklı olarak doğrulanır ve şeffaf şekilde sunulur.
                  </p>
                </div>
              </div>
              <div className={`flex items-start gap-4 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '300ms' }}>
                <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold uppercase mb-2">Teknik Doğrulama</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Uyumluluk önerileri montaj öncesi teknik doğrulama prensibiyle sunulur.
                  </p>
                </div>
              </div>
              <div className={`flex items-start gap-4 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '350ms' }}>
                <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold uppercase mb-2">Destek Ekibi</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    WhatsApp ve telefon üzerinden teknik destek ve uyumluluk doğrulama hizmeti sağlanır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Premium Principle Cards */}
      <section className="premium-section bg-tonal-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-background to-transparent pointer-events-none" />
        <div className="premium-container relative z-10">
          <div className={`mb-16 text-center ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '100ms' }}>
            <span className="section-eyebrow">Prensiplerimiz</span>
            <h2 className="editorial-title">
              Güvenilirlik ve Şeffaflık
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className={`industrial-panel border-metallic premium-card-hover ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '150ms' }}>
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold uppercase">Doğru Model Yönlendirmesi</h3>
                <p className="text-text-secondary leading-relaxed">
                  Akü kodu veya araç bilgisi ile doğru Skyrich modelinin yönlendirilmesi için teknik destek sağlanır.
                </p>
              </CardContent>
            </Card>
            <Card className={`industrial-panel border-metallic premium-card-hover ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '200ms' }}>
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Database className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold uppercase">Kaynaklı Ürün Verisi</h3>
                <p className="text-text-secondary leading-relaxed">
                  Ürün teknik özellikleri ve araç uyumluluk bilgileri kaynaklı olarak doğrulanır ve şeffaf şekilde sunulur.
                </p>
              </CardContent>
            </Card>
            <Card className={`industrial-panel border-metallic premium-card-hover ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '250ms' }}>
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold uppercase">Lityum Teknolojisi</h3>
                <p className="text-text-secondary leading-relaxed">
                  Kurşun-asit akülere karşı %70 daha hafif, daha yüksek performans ve daha uzun ömür sunan lityum iyon teknolojisi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="premium-section bg-background">
        <div className="premium-container">
          <div className={`mb-16 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-4">
              <span className="section-eyebrow mb-0 red-accent-line">Nasıl Çalışır</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className={`text-center space-y-6 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '150ms' }}>
              <div className="w-20 h-20 bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold uppercase">Akü Kodunu Girin</h3>
              <p className="text-text-secondary leading-relaxed">
                Mevcut akünüzün kodunu akü bulucu bölümüne girin veya araç bilgisi ile arama yapın.
              </p>
            </div>
            <div className={`text-center space-y-6 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '200ms' }}>
              <div className="w-20 h-20 bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold uppercase">Uygun Modeli Görün</h3>
              <p className="text-text-secondary leading-relaxed">
                Sistem size uygun Skyrich akü modellerini kaynaklı ürün bilgisi ile sunar.
              </p>
            </div>
            <div className={`text-center space-y-6 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '250ms' }}>
              <div className="w-20 h-20 bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold uppercase">Teknik Doğrulama</h3>
              <p className="text-text-secondary leading-relaxed">
                WhatsApp veya telefon ile teknik destek ekibimizden montaj öncesi doğrulama alın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="premium-section bg-tonal-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-background to-transparent pointer-events-none" />
        <div className="premium-container relative z-10">
          <div className={`industrial-panel border-metallic p-12 md:p-16 text-center space-y-8 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '100ms' }}>
            <h2 className="display-title text-white mb-4">
              Uygun Skyrich Aküyü Bulun
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Akü koduyla veya araç bilgisiyle arama yapın, WhatsApp ile teknik destek alın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest px-12 py-6 shadow-premium">
                <Link href="/aku-bulucu" className="flex items-center gap-3">
                  Akü Bulucu <ArrowRight size={20} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn-premium rounded-none border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest px-12 py-6">
                <Link href="/iletisim" className="flex items-center gap-3">
                  İletişim <MessageCircle size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
