import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center mb-8">
          <AlertCircle className="h-24 w-24 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold tracking-tighter text-foreground font-mono">404</h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-wide">Sayfa Bulunamadı</h2>
          <p className="text-muted-foreground">
            Aradığınız sayfaya ulaşılamıyor. URL'i kontrol edin veya ana sayfaya dönün.
          </p>
        </div>
        
        <div className="pt-8">
          <Button asChild size="lg" className="w-full rounded-none bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-widest font-bold">
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
