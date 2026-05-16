'use client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PROFILES, PRIYA_GOALS, ARJUN_GOALS, NEHA_GOALS } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';

const CHECKIN_DATA = [
  { employee: PROFILES[0], goals: PRIYA_GOALS, q1Done: true, q2Done: true, q3Done: true, overall: 86 },
  { employee: PROFILES[1], goals: ARJUN_GOALS, q1Done: true, q2Done: true, q3Done: true, overall: 95 },
  { employee: PROFILES[2], goals: NEHA_GOALS, q1Done: true, q2Done: true, q3Done: false, overall: 67 },
];

const q3CompletionRate = Math.round((CHECKIN_DATA.filter(d => d.q3Done).length / CHECKIN_DATA.length) * 100);

export default function AdminCheckinsPage() {
  return (
    <DashboardLayout persona="admin" title="Check-in Overview — Q3 2026">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-muted">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Q3 Check-in Completion</p>
            <p className="text-2xl font-bold mt-1">{q3CompletionRate}%</p>
            <Progress value={q3CompletionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Submitted</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{CHECKIN_DATA.filter(d => d.q3Done).length} / {CHECKIN_DATA.length}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Missing Q3</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{CHECKIN_DATA.filter(d => !d.q3Done).length} employee(s)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-muted">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle>Company Check-in Status</CardTitle>
          <CardDescription>Tracking quarterly submission completeness per employee</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Goals</TableHead>
                <TableHead>Q1 Done</TableHead>
                <TableHead>Q2 Done</TableHead>
                <TableHead>Q3 Done</TableHead>
                <TableHead>Overall Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CHECKIN_DATA.map(({ employee, goals, q1Done, q2Done, q3Done, overall }) => (
                <TableRow key={employee.id} className="hover:bg-muted/10">
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell className="text-muted-foreground">{employee.department}</TableCell>
                  <TableCell>{goals.length}</TableCell>
                  <TableCell>{q1Done ? <span className="text-emerald-600 font-medium">✓ Yes</span> : <span className="text-red-500">✗ No</span>}</TableCell>
                  <TableCell>{q2Done ? <span className="text-emerald-600 font-medium">✓ Yes</span> : <span className="text-red-500">✗ No</span>}</TableCell>
                  <TableCell>{q3Done ? <span className="text-emerald-600 font-medium">✓ Yes</span> : <span className="text-red-500 font-medium">✗ Missing</span>}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={overall} className="h-1.5 w-20" />
                      <span className="text-sm font-medium">{overall}%</span>
                    </div>
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
