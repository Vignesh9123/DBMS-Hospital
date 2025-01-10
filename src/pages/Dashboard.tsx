import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2 ,Home} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Stats {
  totalPatients: number;
  totalDoctors: number;
  totalDepartments: number;
  availableRooms: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalDepartments: 0,
    availableRooms: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/patients`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/doctors`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/departments`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_APP_BACKEND_URI}/api/rooms`).then(res => res.json()),
    ]).then(([patients, doctors, departments, rooms]) => {
      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        totalDepartments: departments.length,
        availableRooms: rooms.filter((room: any) => room.status === 'available').length,
      });
    });
  }, []);

  const cards = [
    { title: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'text-blue-600' },
    { title: 'Total Doctors', value: stats.totalDoctors, icon: Users, color: 'text-green-600' },
    { title: 'Departments', value: stats.totalDepartments, icon: Building2, color: 'text-purple-600' },
    { title: 'Available Rooms', value: stats.availableRooms, icon: Home, color: 'text-orange-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}