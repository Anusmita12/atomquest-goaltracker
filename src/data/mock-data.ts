export interface Goal {
  id: string;
  title: string;
  thrustArea: "Sales & Expansion" | "Customer Success" | "Engineering Excellence" | "Talent & Growth";
  uom: string;
  target: number;
  weightage: number;
  progress: number;
  status: "Approved" | "Pending" | "Rejected" | "Completed";
  lastUpdated: string;
  owner?: string;
  department?: string;
}

export const initialEmployeeGoals: Goal[] = [
  {
    id: "G-101",
    title: "Increase Quarterly Sales Revenue via Expansion Enterprise Deals",
    thrustArea: "Sales & Expansion",
    uom: "USD Millions",
    target: 1.5,
    weightage: 30,
    progress: 65,
    status: "Approved",
    lastUpdated: "2026-05-14",
  },
  {
    id: "G-102",
    title: "Improve Customer Satisfaction Score across Tier-1 Strategic Accounts",
    thrustArea: "Customer Success",
    uom: "CSAT % Score",
    target: 95,
    weightage: 25,
    progress: 92,
    status: "Approved",
    lastUpdated: "2026-05-15",
  },
  {
    id: "G-103",
    title: "Complete Cloud Native Multi-Cluster Architecture Certification Program",
    thrustArea: "Engineering Excellence",
    uom: "Certifications Done",
    target: 1,
    weightage: 20,
    progress: 100,
    status: "Completed",
    lastUpdated: "2026-05-10",
  },
  {
    id: "G-104",
    title: "Reduce Critical L1 Ticket Median Resolution Time",
    thrustArea: "Customer Success",
    uom: "Minutes Time window",
    target: 45,
    weightage: 25,
    progress: 10,
    status: "Pending",
    lastUpdated: "2026-05-16",
  },
];

export const managerApprovalQueue: Goal[] = [
  {
    id: "G-201",
    owner: "Sarah Jenkins",
    department: "Customer Operations",
    title: "Automate Support Escalation Workflows using Webhooks",
    thrustArea: "Customer Success",
    uom: "Processes Optimized",
    target: 5,
    weightage: 40,
    progress: 0,
    status: "Pending",
    lastUpdated: "2026-05-15",
  },
  {
    id: "G-202",
    owner: "Michael Chang",
    department: "Core Platform Dev",
    title: "Optimize API Gateway Database Query Latency",
    thrustArea: "Engineering Excellence",
    uom: "Milliseconds p99",
    target: 120,
    weightage: 30,
    progress: 40,
    status: "Pending",
    lastUpdated: "2026-05-14",
  },
  {
    id: "G-203",
    owner: "Elena Rostova",
    department: "Growth Strategy",
    title: "Localize Expansion Assets for EMEA Enterprise Sector Launch",
    thrustArea: "Sales & Expansion",
    uom: "Localized Portals",
    target: 3,
    weightage: 30,
    progress: 0,
    status: "Pending",
    lastUpdated: "2026-05-16",
  },
];

export const teamPerformanceData = [
  { name: "Sarah Jenkins", progress: 78, continuousCheckins: 5 },
  { name: "Michael Chang", progress: 62, continuousCheckins: 4 },
  { name: "Elena Rostova", progress: 45, continuousCheckins: 2 },
  { name: "David Vance", progress: 91, continuousCheckins: 6 },
];

export const orgQuarterlyTrends = [
  { quarter: "FY25-Q3", Engineering: 74, Sales: 81, Operations: 79 },
  { quarter: "FY25-Q4", Engineering: 82, Sales: 85, Operations: 80 },
  { quarter: "FY26-Q1", Engineering: 89, Sales: 88, Operations: 84 },
  { quarter: "FY26-Q2", Engineering: 68, Sales: 72, Operations: 65 },
];

export const deptDistribution = [
  { name: "Engineering Excellence", value: 35 },
  { name: "Sales & Expansion", value: 25 },
  { name: "Customer Success", value: 25 },
  { name: "Talent & Growth", value: 15 },
];

export const auditLogsData = [
  {
    timestamp: "2026-05-16 11:22:04",
    user: "admin@demo.com (System HR)",
    action: "Unlocked Goal Performance Sheet",
    oldValue: "Status: Locked / Read Only",
    newValue: "Status: Unlocked / Editing Enabled",
  },
  {
    timestamp: "2026-05-15 16:45:12",
    user: "manager@demo.com (Director Operations)",
    action: "Modified Target Objective Threshold",
    oldValue: "Sales target: 50L Tier Expansion",
    newValue: "Sales target: 70L Tier Expansion",
  },
  {
    timestamp: "2026-05-14 09:15:00",
    user: "employee@demo.com (Staff Engineer)",
    action: "Self-Appraisal Target Submission",
    oldValue: "No Active Form Workspace",
    newValue: "Created Goal Registry Token [G-104]",
  },
  {
    timestamp: "2026-05-13 14:32:18",
    user: "manager@demo.com (Director Operations)",
    action: "Approved Goal Performance Submission",
    oldValue: "Status: Pending Review",
    newValue: "Status: Approved & Locked",
  },
  {
    timestamp: "2026-05-12 10:05:45",
    user: "employee@demo.com (Staff Engineer)",
    action: "Updated Progress Milestone Achievement",
    oldValue: "Progress: 45%",
    newValue: "Progress: 65%",
  },
];
