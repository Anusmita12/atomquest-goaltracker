import { UserRole } from "@/lib/mock-data";

const roleColor: Record<UserRole, string> = {
  employee: "bg-blue-100 text-blue-900",
  manager: "bg-teal-100 text-teal-900",
  admin: "bg-purple-100 text-purple-900",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${roleColor[role]}`}>{role}</span>;
}
