'use client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PRIYA_GOALS } from '@/lib/mock-data';
import { StatusBadge, ScoreBadge } from '@/components/ui/status-badge';
import { Plus, Send } from 'lucide-react';

import { useGoals } from '@/lib/GoalContext';

export default function EmployeeGoalsPage() {
  const { goals } = useGoals();
  const employeeGoals = goals.filter(g => g.employeeId === 'e1');
  const totalWeight = employeeGoals.reduce((s, g) => s + g.weightage, 0);
  const approved = employeeGoals.filter(g => g.status === 'Approved').length;

  return (
    <DashboardLayout persona="employee" title="My Goals">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Goals', value: employeeGoals.length },
          { label: 'Approved', value: approved },
          { label: 'Pending', value: employeeGoals.filter(g => g.status === 'Pending').length },
          { label: 'Weight Used', value: `${totalWeight}%` },
        ].map(c => (
          <Card key={c.label} className="shadow-sm border-muted">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="text-2xl font-bold mt-1">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-muted">
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <div>
            <CardTitle>Goal Sheet — FY 2025-26</CardTitle>
            <CardDescription>Current quarter: Q3 2026</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" />Add Goal</Button>
            <Button size="sm"><Send className="h-4 w-4 mr-1" />Submit for Approval</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Thrust Area</TableHead>
                <TableHead className="w-[260px]">Goal Title</TableHead>
                <TableHead>UoM</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Q3 Actual</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeGoals.map(goal => (
                <TableRow key={goal.id} className="hover:bg-muted/10">
                  <TableCell>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {goal.thrustArea}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{goal.title}</TableCell>
                  <TableCell className="text-xs text-muted-foreground uppercase">{goal.uom}</TableCell>
                  <TableCell className="text-sm">
                    {typeof goal.targetValue === 'number'
                      ? goal.unit === '₹'
                        ? `₹${(goal.targetValue as number / 1000000).toFixed(0)}Cr`
                        : `${goal.targetValue} ${goal.unit}`
                      : goal.targetValue}
                  </TableCell>
                  <TableCell>{goal.weightage}%</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {goal.q3 !== null
                      ? typeof goal.q3 === 'string'
                        ? goal.q3
                        : goal.unit === '₹'
                          ? `₹${((goal.q3 as number) / 1000000).toFixed(1)}Cr`
                          : `${goal.q3} ${goal.unit}`
                      : '—'}
                  </TableCell>
                  <TableCell><ScoreBadge score={goal.score} /></TableCell>
                  <TableCell><StatusBadge status={goal.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="border-t px-6 py-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Total Weightage</span>
            <span className={`font-semibold ${totalWeight === 100 ? 'text-emerald-600' : 'text-red-600'}`}>{totalWeight}%</span>
          </div>
          <Progress value={totalWeight} className="h-2" />
        </div>
      </Card>
    </DashboardLayout>
  );
}
