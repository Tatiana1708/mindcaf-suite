import React, { useState } from 'react';
import { useBlinkAuth } from '@blinkdotnew/react';
import { Building2, Mail, Lock, Loader2, Github, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const LoginPage = () => {
  const { login, signInWithEmail, isLoading } = useBlinkAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Soficam Suite</span>
          </div>
          
          <div className="space-y-6 max-w-lg">
            <h1 className="text-5xl font-bold leading-tight">Système Intégré de Gestion Foncière & Domaniale</h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed font-light">
              Une plateforme moderne et sécurisée pour l'administration publique, 
              permettant la centralisation et l'automatisation de tous vos processus administratifs.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-8">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">100%</span>
            <span className="text-sm text-primary-foreground/60">Numérisé</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">7+</span>
            <span className="text-sm text-primary-foreground/60">Modules Intégrés</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">256-bit</span>
            <span className="text-sm text-primary-foreground/60">Sécurité</span>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl" />
      </div>

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Bon retour parmi nous</h2>
            <p className="text-muted-foreground">Connectez-vous pour accéder à votre tableau de bord</p>
          </div>

          <Card className="border-none shadow-none lg:shadow-elegant bg-transparent lg:bg-card lg:border">
            <CardHeader className="p-0 lg:p-6 mb-6 lg:mb-0">
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full h-12 gap-2 text-base font-medium shadow-sm hover:bg-accent transition-all"
                  onClick={() => login()}
                >
                  <Globe className="w-5 h-5 text-primary" />
                  Continuer avec Blink Auth
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-medium">Ou avec email</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 lg:p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive mb-4">
                    <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="nom@ministere.gouv" 
                      className="pl-10 h-11 bg-muted/50 focus-visible:ring-primary/20 border-none lg:border lg:bg-transparent"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Button variant="link" className="px-0 h-auto text-xs text-primary font-medium">
                      Oublié ?
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 h-11 bg-muted/50 focus-visible:ring-primary/20 border-none lg:border lg:bg-transparent"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-semibold shadow-elegant transition-all duration-300 hover:scale-[1.02]" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Se connecter'}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="p-0 lg:p-6 mt-8 lg:mt-0 flex flex-col gap-4 text-center">
              <p className="text-sm text-muted-foreground">
                Besoin d'aide ? <Button variant="link" className="px-0 h-auto text-primary font-medium">Contacter le support IT</Button>
              </p>
            </CardFooter>
          </Card>

          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              Propulsé par Blink Platform &copy; 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
