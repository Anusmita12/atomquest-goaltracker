'use client';
import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Send } from 'lucide-react';
import { useGoals, computeScore } from '@/lib/GoalContext';
import { StatusBadge } from '@/components/ui/status-badge';

function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
      <Check className="h-4 w-4" />
      {message}
    </div>
  );
}

function ScorePill({ score }: { score: number }) {
  const cls = score >= 70 ? 'bg-emerald-100 text-emerald-700' : score >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
  return <Badge className={`${cls} border-0 text-xs`}>{score}%</Badge>;
}

const EMPLOYEE_ID = 'e1';

export default function EmployeeCheckinsPage() {
  const { goals, submitAllCheckIns } = useGoals();
  const [toast, setToast] = useState('');

  const employeeGoals = goals.filter(g => g.employeeId === EMPLOYEE_ID);

  // Local editable Q3 values — initialized from context
  const [q3Values, setQ3Values] = useState<Record<string, string>>(() =>
    Object.fromEntries(employeeGoals.map(g => [g.id, g.q3 !== null ? String(g.q3) : '']))
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Live score per row based on local q3 input
  const liveScore = (goalId: string) => {
    const goal = employeeGoals.find(g => g.id === goalId);
    if (!goal) return 0;
    const raw = q3Values[goalId];
    if (raw === '' || raw === undefined) return 0;
    const val = Number(raw);
    return computeScore({ ...goal, q3: isNaN(val) ? null : val });
  };

  const handleSaveAll = () => {
    const updates = employeeGoals
      .map(g => ({ goalId: g.id, q3: Number(q3Values[g.id] ?? g.q3) }))
      .filter(u => !isNaN(u.q3));
    submitAllCheckIns(updates);
    showToast('Check-ins saved!');
  };

  return (
    <DashboardLayout persona="employee" title="Quarterly Check-ins">
      <Toast message={toast} />
      <Card className="shadow-sm border-muted">
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <div>
            <CardTitle>Q3 2026 Check-in</CardTitle>
            <CardDescription>Enter your Q3 actual achievements. Score updates live as you type.</CardDescription>
          </div>
          <Button size="sm" onClick={handleSaveAll}>
            <Send className="h-4 w-4 mr-1" />Save All Check-ins
          </Button>
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
                <TableHead>Live Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeGoals.map(goal => (
                <TableRow key={goal.id} className="hover:bg-muted/10">
                  <TableCell className="font-medium text-sm">{goal.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {goal.unit === '₹'
                      ? `₹${(Number(goal.targetValue) / 1000000).toFixed(0)}Cr`
                      : `${goal.targetValue} ${goal.unit}`}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {goal.q1 !== null
                      ? (goal.unit === '₹' ? `₹${(Number(goal.q1) / 1000000).toFixed(2)}Cr` : String(goal.q1))
                      : '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {goal.q2 !== null
                      ? (typeof goal.q2 === 'string' ? goal.q2 : goal.unit === '₹' ? `₹${(Number(goal.q2) / 1000000).toFixed(2)}Cr` : String(goal.q2))
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {goal.uom === 'timeline' ? (
                      <Input
                        className="h-8 w-48 text-sm"
                        value={q3Values[goal.id] ?? ''}
                        onChange={e => setQ3Values(prev => ({ ...prev, [goal.id]: e.target.value }))}
                        placeholder="e.g. Completed 28 Sep 2025"
                      />
                    ) : (
                      <Input
                        className="h-8 w-28 text-sm"
                        type="number"
                        value={q3Values[goal.id] ?? ''}
                        onChange={e => setQ3Values(prev => ({ ...prev, [goal.id]: e.target.value }))}
                        placeholder="Enter value"
                      />
                    )}
                  </TableCell>
                  <TableCell><ScorePill score={liveScore(goal.id)} /></TableCell>
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
