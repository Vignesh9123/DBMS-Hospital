import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users,  
  Building2, 
  Home,
  Stethoscope,
  BedDouble
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/patients', icon: Users, label: 'Patients' },
  { path: '/doctors', icon: Users, label: 'Doctors' },
  { path: '/departments', icon: Building2, label: 'Departments' },
  { path: '/rooms', icon: Home, label: 'Rooms' },
  { path: '/treatments', icon: Stethoscope, label: 'Treatments' },
  { path: '/admissions', icon: BedDouble, label: 'Admissions' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-highlight"
                  className="absolute bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="h-5 w-5" />
              <span className="font-medium relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}