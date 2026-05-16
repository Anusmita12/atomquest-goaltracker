import { Badge } from '@/components/ui/badge';
import { GoalStatus } from '@/lib/mock-data';

export function StatusBadge({ status }: { status: GoalStatus }) {
  switch (status) {
    case 'Approved':
      return <Badge className="bg-[#DCFCE7] text-[#15803D] border-0 hover:bg-[#DCFCE7]/80">Approved</Badge>;
    case 'Pending':
      return <Badge className="bg-[#FEF9C3] text-[#854D0E] border-0 hover:bg-[#FEF9C3]/80">Pending</Badge>;
    case 'Returned':
      return <Badge className="bg-[#FEE2E2] text-[#B91C1C] border-0 hover:bg-[#FEE2E2]/80">Returned</Badge>;
    case 'Completed':
      return <Badge className="bg-[#DBEAFE] text-[#1D4ED8] border-0 hover:bg-[#DBEAFE]/80">Completed</Badge>;
    case 'Draft':
      return <Badge className="bg-[#F3F4F6] text-[#374151] border-0 hover:bg-[#F3F4F6]/80">Draft</Badge>;
    default:
      return <Badge className="border-0">{status}</Badge>;
  }
}

export function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'text-emerald-600' : score >= 70 ? 'text-amber-600' : 'text-red-600';
  return <span className={`font-semibold ${color}`}>{score}%</span>;
}
