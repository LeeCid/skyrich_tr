import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, MessageCircle, ArrowRight, MessageSquare, PhoneCall, Send } from "lucide-react";
import { useGetSiteSettings, getGetSiteSettingsQueryKey, useGetPageContent, getGetPageContentQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof whatsappTemplates>("general");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { data: settings } = useGetSiteSettings({ query: { queryKey: getGetSiteSettingsQueryKey() } });
  const { data: pageContent } = useGetPageContent("iletisim-intro", { query: { queryKey: getGetPageContentQueryKey("iletisim-intro") } });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const hasAnyContact = settings?.address || settings?.phone || settings?.email || settings?.whatsapp;

  const whatsappTemplates: Record<string, string> = {
    general: "Merhaba, Skyrich akü modelleri hakkında bilgi almak istiyorum.",
    product: "Merhaba, [model kodu] Skyrich akü modeli hakkında teknik bilgi almak istiyorum.",
    compatibility: "Merhaba, aracım için uygun Skyrich akü modelini öğrenmek istiyorum.\n\nAraç Marka:\nAraç Model:\nYıl:\nMotor:",
    support: "Merhaba, teknik destek almak istiyorum.",
  };

  const handleWhatsAppClick = (template?: string) => {
    const message = template || whatsappTemplates[selectedTemplate];
    const whatsappNumber = settings?.whatsapp || "";
    if (whatsappNumber) {
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`, "_blank");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Premium Contact Page Hero */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center text-center px-4 bg-tonal-soft border-b border-border overflow-hidden">
        <div className="absolute inset-0 hero-overlay opacity-30" />
        <div className={`relative z-10 max-w-4xl mx-auto space-y-6 ${!prefersReducedMotion ? 'reveal-up' : ''}`}>
          <span className="section-eyebrow red-accent-line">İletişim</span>
          <h1 className="display-title text-white mb-4">
            Teknik Destek ve Model Uyumluluğu
          </h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            {pageContent?.content || "Size en kısa sürede yardımcı olmak için aşağıdaki kanallardan ulaşabilirsiniz."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="premium-section bg-background">
        <div className="premium-container">
          {!hasAnyContact ? (
            <div className={`max-w-2xl mx-auto text-center py-24 industrial-panel border-metallic ${!prefersReducedMotion ? 'reveal-fade' : ''}`}>
              <MessageCircle className="w-20 h-20 text-text-muted/30 mx-auto mb-6" />
              <h3 className="text-2xl font-bold uppercase mb-4">İletişim Bilgileri</h3>
              <p className="text-text-secondary leading-relaxed">
                İletişim bilgileri admin panelinden eklendiğinde burada görüntülenecek.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Main CTA Cards */}
              <div className={`space-y-6 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '100ms' }}>
                <div className="mb-8">
                  <span className="section-eyebrow">İletişim Kanalları</span>
                  <h2 className="editorial-title mt-4">
                    Hızlı İletişim
                  </h2>
                </div>

                {settings?.whatsapp && (
                  <Card className={`industrial-panel border-metallic premium-card-hover group ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '150ms' }}>
                    <CardContent className="p-8 flex items-center gap-6">
                      <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <MessageCircle className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold uppercase mb-2">WhatsApp ile Yazın</h3>
                        <p className="text-text-secondary text-sm mb-4">
                          Hızlı yanıt için mesaj şablonu seçin
                        </p>
                        <Button
                          onClick={() => handleWhatsAppClick()}
                          className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-wider px-6 py-4"
                        >
                          WhatsApp'a Git
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {settings?.phone && (
                  <Card className={`industrial-panel border-metallic premium-card-hover group ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '200ms' }}>
                    <CardContent className="p-8 flex items-center gap-6">
                      <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <PhoneCall className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold uppercase mb-2">Telefonla Arayın</h3>
                        <a 
                          href={`tel:${settings.phone.replace(/\D/g, '')}`}
                          className="text-text-secondary text-lg font-mono hover:text-primary transition-colors block mb-4"
                        >
                          {settings.phone}
                        </a>
                        <Button
                          asChild
                          className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-wider px-6 py-4"
                        >
                          <a href={`tel:${settings.phone.replace(/\D/g, '')}`}>
                            Ara
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {settings?.email && (
                  <Card className={`industrial-panel border-metallic premium-card-hover group ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '250ms' }}>
                    <CardContent className="p-8 flex items-center gap-6">
                      <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Mail className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold uppercase mb-2">E-posta Gönderin</h3>
                        <a 
                          href={`mailto:${settings.email}`}
                          className="text-text-secondary text-lg font-mono hover:text-primary transition-colors block mb-4"
                        >
                          {settings.email}
                        </a>
                        <Button
                          asChild
                          className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-wider px-6 py-4"
                        >
                          <a href={`mailto:${settings.email}`}>
                            E-posta Gönder
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {settings?.address && (
                  <Card className="industrial-panel border-metallic premium-card-hover group">
                    <CardContent className="p-8 flex items-start gap-6">
                      <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <MapPin className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold uppercase mb-2">Adres</h3>
                        <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                          {settings.address}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* WhatsApp Message Template */}
              {settings?.whatsapp && (
                <div className={`space-y-6 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '300ms' }}>
                  <div className="mb-8">
                    <span className="section-eyebrow">WhatsApp Mesaj Şablonu</span>
                    <h2 className="editorial-title mt-4">
                      Mesaj Önizleme
                    </h2>
                  </div>

                  <Card className="industrial-panel border-metallic">
                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-4">
                        <label className="text-sm font-bold uppercase tracking-wider text-text-muted">Şablon Seçin</label>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.keys(whatsappTemplates).map((key) => (
                            <button
                              key={key}
                              onClick={() => setSelectedTemplate(key as keyof typeof whatsappTemplates)}
                              className={`text-left px-4 py-3 border border-border rounded-none transition-all ${
                                selectedTemplate === key
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-background/50 hover:bg-background/80 text-text-secondary'
                              }`}
                            >
                              <span className="text-sm font-medium capitalize">
                                {key === 'general' && 'Genel'}
                                {key === 'product' && 'Ürün'}
                                {key === 'compatibility' && 'Uyumluluk'}
                                {key === 'support' && 'Teknik Destek'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={`bg-tonal-panel border border-border p-6 ${!prefersReducedMotion ? 'reveal-fade' : ''}`} style={{ animationDelay: '50ms' }}>
                        <div className="flex items-center gap-2 mb-3 text-xs font-mono text-text-muted">
                          <MessageSquare size={14} />
                          <span>Mesaj Önizleme</span>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                          {whatsappTemplates[selectedTemplate]}
                        </p>
                      </div>

                      <Button
                        onClick={() => handleWhatsAppClick()}
                        className="btn-premium w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-wider py-6"
                      >
                        <Send size={20} className="mr-2" />
                        WhatsApp ile Gönder
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
