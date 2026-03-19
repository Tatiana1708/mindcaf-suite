import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blink } from '../lib/blink';

// Type definitions matching the database schema
// SQLite booleans are "0"/"1" strings, id is string

export interface MailRecord {
  id: string;
  userId: string;
  type: string;
  entryDate: string;
  mailNumber: string;
  source: string;
  subject: string;
  service?: string;
  instruction?: string;
  ownerId?: string;
  status: string;
  dueDate?: string;
  notes?: string;
  createdAt: string;
}

export interface LandTitle {
  id: string;
  userId: string;
  titleNumber: string;
  ownerName: string;
  location: string;
  surfaceArea?: number;
  status: string;
  createdAt: string;
}

export interface Expropriation {
  id: string;
  userId: string;
  projectName: string;
  status: string;
  totalImpacted: number;
  totalIndemnity: number;
  createdAt: string;
}

// Module 2 Entities
export interface RegistrationDossier {
  id: string;
  userId: string;
  type: 'registration' | 'concession' | 'morcellement' | 'lotissement';
  applicantName: string;
  applicantIdNumber?: string;
  parcelLocation: string;
  parcelArea: number;
  status: 'submitted' | 'pending' | 'validated' | 'rejected' | 'suspended' | 'completed';
  assignedTo?: string;
  processingTimeStart?: string;
  processingTimeEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DossierWorkflow {
  id: string;
  dossierId: string;
  stepName: string;
  status: 'pending' | 'in_progress' | 'validated' | 'rejected';
  documentUrl?: string;
  actorId?: string;
  notes?: string;
  createdAt: string;
}

export interface Notary {
  id: string;
  userId: string;
  name: string;
  cabinetName: string;
  address?: string;
  phone?: string;
  email?: string;
  licenseNumber?: string;
  createdAt: string;
}

export interface LandTransaction {
  id: string;
  userId: string;
  titleId: string;
  type: 'sale' | 'mutation' | 'withdrawal_indivision' | 'subdivision' | 'parceling';
  notaryId?: string;
  amount?: number;
  status: string;
  transactionDate: string;
  createdAt: string;
}

export interface LandCharge {
  id: string;
  userId: string;
  titleId: string;
  type: 'mortgage' | 'prenotation' | 'radiation' | 'judicial_prenotation';
  status: string;
  details?: string;
  expiryDate?: string;
  createdAt: string;
}

// Input types
export type CreateMailRecordInput = Omit<MailRecord, 'id' | 'userId' | 'createdAt'>;
export type CreateLandTitleInput = Omit<LandTitle, 'id' | 'userId' | 'createdAt'>;
export type CreateExpropriationInput = Omit<Expropriation, 'id' | 'userId' | 'createdAt'>;
export type CreateRegistrationDossierInput = Omit<RegistrationDossier, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type CreateNotaryInput = Omit<Notary, 'id' | 'userId' | 'createdAt'>;
export type CreateLandTransactionInput = Omit<LandTransaction, 'id' | 'userId' | 'createdAt'>;
export type CreateLandChargeInput = Omit<LandCharge, 'id' | 'userId' | 'createdAt'>;

// Filter types
export interface MailFilters { type?: string; status?: string; }
export interface LandTitleFilters { status?: string; }
export interface ExpropriationFilters { status?: string; }
export interface RegistrationFilters { type?: string; status?: string; assignedTo?: string; }

// =====================
// MAIL RECORDS HOOKS
// =====================

export function useMailRecords(filters?: MailFilters) {
  return useQuery({
    queryKey: ['mailRecords', filters],
    queryFn: async (): Promise<MailRecord[]> => {
      const query: Record<string, unknown> = {};
      if (filters?.type) query.type = filters.type;
      if (filters?.status) query.status = filters.status;
      return await blink.db.mailRecords.list({
        where: Object.keys(query).length > 0 ? query : undefined,
        orderBy: { createdAt: 'desc' },
        limit: 100,
      }) as MailRecord[];
    },
  });
}

export function useCreateMailRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateMailRecordInput): Promise<MailRecord> => {
      return await blink.db.mailRecords.create(input) as MailRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mailRecords'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdateMailStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }): Promise<MailRecord> => {
      return await blink.db.mailRecords.update(id, { status }) as MailRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mailRecords'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useDeleteMailRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await blink.db.mailRecords.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mailRecords'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// =====================
// LAND TITLES HOOKS
// =====================

export function useLandTitles(filters?: LandTitleFilters) {
  return useQuery({
    queryKey: ['landTitles', filters],
    queryFn: async (): Promise<LandTitle[]> => {
      const query: Record<string, unknown> = {};
      if (filters?.status) query.status = filters.status;
      return await blink.db.landTitles.list({
        where: Object.keys(query).length > 0 ? query : undefined,
        orderBy: { createdAt: 'desc' },
        limit: 100,
      }) as LandTitle[];
    },
  });
}

export function useCreateLandTitle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateLandTitleInput): Promise<LandTitle> => {
      return await blink.db.landTitles.create(input) as LandTitle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landTitles'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// =====================
// EXPROPRIATIONS HOOKS
// =====================

export function useExpropriations(filters?: ExpropriationFilters) {
  return useQuery({
    queryKey: ['expropriations', filters],
    queryFn: async (): Promise<Expropriation[]> => {
      const query: Record<string, unknown> = {};
      if (filters?.status) query.status = filters.status;
      return await blink.db.expropriations.list({
        where: Object.keys(query).length > 0 ? query : undefined,
        orderBy: { createdAt: 'desc' },
        limit: 100,
      }) as Expropriation[];
    },
  });
}

// =====================
// REGISTRATION DOSSIERS
// =====================

export function useRegistrationDossiers(filters?: RegistrationFilters) {
  return useQuery({
    queryKey: ['registrationDossiers', filters],
    queryFn: async (): Promise<RegistrationDossier[]> => {
      const query: Record<string, unknown> = {};
      if (filters?.type) query.type = filters.type;
      if (filters?.status) query.status = filters.status;
      if (filters?.assignedTo) query.assignedTo = filters.assignedTo;
      return await blink.db.registrationDossiers.list({
        where: Object.keys(query).length > 0 ? query : undefined,
        orderBy: { createdAt: 'desc' },
        limit: 100,
      }) as RegistrationDossier[];
    },
  });
}

export function useCreateRegistrationDossier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateRegistrationDossierInput): Promise<RegistrationDossier> => {
      return await blink.db.registrationDossiers.create({
        ...input,
        processingTimeStart: new Date().toISOString()
      }) as RegistrationDossier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationDossiers'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdateDossierStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RegistrationDossier['status'] }): Promise<RegistrationDossier> => {
      const update: Record<string, unknown> = { status, updatedAt: new Date().toISOString() };
      if (status === 'completed') update.processingTimeEnd = new Date().toISOString();
      return await blink.db.registrationDossiers.update(id, update) as RegistrationDossier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationDossiers'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdateDossierProcessingTimes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, processingTimeStart, processingTimeEnd }: { 
      id: string; 
      processingTimeStart?: string; 
      processingTimeEnd?: string 
    }): Promise<RegistrationDossier> => {
      const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
      if (processingTimeStart) update.processingTimeStart = processingTimeStart;
      if (processingTimeEnd) update.processingTimeEnd = processingTimeEnd;
      return await blink.db.registrationDossiers.update(id, update) as RegistrationDossier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationDossiers'] });
    },
  });
}

