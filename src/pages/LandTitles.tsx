import React from 'react';
import { useLandTitles } from '@/hooks/useData';
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
  Printer
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
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function LandTitles() {
  const { data: landTitles, isLoading } = useLandTitles();

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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
             <Map className="w-8 h-8 text-primary" /> Gestion des Titres Fonciers
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1.5">
             Module de consultation et gestion du registre foncier national.
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
               <p className="text-[10px] mt-1 text-primary-foreground/60 font-medium">Enregistrés dans le système</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-elegant bg-card">
            <CardHeader className="p-4 pb-2">
               <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Titres Actifs</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               <div className="text-3xl font-black text-foreground">{landTitles?.filter(t => t.status === 'active').length || 0}</div>
               <p className="text-[10px] mt-1 text-muted-foreground font-medium">Validés et sécurisés</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-elegant bg-card">
            <CardHeader className="p-4 pb-2">
               <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-bold">En Instance</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               <div className="text-3xl font-black text-foreground">{landTitles?.filter(t => t.status === 'pending').length || 0}</div>
               <p className="text-[10px] mt-1 text-muted-foreground font-medium">En cours de traitement</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-elegant bg-card">
            <CardHeader className="p-4 pb-2">
               <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Litiges</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               <div className="text-3xl font-black text-red-500">{landTitles?.filter(t => t.status === 'dispute').length || 0}</div>
               <p className="text-[10px] mt-1 text-muted-foreground font-medium">Dossiers à traiter d'urgence</p>
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
              />
           </div>
           <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="outline" className="gap-2 h-11 font-semibold group border-primary/10">
                 <Filter className="w-4 h-4 group-hover:text-primary transition-colors" /> Filtrer
              </Button>
              <Button variant="outline" className="gap-2 h-11 font-semibold group border-primary/10">
                 <Download className="w-4 h-4 group-hover:text-primary transition-colors" /> Exporter
              </Button>
           </div>
        </div>

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-bold py-4">Numéro de Titre</TableHead>
              <TableHead className="font-bold py-4">Propriétaire</TableHead>
              <TableHead className="font-bold py-4">Localisation</TableHead>
              <TableHead className="font-bold py-4">Superficie</TableHead>
              <TableHead className="font-bold py-4 text-center">Statut</TableHead>
              <TableHead className="font-bold py-4 text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6} className="h-16 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary/30" />
                  </TableCell>
                </TableRow>
              ))
            ) : landTitles?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                   <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                        <FileText className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">Aucun titre foncier trouvé</p>
                      <Button variant="link" className="text-primary font-bold">Enregistrer le premier titre</Button>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              landTitles?.map((title) => (
                <TableRow key={title.id} className="hover:bg-primary/5 transition-colors cursor-pointer">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-primary" />
                       </div>
                       <span className="font-mono text-sm font-bold text-primary">{title.titleNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{title.ownerName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground font-medium">{title.location}</TableCell>
                  <TableCell>
                     <div className="flex items-center gap-1.5 font-bold">
                        <span>{title.surfaceArea || 0}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">m&sup2;</span>
                     </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(title.status)}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                       <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary rounded-full transition-colors">
                          <Eye className="w-4 h-4" />
                       </Button>
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreHorizontal className="w-4 h-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>Actions sur le titre</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 font-medium">
                               <FileText className="w-4 h-4" /> Certificat d'authenticité
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 font-medium">
                               <Printer className="w-4 h-4" /> Imprimer le titre
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 font-medium">
                               <Layers className="w-4 h-4" /> Historique foncier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 font-medium text-destructive focus:text-destructive">
                               <Trash2 className="w-4 h-4" /> Supprimer le titre
                            </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <div className="p-4 bg-muted/10 border-t flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-widest">
           <span>Total: {landTitles?.length || 0} Titres répertoriés</span>
           <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2 font-black uppercase">Précédent</Button>
              <div className="flex gap-1">
                 <span className="w-7 h-7 bg-primary text-primary-foreground flex items-center justify-center rounded-md">1</span>
                 <span className="w-7 h-7 hover:bg-muted flex items-center justify-center rounded-md cursor-pointer transition-colors">2</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2 font-black uppercase">Suivant</Button>
           </div>
        </div>
      </div>
    </div>
  );
}
