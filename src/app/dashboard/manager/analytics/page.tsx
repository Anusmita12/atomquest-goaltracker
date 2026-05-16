import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AnalyticsContent } from '@/components/layout/AnalyticsContent';
export default function ManagerAnalyticsPage() {
  return <DashboardLayout persona="manager" title="Analytics"><AnalyticsContent /></DashboardLayout>;
}
