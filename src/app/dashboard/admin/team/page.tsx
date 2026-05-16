'use client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PROFILES, PRIYA_GOALS, ARJUN_GOALS, NEHA_GOALS } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';

const ORG_DATA = [
  { emp: PROFILES[0], manager: 'Rahul Bose', goals: PRIYA_GOALS, score: 86 },
  { emp: PROFILES[1], manager: 'Rahul Bose', goals: ARJUN_GOALS, score: 95 },
  { emp: PROFILES[2], manager: 'Rahul Bose', goals: NEHA_GOALS, score: 67 },
];

export default function AdminTeamPage() {
  return (
    <DashboardLayout persona="admin" title="Organisation Roster">
      <Card className="shadow-sm border-muted">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle>All Employees — Grouped by Manager</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 py-3 bg-muted/20 border-b">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Manager: Rahul Bose</p>
          </div>
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Goals</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ORG_DATA.map(({ emp, manager, goals, score }) => (
                <TableRow key={emp.id} className="hover:bg-muted/10">
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell className="text-muted-foreground">{manager}</TableCell>
                  <TableCell className="text-muted-foreground">{emp.department}</TableCell>
                  <TableCell>{goals.length}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={score} className="h-1.5 w-20" />
                      <span className="text-sm font-medium">{score}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{emp.lastActivity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
