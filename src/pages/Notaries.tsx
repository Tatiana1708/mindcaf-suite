import React, { useState } from 'react';
import { 
  useNotaries, 
  useCreateNotary, 
  useUpdateNotary, 
  useDeleteNotary,
  CreateNotaryInput
} from '@/hooks/useData';
import { 
  Plus, 
  Search, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Edit2, 
  Trash2, 
  MoreVertical,
  User,
  ShieldCheck,
  Building,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

export default function Notaries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNotary, setEditingNotary] = useState<any>(null);
  
  const { data: notaries, isLoading } = useNotaries();
  const createNotary = useCreateNotary();
  const updateNotary = useUpdateNotary();
  const deleteNotary = useDeleteNotary();

  const filteredNotaries = notaries?.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.cabinetName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveNotary = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CreateNotaryInput = {
      name: formData.get('name') as string,
      cabinetName: formData.get('cabinetName') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      licenseNumber: formData.get('licenseNumber') as string,
    };

    try {
      if (editingNotary) {
        await updateNotary.mutateAsync({ id: editingNotary.id, ...data });
        toast.success('Notaire mis à jour');
      } else {
        await createNotary.mutateAsync(data);
        toast.success('Notaire ajouté avec succès');
      }
      setIsCreateOpen(false);
      setEditingNotary(null);
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDeleteNotary = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce notaire ?')) return;
    try {
      await deleteNotary.mutateAsync(id);
      toast.success('Notaire supprimé');
    } catch (error) {
      toast.error('Erreur de suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Annuaire des Notaires</h1>
          <p className="text-muted-foreground mt-1">Gérez la liste des notaires instrumentaires et leurs cabinets.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) setEditingNotary(null); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-elegant gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un Notaire
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingNotary ? 'Modifier le Notaire' : 'Ajouter un Notaire'}</DialogTitle>
              <DialogDescription>Remplissez les informations professionnelles du notaire.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveNotary} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom du Notaire</Label>
                  <Input id="name" name="name" defaultValue={editingNotary?.name} placeholder="Ex: Me Jean Dupont" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="licenseNumber">N° d'Agrément</Label>
                  <Input id="licenseNumber" name="licenseNumber" defaultValue={editingNotary?.licenseNumber} placeholder="Ex: AG-2023-001" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cabinetName">Nom de l'Étude / Cabinet</Label>
                <Input id="cabinetName" name="cabinetName" defaultValue={editingNotary?.cabinetName} placeholder="Ex: Étude Me Dupont & Associés" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" name="phone" defaultValue={editingNotary?.phone} placeholder="Ex: +237 6xx xxx xxx" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={editingNotary?.email} placeholder="Ex: jean.dupont@notaire.cm" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Adresse de l'Étude</Label>
                <Input id="address" name="address" defaultValue={editingNotary?.address} placeholder="Ex: Rue 1234, Bastos, Yaoundé" />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Annuler</Button>
                <Button type="submit" className="bg-primary">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par nom ou cabinet..." 
            className="pl-9 h-10 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl shadow-sm" />)
        ) : filteredNotaries?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">Aucun notaire trouvé.</p>
          </div>
        ) : (
          filteredNotaries?.map((notary) => (
            <Card key={notary.id} className="overflow-hidden group hover:shadow-elegant transition-all duration-300 border-none bg-card shadow-sm">
              <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10 relative">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-elegant">
                    {notary.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-bold truncate group-hover:text-primary transition-colors">{notary.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 font-medium text-primary/80">
                      <ShieldCheck className="w-3 h-3" />
                      {notary.licenseNumber || 'N° Agrément inconnu'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setEditingNotary(notary); setIsCreateOpen(true); }}>
                        <Edit2 className="w-4 h-4 mr-2" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteNotary(notary.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-lg bg-muted flex shrink-0">
                    <Building className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Étude / Cabinet</p>
                    <p className="text-sm font-bold text-foreground">{notary.cabinetName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <div className="p-1.5 rounded-lg bg-muted flex shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>{notary.phone || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <div className="p-1.5 rounded-lg bg-muted flex shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="truncate">{notary.email || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <div className="p-1.5 rounded-lg bg-muted flex shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="truncate">{notary.address || 'Non renseigné'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 bg-muted/20 border-t border-border/50 flex justify-between items-center">
                <div className="flex -space-x-2">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted overflow-hidden">
                      <User className="w-full h-full p-1 text-muted-foreground" />
                    </div>
                  ))}
                  <div className="w-6 h-6 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">
                    +5
                  </div>
                </div>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs font-bold text-primary gap-1 group/btn">
                  Voir dossiers 
                  <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
