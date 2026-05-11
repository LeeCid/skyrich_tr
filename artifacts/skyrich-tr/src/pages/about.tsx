import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center text-center px-4 bg-[url('/images/factory.png')] bg-cover bg-center border-b border-border">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-6">Hakkımızda</h1>
          <p className="text-xl text-muted-foreground font-mono">
            Geleceğin enerji depolama çözümleri, bugün Türkiye'de.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter uppercase mb-6 text-primary">Skyrich Battery Türkiye</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Skyrich Battery, yüksek performanslı lityum ve AGM powersport akülerinde küresel bir liderdir. Dünya çapında milyonlarca motosiklet tutkunu ve profesyonel yarışçı tarafından tercih edilen Skyrich, KTM, Ducati, ve Husqvarna gibi prestijli markaların Orijinal Ekipman (OEM) tedarikçisidir.
              </p>
              <p>
                Türkiye distribütörü olarak misyonumuz, bu üstün teknolojiyi Türk motosiklet kullanıcılarına en güvenilir ve hızlı şekilde ulaştırmaktır. Sadece bir ürün değil, kesintisiz bir sürüş deneyimi ve maksimum performans sunuyoruz.
              </p>
              <p>
                Geniş bayi ağımız ve uzman teknik ekibimizle, doğru akü seçimi ve satış sonrası destekte her zaman yanınızdayız.
              </p>
            </div>
            
            <div className="mt-10">
               <Button asChild className="bg-primary text-primary-foreground rounded-none uppercase tracking-widest px-8">
                 <Link href="/iletisim">Bize Ulaşın</Link>
               </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border p-8 text-center flex flex-col justify-center min-h-[200px]">
              <div className="text-5xl font-bold text-primary mb-2 font-mono">10+</div>
              <div className="text-sm font-bold uppercase text-muted-foreground">Yıllık Deneyim</div>
            </div>
            <div className="bg-card border border-border p-8 text-center flex flex-col justify-center min-h-[200px] mt-8">
              <div className="text-5xl font-bold text-primary mb-2 font-mono">50+</div>
              <div className="text-sm font-bold uppercase text-muted-foreground">Aktif Bayi</div>
            </div>
            <div className="bg-card border border-border p-8 text-center flex flex-col justify-center min-h-[200px] -mt-8">
              <div className="text-5xl font-bold text-primary mb-2 font-mono">OEM</div>
              <div className="text-sm font-bold uppercase text-muted-foreground">Kalite Standartı</div>
            </div>
            <div className="bg-card border border-border p-8 text-center flex flex-col justify-center min-h-[200px]">
              <div className="text-5xl font-bold text-primary mb-2 font-mono">%100</div>
              <div className="text-sm font-bold uppercase text-muted-foreground">Müşteri Memnuniyeti</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
