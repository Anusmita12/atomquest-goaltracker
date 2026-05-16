'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PROFILES, PRIYA_GOALS, ARJUN_GOALS, NEHA_GOALS } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';
import { Check, RotateCcw, AlertTriangle } from 'lucide-react';

const TEAM = [
  { emp: PROFILES[0], goals: PRIYA_GOALS, score: 86, pendingGoal: PRIYA_GOALS.find(g => g.status === 'Pending') },
  { emp: PROFILES[1], goals: ARJUN_GOALS, score: 95, pendingGoal: null },
  { emp: PROFILES[2], goals: NEHA_GOALS, score: 67, pendingGoal: null },
];

export default function ManagerTeamPage() {
  const [comment, setComment] = useState('');

  return (
    <DashboardLayout persona="manager" title="My Team">
      <div className="grid gap-6 md:grid-cols-3">
        {TEAM.map(({ emp, goals, score }) => (
          <Card key={emp.id} className="shadow-sm border-muted">
            <CardContent className="pt-6 pb-4 flex flex-col items-center text-center gap-2">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-base">{emp.name}</p>
                <p className="text-sm text-muted-foreground">{emp.department}</p>
              </div>
              <div className="w-full mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Overall Score</span>
                  <span className="font-semibold">{score}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">{goals.length} goals · Last activity: {emp.lastActivity}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Approval */}
      {TEAM.filter(t => t.pendingGoal).map(({ emp, pendingGoal }) => pendingGoal && (
        <Card key={emp.id} className="shadow-sm border-amber-200 bg-amber-50/30 dark:bg-amber-950/10">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Pending Approval — {emp.name}
            </CardTitle>
            <CardDescription>{pendingGoal.title}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-muted-foreground text-xs">Thrust Area</p><p className="font-medium">{pendingGoal.thrustArea}</p></div>
              <div><p className="text-muted-foreground text-xs">Weightage</p><p className="font-medium">{pendingGoal.weightage}%</p></div>
              <div><p className="text-muted-foreground text-xs">Deadline</p><p className="font-medium">{pendingGoal.deadline ?? '—'}</p></div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Comment (optional)</p>
              <Textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Add a note to the employee..."
                className="resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Check className="h-4 w-4 mr-2" />Approve Goal
              </Button>
              <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                <RotateCcw className="h-4 w-4 mr-2" />Return for Rework
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </DashboardLayout>
  );
}
