import { Badge } from '@/components/ui/badge';
import { GoalStatus } from '@/lib/mock-data';

export function StatusBadge({ status }: { status: GoalStatus }) {
  switch (status) {
    case 'Approved':
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">Approved</Badge>;
    case 'Pending':
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20">Pending</Badge>;
    case 'Returned':
      return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">Returned</Badge>;
    case 'Completed':
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20">Completed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'text-emerald-600' : score >= 70 ? 'text-amber-600' : 'text-red-600';
  return <span className={`font-semibold ${color}`}>{score}%</span>;
}
