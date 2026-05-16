export type UserRole = 'employee' | 'manager' | 'admin';

export type GoalStatus = 'Approved' | 'Pending' | 'Returned' | 'Completed' | 'draft' | 'submitted' | 'approved' | 'returned' | 'locked';

export type UoMType = 'min' | 'max' | 'timeline' | 'zero';

export interface Goal {
  id: string;
  employeeId: string;
  thrustArea: string;
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
  role: UserRole;
  overallScore: number;
  lastActivity: string;
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
