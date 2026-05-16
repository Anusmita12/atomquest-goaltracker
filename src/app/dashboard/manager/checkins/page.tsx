'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { PROFILES } from '@/lib/mock-data';
import { useGoals } from '@/lib/GoalContext';
import { cn } from '@/lib/utils';
import { StatusBadge, ScoreBadge } from '@/components/ui/status-badge';

function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
      <Check className="h-4 w-4" />
      {message}
    </div>
  );
}

const TEAM_MEMBER_IDS = ['e1', 'e2', 'e3'];

export default function ManagerCheckinsPage() {
  const { goals, saveComment } = useGoals();
  const [comments, setComments] = useState<Record<string, string>>({});
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSaveComments = (empId: string) => {
    const empGoals = goals.filter(g => g.employeeId === empId);
    let saved = 0;
    empGoals.forEach(g => {
      if (comments[g.id]?.trim()) {
        saveComment(g.id, 'm1', comments[g.id]);
        saved++;
      }
    });
    showToast(saved > 0 ? `${saved} comment(s) saved!` : 'No comments to save.');
  };

  return (
    <DashboardLayout persona="manager" title="Team Check-ins — Q3 2026">
      <Toast message={toast} />
      <div className="space-y-6">
        {TEAM_MEMBER_IDS.map(empId => {
          const employee = PROFILES.find(p => p.id === empId);
          const empGoals = goals.filter(g => g.employeeId === empId);
          return (
            <Card key={empId} className="shadow-sm border-muted">
              <CardHeader className="border-b px-6 py-4">
                <CardTitle className="text-base">{employee?.name} — {employee?.department}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Goal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Q1</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Q2</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Q3</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Score</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase w-[200px]">Manager Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empGoals.map(g => (
                      <tr key={g.id} className={cn('border-t hover:bg-muted/10', g.score < 60 && 'bg-red-50/40')}>
                        <td className={cn('px-6 py-3 font-medium', g.score < 60 && 'text-red-700')}>{g.title}</td>
                        <td className="px-4 py-3 text-muted-foreground">{g.q1 ?? '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{g.q2 !== null ? String(g.q2) : '—'}</td>
                        <td className="px-4 py-3">
                          {g.q3 !== null ? String(g.q3) : <span className="text-red-500 text-xs font-medium">Missing</span>}
                        </td>
                        <td className="px-4 py-3"><ScoreBadge score={g.score} /></td>
                        <td className="px-4 py-3"><StatusBadge status={g.status} /></td>
                        <td className="px-4 py-3">
                          <Textarea
                            className="h-14 text-xs resize-none"
                            placeholder="Add comment..."
                            value={comments[g.id] ?? ''}
                            onChange={e => setComments(prev => ({ ...prev, [g.id]: e.target.value }))}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-6 py-3 flex justify-end border-t">
                  <Button size="sm" onClick={() => handleSaveComments(empId)}>Save Comments</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
