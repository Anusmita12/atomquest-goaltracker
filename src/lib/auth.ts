export type DemoUser = {
  email: string;
  full_name: string;
  role: 'employee' | 'manager' | 'admin';
  dashboard: string;
};

const DEMO_ACCOUNTS: DemoUser[] = [
  { email: 'employee@demo.com', full_name: 'Priya Sharma', role: 'employee', dashboard: '/dashboard/employee' },
  { email: 'manager@demo.com', full_name: 'Rahul Bose', role: 'manager', dashboard: '/dashboard/manager' },
  { email: 'admin@demo.com', full_name: 'Sneha Iyer', role: 'admin', dashboard: '/dashboard/admin' },
];

const DEMO_PASSWORD = 'Demo@1234';
const SESSION_KEY = 'goal_portal_user';

export function loginWithCredentials(email: string, password: string): DemoUser | null {
  if (password !== DEMO_PASSWORD) return null;
  return DEMO_ACCOUNTS.find((a) => a.email === email) ?? null;
}

export function loginAs(role: 'employee' | 'manager' | 'admin'): DemoUser {
  return DEMO_ACCOUNTS.find((a) => a.role === role)!;
}

export function saveSession(user: DemoUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
}

export function getSession(): DemoUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}
