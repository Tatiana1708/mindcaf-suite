import React, { useState } from 'react';
import { 
  useLandTransactions, 
  useCreateLandTransaction, 
  useLandCharges, 
  useCreateLandCharge,
  useUpdateLandCharge,
  useLandTitles,
  useNotaries,
  LandTransaction,
  LandCharge,
  CreateLandTransactionInput,
  CreateLandChargeInput
} from '@/hooks/useData';
import { 
  Plus, 
  Search, 
  Filter, 
  History, 
  ShieldAlert, 
  ShieldCheck, 
  Gavel, 
  Landmark, 
  FileCheck,
  Calendar,
  DollarSign,
  User,
  ExternalLink,
  ChevronRight,
  Loader2,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const TRANSACTION_TYPES: Record<string, string> = {
  sale: 'Vente',
  mutation: 'Mutation',
  withdrawal_indivision: 'Sortie d\'Indivision',
  subdivision: 'Morcellement',
  parceling: 'Lotissement',
};

const CHARGE_TYPES: Record<string, string> = {
  mortgage: 'Hypothèque',
  prenotation: 'Prénotation',
  radiation: 'Radiation',
  judicial_prenotation: 'Prénotation Judiciaire',
};

export default function LandTransactions() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [isRecordTransactionOpen, setIsRecordTransactionOpen] = useState(false);
  const [isRecordChargeOpen, setIsRecordChargeOpen] = useState(false);
  
  const { data: transactions, isLoading: isLoadingTrans } = useLandTransactions();
  const { data: charges, isLoading: isLoadingCharges } = useLandCharges();
  const { data: titles } = useLandTitles();
  const { data: notaries } = useNotaries();
  
  const createTransaction = useCreateLandTransaction();
  const createCharge = useCreateLandCharge();
  const updateCharge = useUpdateLandCharge();

  const handleRecordTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CreateLandTransactionInput = {
      titleId: formData.get('titleId') as string,
      type: formData.get('type') as any,
      notaryId: formData.get('notaryId') as string,
      amount: parseFloat(formData.get('amount') as string || '0'),
      status: 'completed',
      transactionDate: formData.get('transactionDate') as string || new Date().toISOString(),
    };

    try {
      await createTransaction.mutateAsync(data);
      toast.success('Transaction enregistrée avec succès');
      setIsRecordTransactionOpen(false);
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleRecordCharge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CreateLandChargeInput = {
      titleId: formData.get('titleId') as string,
      type: formData.get('type') as any,
      status: 'active',
      details: formData.get('details') as string,
      expiryDate: formData.get('expiryDate') as string || undefined,
    };

    try {
      await createCharge.mutateAsync(data);
      toast.success('Charge foncière enregistrée');
      setIsRecordChargeOpen(false);
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleRadiateCharge = async (chargeId: string) => {
    try {
      await updateCharge.mutateAsync({ id: chargeId, status: 'radiated' });
      toast.success('Charge radiée avec succès');
    } catch (error) {
      toast.error('Erreur de radiation');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Transactions & Charges</h1>
          <p className="text-muted-foreground mt-1">Gérez les mutations, ventes, hypothèques et prénotations.</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isRecordTransactionOpen} onOpenChange={setIsRecordTransactionOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 gap-2">
                <DollarSign className="w-4 h-4" />
                Enregistrer Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Enregistrer une Transaction</DialogTitle>
                <DialogDescription>Consignez une vente ou mutation sur un titre foncier existant.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRecordTransaction} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="titleId">Titre Foncier Concerné</Label>
                  <Select name="titleId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un titre" />
                    </SelectTrigger>
                    <SelectContent>
                      {titles?.map(title => (
                        <SelectItem key={title.id} value={title.id}>
                          TF N° {title.titleNumber} - {title.ownerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type de Transaction</Label>
                    <Select name="type" required defaultValue="sale">
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Vente</SelectItem>
                        <SelectItem value="mutation">Mutation</SelectItem>
                        <SelectItem value="withdrawal_indivision">Sortie d'Indivision</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Montant (FCFA)</Label>
                    <Input id="amount" name="amount" type="number" placeholder="Ex: 5000000" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notaryId">Notaire Instrumentaire</Label>
                  <Select name="notaryId">
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un notaire" />
                    </SelectTrigger>
                    <SelectContent>
                      {notaries?.map(notary => (
                        <SelectItem key={notary.id} value={notary.id}>{notary.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transactionDate">Date de la Transaction</Label>
                  <Input id="transactionDate" name="transactionDate" type="date" />
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsRecordTransactionOpen(false)}>Annuler</Button>
                  <Button type="submit" className="bg-primary">Enregistrer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isRecordChargeOpen} onOpenChange={setIsRecordChargeOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 shadow-elegant gap-2">
                <ShieldAlert className="w-4 h-4" />
                Inscrire une Charge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Inscrire une Charge Foncière</DialogTitle>
                <DialogDescription>Enregistrez une hypothèque, prénotation ou saisie.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRecordCharge} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="titleId">Titre Foncier Concerné</Label>
                  <Select name="titleId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un titre" />
                    </SelectTrigger>
                    <SelectContent>
                      {titles?.map(title => (
                        <SelectItem key={title.id} value={title.id}>
                          TF N° {title.titleNumber} - {title.ownerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Nature de la Charge</Label>
                    <Select name="type" required defaultValue="mortgage">
                      <SelectTrigger>
                        <SelectValue placeholder="Nature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mortgage">Hypothèque</SelectItem>
                        <SelectItem value="prenotation">Prénotation</SelectItem>
                        <SelectItem value="judicial_prenotation">Prénotation Judiciaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiryDate">Date d'Expiration</Label>
                    <Input id="expiryDate" name="expiryDate" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="details">Détails (Bénéficiaire, Montant, etc.)</Label>
                  <Input id="details" name="details" placeholder="Ex: Banque BICEC - 10,000,000 FCFA" required />
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsRecordChargeOpen(false)}>Annuler</Button>
                  <Button type="submit" className="bg-primary">Enregistrer la Charge</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="transactions" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1 rounded-xl mb-6">
          <TabsTrigger value="transactions" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <History className="w-4 h-4" />
            Transactions Historiques
          </TabsTrigger>
          <TabsTrigger value="charges" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ShieldAlert className="w-4 h-4" />
            Charges & Inscriptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-0 animate-in fade-in duration-300">
          <Card className="border-none shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-card/50">
              <div>
                <CardTitle className="text-xl">Historique des Transactions</CardTitle>
                <CardDescription>Liste de toutes les mutations et ventes enregistrées.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Rechercher..." className="pl-9 h-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingTrans ? (
                <div className="p-8 space-y-4">
                  {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Date</TableHead>
                      <TableHead>Titre Foncier</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Notaire</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-48 text-center text-muted-foreground italic">
                          Aucune transaction enregistrée.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions?.map((tx) => (
                        <TableRow key={tx.id} className="group transition-colors hover:bg-primary/5">
                          <TableCell className="font-medium">
                            {format(new Date(tx.transactionDate), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold">N° {titles?.find(t => t.id === tx.titleId)?.titleNumber || 'Inconnu'}</span>
                              <span className="text-xs text-muted-foreground">{titles?.find(t => t.id === tx.titleId)?.ownerName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                              {TRANSACTION_TYPES[tx.type]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {notaries?.find(n => n.id === tx.notaryId)?.name || 'N/A'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold text-primary">
                            {tx.amount?.toLocaleString()} FCFA
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="group-hover:text-primary transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charges" className="mt-0 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingCharges ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
            ) : charges?.length === 0 ? (
              <div className="col-span-full h-48 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                <ShieldAlert className="w-10 h-10 mb-2 opacity-20" />
                <p>Aucune charge active enregistrée.</p>
              </div>
            ) : (
              charges?.map((charge) => (
                <Card 
                  key={charge.id} 
                  className={cn(
                    "relative overflow-hidden group transition-all hover:shadow-elegant border-l-4",
                    charge.status === 'radiated' ? "border-l-muted opacity-60 grayscale" : "border-l-amber-500"
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {charge.status === 'radiated' ? (
                          <Unlock className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Lock className="w-5 h-5 text-amber-500" />
                        )}
                        <CardTitle className="text-lg">{CHARGE_TYPES[charge.type]}</CardTitle>
                      </div>
                      <Badge variant={charge.status === 'active' ? 'warning' : 'secondary'} className="uppercase text-[10px]">
                        {charge.status === 'active' ? 'Active' : 'Radiée'}
                      </Badge>
                    </div>
                    <CardDescription className="font-medium text-foreground">
                      Titre Foncier N° {titles?.find(t => t.id === charge.titleId)?.titleNumber || 'Inconnu'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg text-sm italic border border-border/50">
                      "{charge.details}"
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Inscrit le {format(new Date(charge.createdAt), 'dd/MM/yyyy')}</span>
                      </div>
                      {charge.expiryDate && (
                        <div className="flex items-center gap-1 text-rose-600 font-medium">
                          <AlertCircle className="w-3 h-3" />
                          <span>Expire le {format(new Date(charge.expiryDate), 'dd/MM/yyyy')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-end">
                    {charge.status === 'active' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={() => handleRadiateCharge(charge.id)}
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" /> Radier la charge
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
