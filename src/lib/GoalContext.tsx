'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PRIYA_GOALS, ARJUN_GOALS, ACTIVITY_LOGS, Goal, ActivityLog } from './mock-data';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface GoalContextType {
  goals: Goal[];
  activities: ActivityLog[];
  notifications: Notification[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  submitCheckIn: (goalId: string, value: number, note: string) => void;
  markNotificationsRead: () => void;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export function GoalProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from mock-data or localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('demo_goals');
    const savedActivities = localStorage.getItem('demo_activities');
    const savedNotifications = localStorage.getItem('demo_notifications');

    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setGoals([...PRIYA_GOALS, ...ARJUN_GOALS]);
    }

    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    } else {
      setActivities(ACTIVITY_LOGS);
    }

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      setNotifications([
        { id: '1', title: 'Goal Approved', message: 'Your Q3 Revenue goal was approved.', time: '2 hours ago', read: false },
        { id: '2', title: 'Check-in Reminder', message: 'You have 3 days left to submit Q3 check-ins.', time: '1 day ago', read: false }
      ]);
    }
    
    setIsLoaded(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('demo_goals', JSON.stringify(goals));
    localStorage.setItem('demo_activities', JSON.stringify(activities));
    localStorage.setItem('demo_notifications', JSON.stringify(notifications));
  }, [goals, activities, notifications, isLoaded]);

  const addGoal = (goal: Goal) => {
    setGoals(prev => [goal, ...prev]);
    setActivities(prev => [{
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      user: 'Priya Sharma',
      action: 'Created Goal',
      goal: goal.title
    }, ...prev]);
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Goal Created',
      message: `Successfully created "${goal.title}"`,
      time: 'Just now',
      read: false
    }, ...prev]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const submitCheckIn = (goalId: string, value: number, note: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        // Calculate new score based on progress towards target
        let newScore = 0;
        const target = typeof g.targetValue === 'number' ? g.targetValue : 100;
        
        if (g.uom === 'min') {
          newScore = Math.min(100, Math.round((value / target) * 100));
        } else if (g.uom === 'max') {
          newScore = Math.min(100, Math.round((target / value) * 100));
        } else {
          newScore = 100; // Simplified for timeline/zero
        }

        return { ...g, q3: value, score: newScore };
      }
      return g;
    }));
    
    const goalName = goals.find(g => g.id === goalId)?.title || 'Goal';
    
    setActivities(prev => [{
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      user: 'Priya Sharma',
      action: 'Submitted Check-in',
      goal: goalName,
      newValue: `Value updated to ${value}. Note: ${note}`
    } as any, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isLoaded) return null;

  return (
    <GoalContext.Provider value={{ goals, activities, notifications, addGoal, updateGoal, submitCheckIn, markNotificationsRead }}>
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
