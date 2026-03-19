import React, { useState } from 'react';
import { 
  useRegistrationDossiers, 
  useCreateRegistrationDossier, 
  useUpdateDossierStatus,
  useDossierWorkflow,
  useAddDossierStep,
  useAssignDossier,
  RegistrationDossier,
  RegistrationFilters,
  DossierWorkflow
} from '@/hooks/useData';
import { 
  Plus, 
  Search, 
  Filter, 
  FilePlus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserPlus, 
  MoreHorizontal,
  ChevronRight,
  MapPin,
  User,
  History,
  AlertTriangle,
  ExternalLink,
  Loader2,
  CalendarDays
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
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WorkflowTimeline } from '@/components/WorkflowTimeline';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QRCodeSVG } from 'qrcode.react';

const STATUS_LABELS: Record<string, { label: string; color: string; icon: any }> = {
  submitted: { label: 'Soumis', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FilePlus },
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  validated: { label: 'Validé', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  rejected: { label: 'Rejeté', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle },
  suspended: { label: 'Suspendu', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: AlertTriangle },
  completed: { label: 'Terminé', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: CheckCircle2 },
};

const TYPE_LABELS: Record<string, string> = {
  registration: 'Immatriculation Directe',
  concession: 'Concession',
  morcellement: 'Morcellement',
  lotissement: 'Lotissement',
};

export default function RegistrationDossiers() {
  const [filters, setFilters] = useState<RegistrationFilters>({});
  const [selectedDossier, setSelectedDossier] = useState<RegistrationDossier | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddStepOpen, setIsAddStepOpen] = useState(false);
  
  const { data: dossiers, isLoading } = useRegistrationDossiers(filters);
  const createDossier = useCreateRegistrationDossier();
  const updateStatus = useUpdateDossierStatus();
  const assignDossier = useAssignDossier();
  const addStep = useAddDossierStep();

  const handleCreateDossier = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      type: formData.get('type') as any,
      applicantName: formData.get('applicantName') as string,
      applicantIdNumber: formData.get('applicantIdNumber') as string,
      parcelLocation: formData.get('parcelLocation') as string,
      parcelArea: parseFloat(formData.get('parcelArea') as string),
      status: 'submitted' as const,
    };

    try {
      await createDossier.mutateAsync(data);
      toast.success('Dossier créé avec succès');
      setIsCreateOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la création du dossier');
    }
  };

  const handleUpdateStatus = async (status: RegistrationDossier['status']) => {
    if (!selectedDossier) return;
    try {
      await updateStatus.mutateAsync({ id: selectedDossier.id, status });
      toast.success('Statut mis à jour');
      setSelectedDossier(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      toast.error('Erreur de mise à jour');
    }
  };

  const handleAddStep = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDossier) return;
    const formData = new FormData(e.currentTarget);
    const data = {
      dossierId: selectedDossier.id,
      stepName: formData.get('stepName') as string,
      status: formData.get('status') as any,
      documentUrl: formData.get('documentUrl') as string,
      notes: formData.get('notes') as string,
    };

    try {
      await addStep.mutateAsync(data);
      toast.success('Étape ajoutée');
      setIsAddStepOpen(false);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'étape');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dossiers d'Immatriculation</h1>
          <p className="text-muted-foreground mt-1">Gérez les immatriculations directes, concessions et morcellements.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-elegant gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Dossier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Dossier</DialogTitle>
              <DialogDescription>Remplissez les informations de base pour démarrer le processus.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDossier} className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type de Procédure</Label>
                <Select name="type" required defaultValue="registration">
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="registration">Immatriculation Directe</SelectItem>
                    <SelectItem value="concession">Concession</SelectItem>
                    <SelectItem value="morcellement">Morcellement</SelectItem>
                    <SelectItem value="lotissement">Lotissement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="applicantName">Nom du Requérant</Label>
                <Input id="applicantName" name="applicantName" placeholder="Ex: Jean Dupont" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="applicantIdNumber">N° d'Identité (CNI/Passeport)</Label>
                <Input id="applicantIdNumber" name="applicantIdNumber" placeholder="Ex: 123456789" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="parcelLocation">Localisation du Terrain</Label>
                  <Input id="parcelLocation" name="parcelLocation" placeholder="Ex: Yaoundé, Bastos" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parcelArea">Superficie (m²)</Label>
                  <Input id="parcelArea" name="parcelArea" type="number" step="0.01" placeholder="Ex: 500" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Annuler</Button>
                <Button type="submit" className="bg-primary">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={cn("space-y-4", selectedDossier ? "lg:col-span-5" : "lg:col-span-12")}>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Rechercher par nom, lieu..." className="pl-9" />
            </div>
            <Select onValueChange={(val) => setFilters(prev => ({ ...prev, type: val === 'all' ? undefined : val as any }))}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="registration">Immatriculation</SelectItem>
                <SelectItem value="concession">Concession</SelectItem>
                <SelectItem value="morcellement">Morcellement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
            ) : dossiers?.length === 0 ? (
              <Card className="border-dashed flex flex-col items-center justify-center py-12 text-center">
                <CardContent>
                  <FilePlus className="w-12 h-12 text-muted-foreground mb-4 opacity-20 mx-auto" />
                  <p className="text-muted-foreground font-medium">Aucun dossier trouvé.</p>
                  <Button variant="link" onClick={() => setFilters({})}>Effacer les filtres</Button>
                </CardContent>
              </Card>
            ) : (
              dossiers?.map((dossier) => (
                <Card 
                  key={dossier.id} 
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50 group overflow-hidden",
                    selectedDossier?.id === dossier.id ? "ring-2 ring-primary border-transparent bg-primary/5 shadow-md" : "hover:shadow-elegant"
                  )}
                  onClick={() => setSelectedDossier(dossier)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground truncate max-w-[200px]">{dossier.applicantName}</h3>
                          <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {TYPE_LABELS[dossier.type]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {dossier.parcelLocation}
                          </span>
                          <span className="flex items-center gap-1">
                            <History className="w-3 h-3" /> {format(new Date(dossier.createdAt), 'dd MMM yyyy', { locale: fr })}
                          </span>
                        </div>
                      </div>
                      <Badge className={cn("border", STATUS_LABELS[dossier.status]?.color)}>
                        {STATUS_LABELS[dossier.status]?.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {dossier.assignedTo || 'Non assigné'}
                        </span>
                      </div>
                      {dossier.status !== 'completed' && (
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>Depuis {differenceInDays(new Date(), new Date(dossier.processingTimeStart || dossier.createdAt))} jours</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {selectedDossier && (
          <div className="lg:col-span-7 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border-primary/20 shadow-elegant overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      Détails du Dossier
                      <Badge variant="outline" className="ml-2 bg-background">{selectedDossier.id.split('-')[0]}</Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <CalendarDays className="w-3 h-3" />
                      Créé le {format(new Date(selectedDossier.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedDossier(null)} className="rounded-full hover:bg-background/80">
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-border/50 space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">Informations Requérant</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Nom Complet:</span>
                        <span className="font-medium">{selectedDossier.applicantName}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Pièce d'identité:</span>
                        <span className="font-medium">{selectedDossier.applicantIdNumber || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Localisation:</span>
                        <span className="font-medium">{selectedDossier.parcelLocation}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Superficie:</span>
                        <span className="font-medium font-mono text-primary">{selectedDossier.parcelArea} m²</span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">Attribution & Suivi</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Assigné à:</span>
                        <div className="flex items-center gap-2">
                          <Select 
                            defaultValue={selectedDossier.assignedTo || "unassigned"} 
                            onValueChange={async (val) => {
                              try {
                                await assignDossier.mutateAsync({ id: selectedDossier.id, assignedTo: val });
                                toast.success('Dossier assigné');
                              } catch (e) {
                                toast.error('Erreur d\'assignation');
                              }
                            }}
                          >
                            <SelectTrigger className="h-8 min-w-[120px]">
                              <SelectValue placeholder="Choisir" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Non assigné</SelectItem>
                              <SelectItem value="Service Foncier">Service Foncier</SelectItem>
                              <SelectItem value="Service du Cadastre">Service du Cadastre</SelectItem>
                              <SelectItem value="Conservation">Conservation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Temps de traitement:</span>
                        <span className="font-medium text-amber-600">
                          {differenceInDays(new Date(), new Date(selectedDossier.processingTimeStart || selectedDossier.createdAt))} jours
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border/50 flex flex-col items-center gap-2">
                      <div className="p-2 bg-white rounded-lg border border-border/50 shadow-sm">
                        <QRCodeSVG 
                          value={`${window.location.origin}/registration/${selectedDossier.id}`} 
                          size={100}
                          level="H"
                          includeMargin={false}
                        />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Authentification par QR Code</p>
                    </div>
                  </div>

                  <div className="p-6 bg-muted/20 space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">Actions de Dossier</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border-emerald-200"
                        onClick={() => handleUpdateStatus('validated')}
                        disabled={selectedDossier.status === 'validated'}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Valider
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border-rose-200"
                        onClick={() => handleUpdateStatus('rejected')}
                        disabled={selectedDossier.status === 'rejected'}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Rejeter
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border-amber-200"
                        onClick={() => handleUpdateStatus('suspended')}
                        disabled={selectedDossier.status === 'suspended'}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" /> Suspendre
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 border-indigo-200"
                        onClick={() => handleUpdateStatus('completed')}
                        disabled={selectedDossier.status === 'completed'}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Terminer
                      </Button>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full bg-primary shadow-elegant" onClick={() => setIsAddStepOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Ajouter une étape de workflow
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-border/50">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold flex items-center gap-2">
                      <History className="w-5 h-5 text-primary" />
                      Workflow & Chronologie
                    </h4>
                  </div>
                  
                  <WorkflowData dossierId={selectedDossier.id} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={isAddStepOpen} onOpenChange={setIsAddStepOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter une étape au Workflow</DialogTitle>
            <DialogDescription>Documentez l'avancement du dossier.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStep} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="stepName">Nom de l'étape</Label>
              <Input id="stepName" name="stepName" placeholder="Ex: Rapport d'expertise, Validation PV..." required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Résultat / Statut</Label>
              <Select name="status" required defaultValue="validated">
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="validated">Validé / Favorable</SelectItem>
                  <SelectItem value="in_progress">En cours d'examen</SelectItem>
                  <SelectItem value="rejected">Rejeté / Défavorable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="documentUrl">Lien du Document (URL)</Label>
              <Input id="documentUrl" name="documentUrl" placeholder="Ex: https://storage.cloud/doc.pdf" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Commentaires / Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Observations particulières sur cette étape..." rows={3} />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsAddStepOpen(false)}>Annuler</Button>
              <Button type="submit" className="bg-primary">Enregistrer l'étape</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WorkflowData({ dossierId }: { dossierId: string }) {
  const { data: steps, isLoading } = useDossierWorkflow(dossierId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(2).fill(0).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="w-5 h-5 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <WorkflowTimeline steps={steps || []} />;
}
