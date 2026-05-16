import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AnalyticsContent } from '@/components/layout/AnalyticsContent';
export default function AdminAnalyticsPage() {
  return <DashboardLayout persona="admin" title="Analytics"><AnalyticsContent /></DashboardLayout>;
}
