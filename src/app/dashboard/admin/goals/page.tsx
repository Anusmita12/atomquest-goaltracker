'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PROFILES, PRIYA_GOALS, ARJUN_GOALS, NEHA_GOALS, Goal } from '@/lib/mock-data';
import { StatusBadge, ScoreBadge } from '@/components/ui/status-badge';
import { ChevronDown, ChevronRight, Unlock } from 'lucide-react';

const TEAM_DATA = [
  { employee: PROFILES[0], goals: PRIYA_GOALS, overall: 86, manager: 'Rahul Bose' },
  { employee: PROFILES[1], goals: ARJUN_GOALS, overall: 95, manager: 'Rahul Bose' },
  { employee: PROFILES[2], goals: NEHA_GOALS, overall: 67, manager: 'Rahul Bose' },
];

export default function AdminGoalsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <DashboardLayout persona="admin" title="All Goals (Org-wide)">
      <div className="grid gap-4 md:grid-cols-3 mb-2">
        {[
          { label: 'Total Goals', value: PRIYA_GOALS.length + ARJUN_GOALS.length + NEHA_GOALS.length },
          { label: 'Approved', value: [...PRIYA_GOALS, ...ARJUN_GOALS, ...NEHA_GOALS].filter(g => g.status === 'Approved').length },
          { label: 'Needs Attention', value: [...PRIYA_GOALS, ...ARJUN_GOALS, ...NEHA_GOALS].filter(g => g.status === 'Returned' || g.status === 'Pending').length },
        ].map(c => (
          <Card key={c.label} className="shadow-sm border-muted">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="text-[28px] font-[700] mt-1">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="shadow-sm border-muted">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle>Organisation Goal Overview</CardTitle>
          <CardDescription>Expand each employee to view and unlock individual goals</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Dept</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Goals</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TEAM_DATA.map(({ employee, goals, overall, manager }) => {
                const isOpen = expanded === employee.id;
                const approved = goals.filter(g => g.status === 'Approved').length;
                const hasIssue = goals.some(g => g.status === 'Returned');
                return (
                  <>
                    <TableRow
                      key={employee.id}
                      className="cursor-pointer hover:bg-muted/20"
                      onClick={() => setExpanded(isOpen ? null : employee.id)}
                    >
                      <TableCell>{isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</TableCell>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell className="text-muted-foreground">{employee.department}</TableCell>
                      <TableCell className="text-muted-foreground">{manager}</TableCell>
                      <TableCell>{goals.length}</TableCell>
                      <TableCell className="text-emerald-600 font-medium">{approved}</TableCell>
                      <TableCell><ScoreBadge score={overall} /></TableCell>
                      <TableCell>{hasIssue ? <span className="text-xs text-red-600 font-medium">Needs Rework</span> : <span className="text-xs text-emerald-600 font-medium">On Track</span>}</TableCell>
                    </TableRow>
                    {isOpen && goals.map((g: Goal) => (
                      <TableRow key={g.id} className="bg-muted/10 text-sm">
                        <TableCell />
                        <TableCell colSpan={2} className="pl-8 text-muted-foreground italic">{g.title}</TableCell>
                        <TableCell>{g.thrustArea}</TableCell>
                        <TableCell>{g.weightage}%</TableCell>
                        <TableCell><ScoreBadge score={g.score} /></TableCell>
                        <TableCell><StatusBadge status={g.status} /></TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-amber-600 hover:text-amber-700">
                            <Unlock className="h-3 w-3 mr-1" />Unlock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
