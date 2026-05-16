'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

interface DashboardLayoutProps {
  children: ReactNode;
  persona: 'employee' | 'manager' | 'admin';
  title: string;
}

export function DashboardLayout({ children, persona, title }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar persona={persona} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar title={title} />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6 md:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
