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
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Patient {
  patient_id: number;
  name: string;
  status: string;
  contact_number: string;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/patients`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      toast.error('Failed to fetch patients');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/patients`, {
        method: editingPatient ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingPatient ? 'Patient updated' : 'Patient added');
        fetchPatients();
        setIsOpen(false);
        reset();
        setEditingPatient(null);
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
        <h2 className="text-3xl font-bold">Patients</h2>
        <Dialog open={isOpen} onOpenChange={(open)=>{
          if(!open) {
            setEditingPatient(null);
            setIsOpen(open);
        }}}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input id="contact" {...register('contact_number')} />
              </div>
              <Button type="submit" className="w-full">
                {editingPatient ? 'Update' : 'Add'} Patient
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
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.patient_id}>
                <TableCell>{patient.patient_id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    patient.status === 'admitted' 
                      ? 'bg-green-100 text-green-800'
                      : patient.status === 'discharged'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {patient.status}
                  </span>
                </TableCell>
                <TableCell>{patient.contact_number}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingPatient(patient);
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
                          await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/patients/${patient.patient_id}`, {
                            method: 'DELETE',
                          });
                          toast.success('Patient deleted');
                          fetchPatients();
                        } catch (error) {
                          toast.error('Failed to delete patient');
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