export function useAssignDossier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, assignedTo }: { id: string; assignedTo: string }): Promise<RegistrationDossier> => {
      return await blink.db.registrationDossiers.update(id, { 
        assignedTo, 
        updatedAt: new Date().toISOString() 
      }) as RegistrationDossier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationDossiers'] });
    },
  });
}

// =====================
// DOSSIER WORKFLOW HOOKS
// =====================

export function useDossierWorkflow(dossierId: string) {
  return useQuery({
    queryKey: ['dossierWorkflow', dossierId],
    queryFn: async (): Promise<DossierWorkflow[]> => {
      return await blink.db.dossierWorkflow.list({
        where: { dossierId },
        orderBy: { createdAt: 'asc' },
      }) as DossierWorkflow[];
    },
    enabled: !!dossierId,
  });
}

export function useAddDossierStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<DossierWorkflow, 'id' | 'createdAt'>): Promise<DossierWorkflow> => {
      return await blink.db.dossierWorkflow.create(input) as DossierWorkflow;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dossierWorkflow', variables.dossierId] });
    },
  });
}

export function useUpdateDossierStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dossierId, ...updates }: Partial<DossierWorkflow> & { id: string; dossierId: string }): Promise<DossierWorkflow> => {
      return await blink.db.dossierWorkflow.update(id, updates) as DossierWorkflow;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dossierWorkflow', variables.dossierId] });
    },
  });
}

