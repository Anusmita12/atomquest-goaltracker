import { GoalStatus } from "@/lib/types";

const statusColor: Record<GoalStatus, string> = {
  draft: "bg-slate-200 text-slate-800",
  submitted: "bg-amber-100 text-amber-900",
  approved: "bg-emerald-100 text-emerald-900",
  returned: "bg-rose-100 text-rose-900",
  locked: "bg-blue-100 text-blue-900",
};

export function StatusBadge({ status }: { status: GoalStatus }) {
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColor[status]}`}>{status}</span>;
}
