import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useGetSiteSettings, getGetSiteSettingsQueryKey, useGetPageContent, getGetPageContentQueryKey } from "@workspace/api-client-react";

export default function Contact() {
  const { data: settings } = useGetSiteSettings({ query: { queryKey: getGetSiteSettingsQueryKey() } });
  const { data: pageContent } = useGetPageContent("iletisim-intro", { query: { queryKey: getGetPageContentQueryKey("iletisim-intro") } });

  const hasAnyContact = settings?.address || settings?.phone || settings?.email || settings?.whatsapp;

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">İletişim</h1>
        {pageContent?.content ? (
          <p className="text-muted-foreground font-mono">{pageContent.content}</p>
        ) : (
          <p className="text-muted-foreground font-mono">Size en kısa sürede yardımcı olmak için aşağıdaki kanallardan ulaşabilirsiniz.</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          {!hasAnyContact ? (
             <p className="text-muted-foreground font-mono">İletişim bilgileri yakında eklenecek.</p>
          ) : (
            <>
              {settings?.address && (
                <div className="flex gap-6 items-start">
                  <div className="bg-primary/10 p-4 rounded-none border border-primary/20">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-sm mb-2">Adres</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {settings.address}
                    </p>
                  </div>
                </div>
              )}

              {settings?.phone && (
                <div className="flex gap-6 items-start">
                  <div className="bg-primary/10 p-4 rounded-none border border-primary/20">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-sm mb-2">Telefon</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {settings.phone}
                    </p>
                  </div>
                </div>
              )}

              {settings?.email && (
                <div className="flex gap-6 items-start">
                  <div className="bg-primary/10 p-4 rounded-none border border-primary/20">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-sm mb-2">E-Posta</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {settings.email}
                    </p>
                  </div>
                </div>
              )}

              {settings?.whatsapp && (
                <div className="flex gap-6 items-start">
                  <div className="bg-primary/10 p-4 rounded-none border border-primary/20">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-sm mb-2">WhatsApp</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {settings.whatsapp}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Contact CTA */}
        <div className="bg-card border border-border p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold uppercase mb-4">Bize Ulaşın</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Araç marka/model veya eski akü kodunuzu gönderin, size uygun Skyrich modelini iletelim.
          </p>
          {settings?.whatsapp ? (
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-widest font-bold px-8 py-4 text-sm"
            >
              <MessageCircle size={18} /> WhatsApp'tan Bilgi Al
            </a>
          ) : (
            <p className="text-muted-foreground font-mono text-sm">WhatsApp bilgisi yakında eklenecek.</p>
          )}
        </div>
      </div>
    </div>
  );
}
