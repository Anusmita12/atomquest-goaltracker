import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "GoalTracker",
  description: "Corporate Goal Setting & Tracking Portal",
};

import { GoalProvider } from "@/lib/GoalContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full bg-slate-50/50 text-slate-900 antialiased", "font-sans", geist.variable)}>
      <body className="h-full min-h-screen text-sm font-normal selection:bg-blue-500/10 selection:text-blue-600">
        <GoalProvider>
          {children}
        </GoalProvider>
      </body>
    </html>
  );
}
