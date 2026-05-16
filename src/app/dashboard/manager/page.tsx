'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertTriangle, Clock, Users, Check, RotateCcw, Search, Bell, MessageSquare } from 'lucide-react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend } from 'recharts';
import { PROFILES, DEPT_TREND } from '@/lib/mock-data';
import { useGoals } from '@/lib/GoalContext';

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-4">
      <Check className="h-4 w-4" />
      {message}
    </div>
  );
}

export default function ManagerDashboard() {
  const { goals, approveGoal, returnGoal, addAuditLog } = useGoals();
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  // Per-goal inline edits (for the approval queue)
  const [editedTargets, setEditedTargets] = useState<Record<string, string>>({});
  const [editedWeights, setEditedWeights] = useState<Record<string, string>>({});
  const [returnComments, setReturnComments] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const TEAM_IDS = ['e1', 'e2', 'e3'];
  const teamGoals = goals.filter(g => TEAM_IDS.includes(g.employeeId));
  const approvalQueue = teamGoals.filter(g => g.status === 'Pending');

  const filteredQueue = approvalQueue.filter(g =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEmployee = (id: string) => PROFILES.find(p => p.id === id);

  const handleApprove = (goalId: string, originalTarget: number | string, originalWeight: number) => {
    const et = editedTargets[goalId];
    const ew = editedWeights[goalId];
    const finalTarget = et !== undefined ? (isNaN(Number(et)) ? originalTarget : Number(et)) : originalTarget;
    const finalWeight = ew !== undefined ? (isNaN(Number(ew)) ? originalWeight : Number(ew)) : originalWeight;
    approveGoal(goalId, finalTarget, finalWeight);
    showToast('Goal approved!');
  };

  const handleReturn = (goalId: string) => {
    const comment = returnComments[goalId] ?? '';
    if (!comment.trim()) {
      showToast('Please add a comment before returning.');
      return;
    }
    returnGoal(goalId, comment, 'Rahul Bose');
    setReturnComments(prev => { const n = { ...prev }; delete n[goalId]; return n; });
    showToast('Goal returned with feedback.');
  };

  const handleAcknowledge = () => {
    if (!feedbackText.trim()) { showToast('Please add feedback text first.'); return; }
    addAuditLog({
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      user: 'Rahul Bose',
      action: 'Feedback acknowledged',
      goal: 'Achieve ₹12Cr quarterly sales',
      oldValue: '—',
      newValue: feedbackText.slice(0, 40),
    });
    setFeedbackText('');
    showToast('Feedback acknowledged!');
  };

  const handleRequestMeeting = () => {
    addAuditLog({
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      user: 'Rahul Bose',
      action: 'Meeting requested',
      goal: 'Achieve ₹12Cr quarterly sales',
      oldValue: '—',
      newValue: 'Pending meeting',
    });
    showToast('Meeting request sent to employee!');
  };

  // Team scores
  const employeeScores = TEAM_IDS.map(id => {
    const emp = getEmployee(id);
    const empGoals = goals.filter(g => g.employeeId === id && g.status === 'Approved');
    const score = empGoals.length
      ? Math.round(empGoals.reduce((s, g) => s + g.score * g.weightage, 0) / empGoals.reduce((s, g) => s + g.weightage, 0))
      : 0;
    return { id, name: emp?.name ?? id, score };
  });
  const avgScore = Math.round(employeeScores.reduce((s, e) => s + e.score, 0) / employeeScores.length);

  return (
    <DashboardLayout persona="manager" title="Team Overview">
      <Toast message={toast} />

      {/* Top Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-[28px] font-[700]">{approvalQueue.length}</div>
            <p className="text-xs flex items-center text-amber-600 mt-1 font-medium">
              <AlertTriangle className="mr-1 h-3 w-3" />
              {approvalQueue.length > 0 ? 'Requires immediate action' : 'All caught up'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-[28px] font-[700]">3</div>
            <p className="text-xs text-muted-foreground mt-1">Direct reports</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Team Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-[28px] font-[700]">{avgScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Across approved goals</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Goals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-[28px] font-[700]">{teamGoals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all employees</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="col-span-1 lg:col-span-2 space-y-8">

          {/* Approval Queue */}
          <Card className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Approval Queue</CardTitle>
                <CardDescription>Review and approve goals submitted by your direct reports.</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-48 pl-8 h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueue.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No pending approvals
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQueue.map(goal => {
                      const emp = getEmployee(goal.employeeId);
                      return (
                        <>
                          <TableRow key={goal.id} className="hover:bg-muted/10">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {emp?.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{emp?.name}</span>
                                  <span className="text-xs text-muted-foreground">{emp?.department}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{goal.title}</span>
                                <span className="text-xs text-muted-foreground">{goal.thrustArea}</span>
                              </div>
                            </TableCell>
                            {/* Editable Target */}
                            <TableCell>
                              <Input
                                className="h-7 w-24 text-xs"
                                value={editedTargets[goal.id] ?? String(goal.targetValue)}
                                onChange={e => setEditedTargets(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                title="You may adjust target before approving"
                              />
                            </TableCell>
                            {/* Editable Weight */}
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Input
                                  className="h-7 w-16 text-xs"
                                  type="number"
                                  value={editedWeights[goal.id] ?? String(goal.weightage)}
                                  onChange={e => setEditedWeights(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                  title="You may adjust weightage before approving"
                                />
                                <span className="text-xs text-muted-foreground">%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                  onClick={() => handleApprove(goal.id, goal.targetValue, goal.weightage)}
                                >
                                  <Check className="h-4 w-4 mr-1" /> Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                  onClick={() => handleReturn(goal.id)}
                                >
                                  <RotateCcw className="h-4 w-4 mr-1" /> Return
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {/* Inline comment for return */}
                          <TableRow key={`${goal.id}-comment`} className="bg-muted/5">
                            <TableCell colSpan={5} className="py-2 px-6">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground shrink-0">Return note:</span>
                                <Input
                                  className="h-7 text-xs flex-1"
                                  placeholder="Required to return for rework…"
                                  value={returnComments[goal.id] ?? ''}
                                  onChange={e => setReturnComments(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                />
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                ✏️ You may adjust Target and Weightage above before approving.
                              </p>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Team Performance Graph */}
          <Card className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle>Team Trajectory</CardTitle>
              <CardDescription>Quarterly progress by department</CardDescription>
            </CardHeader>
            <CardContent className="p-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DEPT_TREND} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Legend />
                  <Line type="monotone" dataKey="Engineering" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Sales" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Operations" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column — Check-in Review Panel */}
        <div className="space-y-8">
          <Card className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle>Needs Review</CardTitle>
              <CardDescription>Quarterly check-ins pending your review.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">PS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Priya Sharma</p>
                      <p className="text-xs text-muted-foreground">Engineering</p>
                    </div>
                  </div>

                  <div className="bg-muted/40 p-3 rounded-lg border">
                    <p className="text-sm font-medium mb-1">Achieve ₹12Cr quarterly sales</p>
                    <div className="flex justify-between text-xs mb-2 text-muted-foreground">
                      <span>Current: ₹11.8Cr / ₹12Cr</span>
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">On Track</Badge>
                    </div>
                    <Progress value={98} className="h-1.5" />
                    <p className="text-xs italic text-muted-foreground border-l-2 border-primary pl-2 mt-2">
                      &quot;Q3 deals closed, tracking at ₹11.8Cr. Should hit target by month end.&quot;
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Manager Feedback</p>
                  <Textarea
                    placeholder="Add your constructive feedback here..."
                    className="resize-none"
                    rows={4}
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleAcknowledge}>
                      <Bell className="h-4 w-4 mr-2" />
                      Acknowledge
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleRequestMeeting}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Request Meeting
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team score mini-cards */}
          <Card className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle className="text-sm">Team Scores</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {employeeScores.map(e => (
                <div key={e.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{e.name}</span>
                    <span className={`font-semibold ${e.score >= 70 ? 'text-emerald-600' : e.score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                      {e.score}%
                    </span>
                  </div>
                  <Progress value={e.score} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
