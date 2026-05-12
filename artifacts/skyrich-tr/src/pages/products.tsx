import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListBatteries, getListBatteriesQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Battery as BatteryIcon } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const queryParams = category !== "all" ? { category } : undefined;
  const { data: batteries, isLoading } = useListBatteries(queryParams, { 
    query: { queryKey: getListBatteriesQueryKey(queryParams) } 
  });

  // Ensure batteries is an array
  const batteryList = Array.isArray(batteries) ? batteries : [];

  const filteredBatteries = batteryList.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.modelCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="premium-container premium-section">
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-border pb-8 ${!prefersReducedMotion ? 'reveal-up' : ''}`}>
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">Tüm Ürünler</h1>
          <p className="text-muted-foreground font-mono">Skyrich yüksek performanslı akü serisi</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Model veya isim ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-none border-border bg-background focus-visible:ring-primary"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-none border-border">
              <SelectValue placeholder="Kategori Seç" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border">
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              <SelectItem value="Lithium">Lityum Aküler</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-96 bg-muted/20 animate-pulse border border-border" />
          ))}
        </div>
      ) : filteredBatteries?.length === 0 ? (
        <div className={`text-center py-24 industrial-panel ${!prefersReducedMotion ? 'reveal-fade' : ''}`}>
          <BatteryIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold uppercase mb-2">Ürün Bulunamadı</h3>
          <p className="text-muted-foreground">Arama kriterlerinize uygun akü bulunmuyor.</p>
          <Button onClick={() => { setSearchTerm(""); setCategory("all"); }} variant="outline" className="mt-6 rounded-none border-primary text-primary">
            Filtreleri Temizle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBatteries?.map((battery, idx) => (
            <div key={battery.id} className={!prefersReducedMotion ? 'reveal-up' : ''} style={{ animationDelay: `${idx * 50}ms` }}>
              <ProductCard battery={battery} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
