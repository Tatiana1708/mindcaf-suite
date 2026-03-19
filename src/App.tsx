import React, { Suspense, lazy } from 'react';
import { 
  createRootRoute, 
  createRoute, 
  createRouter, 
  RouterProvider, 
  Outlet
} from '@tanstack/react-router';
import { useBlinkAuth } from '@blinkdotnew/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoginPage } from '@/pages/Login';
import { Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Mail = lazy(() => import('@/pages/Mail'));
const LandTitles = lazy(() => import('@/pages/LandTitles'));
const Expropriations = lazy(() => import('@/pages/Expropriations'));
const RegistrationDossiers = lazy(() => import('@/pages/RegistrationDossiers'));
const Notaries = lazy(() => import('@/pages/Notaries'));
const LandTransactions = lazy(() => import('@/pages/LandTransactions'));

const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center bg-background">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

// Root component that handles auth guarding and layout
const Root = () => {
  const { user, isAuthenticated, isLoading } = useBlinkAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
      <Toaster position="top-right" richColors />
    </DashboardLayout>
  );
};

const rootRoute = createRootRoute({
  component: Root,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const mailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mail',
  component: Mail,
});

const titlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/titles',
  component: LandTitles,
});

const expropriationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/expropriations',
  component: Expropriations,
});

const registrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/registration',
  component: RegistrationDossiers,
});

const notariesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notaries',
  component: Notaries,
});

const transactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transactions',
  component: LandTransactions,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  mailRoute,
  titlesRoute,
  expropriationsRoute,
  registrationRoute,
  notariesRoute,
  transactionsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}