export function useDeleteDossierStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dossierId }: { id: string; dossierId: string }): Promise<void> => {
      await blink.db.dossierWorkflow.delete(id);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dossierWorkflow', variables.dossierId] });
    },
  });
}

// =====================
// NOTARIES HOOKS
// =====================

export function useNotaries() {
  return useQuery({
    queryKey: ['notaries'],
    queryFn: async (): Promise<Notary[]> => {
      return await blink.db.notaries.list({ orderBy: { name: 'asc' } }) as Notary[];
    },
  });
}

export function useCreateNotary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateNotaryInput): Promise<Notary> => {
      return await blink.db.notaries.create(input) as Notary;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notaries'] }),
  });
}

export function useUpdateNotary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CreateNotaryInput> & { id: string }): Promise<Notary> => {
      return await blink.db.notaries.update(id, updates) as Notary;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notaries'] }),
  });
}

export function useDeleteNotary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await blink.db.notaries.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notaries'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// =====================
// LAND TRANSACTIONS HOOKS
// =====================

export interface TransactionFilters {
  type?: string;
  status?: string;
  notaryId?: string;
}

export function useLandTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['landTransactions', filters],
    queryFn: async (): Promise<LandTransaction[]> => {
      const query: Record<string, unknown> = {};
      if (filters?.type) query.type = filters.type;
      if (filters?.status) query.status = filters.status;
      if (filters?.notaryId) query.notaryId = filters.notaryId;
      return await blink.db.landTransactions.list({
        where: Object.keys(query).length > 0 ? query : undefined,
        orderBy: { transactionDate: 'desc' },
        limit: 100,
      }) as LandTransaction[];
    },
  });
}

export function useCreateLandTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateLandTransactionInput): Promise<LandTransaction> => {
      return await blink.db.landTransactions.create(input) as LandTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdateLandTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CreateLandTransactionInput> & { id: string }): Promise<LandTransaction> => {
      return await blink.db.landTransactions.update(id, updates) as LandTransaction;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['landTransactions'] }),
  });
}

// =====================
// LAND CHARGES HOOKS
// =====================

export function useLandCharges(titleId?: string) {
  return useQuery({
    queryKey: ['landCharges', titleId],
    queryFn: async (): Promise<LandCharge[]> => {
      return await blink.db.landCharges.list({
        where: titleId ? { titleId } : undefined,
        orderBy: { createdAt: 'desc' }
      }) as LandCharge[];
    },
  });
}

export function useCreateLandCharge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateLandChargeInput): Promise<LandCharge> => {
      return await blink.db.landCharges.create(input) as LandCharge;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landCharges'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdateLandCharge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CreateLandChargeInput> & { id: string }): Promise<LandCharge> => {
      return await blink.db.landCharges.update(id, updates) as LandCharge;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['landCharges'] }),
  });
}

// Radiation is a special case - it updates the status of an existing charge
export function useRadiateCharge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, expiryDate, notes }: { id: string; expiryDate?: string; notes?: string }): Promise<LandCharge> => {
      return await blink.db.landCharges.update(id, {
        type: 'radiation',
        status: 'completed',
        details: notes || 'Radiated',
        expiryDate: expiryDate || new Date().toISOString(),
      }) as LandCharge;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['landCharges'] }),
  });
}

// =====================
// STATS HOOK
// =====================

export interface Stats {
  mailRecords: number;
  landTitles: number;
  expropriations: number;
  registrationDossiers: number;
  activeNotaries: number;
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async (): Promise<Stats> => {
      const [mailRecords, landTitles, expropriations, dossiers, notaries] = await Promise.all([
        blink.db.mailRecords.list({ limit: 1000 }),
        blink.db.landTitles.list({ limit: 1000 }),
        blink.db.expropriations.list({ limit: 1000 }),
        blink.db.registrationDossiers.list({ limit: 1000 }),
        blink.db.notaries.list({ limit: 1000 }),
      ]);
      
      return {
        mailRecords: mailRecords.length,
        landTitles: landTitles.length,
        expropriations: expropriations.length,
        registrationDossiers: dossiers.length,
        activeNotaries: notaries.length,
      };
    },
  });
}
