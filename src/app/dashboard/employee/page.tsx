'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Target, CheckCircle2, AlertCircle, Clock, Plus, Search, Check, Lock } from 'lucide-react';
import { GoalStatus, Goal } from '@/lib/mock-data';
import { useGoals, computeOverall } from '@/lib/GoalContext';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const STATUS_STYLES: Record<string, string> = {
  Approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Returned: 'bg-red-500/10 text-red-600 border-red-500/20',
  Draft: 'bg-slate-100 text-slate-600 border-slate-200',
  Submitted: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function EmployeeDashboard() {
  const { goals, auditLogs, addGoal, submitCheckIn } = useGoals();
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');

  // Add Goal form
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '', description: '', thrustArea: 'Revenue', weightage: 10, uom: 'min', targetValue: 100,
  });
  const [formError, setFormError] = useState('');

  // Check-in form
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [checkInValue, setCheckInValue] = useState(0);
  const [checkInNote, setCheckInNote] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const EMPLOYEE_ID = 'e1';
  const EMPLOYEE_GOALS = goals.filter(g => g.employeeId === EMPLOYEE_ID);
  const employeeGoalTitles = EMPLOYEE_GOALS.map(g => g.title);
  const EMPLOYEE_ACTIVITIES = auditLogs.filter(a => a.user === 'Employee' || a.user === 'Priya Sharma' || (a.goal && employeeGoalTitles.includes(a.goal)));

  const filteredGoals = EMPLOYEE_GOALS.filter(g =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.thrustArea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalGoals = EMPLOYEE_GOALS.length;
  const approvedGoals = EMPLOYEE_GOALS.filter(g => g.status === 'Approved').length;
  const pendingGoals = EMPLOYEE_GOALS.filter(g => g.status === 'Pending').length;
  const overallProgress = computeOverall(EMPLOYEE_GOALS.filter(g => g.status === 'Approved'));

  const handleAddGoal = () => {
    setFormError('');
    if (!newGoal.title?.trim()) { setFormError('Goal title is required.'); return; }
    if (totalGoals >= 8) { setFormError('Maximum 8 goals allowed.'); return; }
    const usedWeight = EMPLOYEE_GOALS.reduce((s, g) => s + g.weightage, 0);
    const newWeight = Number(newGoal.weightage) || 10;
    if (usedWeight + newWeight > 100) { setFormError(`Only ${100 - usedWeight}% weightage remaining.`); return; }
    if (newWeight < 10) { setFormError('Minimum weightage is 10%.'); return; }

    addGoal({
      id: `e1_${Date.now()}`,
      employeeId: EMPLOYEE_ID,
      title: newGoal.title!,
      description: newGoal.description,
      thrustArea: newGoal.thrustArea || 'Revenue',
      weightage: newWeight,
      uom: (newGoal.uom as Goal['uom']) || 'min',
      unit: newGoal.uom === 'timeline' ? 'date' : 'units',
      targetValue: newGoal.uom === 'zero' ? 0 : newGoal.targetValue || 100,
      deadline: newGoal.deadline,
      status: 'Draft',
      q1: null, q2: null, q3: null,
      score: 0,
    });
    setIsAddGoalOpen(false);
    setNewGoal({ title: '', description: '', thrustArea: 'Revenue', weightage: 10, uom: 'min', targetValue: 100 });
    showToast('Goal added successfully!');
  };

  const handleSubmitCheckIn = () => {
    if (!selectedGoalId) { showToast('Please select a goal first.'); return; }
    submitCheckIn(selectedGoalId, checkInValue, checkInNote);
    setCheckInNote('');
    showToast('Check-in saved!');
  };

  return (
    <DashboardLayout persona="employee" title="My Dashboard">
      <Toast message={toast} />

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-[28px] font-[700]">{totalGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">Maximum 8 allowed</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-[28px] font-[700]">{approvedGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for execution</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-[28px] font-[700]">{pendingGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting manager action</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-muted">
            <div className="h-full bg-primary" style={{ width: `${overallProgress}%` }} />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-[28px] font-[700]">{overallProgress}%</div>
            <p className="text-xs text-muted-foreground mt-1">Q3 2026 Target</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2 space-y-8">
          <Card className="shadow-sm border-muted">
            <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
              <div className="space-y-1">
                <CardTitle>My Goals</CardTitle>
                <CardDescription>Manage and track your KPIs for the current quarter.</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Filter..."
                    className="w-48 pl-8 h-9 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
                  <DialogTrigger render={
                    <Button size="sm" className="h-9">
                      <Plus className="h-4 w-4 mr-2" />Add Goal
                    </Button>
                  } />
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Create New Goal</DialogTitle>
                      <DialogDescription>Define your KPI. Total weightage must equal 100%.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {formError && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">{formError}</p>
                      )}
                      <div className="space-y-2">
                        <Label>Goal Title *</Label>
                        <Input placeholder="e.g. Increase Quarterly Sales" value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea placeholder="Brief details..." value={newGoal.description} onChange={e => setNewGoal({ ...newGoal, description: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Thrust Area</Label>
                          <Select value={newGoal.thrustArea} onValueChange={v => setNewGoal({ ...newGoal, thrustArea: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {['Revenue', 'Cost', 'Quality', 'People', 'Innovation'].map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Weightage (%)</Label>
                          <Input
                            type="number"
                            placeholder="Min 10%"
                            value={newGoal.weightage}
                            onChange={e => setNewGoal({ ...newGoal, weightage: Number(e.target.value) })}
                          />
                          <p className="text-[10px] text-muted-foreground">
                            Available: {100 - EMPLOYEE_GOALS.reduce((acc, g) => acc + g.weightage, 0)}%
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>UoM Type</Label>
                          <Select value={newGoal.uom} onValueChange={v => setNewGoal({ ...newGoal, uom: v as Goal['uom'] })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="min">Minimum (Target)</SelectItem>
                              <SelectItem value="max">Maximum (Limit)</SelectItem>
                              <SelectItem value="timeline">Timeline (Date)</SelectItem>
                              <SelectItem value="zero">Zero (Incident)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {newGoal.uom !== 'zero' && (
                          <div className="space-y-2">
                            <Label>{newGoal.uom === 'timeline' ? 'Target Date' : 'Target'}</Label>
                            {newGoal.uom === 'timeline'
                              ? <Input type="date" onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value, targetValue: e.target.value })} />
                              : <Input type="number" value={String(newGoal.targetValue || '')} onChange={e => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })} />
                            }
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddGoal}>Save Goal</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[300px]">Goal Title</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGoals.map((goal) => (
                    <TableRow key={goal.id} className="hover:bg-muted/10 transition-colors text-sm">
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span>{goal.title}</span>
                            {goal.isShared && (
                              <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px] px-1.5 py-0">
                                <Lock className="h-2.5 w-2.5 mr-0.5" />Shared
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground font-normal">{goal.thrustArea}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{goal.weightage}%</TableCell>
                      <TableCell>
                        <div className="w-[120px] flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] font-medium">
                            <span>{goal.score}%</span>
                          </div>
                          <Progress value={goal.score} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${STATUS_STYLES[goal.status] ?? 'bg-slate-100 text-slate-600'} border text-xs`}>
                          {goal.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Check-in Widget */}
          <Card className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle>Quarterly Check-in</CardTitle>
              <CardDescription>Update your progress for the current quarter.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Select Goal</Label>
                <Select onValueChange={(v) => {
                  setSelectedGoalId(v as string);
                  const g = EMPLOYEE_GOALS.find(x => x.id === v);
                  if (g) setCheckInValue(Number(g.q3) || 0);
                }}>
                  <SelectTrigger><SelectValue placeholder="Choose goal to update" /></SelectTrigger>
                  <SelectContent>
                    {EMPLOYEE_GOALS.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>New Value / Actual</Label>
                <Input
                  type="number"
                  placeholder="Enter current value"
                  value={checkInValue}
                  onChange={e => setCheckInValue(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Note</Label>
                <Textarea
                  placeholder="Brief comment on your progress..."
                  className="resize-none"
                  rows={3}
                  value={checkInNote}
                  onChange={(e) => setCheckInNote(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleSubmitCheckIn}>
                Submit Check-in
              </Button>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {EMPLOYEE_ACTIVITIES.slice(0, 5).map((activity, index) => (
                  <div key={activity.id} className="relative pl-6">
                    {index !== Math.min(EMPLOYEE_ACTIVITIES.length, 5) - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-border" />
                    )}
                    <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <div className="flex items-center text-xs text-muted-foreground space-x-2">
                        <span>{activity.timestamp}</span>
                        <span>•</span>
                        <span>{activity.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
