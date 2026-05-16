'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import { use } from 'react';

export default function EmployeeStubPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = use(params);
  const pageName = slug ? slug.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ') : 'Page';

  return (
    <DashboardLayout persona="employee" title={pageName}>
      <Card className="shadow-sm border-muted">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-amber-500" />
            {pageName}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 bg-muted rounded-full mb-4">
            <Construction className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            This section is under active development and will be available in the next iteration.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
