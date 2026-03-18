import React, { useState } from 'react';
import { useMailRecords, useCreateMailRecord, useDeleteMailRecord, MailRecord } from '@/hooks/useData';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Trash2, 
  Eye, 
  Edit3, 
  Mail, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  User,
  Hash,
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function MailManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: mailRecords, isLoading } = useMailRecords();
  const createMail = useCreateMailRecord();
  const deleteMail = useDeleteMailRecord();

  const [formData, setFormData] = useState({
    type: 'incoming',
    entryDate: new Date().toISOString().split('T')[0],
    mailNumber: '',
    source: '',
    subject: '',
    service: '',
    status: 'pending',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMail.mutateAsync(formData);
      setIsAddDialogOpen(false);
      toast.success('Courrier enregistré avec succès');
      setFormData({
        type: 'incoming',
        entryDate: new Date().toISOString().split('T')[0],
        mailNumber: '',
        source: '',
        subject: '',
        service: '',
        status: 'pending',
      });
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce courrier ?')) {
      try {
        await deleteMail.mutateAsync(id);
        toast.success('Courrier supprimé');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const filteredRecords = mailRecords?.filter(record => 
    record.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.mailNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">En attente</Badge>;
      case 'processed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">Traité</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Gestion du Courrier</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" /> Module de suivi des flux documentaires entrants et sortants.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 shadow-sm font-semibold">
            <Download className="w-4 h-4" /> Exporter (PDF)
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-elegant font-bold">
                <Plus className="w-4 h-4" /> Nouveau Courrier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Enregistrer un Courrier</DialogTitle>
                <DialogDescription>Saisissez les informations du courrier pour son enregistrement et son suivi.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="grid grid-cols-2 gap-6 py-4">
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label htmlFor="type">Type de Courrier</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(v) => setFormData({...formData, type: v})}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choisir le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incoming">
                        <div className="flex items-center gap-2">
                          <ArrowDownLeft className="w-4 h-4 text-blue-500" /> Courrier Entrant
                        </div>
                      </SelectItem>
                      <SelectItem value="outgoing">
                        <div className="flex items-center gap-2">
                          <ArrowUpRight className="w-4 h-4 text-primary" /> Courrier Sortant
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label htmlFor="mailNumber">Numéro de Courrier</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="mailNumber" 
                      placeholder="Ex: 2026/045/MINCAF" 
                      className="pl-10 h-11"
                      value={formData.mailNumber}
                      onChange={(e) => setFormData({...formData, mailNumber: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label htmlFor="entryDate">Date de réception/départ</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="entryDate" 
                      type="date" 
                      className="pl-10 h-11"
                      value={formData.entryDate}
                      onChange={(e) => setFormData({...formData, entryDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label htmlFor="source">Origine / Destination</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="source" 
                      placeholder="Ex: Direction des Impôts" 
                      className="pl-10 h-11"
                      value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="subject">Objet</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="subject" 
                      placeholder="Ex: Demande de transfert de titre foncier..." 
                      className="pl-10 h-11"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="service">Service Affecté</Label>
                  <Select 
                    value={formData.service} 
                    onValueChange={(v) => setFormData({...formData, service: v})}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choisir le service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domaine">Direction du Domaine</SelectItem>
                      <SelectItem value="cadastre">Service du Cadastre</SelectItem>
                      <SelectItem value="juridique">Affaires Juridiques</SelectItem>
                      <SelectItem value="archives">Archives Centrales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="col-span-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="h-11 px-6">Annuler</Button>
                  <Button type="submit" className="h-11 px-6 font-bold" disabled={createMail.isPending}>
                    {createMail.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Enregistrer le Courrier
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par numéro, objet or origine..." 
              className="pl-10 h-11 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <Button variant="outline" className="gap-2 h-11 px-4 font-semibold text-xs uppercase tracking-widest">
                <Filter className="w-4 h-4" /> Filtres
             </Button>
             <Select defaultValue="all">
                <SelectTrigger className="h-11 w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="all">Tous les types</SelectItem>
                   <SelectItem value="incoming">Entrant uniquement</SelectItem>
                   <SelectItem value="outgoing">Sortant uniquement</SelectItem>
                </SelectContent>
             </Select>
          </div>
        </div>

        <div className="border rounded-xl shadow-elegant overflow-hidden bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">Type</TableHead>
                <TableHead className="font-bold">N&deg; Courrier</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Origine/Dest.</TableHead>
                <TableHead className="font-bold">Objet</TableHead>
                <TableHead className="font-bold">Service</TableHead>
                <TableHead className="font-bold text-center">Statut</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={8} className="h-16 text-center">
                       <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary/30" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredRecords?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    Aucun courrier trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords?.map((record) => (
                  <TableRow key={record.id} className="hover:bg-accent/5 transition-colors group">
                    <TableCell>
                      {record.type === 'incoming' ? (
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                          <ArrowDownLeft className="w-4 h-4" />
                          <span className="text-[10px] uppercase tracking-tighter">Entrant</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <ArrowUpRight className="w-4 h-4" />
                          <span className="text-[10px] uppercase tracking-tighter">Sortant</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold">{record.mailNumber}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(record.entryDate), 'dd MMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate font-medium">{record.source}</TableCell>
                    <TableCell className="max-w-[250px] truncate font-medium">{record.subject}</TableCell>
                    <TableCell>
                       <span className="text-[10px] font-bold uppercase text-muted-foreground bg-muted px-2 py-1 rounded">
                        {record.service || 'N/A'}
                       </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(record.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                            <Eye className="w-4 h-4 text-blue-500" /> Voir Détails
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit3 className="w-4 h-4 text-primary" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="gap-2 text-destructive focus:text-destructive"
                            onClick={() => handleDelete(record.id)}
                          >
                            <Trash2 className="w-4 h-4" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-elegant bg-blue-50/50 flex items-center p-4 gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
             <ArrowDownLeft className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600/70">Courriers Entrants</p>
            <p className="text-2xl font-black text-blue-800">{mailRecords?.filter(r => r.type === 'incoming').length || 0}</p>
          </div>
        </Card>
        
        <Card className="border-none shadow-elegant bg-teal-50/50 flex items-center p-4 gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
             <ArrowUpRight className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600/70">Courriers Sortants</p>
            <p className="text-2xl font-black text-teal-800">{mailRecords?.filter(r => r.type === 'outgoing').length || 0}</p>
          </div>
        </Card>

        <Card className="border-none shadow-elegant bg-orange-50/50 flex items-center p-4 gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
             <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600/70">En attente</p>
            <p className="text-2xl font-black text-orange-800">{mailRecords?.filter(r => r.status === 'pending').length || 0}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
