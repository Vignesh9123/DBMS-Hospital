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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Doctor {
  doctor_id: number;
  name: string;
  dept_id: number;
  dept_name: string;
}

interface Department {
  dept_id: number;
  dept_name: string;
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const { register, handleSubmit, reset, control } = useForm();

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/doctors`);
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/departments`);
      const data = await response.json();
      console.log(data)
      setDepartments(data);
    } catch (error) {
      toast.error('Failed to fetch departments');
    }
  };

  const onSubmit = async (data: any) => {
    console.log
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/doctors`, {
        method: editingDoctor ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingDoctor ? 'Doctor updated' : 'Doctor added');
        fetchDoctors();
        setIsOpen(false);
        reset();
        setEditingDoctor(null);
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
        <h2 className="text-3xl font-bold">Doctors</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                  <Controller
                    name="dept_id"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.dept_id} value={dept.dept_id.toString()}>
                              {dept.dept_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
              </div>
              <Button type="submit" className="w-full">
                {editingDoctor ? 'Update' : 'Add'} Doctor
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
              <TableHead>Department</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.doctor_id}>
                <TableCell>{doctor.doctor_id}</TableCell>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.dept_name}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingDoctor(doctor);
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
                          await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/doctors/${doctor.doctor_id}`, {
                            method: 'DELETE',
                          });
                          toast.success('Doctor deleted');
                          fetchDoctors();
                        } catch (error) {
                          toast.error('Failed to delete doctor');
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