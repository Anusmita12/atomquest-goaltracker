'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Target,
  CheckCircle,
  Users,
  BarChart,
  FileText,
  ShieldAlert,
  Settings,
  LogOut,
} from 'lucide-react';
import { getSession, clearSession, type DemoUser } from '@/lib/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const MENU_ITEMS = [
  { name: 'Dashboard', href: '', icon: LayoutDashboard },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Check-ins', href: '/checkins', icon: CheckCircle },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Audit Logs', href: '/audit', icon: ShieldAlert },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const ROLE_COLORS = {
  employee: 'text-blue-600',
  manager: 'text-amber-600',
  admin: 'text-purple-600',
};

const ROLE_LABELS = {
  employee: 'Employee',
  manager: 'Manager',
  admin: 'Admin',
};

import { UserRole } from '@/lib/types';

export function Sidebar({ persona }: { persona: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const basePath = `/dashboard/${persona}`;
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    setUser(getSession());
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push('/');
  };

  // Define menu items based on persona
  const menuItems = MENU_ITEMS.filter(item => {
    if (persona === 'employee') {
      // Employees see their Goals, Check-ins, Team (Peers/Manager), and Analytics
      return !['Reports', 'Audit Logs'].includes(item.name);
    }
    if (persona === 'manager') {
      // Managers see everything including Team Activity (Audit Logs) and Team Reports
      return true;
    }
    return true; // Admin gets everything
  });

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? persona[0].toUpperCase();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card text-card-foreground shadow-sm">
      <div className="flex h-16 items-center px-6 border-b">
        <Target className="h-6 w-6 text-primary mr-2" />
        <span className="text-lg font-bold tracking-tight">GoalTracker</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const href = `${basePath}${item.href}`;
            const isActive = pathname === href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className={cn('mr-3 h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t space-y-3">
        {/* User info card */}
        <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 border border-border">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate">{user?.full_name ?? '—'}</span>
            <span className={cn('text-xs font-medium', ROLE_COLORS[persona])}>
              {ROLE_LABELS[persona]}
            </span>
          </div>
        </div>
        {/* Logout button */}
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground h-9 px-3"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
