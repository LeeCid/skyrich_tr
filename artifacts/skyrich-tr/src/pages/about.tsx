import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useGetPageContent, getGetPageContentQueryKey } from "@workspace/api-client-react";

export default function About() {
  const { data: pageContent } = useGetPageContent("hakkimizda", { query: { queryKey: getGetPageContentQueryKey("hakkimizda") } });

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
              {pageContent?.content ? (
                pageContent.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>İçerik yakında eklenecek.</p>
              )}
            </div>
            
            <div className="mt-10">
               <Button asChild className="bg-primary text-primary-foreground rounded-none uppercase tracking-widest px-8">
                 <Link href="/iletisim">Bize Ulaşın</Link>
               </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Kept empty or original styling if required, but task says "Remove ALL hardcoded stats" so let's remove the stats boxes entirely, or leave empty styled boxes? The rules say "Remove ALL hardcoded stats... Keep the page layout and styling". Removing the text inside makes them empty. Let's just remove the boxes as they are stats. Wait, the rule says "Keep the page layout and styling". So if I remove the whole div with the 4 boxes, the right column is empty. Let's remove the whole right column content but keep the empty grid column if needed, or just let it span. Actually, let's remove the 4 stats boxes. */}
            <div className="bg-card border border-border p-8 text-center flex flex-col justify-center min-h-[200px] opacity-0 pointer-events-none">
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
