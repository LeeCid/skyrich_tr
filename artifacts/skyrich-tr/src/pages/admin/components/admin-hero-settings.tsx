import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGetHeroSettings, getGetHeroSettingsQueryKey, useUpdateHeroSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function AdminHeroSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: hero, isLoading } = useGetHeroSettings({ query: { queryKey: getGetHeroSettingsQueryKey() } });
  const updateMutation = useUpdateHeroSettings();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    cta1Text: "",
    cta1Link: "",
    cta2Text: "",
    cta2Link: "",
    bgImageUrl: ""
  });

  useEffect(() => {
    if (hero) {
      setFormData({
        title: hero.title || "",
        subtitle: hero.subtitle || "",
        cta1Text: hero.cta1Text || "",
        cta1Link: hero.cta1Link || "",
        cta2Text: hero.cta2Text || "",
        cta2Link: hero.cta2Link || "",
        bgImageUrl: hero.bgImageUrl || ""
      });
    }
  }, [hero]);

  const handleSave = () => {
    updateMutation.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Başarılı", description: "Hero ayarları kaydedildi." });
        queryClient.invalidateQueries({ queryKey: getGetHeroSettingsQueryKey() });
      }
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 border border-border">
        <h2 className="text-xl font-bold uppercase tracking-tight">Hero (Ana Sayfa) Ayarları</h2>
      </div>

      <div className="bg-card border border-border p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 col-span-1 md:col-span-2">
          <h3 className="text-lg font-bold uppercase tracking-wider text-primary border-b border-border pb-2 mb-4">Ana Alan İçeriği</h3>
          <div className="space-y-2">
            <Label>Ana Başlık</Label>
            <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="rounded-none font-bold" />
          </div>
          <div className="space-y-2">
            <Label>Alt Başlık</Label>
            <Input value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="rounded-none" />
          </div>
          <div className="space-y-2">
            <Label>Arkaplan Görsel URL</Label>
            <Input value={formData.bgImageUrl} onChange={(e) => setFormData({...formData, bgImageUrl: e.target.value})} className="rounded-none" placeholder="/images/hero-1.png" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wider text-primary border-b border-border pb-2 mb-4">1. Buton (Birincil)</h3>
          <div className="space-y-2">
            <Label>Buton Metni</Label>
            <Input value={formData.cta1Text} onChange={(e) => setFormData({...formData, cta1Text: e.target.value})} className="rounded-none" placeholder="TÜM ÜRÜNLER" />
          </div>
          <div className="space-y-2">
            <Label>Buton Linki</Label>
            <Input value={formData.cta1Link} onChange={(e) => setFormData({...formData, cta1Link: e.target.value})} className="rounded-none" placeholder="/urunler" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wider text-primary border-b border-border pb-2 mb-4">2. Buton (İkincil)</h3>
          <div className="space-y-2">
            <Label>Buton Metni</Label>
            <Input value={formData.cta2Text} onChange={(e) => setFormData({...formData, cta2Text: e.target.value})} className="rounded-none" />
          </div>
          <div className="space-y-2">
            <Label>Buton Linki</Label>
            <Input value={formData.cta2Link} onChange={(e) => setFormData({...formData, cta2Link: e.target.value})} className="rounded-none" />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 pt-6 flex justify-end border-t border-border mt-4">
          <Button onClick={handleSave} className="rounded-none bg-primary text-primary-foreground font-bold uppercase tracking-wider px-8" disabled={updateMutation.isPending}>
            Ayarları Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
}