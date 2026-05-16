'use client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGoals } from '@/lib/GoalContext';

export default function ManagerAuditPage() {
  const { auditLogs } = useGoals();
  // Filter logs to show only team-related actions (Rahul Bose's team)
  const teamLogs = auditLogs.filter(l => 
    (l.goal && l.goal.includes('Arjun')) || 
    (l.goal && l.goal.includes('Neha')) || 
    (l.goal && l.goal.includes('Priya')) ||
    l.user === 'Rahul Bose'
  );

  return (
    <DashboardLayout persona="manager" title="Team Activity Log">
      <Card className="shadow-sm border-muted">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle>Recent Team Activity</CardTitle>
          <CardDescription>Audit trail of changes made by you and your direct reports.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Goal / Entity</TableHead>
                <TableHead>Changes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamLogs.map(log => (
                <TableRow key={log.id} className="hover:bg-muted/10 text-sm">
                  <TableCell className="text-muted-foreground whitespace-nowrap">{log.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-normal">
                        {log.user === 'System' ? 'System' : 'User'}
                      </Badge>
                      <span className="font-medium">{log.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="text-muted-foreground">{log.goal}</TableCell>
                  <TableCell>
                    <div className="text-xs bg-muted px-2 py-1 rounded inline-block">
                      <span className="line-through text-muted-foreground mr-2">{log.oldValue}</span>
                      <span className="font-medium">→ {log.newValue}</span>
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
