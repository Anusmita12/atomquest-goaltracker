'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PROFILES, PRIYA_GOALS, ARJUN_GOALS, NEHA_GOALS, Goal } from '@/lib/mock-data';
import { ScoreBadge, StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';

const TEAM = [
  { employee: PROFILES[0], goals: PRIYA_GOALS },
  { employee: PROFILES[1], goals: ARJUN_GOALS },
  { employee: PROFILES[2], goals: NEHA_GOALS },
];

export default function ManagerCheckinsPage() {
  const [comments, setComments] = useState<Record<string, string>>({});

  return (
    <DashboardLayout persona="manager" title="Team Check-ins — Q3 2026">
      <div className="space-y-6">
        {TEAM.map(({ employee, goals }) => (
          <Card key={employee.id} className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle className="text-base">{employee.name} — {employee.department}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Goal</TableHead>
                    <TableHead>Q1</TableHead>
                    <TableHead>Q2</TableHead>
                    <TableHead>Q3</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[200px]">Manager Comment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goals.map((g: Goal) => {
                    const isLow = g.score < 60;
                    return (
                      <TableRow key={g.id} className={cn('hover:bg-muted/10', isLow && 'bg-red-50/40 dark:bg-red-950/10')}>
                        <TableCell className={cn('font-medium text-sm', isLow && 'text-red-700 dark:text-red-400')}>{g.title}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{g.q1 ?? '—'}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{g.q2 !== null ? String(g.q2) : '—'}</TableCell>
                        <TableCell className="text-sm">{g.q3 !== null ? String(g.q3) : <span className="text-red-500 font-medium text-xs">Missing</span>}</TableCell>
                        <TableCell><ScoreBadge score={g.score} /></TableCell>
                        <TableCell><StatusBadge status={g.status} /></TableCell>
                        <TableCell>
                          <Textarea
                            className="h-16 text-xs resize-none"
                            placeholder="Add comment..."
                            value={comments[g.id] ?? ''}
                            onChange={e => setComments(p => ({ ...p, [g.id]: e.target.value }))}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="px-6 py-3 flex justify-end border-t">
                <Button size="sm">Save Comments</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
