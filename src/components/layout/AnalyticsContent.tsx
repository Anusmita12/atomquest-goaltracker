'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import { DEPT_TREND, THRUST_DISTRIBUTION, EMPLOYEE_SCORES } from '@/lib/mock-data';

const PIE_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e'];

export function AnalyticsContent() {
  return (
    <div className="space-y-8">
      {/* Line Chart */}
      <Card className="shadow-sm border-muted">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle>Department Progress — Q1 to Q3</CardTitle>
          <CardDescription>Quarterly score trend per department</CardDescription>
        </CardHeader>
        <CardContent className="p-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={DEPT_TREND}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)' }} />
              <Legend />
              <Line type="monotone" dataKey="Engineering" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="Sales" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="Operations" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Pie Chart */}
        <Card className="shadow-sm border-muted">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle>Goals by Thrust Area</CardTitle>
            <CardDescription>Distribution of goal count</CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={THRUST_DISTRIBUTION} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {THRUST_DISTRIBUTION.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="shadow-sm border-muted">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle>Employee Performance</CardTitle>
            <CardDescription>Overall score per employee</CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EMPLOYEE_SCORES} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)' }} />
                <Bar dataKey="score" name="Overall Score" radius={[4, 4, 0, 0]}>
                  {EMPLOYEE_SCORES.map((entry, i) => {
                    const color = entry.score >= 90 ? '#10b981' : entry.score >= 70 ? '#f59e0b' : '#f43f5e';
                    return <Cell key={i} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
