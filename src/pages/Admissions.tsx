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
import { BedDouble } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Admission {
  admission_id: number;
  patient_id: number;
  room_id: number;
  admission_date: string;
  discharge_date: string | null;
  primary_doctor_id: number;
  status: string;
  patient_name: string;
  doctor_name: string;
  room_number: string;
}

interface Patient {
  patient_id: number;
  name: string;
  status: string;
}

interface Doctor {
  doctor_id: number;
  name: string;
}

interface Room {
  room_id: number;
  room_number: string;
  status: string;
}

export default function Admissions() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState<Admission | null>(null);

  const { handleSubmit, reset, control } = useForm();

  useEffect(() => {
    fetchAdmissions();
    fetchPatients();
    fetchDoctors();
    fetchRooms();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/admissions`);
      const data = await response.json();
      console.log(data);
      setAdmissions(data);
    } catch (error) {
      toast.error('Failed to fetch admissions');
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/patients`);
      const data = await response.json();
      setPatients(data.filter((p: Patient) => p.status !== 'admitted'));
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

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/rooms`);
      const data = await response.json();
      setRooms(data.filter((r: Room) => r.status === 'available'));
    } catch (error) {
      toast.error('Failed to fetch rooms');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/admissions`, {
        method: editingAdmission ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingAdmission ? 'Admission updated' : 'Patient admitted');
        fetchAdmissions();
        fetchPatients();
        fetchRooms();
        setIsOpen(false);
        reset();
        setEditingAdmission(null);
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDischarge = async (admission: Admission) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/admissions/${admission.admission_id}/discharge`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Patient discharged');
        fetchAdmissions();
        fetchPatients();
        fetchRooms();
      }
    } catch (error) {
      toast.error('Failed to discharge patient');
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
        <h2 className="text-3xl font-bold">Admissions</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <BedDouble className="mr-2 h-4 w-4" />
              New Admission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                New Patient Admission
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
                <Label htmlFor="room">Room</Label>
                <Controller
                  name="room_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.room_id} value={room.room_id.toString()}>
                          Room {room.room_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  )}
                />
                
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Primary Doctor</Label>
                <Controller
                  name="primary_doctor_id"
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
                Admit Patient
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
              <TableHead>Room</TableHead>
              <TableHead>Primary Doctor</TableHead>
              <TableHead>Admission Date</TableHead>
              <TableHead>Discharge Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admissions.map((admission) => (
              <TableRow key={admission.admission_id}>
                <TableCell>{admission.admission_id}</TableCell>
                <TableCell>{admission.patient_name}</TableCell>
                <TableCell>Room {admission.room_number}</TableCell>
                <TableCell>{admission.doctor_name}</TableCell>
                <TableCell>
                  {format(new Date(admission.admission_date), 'PPp')}
                </TableCell>
                <TableCell>
                  {admission.discharge_date 
                    ? format(new Date(admission.discharge_date), 'PPp')
                    : '-'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    admission.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {admission.status}
                  </span>
                </TableCell>
                <TableCell className="space-x-2">
                  {admission.status === 'active' && (
                    <Button
                      size="sm"
                      onClick={() => handleDischarge(admission)}
                    >
                      Discharge
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}