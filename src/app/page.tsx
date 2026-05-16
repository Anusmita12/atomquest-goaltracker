'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Target, Users, ShieldAlert, Briefcase, AlertCircle, Loader2 } from 'lucide-react';
import { loginWithCredentials, loginAs, saveSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const user = loginWithCredentials(email, password);
    if (user) {
      saveSession(user);
      router.push(user.dashboard);
    } else {
      setError('Invalid credentials. Use the demo login buttons below.');
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: 'employee' | 'manager' | 'admin') => {
    const user = loginAs(role);
    saveSession(user);
    router.push(user.dashboard);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-background rounded-r-[100px] shadow-sm transform -translate-x-10" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-2 mb-8">
          <div className="p-2 bg-primary rounded-xl shadow-sm">
            <Target className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            GoalTracker
          </h2>
        </div>
        
        <Card className="shadow-lg border-muted">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center font-bold">Sign in to your account</CardTitle>
            <CardDescription className="text-center">
              Enter your enterprise credentials to access your portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="bg-muted/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-muted/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-md">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Remember me for 30 days
                </Label>
              </div>
              <Button type="submit" className="w-full mt-2 h-11 text-base font-medium shadow-sm" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Sign in
              </Button>
            </form>
          </CardContent>
          <div className="relative px-6 py-4">
            <div className="absolute inset-0 flex items-center px-6">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-medium">Quick Demo Access</span>
            </div>
          </div>
          <CardFooter className="flex flex-col gap-3 pb-8">
            <Button
              variant="outline"
              className="w-full justify-start h-12 relative overflow-hidden group"
              onClick={() => handleDemoLogin('employee')}
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-l-md" />
              <Briefcase className="mr-3 h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Login as Employee</span>
                <span className="text-xs text-muted-foreground font-normal">employee@demo.com</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-12 relative overflow-hidden group"
              onClick={() => handleDemoLogin('manager')}
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-amber-500 rounded-l-md" />
              <Users className="mr-3 h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Login as Manager</span>
                <span className="text-xs text-muted-foreground font-normal">manager@demo.com</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-12 relative overflow-hidden group"
              onClick={() => handleDemoLogin('admin')}
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-purple-500 rounded-l-md" />
              <ShieldAlert className="mr-3 h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Login as Admin</span>
                <span className="text-xs text-muted-foreground font-normal">admin@demo.com</span>
              </div>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}