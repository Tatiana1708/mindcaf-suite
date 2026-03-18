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

// Input types for creating records (without auto-generated fields)
export type CreateMailRecordInput = Omit<MailRecord, 'id' | 'userId' | 'createdAt'>;
export type CreateLandTitleInput = Omit<LandTitle, 'id' | 'userId' | 'createdAt'>;
export type CreateExpropriationInput = Omit<Expropriation, 'id' | 'userId' | 'createdAt'>;

// Filter types
export interface MailFilters {
  type?: string;
  status?: string;
}

export interface LandTitleFilters {
  status?: string;
}

export interface ExpropriationFilters {
  status?: string;
}

// =====================
// MAIL RECORDS HOOKS
// =====================

/**
 * Hook to list mail records with optional filtering
 */
export function useMailRecords(filters?: MailFilters) {
  return useQuery({
    queryKey: ['mailRecords', filters],
    queryFn: async (): Promise<MailRecord[]> => {
      const query: Record<string, unknown> = {};
      
      if (filters?.type) {
        query.type = filters.type;
      }
      if (filters?.status) {
        query.status = filters.status;
      }
      
      // SDK handles user_id automatically with auth
      const records = await blink.db.mailRecords.list({
        where: Object.keys(query).length > 0 ? query : undefined,
        orderBy: { createdAt: 'desc' },
        limit: 100,
      });
      
      return records as MailRecord[];
    },
  });
}

/**
 * Hook to get a single mail record by ID
 */
export function useMailRecord(id: string) {
  return useQuery({
    queryKey: ['mailRecord', id],
    queryFn: async (): Promise<MailRecord | null> => {
      if (!id) return null;
      const record = await blink.db.mailRecords.get(id);
      return record as MailRecord | null;
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new mail record
 */
export function useCreateMailRecord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: CreateMailRecordInput): Promise<MailRecord> => {
      const record = await blink.db.mailRecords.create({
        type: input.type,
        entryDate: input.entryDate,
        mailNumber: input.mailNumber,
        source: input.source,
        subject: input.subject,
        service: input.service,
        instruction: input.instruction,
        ownerId: input.ownerId,
        status: input.status || 'pending',
        dueDate: input.dueDate,
        notes: input.notes,
      });
      return record as MailRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mailRecords'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

/**
 * Hook to update mail record status
 */
export function useUpdateMailStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }): Promise<MailRecord> => {
      const updated = await blink.db.mailRecords.update(id, { status });
      return updated as MailRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mailRecords'] });
      queryClient.invalidateQueries({ queryKey: ['mailRecord'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

/**
 * Hook to delete a mail record
 */
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

/**
 * Hook to list land titles with optional filtering
 */
export function useLandTitles(filters?: LandTitleFilters) {
  return useQuery({
    queryKey: ['landTitles', filters],
    queryFn: async (): Promise<LandTitle[]> => {
      const query: Record<string, unknown> = {};
      
      if (filters?.status) {
        query.status = filters.status;
      }
      
      const records = await blink.db.landTitles.list({
        where: Object.keys(query).length > 0 ? query : undefined,
        orderBy: { createdAt: 'desc' },
        limit: 100,
      });
      
      return records as LandTitle[];
    },
  });
}

/**
 * Hook to get a single land title by ID
 */
export function useLandTitle(id: string) {
  return useQuery({
    queryKey: ['landTitle', id],
    queryFn: async (): Promise<LandTitle | null> => {
      if (!id) return null;
      const record = await blink.db.landTitles.get(id);
      return record as LandTitle | null;
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new land title
 */
export function useCreateLandTitle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: CreateLandTitleInput): Promise<LandTitle> => {
      const record = await blink.db.landTitles.create({
        titleNumber: input.titleNumber,
        ownerName: input.ownerName,
        location: input.location,
        surfaceArea: input.surfaceArea,
        status: input.status || 'active',
      });
      return record as LandTitle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landTitles'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

/**
 * Hook to update land title status
 */
export function useUpdateLandTitleStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }): Promise<LandTitle> => {
      const updated = await blink.db.landTitles.update(id, { status });
      return updated as LandTitle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landTitles'] });
      queryClient.invalidateQueries({ queryKey: ['landTitle'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

/**
 * Hook to delete a land title
 */
export function useDeleteLandTitle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await blink.db.landTitles.delete(id);
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

/**
 * Hook to list expropriations with optional filtering
 */
export function useExpropriations(filters?: ExpropriationFilters) {
  return useQuery({
    queryKey: ['expropriations', filters],
    queryFn: async (): Promise<Expropriation[]> => {
      const query: Record<string, unknown> = {};
      
      if (filters?.status) {
        query.status = filters.status;
      }
      
      const records = await blink.db.expropriations.list({
        where: Object.keys(query).length > 0 ? query : undefined,
        orderBy: { createdAt: 'desc' },
        limit: 100,
      });
      
      return records as Expropriation[];
    },
  });
}

/**
 * Hook to get a single expropriation by ID
 */
export function useExpropriation(id: string) {
  return useQuery({
    queryKey: ['expropriation', id],
    queryFn: async (): Promise<Expropriation | null> => {
      if (!id) return null;
      const record = await blink.db.expropriations.get(id);
      return record as Expropriation | null;
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new expropriation
 */
export function useCreateExpropriation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: CreateExpropriationInput): Promise<Expropriation> => {
      const record = await blink.db.expropriations.create({
        projectName: input.projectName,
        status: input.status || 'draft',
        totalImpacted: input.totalImpacted || 0,
        totalIndemnity: input.totalIndemnity || 0,
      });
      return record as Expropriation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expropriations'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

/**
 * Hook to update expropriation status
 */
export function useUpdateExpropriationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }): Promise<Expropriation> => {
      const updated = await blink.db.expropriations.update(id, { status });
      return updated as Expropriation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expropriations'] });
      queryClient.invalidateQueries({ queryKey: ['expropriation'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

/**
 * Hook to update expropriation details
 */
export function useUpdateExpropriation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: { id: string; projectName?: string; status?: string; totalImpacted?: number; totalIndemnity?: number }): Promise<Expropriation> => {
      const updated = await blink.db.expropriations.update(input.id, {
        projectName: input.projectName,
        status: input.status,
        totalImpacted: input.totalImpacted,
        totalIndemnity: input.totalIndemnity,
      });
      return updated as Expropriation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expropriations'] });
      queryClient.invalidateQueries({ queryKey: ['expropriation'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

/**
 * Hook to delete an expropriation
 */
export function useDeleteExpropriation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await blink.db.expropriations.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expropriations'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// =====================
// STATS HOOK
// =====================

export interface Stats {
  mailRecords: number;
  landTitles: number;
  expropriations: number;
}

/**
 * Hook to get counts for each module
 */
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async (): Promise<Stats> => {
      // These queries will only return records for the authenticated user
      // because the SDK automatically includes the user_id filter with auth
      const [mailRecords, landTitles, expropriations] = await Promise.all([
        blink.db.mailRecords.list({ limit: 1000 }),
        blink.db.landTitles.list({ limit: 1000 }),
        blink.db.expropriations.list({ limit: 1000 }),
      ]);
      
      return {
        mailRecords: mailRecords.length,
        landTitles: landTitles.length,
        expropriations: expropriations.length,
      };
    },
  });
}
