import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Department {
  dept_id: number;
  dept_name: string;
  head_doctor_id: number | null;
}

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/departments`);
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      toast.error('Failed to fetch departments');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/departments`, {
        method: editingDepartment ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingDepartment ? 'Department updated' : 'Department added');
        fetchDepartments();
        setIsOpen(false);
        reset();
        setEditingDepartment(null);
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Departments</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Building2 className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? 'Edit Department' : 'Add New Department'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input id="name" {...register('dept_name')} />
              </div>
              <Button type="submit" className="w-full">
                {editingDepartment ? 'Update' : 'Add'} Department
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.dept_id}>
                <TableCell>{department.dept_id}</TableCell>
                <TableCell>{department.dept_name}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingDepartment(department);
                      setIsOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={async () => {
                      if (confirm('Are you sure?')) {
                        try {
                          await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/departments/${department.dept_id}`, {
                            method: 'DELETE',
                          });
                          toast.success('Department deleted');
                          fetchDepartments();
                        } catch (error) {
                          toast.error('Failed to delete department');
                        }
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}