import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useListBatteries, getListBatteriesQueryKey, useCreateBattery, useUpdateBattery, useDeleteBattery, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { Plus, Edit, Trash2, Battery as BatteryIcon, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Battery, BatteryInput } from "@workspace/api-client-react";

export function AdminBatteries() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBattery, setEditingBattery] = useState<Battery | null>(null);
  
  const [formData, setFormData] = useState<BatteryInput>({
    modelCode: "",
    name: "",
    description: "",
    voltage: 12,
    capacity: 0,
    cca: 0,
    type: "Motorcycle",
    technology: "Lithium",
    dimensions: "",
    weight: 0,
    imageUrl: "",
    applications: "",
    active: true,
    featured: false,
    sortOrder: 0
  });

  const { data: batteries, isLoading } = useListBatteries(undefined, { 
    query: { queryKey: getListBatteriesQueryKey() } 
  });

  const createMutation = useCreateBattery();
  const updateMutation = useUpdateBattery();
  const deleteMutation = useDeleteBattery();

  const handleOpenDialog = (battery?: Battery) => {
    if (battery) {
      setEditingBattery(battery);
      setFormData({
        modelCode: battery.modelCode,
        name: battery.name,
        description: battery.description || "",
        voltage: battery.voltage || undefined,
        capacity: battery.capacity || undefined,
        cca: battery.cca || undefined,
        type: battery.type,
        technology: battery.technology,
        dimensions: battery.dimensions || "",
        weight: battery.weight || undefined,
        imageUrl: battery.imageUrl || "",
        applications: battery.applications || "",
        active: battery.active,
        featured: battery.featured,
        sortOrder: battery.sortOrder
      });
    } else {
      setEditingBattery(null);
      setFormData({
        modelCode: "",
        name: "",
        description: "",
        voltage: 12,
        capacity: 0,
        cca: 0,
        type: "Motorcycle",
        technology: "Lithium",
        dimensions: "",
        weight: 0,
        imageUrl: "",
        applications: "",
        active: true,
        featured: false,
        sortOrder: 0
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingBattery) {
      updateMutation.mutate({ id: editingBattery.id, data: formData }, {
        onSuccess: () => {
          toast({ title: "Başarılı", description: "Akü güncellendi." });
          queryClient.invalidateQueries({ queryKey: getListBatteriesQueryKey() });
          setIsDialogOpen(false);
        }
      });
    } else {
      createMutation.mutate({ data: formData }, {
        onSuccess: () => {
          toast({ title: "Başarılı", description: "Akü oluşturuldu." });
          queryClient.invalidateQueries({ queryKey: getListBatteriesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if(confirm("Bu aküyü silmek istediğinize emin misiniz?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Başarılı", description: "Akü silindi." });
          queryClient.invalidateQueries({ queryKey: getListBatteriesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card p-4 border border-border">
        <h2 className="text-xl font-bold uppercase tracking-tight">Akü Yönetimi</h2>
        <Button onClick={() => handleOpenDialog()} className="rounded-none bg-primary hover:bg-primary/90 uppercase tracking-widest text-xs font-bold">
          <Plus size={16} className="mr-2" /> Yeni Ekle
        </Button>
      </div>
      
      <div className="border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold uppercase text-xs tracking-wider w-16"></TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider">Model</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider">İsim</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider">Kategori / Teknoloji</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider text-center">Öne Çıkan</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider text-center">Durum</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Yükleniyor...</TableCell></TableRow>
            ) : batteries?.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Kayıt bulunamadı.</TableCell></TableRow>
            ) : (
              batteries?.map((battery) => (
                <TableRow key={battery.id} className="border-border">
                  <TableCell>
                    {battery.imageUrl ? (
                       <img src={battery.imageUrl} alt={battery.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <BatteryIcon size={24} className="text-muted-foreground/50 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold">{battery.modelCode}</TableCell>
                  <TableCell className="font-bold">{battery.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <span className="bg-muted text-muted-foreground px-2 py-1 text-[10px] uppercase font-bold">{battery.type}</span>
                      <span className="bg-secondary text-secondary-foreground px-2 py-1 text-[10px] uppercase font-bold">{battery.technology}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {battery.featured ? <Check size={16} className="text-primary mx-auto" /> : <X size={16} className="text-muted-foreground/30 mx-auto" />}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${battery.active ? 'text-green-500 bg-green-500/10 border border-green-500/20' : 'text-red-500 bg-red-500/10 border border-red-500/20'}`}>
                      {battery.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(battery)} className="text-muted-foreground hover:text-primary"><Edit size={16} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(battery.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] bg-card border-border rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="uppercase font-bold tracking-wider">{editingBattery ? "Aküyü Düzenle" : "Yeni Akü Ekle"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Model Kodu</Label>
                <Input value={formData.modelCode} onChange={(e) => setFormData({...formData, modelCode: e.target.value})} className="rounded-none font-mono" />
              </div>
              <div className="space-y-2">
                <Label>İsim</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-none" />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                  <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="Motorcycle">Motosiklet</SelectItem>
                    <SelectItem value="ATV">ATV</SelectItem>
                    <SelectItem value="JetSki">Jet-Ski</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Teknoloji</Label>
                <Select value={formData.technology} onValueChange={(v) => setFormData({...formData, technology: v})}>
                  <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="Lithium">Lityum</SelectItem>
                    <SelectItem value="AGM">AGM</SelectItem>
                    <SelectItem value="GEL">JEL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <Textarea value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-none min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <Label>Görsel URL</Label>
                <Input value={formData.imageUrl || ""} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="rounded-none" placeholder="/images/battery-lithium.png" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Voltaj (V)</Label>
                  <Input type="number" value={formData.voltage || ""} onChange={(e) => setFormData({...formData, voltage: parseFloat(e.target.value)})} className="rounded-none font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Kapasite (Ah)</Label>
                  <Input type="number" value={formData.capacity || ""} onChange={(e) => setFormData({...formData, capacity: parseFloat(e.target.value)})} className="rounded-none font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>CCA (A)</Label>
                  <Input type="number" value={formData.cca || ""} onChange={(e) => setFormData({...formData, cca: parseFloat(e.target.value)})} className="rounded-none font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Ağırlık (kg)</Label>
                  <Input type="number" step="0.1" value={formData.weight || ""} onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})} className="rounded-none font-mono" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Boyutlar (UxGxD mm)</Label>
                <Input value={formData.dimensions || ""} onChange={(e) => setFormData({...formData, dimensions: e.target.value})} className="rounded-none font-mono" />
              </div>
              
              <div className="space-y-2">
                <Label>Uyumlu Araçlar</Label>
                <Textarea value={formData.applications || ""} onChange={(e) => setFormData({...formData, applications: e.target.value})} className="rounded-none min-h-[80px] font-mono text-sm" />
              </div>

              <div className="space-y-2">
                <Label>Sıralama (Küçük olan önce)</Label>
                <Input type="number" value={formData.sortOrder || 0} onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value)})} className="rounded-none font-mono" />
              </div>

              <div className="flex gap-6 pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Switch id="active" checked={formData.active} onCheckedChange={(c) => setFormData({...formData, active: c})} />
                  <Label htmlFor="active" className="cursor-pointer">Aktif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="featured" checked={formData.featured} onCheckedChange={(c) => setFormData({...formData, featured: c})} />
                  <Label htmlFor="featured" className="cursor-pointer">Öne Çıkan</Label>
                </div>
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
