'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { THRUST_DISTRIBUTION, PROFILES } from '@/lib/mock-data';
import { useGoals } from '@/lib/GoalContext';
import { Download, FileSpreadsheet, Target, Activity, Lock, Users, Check } from 'lucide-react';
import Papa from 'papaparse';

const PIE_DATA = THRUST_DISTRIBUTION.map((d, i) => ({
  ...d,
  fill: ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e'][i],
}));

function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
      <Check className="h-4 w-4" />
      {message}
    </div>
  );
}

export default function AdminDashboard() {
  const { goals, auditLogs } = useGoals();
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const EMPLOYEES = PROFILES.filter(p => p.role === 'employee');

  // Org stats
  const totalGoals = goals.length;
  const approvedGoals = goals.filter(g => g.status === 'Approved').length;
  const pendingGoals = goals.filter(g => g.status === 'Pending').length;
  const q3Submitted = goals.filter(g => g.q3 !== null).length;

  const exportCSV = () => {
    const rows = goals.map(g => {
      const emp = PROFILES.find(p => p.id === g.employeeId);
      return {
        Employee: emp?.name ?? g.employeeId,
        Department: emp?.department ?? '—',
        'Goal Title': g.title,
        'Thrust Area': g.thrustArea,
        UoM: g.uom,
        'Weight (%)': g.weightage,
        'Q1 Actual': g.q1 ?? '—',
        'Q2 Actual': g.q2 ?? '—',
        'Q3 Actual': g.q3 ?? '—',
        Target: g.targetValue,
        'Score (%)': g.score,
        Status: g.status,
      };
    });
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'goals-report.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully!');
  };

  const handlePrint = () => {
    window.print();
    showToast('Print dialog opened.');
  };

  return (
    <DashboardLayout persona="admin" title="Organization Overview">
      <Toast message={toast} />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-muted">
          <CardContent className="p-6">
            <div className="flex justify-between items-start pb-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-[28px] font-[700]">{EMPLOYEES.length}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-md"><Users className="h-4 w-4 text-primary" /></div>
            </div>
            <p className="text-xs text-muted-foreground">Active participants</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardContent className="p-6">
            <div className="flex justify-between items-start pb-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Goals Submitted</p>
                <p className="text-[28px] font-[700]">{totalGoals}</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-md"><Activity className="h-4 w-4 text-blue-500" /></div>
            </div>
            <p className="text-xs text-muted-foreground">{pendingGoals} pending approval</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardContent className="p-6">
            <div className="flex justify-between items-start pb-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-[28px] font-[700]">{Math.round((approvedGoals / totalGoals) * 100)}%</p>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-md"><Target className="h-4 w-4 text-emerald-500" /></div>
            </div>
            <p className="text-xs text-muted-foreground">{approvedGoals} of {totalGoals} goals approved</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardContent className="p-6">
            <div className="flex justify-between items-start pb-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Q3 Check-ins</p>
                <p className="text-[28px] font-[700]">{Math.round((q3Submitted / totalGoals) * 100)}%</p>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-md"><Lock className="h-4 w-4 text-amber-500" /></div>
            </div>
            <p className="text-xs text-muted-foreground">{q3Submitted}/{totalGoals} submitted</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Pie Chart */}
        <Card className="shadow-sm border-muted">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle>Goals by Thrust Area</CardTitle>
            <CardDescription>Distribution across all employees</CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2} dataKey="value" stroke="none">
                  {PIE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Exports */}
        <div className="space-y-6">
          <Card className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle>Data Exports</CardTitle>
              <CardDescription>Download system reports for external analysis.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-5 flex flex-col items-center gap-2 group hover:bg-muted/50"
                  onClick={exportCSV}
                >
                  <FileSpreadsheet className="h-7 w-7 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                    <span className="block text-sm font-medium">Export CSV</span>
                    <span className="text-xs text-muted-foreground">All goals data</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-5 flex flex-col items-center gap-2 group hover:bg-muted/50"
                  onClick={handlePrint}
                >
                  <Download className="h-7 w-7 text-blue-600 group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                    <span className="block text-sm font-medium">Quarterly Report</span>
                    <span className="text-xs text-muted-foreground">Print / Save PDF</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Completion Table */}
          <Card className="shadow-sm border-muted">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle>Employee Completion Status</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Dept</TableHead>
                    <TableHead>Goals</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Q3</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {EMPLOYEES.map(emp => {
                    const empGoals = goals.filter(g => g.employeeId === emp.id);
                    const empApproved = empGoals.filter(g => g.status === 'Approved').length;
                    const empQ3 = empGoals.filter(g => g.q3 !== null).length;
                    const totalW = empGoals.filter(g => g.status === 'Approved').reduce((s, g) => s + g.weightage, 0);
                    const empScore = totalW ? Math.round(empGoals.filter(g => g.status === 'Approved').reduce((s, g) => s + g.score * g.weightage, 0) / totalW) : 0;
                    return (
                      <TableRow key={emp.id} className="hover:bg-muted/10 text-sm">
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell className="text-muted-foreground">{emp.department}</TableCell>
                        <TableCell>{empGoals.length}</TableCell>
                        <TableCell>
                          <Badge className={`text-xs border-0 ${empApproved === empGoals.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {empApproved}/{empGoals.length}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs border-0 ${empQ3 === empGoals.length ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {empQ3}/{empGoals.length}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs border-0 ${empScore >= 70 ? 'bg-emerald-100 text-emerald-700' : empScore >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {empScore}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card className="shadow-sm border-muted">
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
              {auditLogs.slice(0, 10).map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{log.timestamp}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-normal text-xs">
                        {log.user === 'System' ? 'System' : 'Admin'}
                      </Badge>
                      {log.user}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{log.action}</TableCell>
                  <TableCell>
                    {log.oldValue && log.newValue ? (
                      <div className="text-sm bg-muted/50 px-2 py-1 rounded inline-block border border-muted">
                        <span className="line-through text-muted-foreground mr-2">{log.oldValue}</span>
                        <span className="font-medium">→ {log.newValue}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm italic">—</span>
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
