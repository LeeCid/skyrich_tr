import { useParams, Link } from "wouter";
import { useEffect, useState } from "react";
import { useGetBattery, getGetBatteryQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, Info, MessageCircle, Zap, CheckCircle, ExternalLink, Search, AlertCircle } from "lucide-react";
import { technologyLabel, productTypeLabel, formatSpec, sourceStatusLabel, confidenceLabel } from "@/lib/display-labels";
import { ProductImageStage } from "@/components/products/product-image-stage";

export default function ProductDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const { data: battery, isLoading, isError } = useGetBattery(id, { 
    query: { 
      queryKey: getGetBatteryQueryKey(id),
      enabled: !!id 
    } 
  });

  const getSourceBadge = (status: string | null | undefined) => {
    const label = sourceStatusLabel(status);
    switch (status) {
      case "official_high":
        return <Badge className="bg-green-600 hover:bg-green-700">{label}</Badge>;
      case "official_conflict":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">{label}</Badge>;
      case "official_partial":
        return <Badge className="bg-blue-600 hover:bg-blue-700">{label}</Badge>;
      case "official_family_conflict":
        return <Badge className="bg-orange-600 hover:bg-orange-700">{label}</Badge>;
      case "official_partial_secondary_specs":
        return <Badge className="bg-purple-600 hover:bg-purple-700">{label}</Badge>;
      case "secondary_verified_manual_review":
        return <Badge className="bg-orange-600 hover:bg-orange-700">{label}</Badge>;
      default:
        return <Badge variant="outline">{label}</Badge>;
    }
  };

  useEffect(() => {
    if (!battery) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: battery.name,
      image: battery.imageUrl ? `https://www.skyrichbattery.com.tr${battery.imageUrl}` : undefined,
      description: battery.description || `${battery.name} — Skyrich lityum akü`,
      brand: {
        "@type": "Brand",
        name: "Skyrich"
      },
      sku: battery.modelCode,
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [battery]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 w-32 bg-muted mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-muted" />
          <div className="space-y-6">
            <div className="h-12 w-3/4 bg-muted" />
            <div className="h-6 w-1/4 bg-muted" />
            <div className="h-32 w-full bg-muted" />
            <div className="h-48 w-full bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !battery) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto rounded-none border-destructive text-left">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>
            Ürün bulunamadı veya bir hata oluştu.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-8 rounded-none">
          <Link href="/urunler">Ürünlere Dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="premium-container premium-section">
      <Button asChild variant="link" className="mb-8 pl-0 text-text-secondary hover:text-primary transition-colors">
        <Link href="/urunler" className="flex items-center gap-2">
          <ArrowLeft size={16} /> Tüm Ürünlere Dön
        </Link>
      </Button>

      {/* Hero Product Intro - Editorial Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20">
        {/* Left: Hero Image Stage - White photography stage inside editorial frame */}
        <div className={`lg:col-span-7 relative ${!prefersReducedMotion ? 'reveal-left' : ''}`}>
          <div className="relative bg-white border border-border overflow-hidden">
            {/* Red hairline accent */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-primary via-primary/50 to-transparent" />
            
            {/* Technology badge */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider z-10">
              {technologyLabel(battery.technology)}
            </div>
            
            {/* Product image - staged in white photography area */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center p-8 bg-gradient-to-br from-white to-gray-50">
              <ProductImageStage
                modelCode={battery.modelCode}
                orderNumber={battery.id}
                imageUrl={battery.imageUrl}
                alt={battery.name}
                variant="detailHero"
                maxHeight="500px"
              />
            </div>
          </div>
        </div>

        {/* Right: Identity Block - Editorial typography */}
        <div className={`lg:col-span-5 space-y-6 ${!prefersReducedMotion ? 'reveal-right' : ''}`} style={{ animationDelay: '100ms' }}>
          {/* Model Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="section-eyebrow mb-0 red-accent-line text-sm">
                {battery.modelCode}
              </div>
              {battery.sourceStatus && getSourceBadge(battery.sourceStatus)}
            </div>
            <h1 className="display-title text-white text-3xl lg:text-4xl leading-tight">
              {battery.name}
            </h1>
            <div className="flex items-center gap-4 text-xs font-mono text-text-secondary border-b border-border pb-3">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                {productTypeLabel(battery.type)}
              </span>
            </div>
          </div>

          {/* Description */}
          {battery.description && (
            <div className={`text-text-secondary leading-relaxed text-sm font-light ${!prefersReducedMotion ? 'reveal-fade' : ''}`} style={{ animationDelay: '200ms' }}>
              {battery.description}
            </div>
          )}

          {/* Cross-Reference Codes */}
          {battery.crossReferenceCodes && battery.crossReferenceCodes.length > 0 && (
            <div className={!prefersReducedMotion ? 'reveal-up' : ''} style={{ animationDelay: '300ms' }}>
              <h3 className="text-xs font-bold uppercase mb-3 tracking-widest text-text-muted flex items-center gap-2">
                <Info size={14} /> Karşılık Kodları
              </h3>
              <div className="flex flex-wrap gap-2">
                {battery.crossReferenceCodes?.map((code: string, idx: number) => (
                  <Badge key={idx} variant="outline" className={`font-mono text-xs px-2.5 py-1 border-border bg-background/50 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: `${300 + idx * 50}ms` }}>
                    {code}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Source Notes */}
          {(battery.sourceNotes || battery.sourceUrl) && (
            <div className={`bg-tonal-panel border border-border p-4 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '400ms' }}>
              <h3 className="font-bold uppercase mb-2 flex items-center gap-2 text-xs tracking-wider">
                <CheckCircle size={14} className="text-primary" /> Kaynak / Doğrulama
              </h3>
              {battery.sourceNotes && (
                <p className="text-text-secondary text-xs mb-2 leading-relaxed">{battery.sourceNotes}</p>
              )}
              {battery.sourceUrl && (
                <a 
                  href={battery.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2 text-xs font-mono"
                >
                  Kaynak Linki <ExternalLink size={12} />
                </a>
              )}
            </div>
          )}

          {/* Premium CTAs */}
          <div className={`flex flex-col sm:flex-row gap-3 pt-2 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '500ms' }}>
            <Button asChild className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest px-5 py-4 text-sm">
              <Link href="/aku-bulucu" className="flex items-center gap-2">
                <Search size={16} /> Akü Koduyla Ara
              </Link>
            </Button>
            <Button asChild variant="outline" className="btn-premium rounded-none border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest px-5 py-4 text-sm">
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle size={16} /> WhatsApp Doğrula
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Technical Specifications Section - Premium Table */}
      <div className={`mb-24 ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-4 mb-10">
          <span className="section-eyebrow mb-0 red-accent-line text-sm">Teknik Veriler</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="industrial-panel border-metallic overflow-hidden">
          <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 font-mono text-xs">
            <div className={`grid grid-cols-2 border-b border-r border-border ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '150ms' }}>
              <dt className="px-4 py-3 bg-tonal-panel text-text-muted uppercase text-[10px] tracking-wider">Voltaj</dt>
              <dd className="px-4 py-3 bg-background font-bold text-sm">{formatSpec(battery.voltage, "V")}</dd>
            </div>
            <div className={`grid grid-cols-2 border-b border-r border-border ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '200ms' }}>
              <dt className="px-4 py-3 bg-tonal-panel text-text-muted uppercase text-[10px] tracking-wider">Kapasite</dt>
              <dd className="px-4 py-3 bg-background font-bold text-sm">{formatSpec(battery.capacity, "Ah")}</dd>
            </div>
            {battery.cca !== undefined && battery.cca !== null && (
              <div className={`grid grid-cols-2 border-b border-r border-border ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '250ms' }}>
                <dt className="px-4 py-3 bg-tonal-panel text-text-muted uppercase text-[10px] tracking-wider">Soğuk Marş (CCA)</dt>
                <dd className="px-4 py-3 bg-background font-bold text-sm">{battery.cca}</dd>
              </div>
            )}
            <div className={`grid grid-cols-2 border-b border-border ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '300ms' }}>
              <dt className="px-4 py-3 bg-tonal-panel text-text-muted uppercase text-[10px] tracking-wider">Teknoloji</dt>
              <dd className="px-4 py-3 bg-background font-bold text-sm">{technologyLabel(battery.technology)}</dd>
            </div>
            {battery.dimensions && (
              <div className={`grid grid-cols-2 border-b border-r border-border ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '350ms' }}>
                <dt className="px-4 py-3 bg-tonal-panel text-text-muted uppercase text-[10px] tracking-wider">Boyutlar</dt>
                <dd className="px-4 py-3 bg-background font-bold text-sm">{battery.dimensions}</dd>
              </div>
            )}
            {battery.weight && (
              <div className={`grid grid-cols-2 border-b border-r border-border ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '400ms' }}>
                <dt className="px-4 py-3 bg-tonal-panel text-text-muted uppercase text-[10px] tracking-wider">Ağırlık</dt>
                <dd className="px-4 py-3 bg-background font-bold text-sm">{battery.weight}</dd>
              </div>
            )}
            <div className={`grid grid-cols-2 border-b border-border ${!prefersReducedMotion ? 'reveal-up' : ''}`} style={{ animationDelay: '450ms' }}>
              <dt className="px-4 py-3 bg-tonal-panel text-text-muted uppercase text-[10px] tracking-wider">Tip</dt>
              <dd className="px-4 py-3 bg-background font-bold text-sm">{productTypeLabel(battery.type)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Vehicle Hints Section - Premium Table */}
      {battery.vehicleHints && battery.vehicleHints.length > 0 && (
        <div className="mb-20 reveal-up">
          <div className="flex items-center gap-4 mb-8">
            <span className="section-eyebrow mb-0">Uyumluluk Desteği</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <Alert className="border-orange-500/50 bg-orange-500/5 border-l-4 mb-6">
            <Info className="h-4 w-4 text-orange-500" />
            <AlertTitle className="text-orange-500">Kaynaklı Aday Eşleşme</AlertTitle>
            <AlertDescription className="text-text-secondary">
              Araç eşleşmeleri kaynaklı aday veridir; montaj öncesi teknik doğrulama önerilir.
            </AlertDescription>
          </Alert>
          <div className="industrial-panel border-metallic overflow-hidden">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-border bg-tonal-panel">
                  <th className="px-5 py-4 text-left uppercase text-text-muted text-xs tracking-wider">Marka</th>
                  <th className="px-5 py-4 text-left uppercase text-text-muted text-xs tracking-wider">Model</th>
                  <th className="px-5 py-4 text-left uppercase text-text-muted text-xs tracking-wider">Yıl Aralığı</th>
                  <th className="px-5 py-4 text-left uppercase text-text-muted text-xs tracking-wider">Kaynak Güveni</th>
                </tr>
              </thead>
              <tbody>
                {battery.vehicleHints.map((hint: any, idx: number) => (
                  <tr key={idx} className="border-b border-border last:border-0 hover:bg-tonal-panel/50 transition-colors">
                    <td className="px-5 py-4">{hint.make}</td>
                    <td className="px-5 py-4">{hint.model}</td>
                    <td className="px-5 py-4 font-mono">
                      {hint.yearFrom || "?"} - {hint.yearTo || "?"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={hint.confidence === "medium" ? "secondary" : "outline"} className="text-xs">
                        {confidenceLabel(hint.confidence)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Applications Section - Premium Panel */}
      {battery.applications && (
        <div className="mb-20 reveal-up">
          <div className="flex items-center gap-4 mb-8">
            <span className="section-eyebrow mb-0">Uyumlu Araçlar</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="industrial-panel border-metallic p-8 text-sm font-mono text-text-secondary leading-relaxed">
            {battery.applications}
          </div>
        </div>
      )}
    </div>
  );
}
