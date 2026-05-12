import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Battery as BatteryIcon, Zap, Search, ArrowRight, MessageCircle, Wrench, Info, AlertTriangle } from "lucide-react";
import { useSearchBatteryCode, getSearchBatteryCodeQueryKey } from "@workspace/api-client-react";
import { useGetSiteSettings, getGetSiteSettingsQueryKey, useListBatteries, getListBatteriesQueryKey } from "@workspace/api-client-react";
import { technologyLabel, sourceStatusLabel } from "@/lib/display-labels";

export default function BatteryFinder() {
  const [tab, setTab] = useState<"code" | "vehicle" | "support">("code");
  const [batteryCode, setBatteryCode] = useState<string>("");
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [engine, setEngine] = useState<string>("");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const { data: settings } = useGetSiteSettings();
  const { data: batteries } = useListBatteries();
  
  const { data: codeResults, isLoading: isLoadingCodeResults, refetch: searchByCode, isFetching: isSearchingCode } = useSearchBatteryCode(
    batteryCode,
    { query: { enabled: false } }
  );

  // Ensure batteries is an array
  const batteryList = Array.isArray(batteries) ? batteries : [];

  // Filter batteries with vehicle hints matching the search
  const vehicleHintsResults = batteryList.filter((b: any) => 
    (b as any).vehicleHints && (b as any).vehicleHints.length > 0 &&
    (b as any).vehicleHints.some((hint: any) => 
      (!make || hint.make?.toLowerCase() === make.toLowerCase()) &&
      (!model || hint.model?.toLowerCase().includes(model.toLowerCase())) &&
      (!year || (hint.yearFrom && hint.yearTo && parseInt(year) >= hint.yearFrom && parseInt(year) <= hint.yearTo))
    )
  ) || [];

  const handleSearchByCode = () => {
    if (batteryCode.trim()) {
      searchByCode();
    }
  };

  const handleWhatsAppSupport = () => {
    const message = `Merhaba, aracım için uygun Skyrich akü modelini öğrenmek istiyorum.

Marka: ${make || "-"}
Model: ${model || "-"}
Yıl: ${year || "-"}
Motor: ${engine || "-"}`;

    const whatsappNumber = settings?.whatsapp || "";
    if (whatsappNumber) {
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodedMessage}`, "_blank");
    }
  };

  const handleCodeWhatsAppSupport = () => {
    const message = `Merhaba, mevcut akümün kodu "${batteryCode}" için uygun Skyrich modelini öğrenmek istiyorum.`;
    const whatsappNumber = settings?.whatsapp || "";
    if (whatsappNumber) {
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodedMessage}`, "_blank");
    }
  };

  const isCodeFormValid = batteryCode.trim().length > 0;
  const isVehicleFormValid = make || model || year;

  return (
    <div className="premium-container premium-section">
      {/* Premium Header */}
      <div className={`mb-16 space-y-4 ${!prefersReducedMotion ? 'reveal-up' : ''}`}>
        <span className="section-eyebrow red-accent-line">Araç Uyumluluğu</span>
        <h1 className="display-title text-white">Akü Bulucu</h1>
        <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
          Aracınız için en uygun Skyrich aküyü bulun. Akü koduyla veya araç bilgisiyle arama yapın, WhatsApp ile teknik destek alın.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as "code" | "vehicle" | "support")} className="w-full">
        {/* Premium Tabs */}
        <TabsList className={`grid w-full grid-cols-3 mb-12 max-w-2xl mx-auto bg-tonal-panel border border-border p-1 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '100ms' }}>
          <TabsTrigger value="code" className="rounded-none data-[state=active]:bg-background data-[state=active]:text-primary transition-all duration-300">Akü Koduyla Ara</TabsTrigger>
          <TabsTrigger value="vehicle" className="rounded-none data-[state=active]:bg-background data-[state=active]:text-primary transition-all duration-300">Araçla Ara</TabsTrigger>
          <TabsTrigger value="support" className="rounded-none data-[state=active]:bg-background data-[state=active]:text-primary transition-all duration-300">Destek Mesajı</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className={`space-y-8 ${!prefersReducedMotion ? 'reveal-fade' : ''}`} style={{ animationDelay: '150ms' }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className={`lg:col-span-4 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '200ms' }}>
              <Card className="industrial-panel border-metallic premium-card-hover">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                      <Search size={16} className="text-primary" />
                      Akü Kodu
                    </label>
                    <Input 
                      placeholder="Örn: YTX9-BS, YTZ14S"
                      value={batteryCode}
                      onChange={(e) => setBatteryCode(e.target.value.toUpperCase())}
                      className="rounded-none border-border bg-background/50 font-mono uppercase text-lg py-6 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Mevcut akünüzün üzerindeki kodu girin (örn: YTX9-BS, YTZ14S)
                    </p>
                  </div>

                  <Button 
                    onClick={handleSearchByCode} 
                    disabled={!isCodeFormValid || isSearchingCode} 
                    className="btn-premium w-full rounded-none h-14 uppercase tracking-wider font-bold text-lg shadow-premium"
                  >
                    {isSearchingCode ? (
                      <span className="flex items-center gap-3">Aranıyor...</span>
                    ) : (
                      <span className="flex items-center gap-3"><Search size={20} /> Kodu Ara</span>
                    )}
                  </Button>

                  <Button 
                    onClick={handleCodeWhatsAppSupport}
                    disabled={!settings?.whatsapp}
                    variant="outline"
                    className="btn-premium w-full rounded-none h-14 border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-wider"
                  >
                    <MessageCircle size={20} className="mr-2" />
                    WhatsApp ile Destek Al
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className={`lg:col-span-8 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '250ms' }}>
              {isSearchingCode || isLoadingCodeResults ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[1, 2].map(i => (
                    <div key={i} className="h-96 bg-tonal-panel animate-pulse border border-border rounded-none" />
                  ))}
                </div>
              ) : codeResults && codeResults.length > 0 ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <span className="section-eyebrow mb-0">Önerilen Eşleşme</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {codeResults.map((result: any, idx: number) => (
                      <Card key={result.battery.id} className={`group industrial-panel border-metallic premium-card-hover rounded-none overflow-hidden flex flex-col ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: `${300 + idx * 50}ms` }}>
                        <CardContent className="p-0 flex-1 flex flex-col">
                          <div className="p-8 flex flex-col flex-1 space-y-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="text-xs font-mono text-primary uppercase tracking-wider">{result.battery.modelCode}</span>
                                  {result.battery.sourceStatus && (
                                    <Badge className="text-xs">{sourceStatusLabel(result.battery.sourceStatus)}</Badge>
                                  )}
                                </div>
                                <h3 className="text-xl font-bold uppercase mb-2">{result.battery.name}</h3>
                                <div className="flex gap-4 text-sm font-mono text-text-secondary">
                                  <span>{result.battery.voltage || '-'}V</span>
                                  <span>{result.battery.capacity ? `${result.battery.capacity}Ah` : 'Doğrulanacak'}</span>
                                </div>
                              </div>
                            </div>
                            <Button asChild className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-none">
                              <Link href={`/urunler/${result.battery.id}`} className="flex items-center gap-2">
                                Detaylar <ArrowRight size={16} />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 industrial-panel border-dashed border-border ${!prefersReducedMotion ? 'reveal-fade' : ''}`} style={{ animationDelay: '300ms' }}>
                  <Search className="w-16 h-16 text-text-muted/30 mb-6" />
                  <h3 className="text-xl font-bold uppercase text-text-muted mb-3">Akü Kodunu Girin</h3>
                  <p className="text-text-secondary max-w-sm leading-relaxed">Önerilen Skyrich aküleri görmek için mevcut akünüzün kodunu girin ve "Kodu Ara" butonuna tıklayın.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vehicle" className={`space-y-8 ${!prefersReducedMotion ? 'reveal-fade' : ''}`} style={{ animationDelay: '150ms' }}>
          <Alert className="border-orange-500/50 bg-orange-500/5 border-l-4 mb-8">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertTitle className="text-orange-500">Kaynaklı Aday Eşleşme</AlertTitle>
            <AlertDescription className="text-text-secondary">
              Araç eşleşmeleri kaynaklı aday veridir; montaj öncesi teknik doğrulama önerilir.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className={`lg:col-span-4 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '200ms' }}>
              <Card className="industrial-panel border-metallic premium-card-hover">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
                      Araç Markası
                    </label>
                    <Input 
                      placeholder="Örn: Honda, Ducati"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      className="rounded-none border-border bg-background/50 py-6 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">2</span>
                      Araç Modeli
                    </label>
                    <Input 
                      placeholder="Örn: Africa Twin, Panigale V4"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="rounded-none border-border bg-background/50 py-6 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">3</span>
                      Üretim Yılı
                    </label>
                    <Input 
                      type="number" 
                      min="2000" 
                      max="2026" 
                      placeholder="Örn: 2018" 
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="rounded-none border-border bg-background/50 py-6 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <Button 
                    onClick={handleWhatsAppSupport}
                    disabled={!settings?.whatsapp}
                    className="btn-premium w-full rounded-none h-14 uppercase tracking-wider font-bold text-lg shadow-premium"
                  >
                    <MessageCircle size={20} className="mr-2" />
                    WhatsApp ile Uyumluluğu Doğrula
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-8 reveal-up delay-200">
              {vehicleHintsResults.length > 0 ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <span className="section-eyebrow mb-0">Kaynaklı Aday Eşleşmeler</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {vehicleHintsResults.map((battery: any) => (
                      <Card key={battery.id} className="group industrial-panel border-metallic premium-card-hover rounded-none overflow-hidden flex flex-col">
                        <CardContent className="p-0 flex-1 flex flex-col">
                          <div className="p-8 flex flex-col flex-1 space-y-6">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="spec-chip bg-primary/5 border-primary/20">{battery.modelCode}</div>
                                <h3 className="text-xl font-bold uppercase leading-tight group-hover:text-primary transition-colors">{battery.name}</h3>
                              </div>
                              <Badge variant="outline" className="text-xs px-3 py-1.5 border-border bg-background/50">
                                {sourceStatusLabel(battery.sourceStatus)}
                              </Badge>
                            </div>
                            
                            {battery.vehicleHints && (
                              <div className="bg-tonal-panel p-4 text-xs font-mono border border-border">
                                <div className="font-bold mb-3 flex items-center gap-2 text-text-muted uppercase tracking-wider">
                                  <Info size={14} /> Kaynaklı Araç Eşleşmeleri:
                                </div>
                                {battery.vehicleHints
                                  .filter((hint: any) => 
                                    (!make || hint.make?.toLowerCase() === make.toLowerCase()) &&
                                    (!model || hint.model?.toLowerCase().includes(model.toLowerCase())) &&
                                    (!year || (hint.yearFrom && hint.yearTo && parseInt(year) >= hint.yearFrom && parseInt(year) <= hint.yearTo))
                                  )
                                  .map((hint: any, idx: number) => (
                                    <div key={idx} className="mb-2 last:mb-0">
                                      {hint.make} {hint.model} ({hint.yearFrom || "?"} - {hint.yearTo || "?"})
                                    </div>
                                  ))}
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-background/50 border border-border p-4">
                                <span className="spec-label block mb-2">Voltaj</span>
                                <span className="spec-value text-lg">{battery.voltage || '-'}V</span>
                              </div>
                              <div className="bg-background/50 border border-border p-4">
                                <span className="spec-label block mb-2">Kapasite</span>
                                <span className="spec-value text-lg">{battery.capacity || '-'}Ah</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <Button asChild className="btn-premium flex-1 bg-secondary hover:bg-primary text-secondary-foreground hover:text-primary-foreground rounded-none uppercase tracking-wider py-5">
                                <Link href={`/urunler/${battery.id}`} className="flex items-center justify-center gap-2">
                                  Detaylar
                                </Link>
                              </Button>
                              <Button 
                                onClick={handleWhatsAppSupport}
                                disabled={!settings?.whatsapp}
                                variant="outline"
                                className="btn-premium rounded-none border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground px-4"
                              >
                                <MessageCircle size={18} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 industrial-panel border-metallic">
                  <BatteryIcon className="w-20 h-20 text-text-muted/30 mb-6" />
                  <h3 className="text-2xl font-bold uppercase mb-4">Kaynaklı Eşleşme Bulunamadı</h3>
                  <p className="text-text-secondary max-w-lg mb-8 leading-relaxed">Seçtiğiniz araç kriterleri için kaynaklı aday eşleşme bulunmamaktadır. WhatsApp ile teknik destek alabilirsiniz.</p>
                  <Button 
                    onClick={handleWhatsAppSupport}
                    disabled={!settings?.whatsapp}
                    className="btn-premium rounded-none bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 shadow-premium"
                  >
                    <MessageCircle size={20} className="mr-2" />
                    WhatsApp ile Destek Al
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-8">
          <div className="max-w-2xl mx-auto reveal-up">
            <Card className="industrial-panel border-metallic">
              <CardContent className="p-10 space-y-8">
                <div className="text-center space-y-4 mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="editorial-title">WhatsApp ile Destek Mesajı</h2>
                  <p className="text-text-secondary leading-relaxed">Araç bilgilerinizi girin, otomatik olarak WhatsApp mesajı oluşturun.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3 block">
                      Araç Markası
                    </label>
                    <Input 
                      placeholder="Örn: Honda"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      className="rounded-none border-border bg-background/50 py-5 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3 block">
                      Araç Modeli
                    </label>
                    <Input 
                      placeholder="Örn: Africa Twin"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="rounded-none border-border bg-background/50 py-5 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3 block">
                      Üretim Yılı
                    </label>
                    <Input 
                      type="number" 
                      min="2000" 
                      max="2026" 
                      placeholder="Örn: 2018" 
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="rounded-none border-border bg-background/50 py-5 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3 block">
                      Motor Hacmi (Opsiyonel)
                    </label>
                    <Input 
                      placeholder="Örn: 250cc"
                      value={engine}
                      onChange={(e) => setEngine(e.target.value)}
                      className="rounded-none border-border bg-background/50 py-5 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="bg-tonal-panel p-6 border border-border">
                  <label className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 block flex items-center gap-2">
                    <Info size={14} /> Mesaj Önizleme:
                  </label>
                  <div className="text-sm font-mono bg-background p-4 border border-border whitespace-pre-wrap leading-relaxed">
                    {`Merhaba, aracım için uygun Skyrich akü modelini öğrenmek istiyorum.

Marka: ${make || "-"}
Model: ${model || "-"}
Yıl: ${year || "-"}
Motor: ${engine || "-"}`}
                  </div>
                </div>

                <Button 
                  onClick={handleWhatsAppSupport}
                  disabled={!settings?.whatsapp}
                  className="btn-premium w-full rounded-none h-14 uppercase tracking-wider font-bold text-lg shadow-premium"
                >
                  <MessageCircle size={20} className="mr-2" />
                  WhatsApp ile Gönder
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
