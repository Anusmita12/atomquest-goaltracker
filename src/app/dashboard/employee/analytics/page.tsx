import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AnalyticsContent } from '@/components/layout/AnalyticsContent';
export default function EmployeeAnalyticsPage() {
  return <DashboardLayout persona="employee" title="Analytics"><AnalyticsContent /></DashboardLayout>;
}
