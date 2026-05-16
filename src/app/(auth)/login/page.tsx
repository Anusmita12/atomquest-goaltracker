"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DEMO_USERS = [
  { label: "Employee", email: "employee@demo.com", path: "/dashboard/employee" },
  { label: "Manager", email: "manager@demo.com", path: "/dashboard/manager" },
  { label: "Admin", email: "admin@demo.com", path: "/dashboard/admin/cycles" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("employee@demo.com");
  const [password, setPassword] = useState("Demo@1234");

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const found = DEMO_USERS.find((user) => user.email === email);
    router.push(found?.path ?? "/dashboard/employee");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-6">
      <h1 className="mb-4 text-2xl font-bold">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3 rounded border bg-white p-4">
        <input className="w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full rounded border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button className="w-full rounded bg-black px-4 py-2 text-white" type="submit">Login</button>
      </form>
      <div className="mt-6 rounded border bg-white p-4">
        <p className="mb-2 text-sm font-semibold">Demo login</p>
        <div className="grid gap-2">
          {DEMO_USERS.map((user) => (
            <button key={user.email} onClick={() => router.push(user.path)} className="rounded border px-3 py-2 text-left text-sm hover:bg-zinc-50" type="button">
              {user.label} ({user.email})
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
