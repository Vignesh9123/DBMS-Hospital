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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Stethoscope, Edit, Trash2 } from 'lucide-react';
import { useForm,Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Treatment {
  treatment_id: number;
  patient_id: number;
  doctor_id: number;
  treatment_date: string;
  patient_name: string;
  doctor_name: string;
}

interface Patient {
  patient_id: number;
  name: string;
}

interface Doctor {
  doctor_id: number;
  name: string;
}

export default function Treatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);

  const {  handleSubmit, reset, control } = useForm();

  useEffect(() => {
    fetchTreatments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchTreatments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/treatments`);
      const data = await response.json();
      setTreatments(data);
    } catch (error) {
      toast.error('Failed to fetch treatments');
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/patients`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      toast.error('Failed to fetch patients');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/doctors`);
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  const onSubmit = async (data: any) => {
    console.log(data)
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/treatments`, {
        method: editingTreatment ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingTreatment ? 'Treatment updated' : 'Treatment added');
        fetchTreatments();
        setIsOpen(false);
        reset();
        setEditingTreatment(null);
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
        <h2 className="text-3xl font-bold">Treatments</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Stethoscope className="mr-2 h-4 w-4" />
              Add Treatment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTreatment ? 'Edit Treatment' : 'Add New Treatment'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient</Label>
                <Controller
                  name="patient_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.patient_id} value={patient.patient_id.toString()}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  )}
               />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Controller
                  name="doctor_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.doctor_id} value={doctor.doctor_id.toString()}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingTreatment ? 'Update' : 'Add'} Treatment
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
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.map((treatment) => (
              <TableRow key={treatment.treatment_id}>
                <TableCell>{treatment.treatment_id}</TableCell>
                <TableCell>{treatment.patient_name}</TableCell>
                <TableCell>{treatment.doctor_name}</TableCell>
                <TableCell>
                  {format(new Date(treatment.treatment_date), 'PPp')}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingTreatment(treatment);
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
                          await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/treatments/${treatment.treatment_id}`, {
                            method: 'DELETE',
                          });
                          toast.success('Treatment deleted');
                          fetchTreatments();
                        } catch (error) {
                          toast.error('Failed to delete treatment');
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