// --- Types & Interfaces ---

export type GoalStatus = 'Approved' | 'Pending' | 'Returned' | 'Completed' | 'Returned' | 'Draft' | 'Submitted' | 'Locked' | 'Rejected' | 'draft' | 'submitted' | 'approved' | 'returned' | 'locked' | 'rejected' | 'pending';
export type UserRole = 'employee' | 'manager' | 'admin';
export type UoMType = 'min' | 'max' | 'timeline' | 'zero';

export interface Goal {
  id: string;
  employeeId: string;
  thrustArea: string;
  description?: string;
  title: string;
  uom: UoMType;
  unit: string;
  targetValue: number | string;
  weightage: number;
  status: GoalStatus;
  deadline?: string;
  q1: number | string | null;
  q2: number | string | null;
  q3: number | string | null;
  score: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  managerId: string | null;
  role: 'employee' | 'manager' | 'admin';
  overallScore: number;
  lastActivity: string;
}

// Aliasing Employee to User as requested
export type User = Employee;

export interface CheckIn {
  goalId: string;
  value: number;
  note: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  goal: string;
  oldValue: string;
  newValue: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  goal?: string;
  oldValue?: string;
  newValue?: string;
}

// --- Mock Data ---

export const PROFILES: Employee[] = [
  { id: 'e1', name: 'Priya Sharma', email: 'employee@demo.com', department: 'Engineering', managerId: 'm1', role: 'employee', overallScore: 86, lastActivity: '12 May 2026' },
  { id: 'e2', name: 'Arjun Mehta', email: 'arjun@demo.com', department: 'Sales', managerId: 'm1', role: 'employee', overallScore: 95, lastActivity: '13 May 2026' },
  { id: 'e3', name: 'Neha Kapoor', email: 'neha@demo.com', department: 'Operations', managerId: 'm1', role: 'employee', overallScore: 67, lastActivity: '10 May 2026' },
  { id: 'm1', name: 'Rahul Bose', email: 'manager@demo.com', department: 'Management', managerId: 'a1', role: 'manager', overallScore: 0, lastActivity: '15 May 2026' },
  { id: 'a1', name: 'Sneha Iyer', email: 'admin@demo.com', department: 'HR', managerId: null, role: 'admin', overallScore: 0, lastActivity: '1 May 2026' },
];

export const PRIYA_GOALS: Goal[] = [
  { id: 'p1', employeeId: 'e1', thrustArea: 'Revenue', title: 'Achieve ₹12Cr quarterly sales', uom: 'min', unit: '₹', targetValue: 12000000, weightage: 25, status: 'Approved', q1: 8500000, q2: 10200000, q3: 11800000, score: 98 },
  { id: 'p2', employeeId: 'e1', thrustArea: 'Cost', title: 'Reduce operational TAT below 48hrs', uom: 'max', unit: 'hrs', targetValue: 48, weightage: 20, status: 'Approved', q1: 52, q2: 47, q3: 43, score: 100 },
  { id: 'p3', employeeId: 'e1', thrustArea: 'Quality', title: 'Launch client onboarding v2', uom: 'timeline', unit: 'date', targetValue: '30 Sep 2025', weightage: 20, status: 'Approved', deadline: '30 Sep 2025', q1: null, q2: null, q3: 'Completed 28 Sep 2025', score: 100 },
  { id: 'p4', employeeId: 'e1', thrustArea: 'People', title: 'Complete leadership certification', uom: 'timeline', unit: 'date', targetValue: '31 Dec 2025', weightage: 25, status: 'Pending', deadline: '31 Dec 2025', q1: null, q2: null, q3: null, score: 0 },
  { id: 'p5', employeeId: 'e1', thrustArea: 'Innovation', title: 'Zero P0 incidents in production', uom: 'zero', unit: 'incidents', targetValue: 0, weightage: 10, status: 'Approved', q1: 0, q2: 1, q3: 0, score: 50 },
];

export const ARJUN_GOALS: Goal[] = [
  { id: 'a1', employeeId: 'e2', thrustArea: 'Revenue', title: 'Close 15 enterprise deals', uom: 'min', unit: 'deals', targetValue: 15, weightage: 30, status: 'Approved', q1: 4, q2: 9, q3: 13, score: 87 },
  { id: 'a2', employeeId: 'e2', thrustArea: 'Cost', title: 'Reduce sales cycle to 30 days', uom: 'max', unit: 'days', targetValue: 30, weightage: 25, status: 'Approved', q1: 45, q2: 38, q3: 31, score: 97 },
  { id: 'a3', employeeId: 'e2', thrustArea: 'Quality', title: 'Achieve CSAT score above 4.5', uom: 'min', unit: 'score', targetValue: 4.5, weightage: 25, status: 'Approved', q1: 4.1, q2: 4.4, q3: 4.6, score: 100 },
  { id: 'a4', employeeId: 'e2', thrustArea: 'People', title: 'Onboard 2 new sales reps', uom: 'timeline', unit: 'date', targetValue: '30 Jun 2025', weightage: 20, status: 'Approved', deadline: '30 Jun 2025', q1: null, q2: 'Completed 25 Jun 2025', q3: null, score: 100 },
];

