'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Target, CheckCircle2, AlertCircle, Clock, Plus, Search, MoreHorizontal } from 'lucide-react';
import { GoalStatus, Goal } from '@/lib/mock-data';
import { useGoals } from '@/lib/GoalContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EmployeeDashboard() {
  const { goals, activities, addGoal, submitCheckIn } = useGoals();
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add Goal Form State
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '', description: '', thrustArea: '', weightage: 10, uom: 'min', targetValue: 100, q3: 0
  });

  // Check-in Form State
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [checkInValue, setCheckInValue] = useState(0);
  const [checkInNote, setCheckInNote] = useState('');

  const EMPLOYEE_GOALS = goals.filter(g => g.employeeId === 'e1');
  const EMPLOYEE_ACTIVITIES = activities.filter(a => a.user === 'Priya Sharma');
  
  const filteredGoals = EMPLOYEE_GOALS.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.thrustArea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: GoalStatus) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">Approved</Badge>;
      case 'Pending':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">Pending</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20">Rejected</Badge>;
      case 'Completed':
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalGoals = EMPLOYEE_GOALS.length;
  const approvedGoals = EMPLOYEE_GOALS.filter(g => g.status === 'Approved').length;
  const pendingGoals = EMPLOYEE_GOALS.filter(g => g.status === 'Pending').length;
  const averageProgress = 86; // Priya's overall progress from seed data

  return (
    <DashboardLayout persona="employee" title="My Dashboard">
      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">Maximum 8 allowed</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for execution</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting manager action</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-muted">
            <div className="h-full bg-primary" style={{ width: `${averageProgress}%` }} />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress}%</div>
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
                  <DialogTrigger
                    render={
                      <Button size="sm" className="h-9">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Goal
                      </Button>
                    }
                  />
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Create New Goal</DialogTitle>
                      <DialogDescription>
                        Define your KPI. Total weightage across all goals must equal 100%.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Goal Title</Label>
                        <Input id="title" placeholder="e.g. Increase Quarterly Sales" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="desc">Description</Label>
                        <Textarea id="desc" placeholder="Brief details about the expected outcome..." value={newGoal.description} onChange={e => setNewGoal({...newGoal, description: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Thrust Area</Label>
                          <Select value={newGoal.thrustArea} onValueChange={v => setNewGoal({...newGoal, thrustArea: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Revenue">Revenue Growth</SelectItem>
                              <SelectItem value="Customer">Customer Success</SelectItem>
                              <SelectItem value="Operations">Operational Efficiency</SelectItem>
                              <SelectItem value="Learning">Learning & Dev</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Weightage (%)</Label>
                          <Input type="number" placeholder="Min 10%" value={newGoal.weightage} onChange={e => setNewGoal({...newGoal, weightage: Number(e.target.value)})} />
                          <p className="text-[10px] text-muted-foreground">Available: {100 - EMPLOYEE_GOALS.reduce((acc, g) => acc + g.weightage, 0)}%</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>UoM Type</Label>
                          <Select value={newGoal.uom} onValueChange={v => setNewGoal({...newGoal, uom: v as any})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="min">Minimum (Target)</SelectItem>
                              <SelectItem value="max">Maximum (Limit)</SelectItem>
                              <SelectItem value="timeline">Timeline (Date)</SelectItem>
                              <SelectItem value="zero">Zero (Incident)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Target</Label>
                          <Input type="number" placeholder="Value" value={String(newGoal.targetValue || '')} onChange={e => setNewGoal({...newGoal, targetValue: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Deadline</Label>
                          <Input type="date" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>Cancel</Button>
                      <Button onClick={() => {
                        if (!newGoal.title) return;
                        addGoal({
                          id: Date.now().toString(),
                          employeeId: 'e1',
                          title: newGoal.title!,
                          thrustArea: newGoal.thrustArea || 'Other',
                          weightage: Number(newGoal.weightage) || 10,
                          uom: (newGoal.uom as any) || 'min',
                          unit: 'units',
                          targetValue: newGoal.targetValue || 100,
                          status: 'Pending',
                          q1: null, q2: null, q3: 0,
                          score: 0
                        });
                        setIsAddGoalOpen(false);
                        setNewGoal({title: '', description: '', weightage: 10});
                      }}>Submit for Approval</Button>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGoals.map((goal) => {
                    return (
                      <TableRow key={goal.id} className="hover:bg-muted/10 transition-colors text-sm">
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{goal.title}</span>
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
                        <TableCell>{getStatusBadge(goal.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle>Quarterly Check-in</CardTitle>
              <CardDescription>Update your progress for the current quarter.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Select Goal</Label>
                <Select onValueChange={(v) => {
                  setSelectedGoalId(v);
                  const g = EMPLOYEE_GOALS.find(x => x.id === v);
                  if (g) setCheckInValue(Number(g.q3) || 0);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose goal to update" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYEE_GOALS.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>New Value / Actual</Label>
                <Input type="number" placeholder="Enter current value" value={checkInValue} onChange={e => setCheckInValue(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Quick Update / Note</Label>
                <Textarea 
                  placeholder="Add a brief comment on your progress..." 
                  className="resize-none" 
                  rows={3} 
                  value={checkInNote}
                  onChange={(e) => setCheckInNote(e.target.value)}
                />
              </div>
              <Button 
                className="w-full"
                onClick={() => {
                  // Find the selected goal's ID from the previous select... we need state for selectedGoalId
                  if (selectedGoalId) {
                    submitCheckIn(selectedGoalId, checkInValue, checkInNote);
                    setCheckInNote('');
                  }
                }}
              >
                Submit Check-in
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {EMPLOYEE_ACTIVITIES.map((activity, index) => (
                  <div key={activity.id} className="relative pl-6">
                    {index !== EMPLOYEE_ACTIVITIES.length - 1 && (
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
