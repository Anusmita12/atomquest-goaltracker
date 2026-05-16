'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGoals } from '@/lib/GoalContext';
import { Search } from 'lucide-react';

export default function AdminAuditPage() {
  const { activities } = useGoals();
  const [search, setSearch] = useState('');
  const filtered = activities.filter(l =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    (l.goal && l.goal.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout persona="admin" title="Audit Logs">
      <Card className="shadow-sm border-muted">
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <div>
            <CardTitle>System Audit Trail</CardTitle>
            <CardDescription>{activities.length} events recorded in FY 2025-26</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="w-56 pl-8 h-9 text-sm"
              placeholder="Filter by user or action..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Goal / Entity</TableHead>
                <TableHead>Old Value</TableHead>
                <TableHead>New Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(log => (
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
                    <span className="line-through text-muted-foreground text-xs">{log.oldValue}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground text-xs bg-muted px-2 py-0.5 rounded">{log.newValue}</span>
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