export const NEHA_GOALS: Goal[] = [
  { id: 'n1', employeeId: 'e3', thrustArea: 'Cost', title: 'Reduce logistics cost by 15%', uom: 'min', unit: '%', targetValue: 15, weightage: 30, status: 'Approved', q1: 4, q2: 8, q3: 11, score: 73 },
  { id: 'n2', employeeId: 'e3', thrustArea: 'Quality', title: 'Achieve 99% SLA compliance', uom: 'min', unit: '%', targetValue: 99, weightage: 25, status: 'Returned', q1: 94, q2: 96, q3: 97, score: 98 },
  { id: 'n3', employeeId: 'e3', thrustArea: 'Innovation', title: 'Automate 3 manual processes', uom: 'min', unit: 'processes', targetValue: 3, weightage: 25, status: 'Approved', q1: 1, q2: 2, q3: 2, score: 67 },
  { id: 'n4', employeeId: 'e3', thrustArea: 'People', title: 'Complete Six Sigma certification', uom: 'timeline', unit: 'date', targetValue: '31 Mar 2026', weightage: 20, status: 'Approved', deadline: '31 Mar 2026', q1: null, q2: null, q3: null, score: 0 },
];

export const ALL_GOALS: Goal[] = [...PRIYA_GOALS, ...ARJUN_GOALS, ...NEHA_GOALS];

export const ACTIVITY_LOGS: ActivityLog[] = [
  { id: '1', timestamp: '15 May 2026', user: 'Rahul Bose', action: 'Manager approved Sales KPI for Arjun' },
  { id: '2', timestamp: '13 May 2026', user: 'System', action: 'Arjun closed enterprise deal #13' },
  { id: '3', timestamp: '12 May 2026', user: 'System', action: 'Q3 achievement updated for Priya' },
  { id: '4', timestamp: '10 May 2026', user: 'Rahul Bose', action: "Neha's SLA goal returned for rework" },
  { id: '5', timestamp: '5 May 2026', user: 'System', action: 'All employees submitted goals' },
  { id: '6', timestamp: '1 May 2026', user: 'Sneha Iyer', action: 'Goal setting cycle 2025 opened' },
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: '1', timestamp: '15 May 2026, 10:30', user: 'Rahul Bose', action: 'Goal status changed', goal: 'Arjun – Close 15 enterprise deals', oldValue: 'Pending', newValue: 'Approved' },
  { id: '2', timestamp: '13 May 2026, 14:15', user: 'System', action: 'Q3 deal count updated', goal: 'Arjun – Close 15 enterprise deals', oldValue: '12', newValue: '13' },
  { id: '3', timestamp: '12 May 2026, 09:00', user: 'System', action: 'Q3 check-in submitted', goal: 'Priya – ₹12Cr Sales Revenue', oldValue: '₹11.2Cr', newValue: '₹11.8Cr' },
  { id: '4', timestamp: '10 May 2026, 16:45', user: 'Rahul Bose', action: 'Goal returned for rework', goal: 'Neha – 99% SLA Compliance', oldValue: 'Approved', newValue: 'Returned' },
  { id: '5', timestamp: '8 May 2026, 11:20', user: 'Sneha Iyer', action: 'Goal sheet unlocked', goal: 'Neha – SLA Compliance', oldValue: 'Locked', newValue: 'Unlocked' },
  { id: '6', timestamp: '5 May 2026, 17:00', user: 'System', action: 'Goals submitted', goal: 'All employees', oldValue: 'Draft', newValue: 'Submitted' },
  { id: '7', timestamp: '3 May 2026, 09:00', user: 'System', action: 'Q3 cycle opened', goal: 'All goals', oldValue: 'Closed', newValue: 'Open' },
  { id: '8', timestamp: '28 Apr 2026, 15:30', user: 'Rahul Bose', action: 'Weightage updated', goal: 'Arjun – Revenue goal', oldValue: '25%', newValue: '30%' },
];

export const DEPT_TREND = [
  { quarter: 'Q1', Engineering: 66, Sales: 72, Operations: 45 },
  { quarter: 'Q2', Engineering: 79, Sales: 85, Operations: 58 },
  { quarter: 'Q3', Engineering: 86, Sales: 95, Operations: 67 },
];

export const THRUST_DISTRIBUTION = [
  { name: 'Revenue', value: 3 },
  { name: 'Cost', value: 3 },
  { name: 'Quality', value: 3 },
  { name: 'People', value: 3 },
  { name: 'Innovation', value: 2 },
];

export const EMPLOYEE_SCORES = [
  { name: 'Priya Sharma', score: 86, dept: 'Engineering' },
  { name: 'Arjun Mehta', score: 95, dept: 'Sales' },
  { name: 'Neha Kapoor', score: 67, dept: 'Operations' },
];
