'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PRIYA_GOALS } from '@/lib/mock-data';
import { StatusBadge, ScoreBadge } from '@/components/ui/status-badge';
import { Send } from 'lucide-react';

export default function EmployeeCheckinsPage() {
  const [q3Values, setQ3Values] = useState<Record<string, string>>(
    Object.fromEntries(PRIYA_GOALS.map(g => [g.id, g.q3 !== null ? String(g.q3) : '']))
  );

  return (
    <DashboardLayout persona="employee" title="Quarterly Check-ins">
      <Card className="shadow-sm border-muted">
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <div>
            <CardTitle>Q3 2026 Check-in</CardTitle>
            <CardDescription>Enter your Q3 actual achievements below. All fields are editable.</CardDescription>
          </div>
          <Button size="sm"><Send className="h-4 w-4 mr-1" />Submit Check-in</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[240px]">Goal Title</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Q1 Actual</TableHead>
                <TableHead>Q2 Actual</TableHead>
                <TableHead className="text-primary font-semibold">Q3 Actual (Editable)</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRIYA_GOALS.map(goal => (
                <TableRow key={goal.id} className="hover:bg-muted/10">
                  <TableCell className="font-medium text-sm">{goal.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {goal.unit === '₹'
                      ? `₹${(goal.targetValue as number / 1000000).toFixed(0)}Cr`
                      : `${goal.targetValue} ${goal.unit}`}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {goal.q1 !== null ? (goal.unit === '₹' ? `₹${((goal.q1 as number) / 1000000).toFixed(2)}Cr` : `${goal.q1}`) : '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {goal.q2 !== null ? (typeof goal.q2 === 'string' ? goal.q2 : goal.unit === '₹' ? `₹${((goal.q2 as number) / 1000000).toFixed(2)}Cr` : `${goal.q2}`) : '—'}
                  </TableCell>
                  <TableCell>
                    <Input
                      className="h-8 w-36 text-sm"
                      value={q3Values[goal.id]}
                      onChange={e => setQ3Values(p => ({ ...p, [goal.id]: e.target.value }))}
                      placeholder="Enter value"
                    />
                  </TableCell>
                  <TableCell><ScoreBadge score={goal.score} /></TableCell>
                  <TableCell><StatusBadge status={goal.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
