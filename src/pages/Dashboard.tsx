import React from 'react';
import { useStats } from '@/hooks/useData';
import { 
  Mail, 
  Map, 
  Gavel, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  UserPlus,
  ArrowRight,
  MoreVertical,
  User // Added User icon
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ title, value, icon: Icon, description, trend, isLoading }: any) => (
  <Card className="overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-elegant">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
        <Icon className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-9 w-24 mb-1" />
      ) : (
        <div className="text-3xl font-bold tracking-tight">{value}</div>
      )}
      <div className="flex items-center gap-2 mt-1">
        {trend && (
          <span className={cn("text-xs font-medium flex items-center gap-0.5", trend.isPositive ? "text-green-500" : "text-red-500")}>
            <TrendingUp className="w-3 h-3" />
            {trend.value}%
          </span>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </CardContent>
    <div className="h-1 bg-primary/10 w-full overflow-hidden">
      <div className="h-full bg-primary w-2/3 group-hover:w-full transition-all duration-1000" />
    </div>
  </Card>
);

import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();

  const activities = [
    { icon: Mail, label: 'Nouveau courrier entrant', time: 'Il y a 10 min', user: 'Jean Dupont', status: 'En attente' },
    { icon: Map, label: 'Titre foncier mis à jour', time: 'Il y a 1h', user: 'Marie Lefebvre', status: 'Validé' },
    { icon: Gavel, label: 'Projet d\'expropriation lancé', time: 'Il y a 3h', user: 'Admin System', status: 'En cours' },
    { icon: FileText, label: 'Archive numérisée', time: 'Il y a 5h', user: 'Lucas Martin', status: 'Terminé' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Tableau de Bord</h1>
        <p className="text-muted-foreground">Bienvenue sur Soficam Suite. Voici un aperçu de l'activité aujourd'hui.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard 
          title="Courriers Totaux" 
          value={stats?.mailRecords || 0} 
          icon={Mail} 
          description="Traités ce mois"
          trend={{ value: 12, isPositive: true }}
          isLoading={isLoading}
        />
        <StatCard 
          title="Titres Fonciers" 
          value={stats?.landTitles || 0} 
          icon={Map} 
          description="Inscrits au cadastre"
          trend={{ value: 5, isPositive: true }}
          isLoading={isLoading}
        />
        <StatCard 
          title="Dossiers d'Immat." 
          value={stats?.registrationDossiers || 0} 
          icon={FileText} 
          description="En cours de traitement"
          trend={{ value: 8, isPositive: true }}
          isLoading={isLoading}
        />
        <StatCard 
          title="Notaires Partenaires" 
          value={stats?.activeNotaries || 0} 
          icon={User} 
          description="Cabinets agréés"
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-elegant border-none bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Activité Récente</CardTitle>
              <CardDescription>Historique des actions effectuées sur la plateforme.</CardDescription>
            </div>
            <Button variant="outline" size="sm">Tout voir</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-all">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                    <activity.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold leading-none">{activity.label}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{activity.user}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-elegant border-none bg-primary text-primary-foreground relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl">Résumé Mensuel</CardTitle>
            <CardDescription className="text-primary-foreground/70">Performance des services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Gestion Domaniale</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-2 bg-white/20" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Courrier Entrant</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2 bg-white/20" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Numérisation Archives</span>
                <span>40%</span>
              </div>
              <Progress value={40} className="h-2 bg-white/20" />
            </div>
          </CardContent>
          <CardFooter className="pt-6">
            <Button variant="secondary" className="w-full font-bold gap-2 group">
              Rapport complet <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
          
          {/* Decorative shapes */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <Card className="shadow-elegant border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
              <AlertCircle className="w-5 h-5 text-orange-500 animate-pulse" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Dossiers en retard
              </CardTitle>
              <CardDescription>Courriers dont la date d'échéance est dépassée.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-4xl font-black text-orange-500 mb-2">12</div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Dossiers prioritaires</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t p-4 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Dernière mise à jour: Aujourd'hui 10:45</span>
              <Button variant="ghost" size="sm" className="h-8 font-bold text-xs hover:text-orange-500">Traiter maintenant</Button>
            </CardFooter>
         </Card>

         <Card className="shadow-elegant border-none overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Nouveaux Utilisateurs</CardTitle>
                <CardDescription>Collaborateurs récemment ajoutés au système.</CardDescription>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full">
                <UserPlus className="w-4 h-4 text-primary" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-3 overflow-hidden py-4">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-background bg-muted flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
                <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-background bg-primary text-primary-foreground text-xs font-bold">
                  +8
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t p-4 flex justify-between items-center">
               <span className="text-xs text-muted-foreground">Total: 42 collaborateurs actifs</span>
               <Button variant="link" size="sm" className="h-8 font-bold text-xs p-0">Gérer l'équipe</Button>
            </CardFooter>
         </Card>
      </div>
    </div>
  );
}
