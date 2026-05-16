'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PROFILES, PRIYA_GOALS, ARJUN_GOALS, NEHA_GOALS, Goal } from '@/lib/mock-data';
import { StatusBadge, ScoreBadge } from '@/components/ui/status-badge';
import { ChevronDown, ChevronRight } from 'lucide-react';

const TEAM_DATA = [
  { employee: PROFILES[0], goals: PRIYA_GOALS, overall: 86 },
  { employee: PROFILES[1], goals: ARJUN_GOALS, overall: 95 },
  { employee: PROFILES[2], goals: NEHA_GOALS, overall: 67 },
];

export default function ManagerGoalsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <DashboardLayout persona="manager" title="Team Goals">
      <Card className="shadow-sm border-muted">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle>Team Goal Summary</CardTitle>
          <CardDescription>Click a row to expand individual goals</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Total Goals</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Overall Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TEAM_DATA.map(({ employee, goals, overall }) => {
                const isOpen = expanded === employee.id;
                const approved = goals.filter(g => g.status === 'Approved').length;
                const pending = goals.filter(g => g.status === 'Pending').length;
                const hasIssue = goals.some(g => g.status === 'Returned');
                return (
                  <>
                    <TableRow
                      key={employee.id}
                      className="cursor-pointer hover:bg-muted/20"
                      onClick={() => setExpanded(isOpen ? null : employee.id)}
                    >
                      <TableCell className="text-muted-foreground">
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </TableCell>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell className="text-muted-foreground">{employee.department}</TableCell>
                      <TableCell>{goals.length}</TableCell>
                      <TableCell className="text-emerald-600 font-medium">{approved}</TableCell>
                      <TableCell className="text-amber-600 font-medium">{pending}</TableCell>
                      <TableCell><ScoreBadge score={overall} /></TableCell>
                      <TableCell>
                        {hasIssue
                          ? <span className="text-xs font-medium text-red-600">Needs Rework</span>
                          : <span className="text-xs font-medium text-emerald-600">On Track</span>}
                      </TableCell>
                    </TableRow>
                    {isOpen && goals.map((g: Goal) => (
                      <TableRow key={g.id} className="bg-muted/10 text-sm">
                        <TableCell />
                        <TableCell colSpan={2} className="pl-8 text-muted-foreground italic">{g.title}</TableCell>
                        <TableCell>{g.thrustArea}</TableCell>
                        <TableCell className="text-muted-foreground">{g.uom.toUpperCase()}</TableCell>
                        <TableCell>{g.weightage}%</TableCell>
                        <TableCell><ScoreBadge score={g.score} /></TableCell>
                        <TableCell><StatusBadge status={g.status} /></TableCell>
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
