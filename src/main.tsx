import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BlinkProvider, BlinkAuthProvider } from '@blinkdotnew/react';
import { getProjectId } from './lib/blink';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BlinkProvider projectId={getProjectId()}>
      <BlinkAuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BlinkAuthProvider>
    </BlinkProvider>
  </React.StrictMode>,
);
