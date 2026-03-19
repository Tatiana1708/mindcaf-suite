import React, { useState } from 'react';
import { useLandTitles, useLandTransactions, useLandCharges, LandTitle } from '@/hooks/useData';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Map, 
  MapPin, 
  User, 
  Layers, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Scan,
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  Eye,
  Trash2,
  Printer,
  History,
  Lock,
  Zap,
  ArrowRightLeft,
  X,
  QrCode
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { QRCodeSVG } from 'qrcode.react';

export default function LandTitles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTitle, setSelectedTitle] = useState<LandTitle | null>(null);
  const { data: landTitles, isLoading } = useLandTitles();
  const { data: transactions } = useLandTransactions(selectedTitle ? { titleId: selectedTitle.id } : undefined);
  const { data: charges } = useLandCharges(selectedTitle?.id);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 gap-1"><ShieldCheck className="w-3 h-3" /> Actif</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">En cours</Badge>;
      case 'dispute':
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" /> Litige</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleGenerateCertificate = () => {
    toast.success("Certificat de propriété en cours de génération...");
  };

  const handleGenerateRBI = () => {
    toast.success("Relevé de Biens Immobiliers (RBI) en cours de génération...");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
             <Map className="w-8 h-8 text-primary" /> Registre Foncier
          </h1>
          <p className="text-muted-foreground text-sm">
             Consultation et gestion centralisée des titres fonciers nationaux.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 shadow-sm font-semibold h-11 border-primary/20 hover:bg-primary/5">
             <Scan className="w-4 h-4 text-primary" /> Numériser
          </Button>
          <Button className="gap-2 shadow-elegant font-bold h-11 px-6">
             <Plus className="w-4 h-4" /> Nouveau Titre
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
         <Card className="border-none shadow-elegant bg-primary text-primary-foreground">
            <CardHeader className="p-4 pb-2">
               <CardTitle className="text-xs uppercase tracking-widest text-primary-foreground/70 font-bold">Total Titres</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               <div className="text-3xl font-black">{landTitles?.length || 0}</div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-elegant bg-card">
            <CardHeader className="p-4 pb-2">
               <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Titres Actifs</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               <div className="text-3xl font-black text-foreground">{landTitles?.filter(t => t.status === 'active').length || 0}</div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-elegant bg-card">
            <CardHeader className="p-4 pb-2">
               <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Litiges</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               <div className="text-3xl font-black text-red-500">{landTitles?.filter(t => t.status === 'dispute').length || 0}</div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-elegant bg-card">
            <CardHeader className="p-4 pb-2">
               <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Nouvelles Demandes</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               <div className="text-3xl font-black text-foreground">12</div>
            </CardContent>
         </Card>
      </div>

      <div className="bg-card rounded-2xl shadow-elegant border border-primary/5 overflow-hidden">
        <div className="p-6 border-b bg-muted/20 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                 placeholder="Rechercher par n&deg; de titre ou propriétaire..." 
                 className="pl-10 h-11 bg-background focus-visible:ring-primary/20 border-primary/10 shadow-sm"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="outline" className="gap-2 h-11 font-semibold border-primary/10">
                 <Filter className="w-4 h-4 text-muted-foreground" /> Filtrer
              </Button>
              <Button variant="outline" className="gap-2 h-11 font-semibold border-primary/10">
                 <Download className="w-4 h-4 text-muted-foreground" /> Exporter
              </Button>
           </div>
        </div>

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-bold">Numéro de Titre</TableHead>
              <TableHead className="font-bold">Propriétaire</TableHead>
              <TableHead className="font-bold">Localisation</TableHead>
              <TableHead className="font-bold">Superficie</TableHead>
              <TableHead className="font-bold text-center">Authentification</TableHead>
              <TableHead className="font-bold text-center">Statut</TableHead>
              <TableHead className="font-bold text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} className="h-16 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary/30" />
                  </TableCell>
                </TableRow>
              ))
            ) : landTitles?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center">
                   <p className="text-sm font-semibold text-muted-foreground">Aucun titre foncier trouvé</p>
                </TableCell>
              </TableRow>
            ) : (
              landTitles?.filter(t => t.titleNumber.includes(searchTerm) || t.ownerName.toLowerCase().includes(searchTerm.toLowerCase())).map((title) => (
                <TableRow key={title.id} className="hover:bg-primary/5 transition-colors group cursor-pointer">
                  <TableCell className="py-4 font-mono text-sm font-bold text-primary">{title.titleNumber}</TableCell>
                  <TableCell className="font-semibold">{title.ownerName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{title.location}</TableCell>
                  <TableCell className="font-bold">{title.surfaceArea} m&sup2;</TableCell>
                  <TableCell className="text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-2 hover:text-primary">
                          <Scan className="w-4 h-4 text-primary" />
                          <span>QR</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[300px] flex flex-col items-center gap-4">
                        <DialogHeader>
                          <DialogTitle className="text-center">Authentification TF</DialogTitle>
                          <DialogDescription className="text-center">TF N° {title.titleNumber}</DialogDescription>
                        </DialogHeader>
                        <div className="p-4 bg-white rounded-xl shadow-inner border border-primary/10">
                          <QRCodeSVG 
                            value={`${window.location.origin}/titles/${title.id}`} 
                            size={200} 
                            level="H"
                          />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Scanner pour authentifier</p>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(title.status)}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:text-primary rounded-full"
                          onClick={() => setSelectedTitle(title)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
                        <SheetHeader className="pb-6 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-elegant">
                              <Map className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <SheetTitle className="text-2xl font-black text-primary">TF {title.titleNumber}</SheetTitle>
                              <SheetDescription className="font-bold">Propriété de {title.ownerName}</SheetDescription>
                            </div>
                          </div>
                        </SheetHeader>
                        
                        <div className="py-8 space-y-8 animate-slide-up">
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="border-none bg-muted/30 p-4">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Localisation</p>
                              <p className="text-sm font-black flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-primary" /> {title.location}
                              </p>
                            </Card>
                            <Card className="border-none bg-muted/30 p-4">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Superficie</p>
                              <p className="text-sm font-black">{title.surfaceArea} m&sup2;</p>
                            </Card>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                              <Zap className="w-4 h-4 text-primary" /> Actions Rapides
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                              <Button onClick={handleGenerateCertificate} variant="outline" className="h-12 gap-2 font-bold border-primary/20">
                                <ShieldCheck className="w-4 h-4 text-green-500" /> Certificat
                              </Button>
                              <Button onClick={handleGenerateRBI} variant="outline" className="h-12 gap-2 font-bold border-primary/20">
                                <FileText className="w-4 h-4 text-blue-500" /> Relevé RBI
                              </Button>
                            </div>
                          </div>

                          <div className="p-6 bg-muted/20 rounded-2xl flex items-center gap-6 border">
                             <div className="w-24 h-24 bg-white p-2 rounded-xl border-2 border-primary/20 flex items-center justify-center shadow-sm">
                                <QRCodeSVG 
                                  value={`${window.location.origin}/titles/${title.id}`} 
                                  size={80} 
                                  level="H"
                                />
                             </div>
                             <div>
                                <h4 className="text-sm font-black uppercase tracking-tight">Authentification QR</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                   Scannez pour vérifier l'authenticité du titre sur le portail public Soficam.
                                </p>
                                <Button variant="link" className="h-auto p-0 mt-2 text-[10px] font-bold text-primary uppercase">Copier le lien de vérification</Button>
                             </div>
                          </div>

                          <Tabs defaultValue="transactions" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                              <TabsTrigger value="transactions" className="font-bold text-xs uppercase tracking-tighter gap-2">
                                <History className="w-3.5 h-3.5" /> Historique
                              </TabsTrigger>
                              <TabsTrigger value="charges" className="font-bold text-xs uppercase tracking-tighter gap-2">
                                <Lock className="w-3.5 h-3.5" /> Charges
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="transactions" className="mt-4">
                              {transactions && transactions.length > 0 ? (
                                <div className="space-y-3">
                                  {transactions.map(tx => (
                                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border bg-card/50">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                          <ArrowRightLeft className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold uppercase">{tx.type}</p>
                                          <p className="text-[10px] text-muted-foreground">{format(new Date(tx.transactionDate), 'dd/MM/yyyy')}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-black">{tx.amount ? `${new Intl.NumberFormat().format(tx.amount)} F` : '---'}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm font-medium italic">
                                  Aucun historique de transaction
                                </div>
                              )}
                            </TabsContent>
                            <TabsContent value="charges" className="mt-4">
                               {charges && charges.length > 0 ? (
                                <div className="space-y-3">
                                  {charges.map(charge => ( 
                                    <div key={charge.id} className="flex items-center justify-between p-3 rounded-xl border border-red-100 bg-red-50/20">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                          <Lock className="w-4 h-4 text-red-600" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold uppercase text-red-700">{charge.type}</p>
                                          <p className="text-[10px] text-red-600/70">{charge.status}</p>
                                        </div>
                                      </div>
                                      <Badge variant="outline" className="text-[10px] uppercase tracking-tighter">{charge.expiryDate || 'Permanent'}</Badge>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm font-medium italic">
                                  Titre libre de toutes charges
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}