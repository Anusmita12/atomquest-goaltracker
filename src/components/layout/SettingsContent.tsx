'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PROFILES } from '@/lib/mock-data';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { getSession, DemoUser } from '@/lib/auth';
import { useEffect } from 'react';

const PHASES = [
  { label: 'Goal Setting', done: true, active: false },
  { label: 'Q1 Check-in', done: true, active: false },
  { label: 'Q2 Check-in', done: true, active: false },
  { label: 'Q3 Check-in', done: false, active: true },
  { label: 'Q4 Check-in', done: false, active: false },
];

const ROLE_COLORS: Record<string, string> = {
  employee: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  manager: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  admin: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
};

export function SettingsContent({ persona }: { persona: 'employee' | 'manager' | 'admin' }) {
  const [phases, setPhases] = useState(PHASES);
  const [user, setUser] = useState<DemoUser | null>(null);
  
  useEffect(() => {
    setUser(getSession());
  }, []);

  const isAdmin = persona === 'admin';
  const isManager = persona === 'manager';

  const togglePhase = (i: number) => {
    setPhases(p => p.map((ph, idx) => idx === i ? { ...ph, active: !ph.active } : ph));
  };

  return (
    <DashboardLayout persona={persona} title="Settings">
      <div className="space-y-6">
        {/* Cycle Info */}
        <Card className="shadow-sm border-muted">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle>Current Goal Cycle</CardTitle>
            <CardDescription>FY 2025-26 · Q3 Active</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 flex-wrap">
              {phases.map((phase, i) => (
                <div key={phase.label} className="flex flex-col items-center gap-2">
                  <div className={`flex items-center justify-center h-10 w-10 rounded-full border-2 ${phase.done ? 'bg-emerald-500 border-emerald-500' : phase.active ? 'bg-amber-500 border-amber-500' : 'bg-muted border-border'}`}>
                    {phase.done ? <CheckCircle2 className="h-5 w-5 text-white" /> : phase.active ? <Circle className="h-5 w-5 text-white fill-white" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <span className="text-xs font-medium text-center">{phase.label}</span>
                  {phase.active && <Badge variant="secondary" className="text-xs">Current</Badge>}
                  {phase.done && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">Done</Badge>}
                  {isAdmin && !phase.done && (
                    <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => togglePhase(i)}>
                      {phase.active ? 'Close' : 'Open'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo User Profiles */}
        <Card className="shadow-sm border-muted">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle>Demo User Profiles</CardTitle>
            <CardDescription>Accounts configured for this hackathon demo</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {PROFILES.filter(p => {
                if (isAdmin) return true;
                if (isManager) {
                  const managerProfile = PROFILES.find(x => x.email === user?.email);
                  return p.email === user?.email || p.managerId === managerProfile?.id;
                }
                return p.email === user?.email;
              }).map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.email} · {p.department}</p>
                  </div>
                  <Badge className={`capitalize ${ROLE_COLORS[p.role]}`}>{p.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
