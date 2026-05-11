import { useParams, Link } from "wouter";
import { useEffect } from "react";
import { useGetBattery, getGetBatteryQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, MessageCircle, Phone } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProductDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);

  const { data: battery, isLoading, isError } = useGetBattery(id, { 
    query: { 
      queryKey: getGetBatteryQueryKey(id),
      enabled: !!id 
    } 
  });

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
    <div className="container mx-auto px-4 py-12">
      <Button asChild variant="link" className="mb-8 pl-0 text-muted-foreground hover:text-primary">
        <Link href="/urunler" className="flex items-center gap-2">
          <ArrowLeft size={16} /> Tüm Ürünlere Dön
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Image Gallery Area */}
        <div className="bg-card border border-border p-8 flex items-center justify-center relative">
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
            {battery.technology}
          </div>
          {battery.imageUrl ? (
            <img src={battery.imageUrl} alt={battery.name} className="w-full max-w-md object-contain drop-shadow-2xl" />
          ) : (
            <div className="aspect-square w-full max-w-md bg-muted flex items-center justify-center text-muted-foreground">
              Görsel Yok
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-8">
            <div className="text-primary font-mono font-bold tracking-widest uppercase mb-2">
              Model: {battery.modelCode}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4 leading-tight">
              {battery.name}
            </h1>
            <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground border-b border-border pb-6">
              <span>Kategori: {battery.type}</span>
            </div>
          </div>

          {battery.description && (
            <div className="mb-10 text-muted-foreground leading-relaxed prose prose-invert max-w-none">
              <p>{battery.description}</p>
            </div>
          )}

          <h3 className="text-xl font-bold uppercase mb-6 tracking-tight">Teknik Özellikler</h3>
          
          <div className="border border-border">
            <dl className="grid grid-cols-1 font-mono text-sm">
              <div className="grid grid-cols-2 border-b border-border">
                <dt className="px-4 py-3 bg-muted/30 text-muted-foreground uppercase">Voltaj (V)</dt>
                <dd className="px-4 py-3 bg-card font-bold">{(battery.voltage != null && battery.voltage !== 0) ? battery.voltage : 'Doğrulanacak'}</dd>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <dt className="px-4 py-3 bg-muted/30 text-muted-foreground uppercase">Kapasite (Ah)</dt>
                <dd className="px-4 py-3 bg-card font-bold">{(battery.capacity != null && battery.capacity !== 0) ? battery.capacity : 'Doğrulanacak'}</dd>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <dt className="px-4 py-3 bg-muted/30 text-muted-foreground uppercase">Soğuk Marş Akımı (CCA)</dt>
                <dd className="px-4 py-3 bg-card font-bold">{(battery.cca != null && battery.cca !== 0) ? battery.cca : 'Doğrulanacak'}</dd>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <dt className="px-4 py-3 bg-muted/30 text-muted-foreground uppercase">Boyutlar (UxGxD)</dt>
                <dd className="px-4 py-3 bg-card">{battery.dimensions || 'Doğrulanacak'}</dd>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <dt className="px-4 py-3 bg-muted/30 text-muted-foreground uppercase">Ağırlık (kg)</dt>
                <dd className="px-4 py-3 bg-card">{(battery.weight != null && battery.weight !== 0) ? battery.weight : 'Doğrulanacak'}</dd>
              </div>
              <div className="grid grid-cols-2 border-b border-border">
                <dt className="px-4 py-3 bg-muted/30 text-muted-foreground uppercase">Teknoloji</dt>
                <dd className="px-4 py-3 bg-card">{battery.technology}</dd>
              </div>
            </dl>
          </div>

          {battery.applications && (
            <div className="mt-10">
               <h3 className="text-xl font-bold uppercase mb-4 tracking-tight">Uyumlu Araçlar</h3>
               <div className="bg-card border border-border p-4 text-sm font-mono text-muted-foreground">
                 {battery.applications}
               </div>
            </div>
          )}

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest px-8 py-6 text-lg">
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle size={20} /> WhatsApp'tan Bilgi Al
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto rounded-none uppercase tracking-widest px-8 py-6 text-lg">
              <Link href="/iletisim" className="flex items-center gap-2">
                <Phone size={20} /> Uyumluluğu Sor
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
