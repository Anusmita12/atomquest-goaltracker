'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ALL_GOALS, AUDIT_LOGS, ACTIVITY_LOGS, Goal, AuditLog, ActivityLog } from './mock-data';

// ─── Score helpers ────────────────────────────────────────────────────────────

export function computeScore(goal: Goal): number {
  const { uom, targetValue, q3, deadline } = goal;
  if (uom === 'min') {
    return q3 != null && targetValue
      ? Math.min(Math.round((Number(q3) / Number(targetValue)) * 100), 100)
      : 0;
  }
  if (uom === 'max') {
    return q3 != null && Number(q3) > 0 && targetValue
      ? Math.min(Math.round((Number(targetValue) / Number(q3)) * 100), 100)
      : 0;
  }
  if (uom === 'timeline') {
    return q3 != null && String(q3).toLowerCase().includes('completed') ? 100 : 0;
  }
  if (uom === 'zero') {
    return q3 === 0 ? 100 : 0;
  }
  return 0;
}

export function computeOverall(goals: Goal[]): number {
  if (!goals.length) return 0;
  const total = goals.reduce((sum, g) => sum + computeScore(g) * g.weightage, 0);
  const weights = goals.reduce((sum, g) => sum + g.weightage, 0);
  return weights > 0 ? Math.round(total / weights) : 0;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Comment {
  id: string;
  goalId: string;
  managerId: string;
  text: string;
  date: string;
}

interface GoalContextType {
  goals: Goal[];
  activities: ActivityLog[];
  auditLogs: AuditLog[];
  comments: Comment[];
  notifications: Notification[];

  // Goal mutations
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  submitCheckIn: (goalId: string, value: number, note: string) => void;
  submitAllCheckIns: (updates: { goalId: string; q3: number }[]) => void;

  // Manager actions
  approveGoal: (goalId: string, editedTarget?: number | string, editedWeightage?: number) => void;
  returnGoal: (goalId: string, comment: string, managerName: string) => void;
  saveComment: (goalId: string, managerId: string, text: string) => void;
  pushSharedGoal: (
    sharedData: {
      title: string;
      thrustArea: string;
      uom: Goal['uom'];
      targetValue: number | string;
      unit: string;
      deadline?: string;
    },
    recipientIds: string[]
  ) => void;

  // Audit
  addAuditLog: (entry: Omit<AuditLog, 'id'>) => void;

  // Notifications
  markNotificationsRead: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export function GoalProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage or seed data
  useEffect(() => {
    const savedGoals = localStorage.getItem('demo_goals');
    const savedActivities = localStorage.getItem('demo_activities');
    const savedAuditLogs = localStorage.getItem('demo_audit_logs');
    const savedComments = localStorage.getItem('demo_comments');
    const savedNotifications = localStorage.getItem('demo_notifications');

    setGoals(savedGoals ? JSON.parse(savedGoals) : ALL_GOALS);
    setActivities(savedActivities ? JSON.parse(savedActivities) : ACTIVITY_LOGS);
    setAuditLogs(savedAuditLogs ? JSON.parse(savedAuditLogs) : AUDIT_LOGS);
    setComments(savedComments ? JSON.parse(savedComments) : [
      { id: '1', goalId: 'p1', managerId: 'm1', text: 'Great progress on revenue target!', date: '12 May 2026' },
      { id: '2', goalId: 'a1', managerId: 'm1', text: 'Keep pushing on enterprise deals.', date: '13 May 2026' },
    ]);
    setNotifications(savedNotifications ? JSON.parse(savedNotifications) : [
      { id: '1', title: 'Goal Approved', message: 'Your Q3 Revenue goal was approved.', time: '2 hours ago', read: false },
      { id: '2', title: 'Check-in Reminder', message: 'You have 3 days left to submit Q3 check-ins.', time: '1 day ago', read: false },
    ]);

    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('demo_goals', JSON.stringify(goals));
    localStorage.setItem('demo_activities', JSON.stringify(activities));
    localStorage.setItem('demo_audit_logs', JSON.stringify(auditLogs));
    localStorage.setItem('demo_comments', JSON.stringify(comments));
    localStorage.setItem('demo_notifications', JSON.stringify(notifications));
  }, [goals, activities, auditLogs, comments, notifications, isLoaded]);

  // ─── Goal Mutations ─────────────────────────────────────────────────────────

  const addGoal = (goal: Goal) => {
    setGoals(prev => [goal, ...prev]);
    addAuditLog({
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      user: 'Employee',
      action: 'Goal created',
      goal: goal.title,
      oldValue: '—',
      newValue: 'Draft',
    });
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Goal Created',
      message: `Successfully created "${goal.title}"`,
      time: 'Just now',
      read: false,
    }, ...prev]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const submitCheckIn = (goalId: string, value: number, note: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const updated = { ...g, q3: value };
      return { ...updated, score: computeScore(updated) };
    }));
    const goalTitle = goals.find(g => g.id === goalId)?.title ?? 'Goal';
    addAuditLog({
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      user: 'Employee',
      action: 'Check-in submitted',
      goal: goalTitle,
      oldValue: '—',
      newValue: String(value) + (note ? ` — ${note}` : ''),
    });
  };

  const submitAllCheckIns = (updates: { goalId: string; q3: number }[]) => {
    setGoals(prev => prev.map(g => {
      const update = updates.find(u => u.goalId === g.id);
      if (!update) return g;
      const updated = { ...g, q3: update.q3 };
      return { ...updated, score: computeScore(updated) };
    }));
  };

  // ─── Manager Actions ────────────────────────────────────────────────────────

  const approveGoal = (goalId: string, editedTarget?: number | string, editedWeightage?: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const updates: Partial<Goal> = { status: 'Approved' };
      if (editedTarget !== undefined) updates.targetValue = editedTarget;
      if (editedWeightage !== undefined) updates.weightage = editedWeightage;
      return { ...g, ...updates };
    }));
    const goalTitle = goals.find(g => g.id === goalId)?.title ?? 'Goal';
    addAuditLog({
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      user: 'Rahul Bose',
      action: 'Goal approved',
      goal: goalTitle,
      oldValue: 'Pending',
      newValue: 'Approved',
    });
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Goal Approved',
      message: `"${goalTitle}" has been approved.`,
      time: 'Just now',
      read: false,
    }, ...prev]);
  };

  const returnGoal = (goalId: string, comment: string, managerName: string) => {
    setGoals(prev => prev.map(g =>
      g.id === goalId ? { ...g, status: 'Returned' } : g
    ));
    const goalTitle = goals.find(g => g.id === goalId)?.title ?? 'Goal';
    if (comment) {
      setComments(prev => [{
        id: Date.now().toString(),
        goalId,
        managerId: 'm1',
        text: comment,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      }, ...prev]);
    }
    addAuditLog({
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      user: managerName,
      action: 'Goal returned for rework',
      goal: goalTitle,
      oldValue: 'Pending',
      newValue: 'Returned',
    });
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Goal Returned',
      message: `"${goalTitle}" was returned with feedback.`,
      time: 'Just now',
      read: false,
    }, ...prev]);
  };

  const saveComment = (goalId: string, managerId: string, text: string) => {
    const goalTitle = goals.find(g => g.id === goalId)?.title ?? 'Goal';
    // Update if exists, else add
    setComments(prev => {
      const exists = prev.find(c => c.goalId === goalId && c.managerId === managerId);
      if (exists) {
        return prev.map(c => c.goalId === goalId && c.managerId === managerId
          ? { ...c, text, date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
          : c
        );
      }
      return [{
        id: Date.now().toString(),
        goalId,
        managerId,
        text,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      }, ...prev];
    });
    addAuditLog({
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      user: 'Rahul Bose',
      action: 'Manager comment added',
      goal: goalTitle,
      oldValue: '—',
      newValue: text.slice(0, 40) + (text.length > 40 ? '…' : ''),
    });
  };

  const pushSharedGoal = (
    sharedData: {
      title: string;
      thrustArea: string;
      uom: Goal['uom'];
      targetValue: number | string;
      unit: string;
      deadline?: string;
    },
    recipientIds: string[]
  ) => {
    const newGoals: Goal[] = recipientIds.map(empId => ({
      id: `shared_${Date.now()}_${empId}`,
      employeeId: empId,
      thrustArea: sharedData.thrustArea,
      title: sharedData.title,
      uom: sharedData.uom,
      unit: sharedData.unit,
      targetValue: sharedData.targetValue,
      weightage: 10,
      status: 'Draft',
      deadline: sharedData.deadline,
      q1: null,
      q2: null,
      q3: null,
      score: 0,
      isShared: true,
    }));
    setGoals(prev => [...newGoals, ...prev]);
    addAuditLog({
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      user: 'Rahul Bose',
      action: 'Shared goal pushed',
      goal: sharedData.title,
      oldValue: '—',
      newValue: `${recipientIds.length} employee(s)`,
    });
  };

  // ─── Audit ──────────────────────────────────────────────────────────────────

  const addAuditLog = (entry: Omit<AuditLog, 'id'>) => {
    setAuditLogs(prev => [{
      id: Date.now().toString(),
      ...entry,
    }, ...prev]);
  };

  // ─── Notifications ──────────────────────────────────────────────────────────

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isLoaded) return null;

  return (
    <GoalContext.Provider value={{
      goals, activities, auditLogs, comments, notifications,
      addGoal, updateGoal, deleteGoal, submitCheckIn, submitAllCheckIns,
      approveGoal, returnGoal, saveComment, pushSharedGoal,
      addAuditLog, markNotificationsRead,
    }}>
      {children}
    </GoalContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
}
