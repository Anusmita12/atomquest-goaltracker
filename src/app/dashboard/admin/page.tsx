'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { THRUST_DISTRIBUTION } from '@/lib/mock-data';
import { useGoals } from '@/lib/GoalContext';
const ORG_COMPLETION_DATA = THRUST_DISTRIBUTION.map((d, i) => ({ ...d, fill: ['#6366f1','#f59e0b','#10b981','#3b82f6','#f43f5e'][i] }));
import { Download, FileSpreadsheet, FileText, Lock, Unlock, Settings, Users, Activity, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function AdminDashboard() {
  const { activities } = useGoals();
  const ADMIN_AUDIT_LOGS = activities;
  return (
    <DashboardLayout persona="admin" title="Organization Overview">
      {/* KPI Cards Row */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Card className="shadow-sm border-muted">
          <CardContent className="p-6">
            <div className="flex justify-between items-start space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Org Completion</p>
                <p className="text-2xl font-bold">72%</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-md">
                <Target className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Overall Q3 progress</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-muted">
          <CardContent className="p-6">
            <div className="flex justify-between items-start space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Cycles</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-md">
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Q3 2026</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardContent className="p-6">
            <div className="flex justify-between items-start space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Delayed Reviews</p>
                <p className="text-2xl font-bold text-red-600">14</p>
              </div>
              <div className="p-2 bg-red-500/10 rounded-md">
                <Users className="h-4 w-4 text-red-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Escalate to managers</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardContent className="p-6">
            <div className="flex justify-between items-start space-y-0 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Locked Sheets</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-md">
                <Lock className="h-4 w-4 text-amber-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Of total workforce</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted bg-primary text-primary-foreground border-transparent">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="space-y-1">
              <p className="text-sm font-medium text-primary-foreground/80">Goal Cycle Status</p>
              <p className="text-xl font-bold">Execution Phase</p>
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-4 font-semibold shadow-sm">
              Manage Cycle
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Analytics Section */}
        <Card className="shadow-sm border-muted col-span-1">
          <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Department Analytics</CardTitle>
              <CardDescription>Completion rate distribution by department.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ORG_COMPLETION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {ORG_COMPLETION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}
                  itemStyle={{ color: 'var(--color-foreground)' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-8 col-span-1">
          {/* Shared Goals UI */}
          <Card className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle>Assign Top-Down Goals</CardTitle>
              <CardDescription>Push organizational KPIs down to specific departments or roles.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Department</label>
                  <Input value="Sales Department" readOnly className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Goal Template</label>
                  <div className="flex gap-2">
                    <Input value="Q3 Revenue Target ($1M)" readOnly className="bg-muted/50" />
                    <Button variant="outline"><Settings className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 flex items-start gap-3 mt-4">
                  <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-500">Lock Goal Settings</h4>
                    <p className="text-xs text-amber-700/80 dark:text-amber-500/80">Employees will only be able to edit the weightage. Target and description are locked by admin.</p>
                  </div>
                </div>
                <Button className="w-full mt-2">Assign to 45 Employees</Button>
              </div>
            </CardContent>
          </Card>

          {/* Report Export Section */}
          <Card className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle>Data Exports</CardTitle>
              <CardDescription>Download system reports for external analysis.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2 group hover:bg-muted/50 hover:border-muted-foreground/30">
                  <FileSpreadsheet className="h-6 w-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                    <span className="block text-sm font-medium">Export CSV</span>
                    <span className="text-xs text-muted-foreground">Raw data dump</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2 group hover:bg-muted/50 hover:border-muted-foreground/30">
                  <Download className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                    <span className="block text-sm font-medium">Quarterly Report</span>
                    <span className="text-xs text-muted-foreground">Aggregated PDF</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card className="shadow-sm border-muted mt-8">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle>System Audit Log</CardTitle>
          <CardDescription>Recent administrative and system-level actions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User / System</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Changes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ADMIN_AUDIT_LOGS.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-normal text-xs">{log.user === 'System' ? 'System' : 'Admin'}</Badge>
                      {log.user}
                    </div>
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    {log.oldValue && log.newValue ? (
                      <div className="text-sm bg-muted/50 px-2 py-1 rounded inline-block border border-muted">
                        <span className="line-through text-muted-foreground mr-2">{log.oldValue}</span>
                        <span className="font-medium text-foreground">→ {log.newValue}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm italic">No value changes</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
