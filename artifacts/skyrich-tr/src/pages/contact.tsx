import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "İsim en az 2 karakter olmalıdır." }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz." }),
  subject: z.string().min(5, { message: "Konu en az 5 karakter olmalıdır." }),
  message: z.string().min(10, { message: "Mesaj en az 10 karakter olmalıdır." }),
});

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Mesajınız Gönderildi",
      description: "En kısa sürede size dönüş yapacağız.",
      variant: "default",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">İletişim</h1>
        <p className="text-muted-foreground font-mono">Sorularınız veya bayilik talepleriniz için bize ulaşın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="flex gap-6 items-start">
            <div className="bg-primary/10 p-4 rounded-none border border-primary/20">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-2">Merkez Ofis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Atatürk Mah. İkitelli Cad.<br />
                No: 123 Kat: 4<br />
                Küçükçekmece, İstanbul
              </p>
            </div>
          </div>
          
          <div className="flex gap-6 items-start">
            <div className="bg-primary/10 p-4 rounded-none border border-primary/20">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-2">Telefon</h3>
              <p className="text-muted-foreground leading-relaxed">
                +90 (212) 555 00 00<br />
                +90 (532) 555 00 00
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="bg-primary/10 p-4 rounded-none border border-primary/20">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-2">E-Posta</h3>
              <p className="text-muted-foreground leading-relaxed">
                info@skyrichbattery.com.tr<br />
                destek@skyrichbattery.com.tr
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-card border border-border p-8 md:p-12">
          <h2 className="text-2xl font-bold uppercase mb-8">Mesaj Gönderin</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-wider">İsim Soyisim</FormLabel>
                      <FormControl>
                        <Input placeholder="Adınız" {...field} className="rounded-none border-border bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-wider">E-Posta</FormLabel>
                      <FormControl>
                        <Input placeholder="ornek@email.com" {...field} className="rounded-none border-border bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold tracking-wider">Konu</FormLabel>
                    <FormControl>
                      <Input placeholder="Mesajınızın konusu" {...field} className="rounded-none border-border bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold tracking-wider">Mesajınız</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Size nasıl yardımcı olabiliriz?" 
                        className="min-h-[150px] rounded-none border-border bg-background resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full md:w-auto px-12 rounded-none bg-primary hover:bg-primary/90 uppercase tracking-widest text-primary-foreground font-bold">
                Gönder
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
