import { Link } from "wouter";
import { Battery as BatteryIcon, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { technologyLabel, productTypeLabel, formatSpec } from "@/lib/display-labels";
import { ProductImageStage } from "./product-image-stage";

interface ProductCardProps {
  battery: {
    id: number;
    modelCode: string;
    name: string;
    technology: string;
    type?: string;
    voltage: number | null | undefined;
    capacity: number | null | undefined;
    cca?: number | null | undefined;
    imageUrl?: string | null | undefined;
  };
}

export function ProductCard({ battery }: ProductCardProps) {
  return (
    <Card className="group premium-card premium-card-hover rounded-none overflow-hidden flex flex-col border-metallic bg-background/50">
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Premium image stage with white photography background */}
        <div className="aspect-[4/3] bg-gradient-to-br from-white to-zinc-100 relative flex items-center justify-center p-5 border-b border-border overflow-hidden">
          <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider flex items-center gap-1.5 border border-primary/30 z-10">
            <Zap size={11} /> {technologyLabel(battery.technology)}
          </div>
          <ProductImageStage
            modelCode={battery.modelCode}
            orderNumber={battery.id}
            imageUrl={battery.imageUrl}
            alt={battery.name}
            variant="compactCard"
            maxHeight="260px"
            className="group-hover:scale-105 group-hover:drop-shadow-[0_25px_50px_rgba(255,0,0,0.15)] transition-all duration-500"
          />
        </div>
        
        {/* Refined content layout */}
        <div className="p-6 flex flex-col flex-1 space-y-5">
          <div className="space-y-3">
            <div className="spec-chip bg-primary/5 border-primary/20 text-xs">{battery.modelCode}</div>
            <h3 className="text-sm font-bold uppercase leading-tight group-hover:text-primary transition-colors">{battery.name}</h3>
          </div>
          
          {/* Cleaner specs display */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-background/80 border border-border p-3">
              <span className="spec-label block mb-1 text-xs">Voltaj</span>
              <span className="spec-value text-base font-mono">{formatSpec(battery.voltage, "V")}</span>
            </div>
            <div className="bg-background/80 border border-border p-3">
              <span className="spec-label block mb-1 text-xs">Kapasite</span>
              <span className="spec-value text-base font-mono">{battery.capacity ? `${battery.capacity}Ah` : 'Doğrulanacak'}</span>
            </div>
          </div>
          
          <div className="flex-1" />
          
          {/* Premium CTA */}
          <Button asChild className="btn-premium w-full bg-secondary hover:bg-primary text-secondary-foreground hover:text-primary-foreground rounded-none uppercase tracking-wider text-xs py-4 border border-border">
            <Link href={`/urunler/${battery.id}`} className="flex items-center justify-center gap-2">
              Detaylar
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
