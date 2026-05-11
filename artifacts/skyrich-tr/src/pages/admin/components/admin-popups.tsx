import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useListPopups, getListPopupsQueryKey, useCreatePopup, useUpdatePopup, useDeletePopup, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { Plus, Edit, Trash2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popup, PopupInput, PopupInputFrequency } from "@workspace/api-client-react";

export function AdminPopups() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  
  const [formData, setFormData] = useState<PopupInput>({
    title: "",
    content: "",
    imageUrl: "",
    buttonText: "",
    buttonUrl: "",
    active: true,
    frequency: 'always' as PopupInputFrequency,
    delaySeconds: 2,
    startDate: "",
    endDate: ""
  });

  const { data: popups, isLoading } = useListPopups(undefined, { 
    query: { queryKey: getListPopupsQueryKey() } 
  });

  const createMutation = useCreatePopup();
  const updateMutation = useUpdatePopup();
  const deleteMutation = useDeletePopup();

  const handleOpenDialog = (popup?: Popup) => {
    if (popup) {
      setEditingPopup(popup);
      setFormData({
        title: popup.title,
        content: popup.content || "",
        imageUrl: popup.imageUrl || "",
        buttonText: popup.buttonText || "",
        buttonUrl: popup.buttonUrl || "",
        active: popup.active,
        frequency: popup.frequency || 'always',
        delaySeconds: popup.delaySeconds || 0,
        startDate: popup.startDate || "",
        endDate: popup.endDate || ""
      });
    } else {
      setEditingPopup(null);
      setFormData({
        title: "",
        content: "",
        imageUrl: "",
        buttonText: "",
        buttonUrl: "",
        active: true,
        frequency: 'always',
        delaySeconds: 2,
        startDate: "",
        endDate: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingPopup) {
      updateMutation.mutate({ id: editingPopup.id, data: formData }, {
        onSuccess: () => {
          toast({ title: "Başarılı", description: "Popup güncellendi." });
          queryClient.invalidateQueries({ queryKey: getListPopupsQueryKey() });
          setIsDialogOpen(false);
        }
      });
    } else {
      createMutation.mutate({ data: formData }, {
        onSuccess: () => {
          toast({ title: "Başarılı", description: "Popup oluşturuldu." });
          queryClient.invalidateQueries({ queryKey: getListPopupsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if(confirm("Bu popup'ı silmek istediğinize emin misiniz?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Başarılı", description: "Popup silindi." });
          queryClient.invalidateQueries({ queryKey: getListPopupsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card p-4 border border-border">
        <h2 className="text-xl font-bold uppercase tracking-tight">Popup Yönetimi</h2>
        <Button onClick={() => handleOpenDialog()} className="rounded-none bg-primary hover:bg-primary/90 uppercase tracking-widest text-xs font-bold">
          <Plus size={16} className="mr-2" /> Yeni Ekle
        </Button>
      </div>
      
      <div className="border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold uppercase text-xs tracking-wider">Başlık</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider text-center">Gecikme (sn)</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider text-center">Sıklık</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider text-center">Durum</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Yükleniyor...</TableCell></TableRow>
            ) : popups?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Kayıt bulunamadı.</TableCell></TableRow>
            ) : (
              popups?.map((popup) => (
                <TableRow key={popup.id} className="border-border">
                  <TableCell className="font-bold">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} className="text-muted-foreground" />
                      {popup.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono">{popup.delaySeconds}</TableCell>
                  <TableCell className="text-center">
                    {popup.frequency === 'always' ? 'Her Zaman' : popup.frequency === 'once-per-session' ? 'Oturum Başı' : 'Devre Dışı'}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${popup.active ? 'text-green-500 bg-green-500/10 border border-green-500/20' : 'text-red-500 bg-red-500/10 border border-red-500/20'}`}>
                      {popup.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(popup)} className="text-muted-foreground hover:text-primary"><Edit size={16} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(popup.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></Button>
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
            <DialogTitle className="uppercase font-bold tracking-wider">{editingPopup ? "Popup'ı Düzenle" : "Yeni Popup Ekle"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Başlık</Label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="rounded-none" />
            </div>
            <div className="space-y-2">
              <Label>İçerik</Label>
              <Textarea value={formData.content || ""} onChange={(e) => setFormData({...formData, content: e.target.value})} className="rounded-none min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label>Görsel URL (Opsiyonel)</Label>
              <Input value={formData.imageUrl || ""} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="rounded-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Buton Metni (Opsiyonel)</Label>
                <Input value={formData.buttonText || ""} onChange={(e) => setFormData({...formData, buttonText: e.target.value})} className="rounded-none" />
              </div>
              <div className="space-y-2">
                <Label>Buton URL</Label>
                <Input value={formData.buttonUrl || ""} onChange={(e) => setFormData({...formData, buttonUrl: e.target.value})} className="rounded-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Gecikme (Saniye)</Label>
                <Input type="number" value={formData.delaySeconds || 0} onChange={(e) => setFormData({...formData, delaySeconds: parseInt(e.target.value)})} className="rounded-none font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Gösterim Sıklığı</Label>
                <Select value={formData.frequency} onValueChange={(val) => setFormData({...formData, frequency: val as PopupInputFrequency})}>
                  <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="always">Her Zaman</SelectItem>
                    <SelectItem value="once-per-session">Oturum Başına Bir Kez</SelectItem>
                    <SelectItem value="disabled">Devre Dışı</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Başlangıç Tarihi (Opsiyonel)</Label>
                <Input type="date" value={formData.startDate || ""} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="rounded-none" />
              </div>
              <div className="space-y-2">
                <Label>Bitiş Tarihi (Opsiyonel)</Label>
                <Input type="date" value={formData.endDate || ""} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="rounded-none" />
              </div>
            </div>
            <div className="flex gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <Switch id="popup-active" checked={formData.active} onCheckedChange={(c) => setFormData({...formData, active: c})} />
                <Label htmlFor="popup-active" className="cursor-pointer">Aktif</Label>
              </div>
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
