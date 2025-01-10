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

interface Room {
  room_id: number;
  room_number: string;
  type_id: number;
  dept_id: number;
  status: string;
  type_name: string;
  daily_rate: number;
  dept_name: string;
}

interface Department {
  dept_id: number;
  dept_name: string;
}

interface RoomType {
  type_id: number;
  type_name: string;
  daily_rate: number;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const { register, handleSubmit, reset,control, 
    formState: { isSubmitting, isValid },

  } = useForm();

  useEffect(() => {
    fetchRooms();
    fetchDepartments();
    fetchRoomTypes();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/rooms`);
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      toast.error('Failed to fetch rooms');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/departments`);
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      toast.error('Failed to fetch departments');
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/room-types`);
      const data = await response.json();
      setRoomTypes(data);
    } catch (error) {
      toast.error('Failed to fetch room types');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/rooms`, {
        method: editingRoom ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingRoom ? 'Room updated' : 'Room added');
        fetchRooms();
        setIsOpen(false);
        reset();
        setEditingRoom(null);
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
        <h2 className="text-3xl font-bold">Rooms</h2>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            reset( {
              room_number: '',
              type_id: '',
              dept_id: '',});
            setEditingRoom(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
          {editingRoom ? 'Edit Room' : 'Add New Room'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
          <Label htmlFor="room_number">Room Number</Label>
          <Input id="room_number" type="text" placeholder="Room Number" defaultValue={editingRoom?.room_number}  {...register('room_number',{ required: true })} />
              </div>
              <div className="space-y-2">
          <Label htmlFor="type">Room Type</Label>
          <Controller
            name="type_id"
            control={control}
            defaultValue={editingRoom?.type_id?.toString()}
            rules={{required: true}}
            render={({ field }) => (
              <Select  onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent className='max-h-[200px] overflow-auto'>
              {roomTypes.map((type) => (
                <SelectItem key={type.type_id} value={type.type_id.toString()}>
            {type.type_name} - &#8377;{type.daily_rate}/day
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
            )}
          />
          
              </div>
              <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Controller 
            name="dept_id"
            control={control}
            rules={{required: true}}
            defaultValue={editingRoom?.dept_id?.toString()}
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
              <Button type="submit" className="w-full" disabled={isSubmitting || !isValid}>
              
          {editingRoom ? 'Update' : 'Add'} Room
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Daily Rate</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.room_id}>
                <TableCell>{room.room_number}</TableCell>
                <TableCell>{room.type_name}</TableCell>
                <TableCell>{room.dept_name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    room.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : room.status === 'occupied'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {room.status}
                  </span>
                </TableCell>
                <TableCell>&#8377;{room.daily_rate}/day</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingRoom(room);
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
                          await fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/rooms/${room.room_id}`, {
                            method: 'DELETE',
                          });
                          toast.success('Room deleted');
                          fetchRooms();
                        } catch (error) {
                          toast.error('Failed to delete room');
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