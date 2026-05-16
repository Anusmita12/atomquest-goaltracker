'use client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PROFILES } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Mail, Briefcase } from 'lucide-react';

export default function EmployeeTeamPage() {
  // Priya's manager and peers
  const manager = PROFILES.find(p => p.id === 'm1');
  const peers = PROFILES.filter(p => p.managerId === 'm1' && p.id !== 'e1');

  return (
    <DashboardLayout persona="employee" title="My Team">
      <div className="space-y-8">
        {/* Manager Section */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" /> My Manager
          </h3>
          <Card className="max-w-md shadow-sm border-muted">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">RB</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-xl font-bold">{manager?.name}</h4>
                  <p className="text-muted-foreground">{manager?.department}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">Manager</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {manager?.email}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Peers Section */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" /> My Peers
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {peers.map(peer => (
              <Card key={peer.id} className="shadow-sm border-muted hover:border-primary/20 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                        {peer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{peer.name}</p>
                      <p className="text-xs text-muted-foreground">{peer.department}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">Peer</Badge>
                    <span className="text-[10px] text-muted-foreground">{peer.email}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
