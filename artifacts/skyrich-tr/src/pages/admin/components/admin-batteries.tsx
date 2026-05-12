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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    voltage: undefined,
    capacity: undefined,
    cca: undefined,
    type: "Motorcycle",
    technology: "Lithium",
    dimensions: "",
    weight: undefined,
    chargeCurrent: "",
    imageUrl: "",
    applications: "",
    crossReferenceCodes: [],
    sourceStatus: "",
    sourceUrl: "",
    sourceNotes: "",
    vehicleHints: [],
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
        chargeCurrent: (battery as any).chargeCurrent || "",
        imageUrl: battery.imageUrl || "",
        applications: battery.applications || "",
        crossReferenceCodes: (battery as any).crossReferenceCodes || [],
        sourceStatus: (battery as any).sourceStatus || "",
        sourceUrl: (battery as any).sourceUrl || "",
        sourceNotes: (battery as any).sourceNotes || "",
        vehicleHints: (battery as any).vehicleHints || [],
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
        voltage: undefined,
        capacity: undefined,
        cca: undefined,
        type: "Motorcycle",
        technology: "Lithium",
        dimensions: "",
        weight: undefined,
        chargeCurrent: "",
        imageUrl: "",
        applications: "",
        crossReferenceCodes: [],
        sourceStatus: "",
        sourceUrl: "",
        sourceNotes: "",
        vehicleHints: [],
        active: true,
        featured: false,
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
    if (!formData.modelCode.trim() || !formData.name.trim()) {
      toast({ title: "Hata", description: "Model kodu ve isim zorunludur.", variant: "destructive" });
      return;
    }
    if (!isValidUrl(formData.imageUrl || "")) {
      toast({ title: "Hata", description: "Görsel URL geçersiz. Sadece / veya http/https ile başlayan adresler kullanın.", variant: "destructive" });
      return;
    }
    if (formData.sourceUrl && !isValidUrl(formData.sourceUrl)) {
      toast({ title: "Hata", description: "Kaynak URL geçersiz. Sadece http/https ile başlayan adresler kullanın.", variant: "destructive" });
      return;
    }
    
    // Parse crossReferenceCodes from comma/newline-separated text if stored as string
    let crossRefCodes: string[] = [];
    const crossRefInput = formData.crossReferenceCodes as any;
    if (typeof crossRefInput === 'string') {
      crossRefCodes = crossRefInput.split(/[\n,]+/).map((s: string) => s.trim()).filter((s: string) => s);
    } else if (Array.isArray(crossRefInput)) {
      crossRefCodes = crossRefInput;
    }
    
    // Parse vehicleHints from JSON if stored as string
    let vehicleHints: any[] = [];
    const vehicleHintsInput = formData.vehicleHints as any;
    if (typeof vehicleHintsInput === 'string') {
      try {
        vehicleHints = JSON.parse(vehicleHintsInput);
      } catch (e) {
        toast({ title: "Hata", description: "Araç ipuçları JSON formatı geçersiz.", variant: "destructive" });
        return;
      }
    } else if (Array.isArray(vehicleHintsInput)) {
      vehicleHints = vehicleHintsInput;
    }

    const submitData = {
      ...formData,
      crossReferenceCodes: crossRefCodes,
      vehicleHints: vehicleHints
    } as any;

    if (editingBattery) {
      updateMutation.mutate({ id: editingBattery.id, data: submitData }, {
        onSuccess: () => {
          toast({ title: "Başarılı", description: "Akü güncellendi." });
          queryClient.invalidateQueries({ queryKey: getListBatteriesQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => {
          toast({ title: "Hata", description: "Akü güncellenemedi.", variant: "destructive" });
        }
      });
    } else {
      createMutation.mutate({ data: submitData }, {
        onSuccess: () => {
          toast({ title: "Başarılı", description: "Akü oluşturuldu." });
          queryClient.invalidateQueries({ queryKey: getListBatteriesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => {
          toast({ title: "Hata", description: "Akü oluşturulamadı.", variant: "destructive" });
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
        },
        onError: () => {
          toast({ title: "Hata", description: "Akü silinemedi.", variant: "destructive" });
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
        <DialogContent className="sm:max-w-[900px] bg-card border-border rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="uppercase font-bold tracking-wider">{editingBattery ? "Aküyü Düzenle" : "Yeni Akü Ekle"}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
              <TabsTrigger value="technical">Teknik Özellikler</TabsTrigger>
              <TabsTrigger value="codes">Karşılık Kodları</TabsTrigger>
              <TabsTrigger value="source">Kaynak / Doğrulama</TabsTrigger>
              <TabsTrigger value="vehicles">Araç İpuçları</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Select value={formData.technology || "Lithium"} onValueChange={(v) => setFormData({...formData, technology: v})}>
                    <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Lithium">Lityum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Görsel URL</Label>
                  <Input value={formData.imageUrl || ""} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="rounded-none" placeholder="/images/battery-lithium.png" />
                </div>
                <div className="space-y-2">
                  <Label>Sıralama (Küçük olan önce)</Label>
                  <Input type="number" value={formData.sortOrder || 0} onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value)})} className="rounded-none font-mono" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <Textarea value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-none min-h-[100px]" />
              </div>

              <div className="space-y-2">
                <Label>Uyumlu Araçlar</Label>
                <Textarea value={formData.applications || ""} onChange={(e) => setFormData({...formData, applications: e.target.value})} className="rounded-none min-h-[80px] font-mono text-sm" />
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
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Teknik değerler resmi kaynak veya işletme tarafından doğrulanmadan doldurulmamalıdır.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                <div className="space-y-2">
                  <Label>Şarj Akımı</Label>
                  <Input value={formData.chargeCurrent || ""} onChange={(e) => setFormData({...formData, chargeCurrent: e.target.value})} className="rounded-none font-mono" placeholder="Örn: 2A—15A" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Boyutlar (UxGxD mm)</Label>
                <Input value={formData.dimensions || ""} onChange={(e) => setFormData({...formData, dimensions: e.target.value})} className="rounded-none font-mono" placeholder="Örn: 150*87*93 mm" />
              </div>
            </TabsContent>

            <TabsContent value="codes" className="space-y-4">
              <div className="space-y-2">
                <Label>Karşılık Kodları (Virgül veya yeni satır ile ayırın)</Label>
                <Textarea 
                  value={Array.isArray(formData.crossReferenceCodes) ? (formData.crossReferenceCodes as any).join('\n') : (formData.crossReferenceCodes as any) || ""} 
                  onChange={(e) => setFormData({...formData, crossReferenceCodes: e.target.value as any})} 
                  className="rounded-none min-h-[150px] font-mono text-sm" 
                  placeholder="YTX7A-BS&#10;YTX9-BS&#10;YTR9-BS" 
                />
                <p className="text-xs text-muted-foreground">
                  Her satıra bir kod veya virgül ile ayırarak birden fazla kod girin.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="source" className="space-y-4">
              <div className="space-y-2">
                <Label>Kaynak Durumu</Label>
                <Select value={formData.sourceStatus || ""} onValueChange={(v) => setFormData({...formData, sourceStatus: v})}>
                  <SelectTrigger className="rounded-none"><SelectValue placeholder="Seçin..." /></SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="official_high">Resmi Kaynak (Yüksek Güven)</SelectItem>
                    <SelectItem value="official_conflict">Resmi Kaynak Varyantı (Çakışma)</SelectItem>
                    <SelectItem value="official_partial">Kısmi Resmi Kaynak</SelectItem>
                    <SelectItem value="official_family_conflict">Aile Kaynağı / Doğrulama Gerekli</SelectItem>
                    <SelectItem value="official_partial_secondary_specs">Kısmi Resmi + İkincil</SelectItem>
                    <SelectItem value="secondary_verified_manual_review">İkincil Kaynak / Manuel Doğrulama</SelectItem>
                    <SelectItem value="missing">Kaynak Yok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Kaynak URL</Label>
                <Input value={formData.sourceUrl || ""} onChange={(e) => setFormData({...formData, sourceUrl: e.target.value})} className="rounded-none" placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <Label>Kaynak Notları</Label>
                <Textarea value={formData.sourceNotes || ""} onChange={(e) => setFormData({...formData, sourceNotes: e.target.value})} className="rounded-none min-h-[100px]" placeholder="Kaynak açıklaması, çakışma notları, vb." />
              </div>
            </TabsContent>

            <TabsContent value="vehicles" className="space-y-4">
              <div className="space-y-2">
                <Label>Araç İpuçları (JSON formatında)</Label>
                <Textarea 
                  value={Array.isArray(formData.vehicleHints) ? JSON.stringify(formData.vehicleHints, null, 2) : (formData.vehicleHints as any) || ""} 
                  onChange={(e) => setFormData({...formData, vehicleHints: e.target.value as any})} 
                  className="rounded-none min-h-[200px] font-mono text-xs" 
                  placeholder={`[
  {
    "make": "Honda",
    "model": "Africa Twin",
    "yearFrom": 2018,
    "yearTo": null,
    "engine": null,
    "note": null,
    "confidence": "medium",
    "sourceUrl": null
  }
]`} 
                />
                <p className="text-xs text-muted-foreground">
                  Araç uyumluluk ipuçları JSON formatında girin. Bu alan kaynaklı aday eşleşmeler için kullanılır.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
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
