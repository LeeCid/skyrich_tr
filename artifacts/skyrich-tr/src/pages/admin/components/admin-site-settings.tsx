import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useGetSiteSettings, getGetSiteSettingsQueryKey, useUpdateSiteSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function AdminSiteSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetSiteSettings({ query: { queryKey: getGetSiteSettingsQueryKey() } });
  const updateMutation = useUpdateSiteSettings();

  const [formData, setFormData] = useState({
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
    instagram: "",
    facebook: "",
    seoTitle: "",
    seoDescription: "",
    footerDescription: ""
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        whatsapp: settings.whatsapp || "",
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || "",
        instagram: settings.instagram || "",
        facebook: settings.facebook || "",
        seoTitle: settings.seoTitle || "",
        seoDescription: settings.seoDescription || "",
        footerDescription: settings.footerDescription || ""
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateMutation.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Başarılı", description: "Ayarlar kaydedildi." });
        queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() });
      },
      onError: () => {
        toast({ title: "Hata", description: "Ayarlar kaydedilemedi.", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 border border-border">
        <h2 className="text-xl font-bold uppercase tracking-tight">Site Ayarları</h2>
      </div>

      <div className="bg-card border border-border p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wider text-primary border-b border-border pb-2 mb-4">İletişim Bilgileri</h3>
          <div className="space-y-2">
            <Label>WhatsApp Numarası</Label>
            <Input value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="rounded-none" placeholder="+90555..." />
          </div>
          <div className="space-y-2">
            <Label>Telefon</Label>
            <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="rounded-none" placeholder="+90212..." />
          </div>
          <div className="space-y-2">
            <Label>E-posta</Label>
            <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="rounded-none" placeholder="info@..." />
          </div>
          <div className="space-y-2">
            <Label>Adres</Label>
            <Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="rounded-none" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wider text-primary border-b border-border pb-2 mb-4">Sosyal Medya & SEO</h3>
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} className="rounded-none" placeholder="https://instagram.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Facebook URL</Label>
            <Input value={formData.facebook} onChange={(e) => setFormData({...formData, facebook: e.target.value})} className="rounded-none" placeholder="https://facebook.com/..." />
          </div>
          <div className="space-y-2">
            <Label>SEO Başlığı</Label>
            <Input value={formData.seoTitle} onChange={(e) => setFormData({...formData, seoTitle: e.target.value})} className="rounded-none" />
          </div>
          <div className="space-y-2">
            <Label>SEO Açıklaması</Label>
            <Textarea value={formData.seoDescription} onChange={(e) => setFormData({...formData, seoDescription: e.target.value})} className="rounded-none" />
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