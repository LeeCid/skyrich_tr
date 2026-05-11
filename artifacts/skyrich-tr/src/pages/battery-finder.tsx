import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Battery as BatteryIcon, Zap, Search, ArrowRight } from "lucide-react";
import { 
  useGetVehicleMakes, 
  useGetVehicleModels, 
  useFindBatteries, 
  getGetVehicleModelsQueryKey, 
  getFindBatteriesQueryKey 
} from "@workspace/api-client-react";

export default function BatteryFinder() {
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const { data: makes, isLoading: isLoadingMakes } = useGetVehicleMakes();
  
  const { data: models, isLoading: isLoadingModels } = useGetVehicleModels(
    { make },
    { query: { enabled: !!make, queryKey: getGetVehicleModelsQueryKey({ make }) } }
  );

  const { data: results, isLoading: isLoadingResults, refetch: searchBatteries, isFetching: isSearching } = useFindBatteries(
    { make, model, year: year ? parseInt(year) : undefined },
    { query: { enabled: false, queryKey: getFindBatteriesQueryKey({ make, model, year: year ? parseInt(year) : undefined }) } }
  );

  const handleMakeChange = (value: string) => {
    setMake(value);
    setModel("");
  };

  const handleModelChange = (value: string) => {
    setModel(value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(e.target.value);
  };

  const handleSearch = () => {
    if (make && model && year) {
      searchBatteries();
    }
  };

  const isFormValid = make && model && year && year.length === 4;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">Akü Bulucu</h1>
        <p className="text-muted-foreground font-mono">Aracınız için en uygun Skyrich aküyü bulun</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-card border-border rounded-none shadow-xl">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">1</span>
                  Araç Markası
                </label>
                <Select value={make} onValueChange={handleMakeChange} disabled={isLoadingMakes}>
                  <SelectTrigger className="w-full rounded-none border-border bg-background">
                    <SelectValue placeholder="Marka Seçin" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-border">
                    {makes?.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">2</span>
                  Araç Modeli
                </label>
                <Select value={model} onValueChange={handleModelChange} disabled={!make || isLoadingModels}>
                  <SelectTrigger className="w-full rounded-none border-border bg-background">
                    <SelectValue placeholder="Model Seçin" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-border">
                    {models?.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">3</span>
                  Üretim Yılı
                </label>
                <Input 
                  type="number" 
                  min="2000" 
                  max="2024" 
                  placeholder="Örn: 2018" 
                  value={year}
                  onChange={handleYearChange}
                  disabled={!model}
                  className="rounded-none border-border bg-background"
                />
              </div>

              <Button 
                onClick={handleSearch} 
                disabled={!isFormValid || isSearching} 
                className="w-full rounded-none h-12 uppercase tracking-wider font-bold"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">Aranıyor...</span>
                ) : (
                  <span className="flex items-center gap-2"><Search size={18} /> Akü Bul</span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {isSearching || isLoadingResults ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-80 bg-muted/20 animate-pulse border border-border" />
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
                <Zap className="text-primary" /> Uygun Aküler
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {results.map((result) => (
                  <Card key={result.battery.id} className="group bg-card border-border hover:border-primary/50 transition-all rounded-none overflow-hidden flex flex-col">
                    <CardContent className="p-0 flex-1 flex flex-col">
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-xs font-mono text-primary mb-1">{result.battery.modelCode}</div>
                            <h3 className="text-lg font-bold uppercase leading-tight">{result.battery.name}</h3>
                          </div>
                          <div className="bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-border">
                            {result.battery.technology}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm font-mono bg-background p-3 mb-6 border border-border mt-auto">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-[10px] uppercase">Voltaj</span>
                            <span className="font-bold">{result.battery.voltage || '-'}V</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-[10px] uppercase">Kapasite</span>
                            <span className="font-bold">{result.battery.capacity || '-'}Ah</span>
                          </div>
                        </div>
                        
                        <Button asChild className="w-full bg-secondary hover:bg-primary text-secondary-foreground hover:text-primary-foreground rounded-none uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                          <Link href={`/urunler/${result.battery.id}`} className="flex items-center justify-center gap-2">
                            Detaylı İncele <ArrowRight size={16} />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : results && results.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 border border-border bg-card">
              <BatteryIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-bold uppercase mb-2">Uyumlu Akü Bulunamadı</h3>
              <p className="text-muted-foreground max-w-md">Seçtiğiniz araç modeli için uygun bir akü bulunmamaktadır. Lütfen farklı bir model seçin veya destek için bizimle iletişime geçin.</p>
              <Button asChild variant="outline" className="mt-6 rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link href="/iletisim">İletişime Geç</Link>
              </Button>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-border bg-card/50">
              <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-bold uppercase text-muted-foreground">Aracınızı Seçin</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-2">Uyumlu aküleri görmek için sol taraftaki formu doldurun ve "Akü Bul" butonuna tıklayın.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
