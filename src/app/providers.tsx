'use client';

import { HeroUIProvider } from '@heroui/react'
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastContainer } from 'react-toastify';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider>
        <SidebarProvider>
          <ToastContainer />
          {children}
        </SidebarProvider>
      </ThemeProvider>
    </HeroUIProvider>
  )
}