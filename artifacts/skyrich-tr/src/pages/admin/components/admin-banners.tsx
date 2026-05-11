import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useListBanners, getListBannersQueryKey, useCreateBanner, useUpdateBanner, useDeleteBanner, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Banner, BannerInput } from "@workspace/api-client-react";

export function AdminBanners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  
  const [formData, setFormData] = useState<BannerInput>({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    linkText: "",
    backgroundColor: "#000000",
    active: true,
    sortOrder: 0
  });

  const { data: banners, isLoading } = useListBanners(undefined, { 
    query: { queryKey: getListBannersQueryKey() } 
  });

  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || "",
        imageUrl: banner.imageUrl || "",
        linkUrl: banner.linkUrl || "",
        linkText: banner.linkText || "",
        backgroundColor: banner.backgroundColor || "#000000",
        active: banner.active,
        sortOrder: banner.sortOrder
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: "",
        subtitle: "",
        imageUrl: "",
        linkUrl: "",
        linkText: "",
        backgroundColor: "#000000",
        active: true,
        sortOrder: 0
      });
    }
    setIsDialogOpen(true);
  };

  const isValidUrl = (url: string) => {
    if (!url) return true;
    return url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://");
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast({ title: "Hata", description: "Başlık zorunludur.", variant: "destructive" });
      return;
    }
    if (!isValidUrl(formData.imageUrl || "")) {
      toast({ title: "Hata", description: "Görsel URL geçersiz. Sadece / veya http/https ile başlayan adresler kullanın.", variant: "destructive" });
      return;
    }
    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, data: formData }, {
        onSuccess: () => {
          toast({ title: "Başarılı", description: "Banner güncellendi." });
          queryClient.invalidateQueries({ queryKey: getListBannersQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => {
          toast({ title: "Hata", description: "Banner güncellenemedi.", variant: "destructive" });
        }
      });
    } else {
      createMutation.mutate({ data: formData }, {
        onSuccess: () => {
          toast({ title: "Başarılı", description: "Banner oluşturuldu." });
          queryClient.invalidateQueries({ queryKey: getListBannersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => {
          toast({ title: "Hata", description: "Banner oluşturulamadı.", variant: "destructive" });
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if(confirm("Bu bannerı silmek istediğinize emin misiniz?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Başarılı", description: "Banner silindi." });
          queryClient.invalidateQueries({ queryKey: getListBannersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        },
        onError: () => {
          toast({ title: "Hata", description: "Banner silinemedi.", variant: "destructive" });
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card p-4 border border-border">
        <h2 className="text-xl font-bold uppercase tracking-tight">Banner Yönetimi</h2>
        <Button onClick={() => handleOpenDialog()} className="rounded-none bg-primary hover:bg-primary/90 uppercase tracking-widest text-xs font-bold">
          <Plus size={16} className="mr-2" /> Yeni Ekle
        </Button>
      </div>
      
      <div className="border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold uppercase text-xs tracking-wider w-32">Görsel</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider">Başlık</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider">Link</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider text-center">Sıra</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider text-center">Durum</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Yükleniyor...</TableCell></TableRow>
            ) : banners?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Kayıt bulunamadı.</TableCell></TableRow>
            ) : (
              banners?.map((banner) => (
                <TableRow key={banner.id} className="border-border">
                  <TableCell>
                    {banner.imageUrl ? (
                       <img src={banner.imageUrl} alt={banner.title} className="w-full h-12 object-cover border border-border" />
                    ) : (
                      <div className="w-full h-12 bg-muted flex items-center justify-center border border-border">
                        <ImageIcon size={16} className="text-muted-foreground/50" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-bold">
                    {banner.title}
                    {banner.subtitle && <div className="text-xs font-normal text-muted-foreground mt-1">{banner.subtitle}</div>}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{banner.linkUrl}</TableCell>
                  <TableCell className="text-center font-mono">{banner.sortOrder}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${banner.active ? 'text-green-500 bg-green-500/10 border border-green-500/20' : 'text-red-500 bg-red-500/10 border border-red-500/20'}`}>
                      {banner.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(banner)} className="text-muted-foreground hover:text-primary"><Edit size={16} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(banner.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border rounded-none">
          <DialogHeader>
            <DialogTitle className="uppercase font-bold tracking-wider">{editingBanner ? "Bannerı Düzenle" : "Yeni Banner Ekle"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Başlık</Label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="rounded-none" />
            </div>
            <div className="space-y-2">
              <Label>Alt Başlık</Label>
              <Input value={formData.subtitle || ""} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="rounded-none" />
            </div>
            <div className="space-y-2">
              <Label>Görsel URL</Label>
              <Input value={formData.imageUrl || ""} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="rounded-none" placeholder="/images/hero-1.png" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Link Metni</Label>
                <Input value={formData.linkText || ""} onChange={(e) => setFormData({...formData, linkText: e.target.value})} className="rounded-none" />
              </div>
              <div className="space-y-2">
                <Label>Link URL</Label>
                <Input value={formData.linkUrl || ""} onChange={(e) => setFormData({...formData, linkUrl: e.target.value})} className="rounded-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Arka Plan Rengi</Label>
                <Input type="color" value={formData.backgroundColor || "#000000"} onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})} className="rounded-none h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Label>Sıralama</Label>
                <Input type="number" value={formData.sortOrder || 0} onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value)})} className="rounded-none font-mono" />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <Switch id="banner-active" checked={formData.active} onCheckedChange={(c) => setFormData({...formData, active: c})} />
              <Label htmlFor="banner-active" className="cursor-pointer">Aktif</Label>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-none">İptal</Button>
            <Button onClick={handleSave} className="rounded-none bg-primary text-primary-foreground font-bold uppercase tracking-wider" disabled={createMutation.isPending || updateMutation.isPending}>
              Kaydet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
