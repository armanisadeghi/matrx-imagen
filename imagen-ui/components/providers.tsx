// components\providers.tsx

import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
<TooltipProvider>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
