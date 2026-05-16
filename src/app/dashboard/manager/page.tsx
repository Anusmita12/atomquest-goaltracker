'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, CheckCircle, Clock, Users, ArrowUpRight, ArrowDownRight, Check, X, Search } from 'lucide-react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { PROFILES, DEPT_TREND } from '@/lib/mock-data';
import { useGoals } from '@/lib/GoalContext';

export default function ManagerDashboard() {
  const { goals, updateGoal } = useGoals();
  const [searchQuery, setSearchQuery] = useState('');

  // Get direct reports (Priya e1, Arjun e2, Neha e3)
  const TEAM_IDS = ['e1', 'e2', 'e3'];
  const teamGoals = goals.filter(g => TEAM_IDS.includes(g.employeeId));
  const approvalQueue = teamGoals.filter(g => g.status === 'Pending');
  
  const filteredQueue = approvalQueue.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEmployee = (id: string) => PROFILES.find(p => p.id === id);
  
  const handleApproval = (id: string, status: 'Approved' | 'Rejected') => {
    updateGoal(id, { status });
  };

  return (
    <DashboardLayout persona="manager" title="Team Overview">
      {/* Top Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalQueue.length}</div>
            <p className="text-xs flex items-center text-amber-600 mt-1 font-medium">
              <AlertTriangle className="mr-1 h-3 w-3" />
              {approvalQueue.length > 0 ? 'Requires immediate action' : 'All caught up'}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Completion Rate</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs flex items-center text-emerald-600 mt-1 font-medium">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +5% from last week
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Check-ins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs flex items-center text-muted-foreground mt-1">
              Neha Kapoor
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Goals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs flex items-center text-red-600 mt-1 font-medium">
              <ArrowDownRight className="mr-1 h-3 w-3" />
              Needs intervention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          
          {/* Approval Queue Table */}
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
                  placeholder="Search employee..." 
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
                    <TableHead>Goal Details</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueue.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No pending approvals</TableCell>
                    </TableRow>
                  ) : (
                    filteredQueue.map(goal => {
                      const emp = getEmployee(goal.employeeId);
                      return (
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
                                <span className="text-xs text-muted-foreground">{emp?.role}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{goal.title}</span>
                              <span className="text-xs text-muted-foreground">{goal.thrustArea}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-muted-foreground">{goal.weightage}%</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/50"
                                onClick={() => handleApproval(goal.id, 'Approved')}
                              >
                                <Check className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 dark:bg-red-950/30 dark:border-red-900/50"
                                onClick={() => handleApproval(goal.id, 'Rejected')}
                              >
                                <X className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
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
              <CardDescription>Quarterly progress vs Target</CardDescription>
            </CardHeader>
            <CardContent className="p-6 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
<LineChart data={DEPT_TREND} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="Engineering" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Sales" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Operations" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Check-in Review Panel */}
          <Card className="shadow-sm border-muted flex flex-col h-full">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle>Needs Review</CardTitle>
              <CardDescription>Quarterly check-ins pending your review.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1">
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
                  
                  <div className="bg-muted/40 p-3 rounded-lg border border-border">
                    <p className="text-sm font-medium mb-1">Achieve ₹12Cr quarterly sales</p>
                    <div className="flex justify-between text-xs mb-2 text-muted-foreground">
                      <span>Current: ₹11.8Cr / ₹12Cr</span>
                      <span className="font-medium text-emerald-600">On Track</span>
                    </div>
                    <Progress value={98} className="h-1.5 mb-2" />
                    <p className="text-xs italic text-muted-foreground border-l-2 border-primary pl-2 mt-2">
                      &quot;Q3 deals closed, tracking at ₹11.8Cr. Should hit target by month end.&quot;
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-sm font-medium">Manager Feedback</p>
                  <Textarea placeholder="Add your constructive feedback here..." className="resize-none" rows={4} />
                  <div className="flex gap-2">
                    <Button className="flex-1">Acknowledge</Button>
                    <Button variant="outline" className="flex-1">Request Meeting</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}
