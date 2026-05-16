'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { getSession, DemoUser } from '@/lib/auth';
import { useGoals } from '@/lib/GoalContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopNavbar({ title }: { title: string }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const { notifications, markNotificationsRead } = useGoals();

  useEffect(() => {
    setUser(getSession());
  }, []);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? 'U';
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <Badge variant="secondary" className="hidden sm:inline-flex">Q3 2026</Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search goals..."
            className="w-64 bg-muted/50 pl-8 rounded-full border-none focus-visible:ring-1"
          />
        </div>
        <DropdownMenu onOpenChange={(open) => { if(!open) markNotificationsRead(); }}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-center text-muted-foreground">No new notifications</div>
            ) : (
              notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3 cursor-default">
                  <div className="flex justify-between w-full">
                    <span className={`font-medium ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</span>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </div>
                  <span className="text-sm text-muted-foreground line-clamp-2">{n.message}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Avatar className="h-8 w-8 ring-2 ring-border">
          <AvatarImage src="" alt="Profile" />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
