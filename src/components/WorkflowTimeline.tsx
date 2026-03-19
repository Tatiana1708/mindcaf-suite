import React from 'react';
import { DossierWorkflow } from '@/hooks/useData';
import { CheckCircle2, Clock, XCircle, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface WorkflowTimelineProps {
  steps: DossierWorkflow[];
  className?: string;
}

export const WorkflowTimeline = ({ steps, className }: WorkflowTimelineProps) => {
  if (!steps || steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground italic">
        <Clock className="w-10 h-10 mb-2 opacity-20" />
        <p>Aucune étape enregistrée pour ce dossier.</p>
      </div>
    );
  }

  const getStatusIcon = (status: DossierWorkflow['status']) => {
    switch (status) {
      case 'validated':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 bg-background rounded-full" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-rose-500 bg-background rounded-full" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-amber-500 bg-background rounded-full animate-pulse" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground bg-background rounded-full" />;
    }
  };

  const getStatusLabel = (status: DossierWorkflow['status']) => {
    switch (status) {
      case 'validated': return 'Validé';
      case 'rejected': return 'Rejeté';
      case 'in_progress': return 'En cours';
      default: return 'En attente';
    }
  };

  const getStatusVariant = (status: DossierWorkflow['status']) => {
    switch (status) {
      case 'validated': return 'success';
      case 'rejected': return 'destructive';
      case 'in_progress': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className={cn("space-y-8 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-border before:to-transparent", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="relative flex items-start gap-6 group">
          <div className="absolute left-0 mt-1 flex items-center justify-center">
            {getStatusIcon(step.status)}
          </div>
          
          <div className="flex-1 ml-8 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {step.stepName}
              </h4>
              <time className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {format(new Date(step.createdAt), 'dd MMMM yyyy HH:mm', { locale: fr })}
              </time>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(step.status) as any} className="text-[10px] px-1.5 py-0 leading-tight h-4">
                {getStatusLabel(step.status)}
              </Badge>
              {step.documentUrl && (
                <a 
                  href={step.documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-medium"
                >
                  <FileText className="w-3 h-3" />
                  Voir document
                </a>
              )}
            </div>

            {step.notes && (
              <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground border border-border/50">
                {step.notes}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
