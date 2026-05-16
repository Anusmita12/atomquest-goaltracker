'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Send, Check, Lock, Pencil, Trash2 } from 'lucide-react';
import { Goal } from '@/lib/mock-data';
import { useGoals } from '@/lib/GoalContext';
import { StatusBadge, ScoreBadge } from '@/components/ui/status-badge';

function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
      <Check className="h-4 w-4" />
      {message}
    </div>
  );
}

const EMPLOYEE_ID = 'e1';

export default function EmployeeGoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();
  const [toast, setToast] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formError, setFormError] = useState('');

  const blankForm = (): Partial<Goal> => ({
    title: '', description: '', thrustArea: 'Revenue', weightage: 10, uom: 'min', targetValue: 100,
  });
  const [form, setForm] = useState<Partial<Goal>>(blankForm());

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const employeeGoals = goals.filter(g => g.employeeId === EMPLOYEE_ID);
  const totalWeight = employeeGoals.reduce((s, g) => s + g.weightage, 0);
  const approved = employeeGoals.filter(g => g.status === 'Approved').length;
  const pending = employeeGoals.filter(g => g.status === 'Pending').length;

  const openAdd = () => {
    setEditingGoal(null);
    setForm(blankForm());
    setFormError('');
    setIsAddOpen(true);
  };

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setForm({ ...goal });
    setFormError('');
    setIsAddOpen(true);
  };

  const handleSave = () => {
    setFormError('');
    if (!form.title?.trim()) { setFormError('Goal title is required.'); return; }
    const newWeight = Number(form.weightage) || 10;
    if (newWeight < 10) { setFormError('Minimum weightage is 10%.'); return; }

    if (editingGoal) {
      // Editing
      updateGoal(editingGoal.id, {
        title: form.title,
        description: form.description,
        thrustArea: form.thrustArea,
        weightage: newWeight,
        uom: form.uom,
        targetValue: form.targetValue,
        deadline: form.deadline,
      });
      showToast('Goal updated!');
    } else {
      // New goal
      if (employeeGoals.length >= 8) { setFormError('Maximum 8 goals allowed.'); return; }
      const usedWeight = employeeGoals.reduce((s, g) => s + g.weightage, 0);
      if (usedWeight + newWeight > 100) { setFormError(`Only ${100 - usedWeight}% weightage remaining.`); return; }
      addGoal({
        id: `e1_${Date.now()}`,
        employeeId: EMPLOYEE_ID,
        title: form.title!,
        description: form.description,
        thrustArea: form.thrustArea || 'Revenue',
        weightage: newWeight,
        uom: (form.uom as Goal['uom']) || 'min',
        unit: form.uom === 'timeline' ? 'date' : 'units',
        targetValue: form.uom === 'zero' ? 0 : form.targetValue || 100,
        deadline: form.deadline,
        status: 'Draft',
        q1: null, q2: null, q3: null,
        score: 0,
      });
      showToast('Goal added!');
    }
    setIsAddOpen(false);
  };

  const handleDelete = (goal: Goal) => {
    if (goal.status !== 'Draft' && goal.status !== 'Returned') {
      showToast('Only Draft or Returned goals can be deleted.');
      return;
    }
    deleteGoal(goal.id);
    showToast('Goal deleted.');
  };

  const handleSubmitForApproval = () => {
    if (totalWeight !== 100) {
      showToast(`Total weightage must be exactly 100%. Currently: ${totalWeight}%`);
      return;
    }
    const draftGoals = employeeGoals.filter(g => g.status === 'Draft');
    if (draftGoals.length === 0) {
      showToast('No draft goals to submit.');
      return;
    }
    draftGoals.forEach(g => updateGoal(g.id, { status: 'Pending' }));
    showToast('Goals submitted for approval!');
  };

  return (
    <DashboardLayout persona="employee" title="My Goals">
      <Toast message={toast} />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Goals', value: employeeGoals.length },
          { label: 'Approved', value: approved },
          { label: 'Pending', value: pending },
          { label: 'Weight Used', value: `${totalWeight}%` },
        ].map(c => (
          <Card key={c.label} className="shadow-sm border-muted">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="text-2xl font-bold mt-1">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-muted">
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <div>
            <CardTitle>Goal Sheet — FY 2025-26</CardTitle>
            <CardDescription>Current quarter: Q3 2026</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-1" />Add Goal
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitForApproval}
              disabled={totalWeight !== 100}
              title={totalWeight !== 100 ? `Total weight is ${totalWeight}%, must be 100%` : ''}
            >
              <Send className="h-4 w-4 mr-1" />Submit for Approval
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Thrust Area</TableHead>
                <TableHead className="w-[260px]">Goal Title</TableHead>
                <TableHead>UoM</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Q3 Actual</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeGoals.map(goal => (
                <TableRow key={goal.id} className="hover:bg-muted/10 text-sm">
                  <TableCell>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {goal.thrustArea}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {goal.title}
                      {goal.isShared && (
                        <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px] px-1.5 py-0">
                          <Lock className="h-2.5 w-2.5 mr-0.5" />Shared
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground uppercase">{goal.uom}</TableCell>
                  <TableCell className="text-sm">
                    {typeof goal.targetValue === 'number'
                      ? goal.unit === '₹' ? `₹${(goal.targetValue / 1000000).toFixed(0)}Cr` : `${goal.targetValue} ${goal.unit}`
                      : goal.targetValue}
                  </TableCell>
                  <TableCell>{goal.weightage}%</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {goal.q3 !== null ? String(goal.q3) : '—'}
                  </TableCell>
                  <TableCell><ScoreBadge score={goal.score} /></TableCell>
                  <TableCell><StatusBadge status={goal.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {!goal.isShared && (goal.status === 'Draft' || goal.status === 'Returned') && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(goal)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {goal.isShared && (goal.status === 'Draft' || goal.status === 'Returned') && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(goal)} title="Only weightage is editable">
                          <Pencil className="h-3.5 w-3.5 text-blue-500" />
                        </Button>
                      )}
                      {(goal.status === 'Draft' || goal.status === 'Returned') && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleDelete(goal)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="border-t px-6 py-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Total Weightage</span>
            <span className={`font-semibold ${totalWeight === 100 ? 'text-emerald-600' : 'text-red-600'}`}>{totalWeight}%</span>
          </div>
          <Progress value={totalWeight} className="h-2" />
        </div>
      </Card>

      {/* Add / Edit Goal Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingGoal ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
            <DialogDescription>
              {editingGoal?.isShared
                ? 'This is a shared goal. Only the Weightage field can be edited.'
                : 'Define your KPI. Total weightage must equal 100%.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {formError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">{formError}</p>
            )}
            <div className="space-y-2">
              <Label>Goal Title *</Label>
              <Input
                placeholder="e.g. Increase Quarterly Sales"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                disabled={!!editingGoal?.isShared}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Thrust Area</Label>
                <Select
                  value={form.thrustArea}
                  onValueChange={v => setForm({ ...form, thrustArea: v })}
                  disabled={!!editingGoal?.isShared}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Revenue', 'Cost', 'Quality', 'People', 'Innovation'].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Weightage (%) {editingGoal?.isShared && <span className="text-blue-600 text-xs">(only editable field)</span>}</Label>
                <Input
                  type="number"
                  value={form.weightage}
                  onChange={e => setForm({ ...form, weightage: Number(e.target.value) })}
                />
                {!editingGoal && (
                  <p className="text-[10px] text-muted-foreground">
                    Available: {100 - employeeGoals.reduce((acc, g) => acc + g.weightage, 0)}%
                  </p>
                )}
              </div>
            </div>
            {!editingGoal?.isShared && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>UoM Type</Label>
                  <Select value={form.uom} onValueChange={v => setForm({ ...form, uom: v as Goal['uom'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="min">Minimum (Target)</SelectItem>
                      <SelectItem value="max">Maximum (Limit)</SelectItem>
                      <SelectItem value="timeline">Timeline (Date)</SelectItem>
                      <SelectItem value="zero">Zero (Incident)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.uom !== 'zero' && (
                  <div className="space-y-2">
                    <Label>{form.uom === 'timeline' ? 'Target Date' : 'Target Value'}</Label>
                    {form.uom === 'timeline'
                      ? <Input type="date" value={form.deadline ?? ''} onChange={e => setForm({ ...form, deadline: e.target.value, targetValue: e.target.value })} />
                      : <Input type="number" value={String(form.targetValue || '')} onChange={e => setForm({ ...form, targetValue: Number(e.target.value) })} />
                    }
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingGoal ? 'Save Changes' : 'Add Goal'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
