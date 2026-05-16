'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, RotateCcw, AlertTriangle, Share2 } from 'lucide-react';
import { PROFILES, Goal } from '@/lib/mock-data';
import { useGoals } from '@/lib/GoalContext';

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
      <Check className="h-4 w-4" />
      {message}
    </div>
  );
}

const TEAM_MEMBERS = [
  { id: 'e1', name: 'Priya Sharma', initials: 'PS' },
  { id: 'e2', name: 'Arjun Mehta', initials: 'AM' },
  { id: 'e3', name: 'Neha Kapoor', initials: 'NK' },
];

export default function ManagerTeamPage() {
  const { goals, approveGoal, returnGoal, saveComment, pushSharedGoal } = useGoals();
  const [toast, setToast] = useState('');

  // Per-goal states
  const [comments, setComments] = useState<Record<string, string>>({});
  const [returnNotes, setReturnNotes] = useState<Record<string, string>>({});
  const [editedTargets, setEditedTargets] = useState<Record<string, string>>({});
  const [editedWeights, setEditedWeights] = useState<Record<string, string>>({});

  // Shared Goal form
  const [sharedTitle, setSharedTitle] = useState('');
  const [sharedThrust, setSharedThrust] = useState('Revenue');
  const [sharedUom, setSharedUom] = useState<Goal['uom']>('min');
  const [sharedTarget, setSharedTarget] = useState('');
  const [sharedDeadline, setSharedDeadline] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const getEmpGoals = (empId: string) => goals.filter(g => g.employeeId === empId);
  const getPendingGoals = (empId: string) => goals.filter(g => g.employeeId === empId && g.status === 'Pending');

  const calcScore = (empId: string) => {
    const eg = getEmpGoals(empId).filter(g => g.status === 'Approved');
    if (!eg.length) return 0;
    const totalW = eg.reduce((s, g) => s + g.weightage, 0);
    return totalW ? Math.round(eg.reduce((s, g) => s + g.score * g.weightage, 0) / totalW) : 0;
  };

  const handleApprove = (goalId: string, originalTarget: number | string, originalWeight: number) => {
    const et = editedTargets[goalId];
    const ew = editedWeights[goalId];
    const finalTarget = et !== undefined ? Number(et) || originalTarget : originalTarget;
    const finalWeight = ew !== undefined ? Number(ew) || originalWeight : originalWeight;
    approveGoal(goalId, finalTarget, finalWeight);
    showToast('Goal approved!');
  };

  const handleReturn = (goalId: string) => {
    const note = returnNotes[goalId] ?? '';
    if (!note.trim()) { showToast('Add a comment before returning.'); return; }
    returnGoal(goalId, note, 'Rahul Bose');
    setReturnNotes(prev => { const n = { ...prev }; delete n[goalId]; return n; });
    showToast('Goal returned with feedback.');
  };

  const handleSaveComments = (empId: string) => {
    const empGoals = getEmpGoals(empId);
    let saved = 0;
    empGoals.forEach(g => {
      if (comments[g.id]?.trim()) {
        saveComment(g.id, 'm1', comments[g.id]);
        saved++;
      }
    });
    if (saved === 0) { showToast('No comments to save.'); return; }
    showToast(`${saved} comment(s) saved!`);
  };

  const toggleRecipient = (id: string) => {
    setSelectedRecipients(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handlePushSharedGoal = () => {
    if (!sharedTitle.trim()) { showToast('Goal title is required.'); return; }
    if (selectedRecipients.length === 0) { showToast('Select at least one recipient.'); return; }
    pushSharedGoal(
      {
        title: sharedTitle,
        thrustArea: sharedThrust,
        uom: sharedUom,
        targetValue: sharedUom === 'timeline' ? sharedDeadline : Number(sharedTarget) || 0,
        unit: sharedUom === 'timeline' ? 'date' : 'units',
        deadline: sharedUom === 'timeline' ? sharedDeadline : undefined,
      },
      selectedRecipients
    );
    showToast(`Shared goal pushed to ${selectedRecipients.length} employee(s)!`);
    setSharedTitle('');
    setSharedTarget('');
    setSharedDeadline('');
    setSelectedRecipients([]);
  };

  return (
    <DashboardLayout persona="manager" title="My Team">
      <Toast message={toast} />

      {/* Team Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {TEAM_MEMBERS.map(({ id, name, initials }) => {
          const emp = PROFILES.find(p => p.id === id);
          const score = calcScore(id);
          const goalsCount = getEmpGoals(id).length;
          return (
            <Card key={id} className="shadow-sm border-muted">
              <CardContent className="pt-6 pb-4 flex flex-col items-center text-center gap-2">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-base">{name}</p>
                  <p className="text-sm text-muted-foreground">{emp?.department}</p>
                </div>
                <div className="w-full mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Overall Score</span>
                    <span className={`font-semibold ${score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                      {score}%
                    </span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground">{goalsCount} goals · Last activity: {emp?.lastActivity}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Approvals per employee */}
      {TEAM_MEMBERS.map(({ id, name }) => {
        const pending = getPendingGoals(id);
        if (!pending.length) return null;
        return (
          <Card key={id} className="shadow-sm border-amber-200 bg-amber-50/30">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-amber-700 text-base">
                <AlertTriangle className="h-5 w-5" />
                Pending Approval — {name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {pending.map(goal => (
                <div key={goal.id} className="border rounded-lg p-4 space-y-3 bg-white">
                  <div>
                    <p className="font-medium text-sm">{goal.title}</p>
                    <p className="text-xs text-muted-foreground">{goal.thrustArea} · {goal.uom.toUpperCase()}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Thrust Area</p>
                      <p className="text-sm font-medium">{goal.thrustArea}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Target (editable)</p>
                      <Input
                        className="h-7 text-xs"
                        value={editedTargets[goal.id] ?? String(goal.targetValue)}
                        onChange={e => setEditedTargets(prev => ({ ...prev, [goal.id]: e.target.value }))}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Weight % (editable)</p>
                      <Input
                        className="h-7 text-xs"
                        type="number"
                        value={editedWeights[goal.id] ?? String(goal.weightage)}
                        onChange={e => setEditedWeights(prev => ({ ...prev, [goal.id]: e.target.value }))}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-700 bg-amber-50 rounded px-2 py-1">
                    ✏️ You may adjust target and weightage before approving.
                  </p>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Comment (required to return)</p>
                    <Textarea
                      className="resize-none text-xs"
                      rows={2}
                      placeholder="Add a note to the employee..."
                      value={returnNotes[goal.id] ?? ''}
                      onChange={e => setReturnNotes(prev => ({ ...prev, [goal.id]: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleApprove(goal.id, goal.targetValue, goal.weightage)}
                    >
                      <Check className="h-4 w-4 mr-2" />Approve Goal
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleReturn(goal.id)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />Return for Rework
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Check-in Comments Table per employee */}
      {TEAM_MEMBERS.map(({ id, name }) => {
        const empGoals = getEmpGoals(id);
        return (
          <Card key={`comments-${id}`} className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle className="text-base">{name} — Check-in Review</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-xs text-muted-foreground uppercase">Goal</th>
                    <th className="px-4 py-3 text-left font-medium text-xs text-muted-foreground uppercase">Q3</th>
                    <th className="px-4 py-3 text-left font-medium text-xs text-muted-foreground uppercase">Score</th>
                    <th className="px-4 py-3 text-left font-medium text-xs text-muted-foreground uppercase w-[220px]">Manager Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {empGoals.map(g => (
                    <tr key={g.id} className={`border-t ${g.score < 60 ? 'bg-red-50/40' : ''}`}>
                      <td className="px-6 py-3 font-medium">{g.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{g.q3 !== null ? String(g.q3) : '—'}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${g.score >= 70 ? 'bg-emerald-100 text-emerald-700' : g.score >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {g.score}%
                        </Badge>
                      </td>
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
                <Button size="sm" onClick={() => handleSaveComments(id)}>Save Comments</Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Push Shared Goal */}
      <Card className="shadow-sm border-muted">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Push Shared Goal
          </CardTitle>
          <CardDescription>Create a goal and push it to your direct reports. Employees can only edit the weightage.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <p className="text-sm font-medium">Goal Title *</p>
              <Input placeholder="e.g. Improve NPS Score by 20%" value={sharedTitle} onChange={e => setSharedTitle(e.target.value)} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Thrust Area</p>
              <Select value={sharedThrust} onValueChange={setSharedThrust}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Revenue', 'Cost', 'Quality', 'People', 'Innovation'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">UoM Type</p>
              <Select value={sharedUom} onValueChange={v => setSharedUom(v as Goal['uom'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="min">Minimum (Target)</SelectItem>
                  <SelectItem value="max">Maximum (Limit)</SelectItem>
                  <SelectItem value="timeline">Timeline (Date)</SelectItem>
                  <SelectItem value="zero">Zero (Incidents)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {sharedUom !== 'zero' && (
              <div className="space-y-1">
                <p className="text-sm font-medium">{sharedUom === 'timeline' ? 'Target Date' : 'Target Value'}</p>
                {sharedUom === 'timeline'
                  ? <Input type="date" value={sharedDeadline} onChange={e => setSharedDeadline(e.target.value)} />
                  : <Input type="number" placeholder="Enter target" value={sharedTarget} onChange={e => setSharedTarget(e.target.value)} />
                }
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Select Recipients</p>
            <div className="flex gap-4">
              {TEAM_MEMBERS.map(({ id, name }) => (
                <label key={id} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={selectedRecipients.includes(id)}
                    onChange={() => toggleRecipient(id)}
                    className="rounded"
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={handlePushSharedGoal}>
            <Share2 className="h-4 w-4 mr-2" />
            Push to Selected Employees ({selectedRecipients.length} selected)
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
