import React from 'react';
import { useExpropriations } from '@/hooks/useData';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Gavel, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Building2,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Eye,
  Trash2,
  Printer,
  Loader2,
  Users,
  BadgeDollarSign,
  Briefcase
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function Expropriations() {
  const { data: expropriations, isLoading } = useExpropriations();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 gap-1"><CheckCircle2 className="w-3 h-3" /> Publié</Badge>;
      case 'draft':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">Brouillon</Badge>;
      case 'closed':
        return <Badge variant="outline" className="gap-1 opacity-70"><ShieldCheck className="w-3 h-3" /> Clôturé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
             <Gavel className="w-8 h-8 text-primary" /> Gestion des Expropriations
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1.5 font-medium uppercase tracking-widest text-[10px]">
             Module d'utilité publique et indemnisation foncière.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 shadow-sm font-semibold h-11 border-primary/20 hover:bg-primary/5">
             <Printer className="w-4 h-4 text-primary" /> Rapports DUP
          </Button>
          <Button className="gap-2 shadow-elegant font-bold h-11 px-6">
             <Plus className="w-4 h-4" /> Nouveau Projet
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="border-none shadow-elegant bg-primary text-primary-foreground relative overflow-hidden group">
            <CardHeader className="p-6">
               <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-white" />
               </div>
               <CardTitle className="text-xs uppercase tracking-widest text-primary-foreground/70 font-bold mb-1">Projets Actifs</CardTitle>
               <div className="text-4xl font-black">{expropriations?.length || 0}</div>
            </CardHeader>
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform">
               <Briefcase className="w-24 h-24" />
            </div>
         </Card>
         <Card className="border-none shadow-elegant bg-card relative overflow-hidden group">
            <CardHeader className="p-6">
               <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
               </div>
               <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Impactés Totaux</CardTitle>
               <div className="text-4xl font-black text-foreground">
                  {expropriations?.reduce((acc, curr) => acc + (curr.totalImpacted || 0), 0) || 0}
               </div>
            </CardHeader>
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform">
               <Users className="w-24 h-24" />
            </div>
         </Card>
         <Card className="border-none shadow-elegant bg-card relative overflow-hidden group">
            <CardHeader className="p-6">
               <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                  <BadgeDollarSign className="w-6 h-6 text-green-600" />
               </div>
               <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Budget Engagé</CardTitle>
               <div className="text-4xl font-black text-foreground">
                  {new Intl.NumberFormat('fr-FR').format(expropriations?.reduce((acc, curr) => acc + (curr.totalIndemnity || 0), 0) || 0)}
               </div>
               <p className="text-[10px] mt-1 text-muted-foreground font-bold uppercase tracking-tighter">F CFA</p>
            </CardHeader>
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform">
               <BadgeDollarSign className="w-24 h-24" />
            </div>
         </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                 placeholder="Rechercher un projet d'expropriation..." 
                 className="pl-10 h-11 bg-card focus-visible:ring-primary/20 border-primary/10 shadow-sm"
              />
           </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-64 border-none shadow-elegant" />
            ))
          ) : expropriations?.length === 0 ? (
            <div className="col-span-full h-64 border-2 border-dashed border-primary/10 rounded-2xl flex flex-col items-center justify-center bg-card/50">
               <Gavel className="w-12 h-12 text-primary/20 mb-4" />
               <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">Aucun projet d'expropriation répertorié</p>
               <Button variant="link" className="text-primary font-black mt-2">Démarrer une nouvelle DUP</Button>
            </div>
          ) : (
            expropriations?.map((project) => (
              <Card key={project.id} className="border-none shadow-elegant bg-card hover:scale-[1.02] transition-all cursor-pointer group">
                <CardHeader className="pb-4">
                   <div className="flex justify-between items-start mb-4">
                      {getStatusBadge(project.status)}
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                         <MoreVertical className="w-4 h-4" />
                      </Button>
                   </div>
                   <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">{project.projectName}</CardTitle>
                   <CardDescription className="flex items-center gap-1.5 mt-2 font-medium">
                      <Clock className="w-3 h-3" /> Lancé le {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                   </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-6">
                   <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-2">
                         <Users className="w-4 h-4 text-muted-foreground" />
                         <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Impactés</span>
                      </div>
                      <span className="text-lg font-black">{project.totalImpacted}</span>
                   </div>
                   <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5">
                      <div className="flex items-center gap-2">
                         <BadgeDollarSign className="w-4 h-4 text-primary" />
                         <span className="text-xs font-bold uppercase tracking-widest text-primary">Indemnité</span>
                      </div>
                      <div className="text-right">
                         <span className="text-lg font-black text-primary">
                            {new Intl.NumberFormat('fr-FR').format(project.totalIndemnity || 0)}
                         </span>
                         <span className="text-[10px] ml-1 font-bold text-primary/70 uppercase">F</span>
                      </div>
                   </div>
                </CardContent>
                <CardFooter className="pt-0 pb-6 px-6">
                   <Button variant="outline" className="w-full gap-2 font-black uppercase text-[10px] tracking-widest group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      Consulter le dossier <ChevronRight className="w-4 h-4" />
                   </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
