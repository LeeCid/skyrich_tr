import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useListPageContents, getListPageContentsQueryKey, useUpdatePageContent } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";

export function AdminPageContents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: pages, isLoading } = useListPageContents({ query: { queryKey: getListPageContentsQueryKey() } });
  const updateMutation = useUpdatePageContent();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<{ key: string, title: string, content: string } | null>(null);

  const predefinedPages = [
    { key: "hakkimizda", label: "Hakkımızda" },
    { key: "kullanim-kilavuzu", label: "Kullanım Kılavuzu" },
    { key: "sertifikalar", label: "Sertifikalar" },
    { key: "iletisim-intro", label: "İletişim Giriş Metni" },
    { key: "footer-description", label: "Footer Açıklaması" }
  ];

  const handleEdit = (pageKey: string, label: string) => {
    const existing = pages?.find(p => p.key === pageKey);
    setEditingPage({
      key: pageKey,
      title: existing?.title || label,
      content: existing?.content || ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingPage) return;

    updateMutation.mutate({ 
      key: editingPage.key, 
      data: { title: editingPage.title, content: editingPage.content } 
    }, {
      onSuccess: () => {
        toast({ title: "Başarılı", description: "Sayfa içeriği güncellendi." });
        queryClient.invalidateQueries({ queryKey: getListPageContentsQueryKey() });
        setIsDialogOpen(false);
      },
      onError: () => {
        toast({ title: "Hata", description: "Sayfa içeriği güncellenemedi.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card p-4 border border-border">
        <h2 className="text-xl font-bold uppercase tracking-tight">Sayfa İçerikleri</h2>
      </div>

      <div className="border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold uppercase text-xs tracking-wider">Sayfa Anahtarı</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider">Durum</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-8">Yükleniyor...</TableCell></TableRow>
            ) : (
              predefinedPages.map((pageDef) => {
                const isConfigured = pages?.some(p => p.key === pageDef.key && p.content);
                return (
                  <TableRow key={pageDef.key} className="border-border">
                    <TableCell className="font-bold">{pageDef.label}</TableCell>
                    <TableCell>
                      {isConfigured ? (
                        <span className="text-green-500 text-xs font-bold uppercase tracking-wider">Dolu</span>
                      ) : (
                        <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Boş</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(pageDef.key, pageDef.label)} className="text-primary hover:text-primary/80 uppercase tracking-widest text-xs font-bold rounded-none">
                        <Edit size={14} className="mr-2" /> Düzenle
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-card border-border rounded-none">
          <DialogHeader>
            <DialogTitle className="uppercase font-bold tracking-wider">İçerik Düzenle: {editingPage?.key}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label>Başlık (Opsiyonel)</Label>
              <Input 
                value={editingPage?.title || ""} 
                onChange={(e) => setEditingPage(prev => prev ? {...prev, title: e.target.value} : null)} 
                className="rounded-none" 
              />
            </div>
            <div className="space-y-2">
              <Label>İçerik</Label>
              <Textarea 
                value={editingPage?.content || ""} 
                onChange={(e) => setEditingPage(prev => prev ? {...prev, content: e.target.value} : null)} 
                className="rounded-none min-h-[300px]" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-none">İptal</Button>
            <Button onClick={handleSave} className="rounded-none bg-primary text-primary-foreground font-bold uppercase tracking-wider" disabled={updateMutation.isPending}>
              Kaydet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}