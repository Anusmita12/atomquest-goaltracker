import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running seed");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function upsertUser(email: string, role: "employee" | "manager" | "admin", managerId?: string) {
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing.users.find((user) => user.email === email);

  const user = found ?? (await supabase.auth.admin.createUser({ email, password: "Demo@1234", email_confirm: true })).data.user;

  if (!user) throw new Error(`Unable to create user ${email}`);

  await supabase.from("profiles").upsert({
    id: user.id,
    email,
    full_name: email.split("@")[0],
    role,
    department: role === "admin" ? "HR" : "Revenue",
    manager_id: managerId ?? null,
  });

  return user.id;
}

async function main() {
  const managerId = await upsertUser("manager@demo.com", "manager");
  const employeeId = await upsertUser("employee@demo.com", "employee", managerId);
  await upsertUser("admin@demo.com", "admin");

  const goals = [
    ["Revenue", "Increase upsell revenue", "min", "120", 25],
    ["Cost", "Reduce support turnaround", "max", "8", 20],
    ["Quality", "Automate QA migration", "timeline", "2026-09-30", 20],
    ["People", "Zero critical escalations", "zero", "0", 15],
    ["Innovation", "Launch proposal generator", "min", "10", 20],
  ] as const;

  const { data: insertedGoals } = await supabase
    .from("goals")
    .upsert(
      goals.map(([thrustArea, title, uomType, targetValue, weightage]) => ({
        profile_id: employeeId,
        thrust_area: thrustArea,
        title,
        description: `${title} - seeded record`,
        uom_type: uomType,
        target_value: targetValue,
        weightage,
        status: "locked",
        locked_at: new Date().toISOString(),
      })),
      { onConflict: "profile_id,title" }
    )
    .select("id,title");

  if (!insertedGoals) return;

  const checkins = insertedGoals.flatMap((goal) => [
    { goal_id: goal.id, quarter: "Q1", actual_value: "50", status: "On Track" },
    { goal_id: goal.id, quarter: "Q2", actual_value: "80", status: "Completed" },
  ]);

  await supabase.from("checkins").upsert(checkins, { onConflict: "goal_id,quarter" });

  await supabase.from("audit_log").insert({
    actor_id: managerId,
    goal_id: insertedGoals[0].id,
    action: "approve_goal_sheet",
    old_value: { status: "submitted" },
    new_value: { status: "locked" },
  });

  await supabase.from("escalation_log").insert({
    profile_id: employeeId,
    escalation_type: "checkin_due",
    notes: "Seeded escalation entry",
  });

  console.log("Seed complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
