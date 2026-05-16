'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ALL_GOALS, PROFILES, GoalStatus, Goal } from '@/lib/mock-data';
import { StatusBadge, ScoreBadge } from '@/components/ui/status-badge';
import { Download } from 'lucide-react';
import Papa from 'papaparse';

const getName = (id: string) => PROFILES.find(p => p.id === id)?.name ?? id;
const getDept = (id: string) => PROFILES.find(p => p.id === id)?.department ?? '—';

export function ReportsContent({ persona }: { persona: 'manager' | 'admin' }) {
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = ALL_GOALS.filter(g => {
    const dept = getDept(g.employeeId);
    return (deptFilter === 'all' || dept === deptFilter) &&
      (statusFilter === 'all' || g.status === statusFilter);
  });

  const exportCSV = () => {
    const rows = filtered.map(g => ({
      Employee: getName(g.employeeId),
      Department: getDept(g.employeeId),
      'Goal Title': g.title,
      'Thrust Area': g.thrustArea,
      'Weight (%)': g.weightage,
      'Q1 Actual': g.q1 ?? '—',
      'Q2 Actual': g.q2 ?? '—',
      'Q3 Actual': g.q3 ?? '—',
      Target: g.targetValue,
      'Score (%)': g.score,
      Status: g.status,
    }));
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'goals-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout persona={persona} title="Reports">
      <Card className="shadow-sm border-muted">
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <div>
            <CardTitle>Goal Report — FY 2025-26</CardTitle>
            <CardDescription>{filtered.length} goals across all employees</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-36 h-9 text-sm"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Depts</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={exportCSV}><Download className="h-4 w-4 mr-1" />Export CSV</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Dept</TableHead>
                <TableHead className="w-[220px]">Goal Title</TableHead>
                <TableHead>Thrust</TableHead>
                <TableHead>Wt%</TableHead>
                <TableHead>Q1</TableHead>
                <TableHead>Q2</TableHead>
                <TableHead>Q3</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(g => (
                <TableRow key={g.id} className="hover:bg-muted/10 text-sm">
                  <TableCell className="font-medium">{getName(g.employeeId)}</TableCell>
                  <TableCell className="text-muted-foreground">{getDept(g.employeeId)}</TableCell>
                  <TableCell>{g.title}</TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{g.thrustArea}</span>
                  </TableCell>
                  <TableCell>{g.weightage}%</TableCell>
                  <TableCell className="text-muted-foreground">{g.q1 !== null ? String(g.q1) : '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{g.q2 !== null ? String(g.q2) : '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{g.q3 !== null ? String(g.q3) : '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{String(g.targetValue)}</TableCell>
                  <TableCell><ScoreBadge score={g.score} /></TableCell>
                  <TableCell><StatusBadge status={g.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
