import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useListBatteries, getListBatteriesQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Battery as BatteryIcon, Zap } from "lucide-react";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("all");

  const queryParams = category !== "all" ? { category } : undefined;
  const { data: batteries, isLoading } = useListBatteries(queryParams, { 
    query: { queryKey: getListBatteriesQueryKey(queryParams) } 
  });

  const filteredBatteries = batteries?.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.modelCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-border pb-8">
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
        <div className="text-center py-24 bg-card border border-border">
          <BatteryIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold uppercase mb-2">Ürün Bulunamadı</h3>
          <p className="text-muted-foreground">Arama kriterlerinize uygun akü bulunmuyor.</p>
          <Button onClick={() => { setSearchTerm(""); setCategory("all"); }} variant="outline" className="mt-6 rounded-none border-primary text-primary">
            Filtreleri Temizle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBatteries?.map((battery) => (
            <Card key={battery.id} className="group bg-card border-border hover:border-primary/50 transition-all rounded-none overflow-hidden flex flex-col">
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="aspect-square bg-muted/10 relative flex items-center justify-center p-6 border-b border-border">
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 uppercase tracking-wider flex items-center gap-1">
                    <Zap size={12} /> {battery.technology}
                  </div>
                  {battery.imageUrl ? (
                    <img src={battery.imageUrl} alt={battery.name} className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 bg-background border border-border">
                      <BatteryIcon size={32} className="text-muted-foreground mb-2" />
                      <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{battery.modelCode}</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-xs font-mono text-muted-foreground mb-2">{battery.modelCode}</div>
                  <h3 className="text-lg font-bold uppercase mb-4 flex-1 leading-tight">{battery.name}</h3>
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
                    <Link href={`/urunler/${battery.id}`}>Detaylı İncele</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
