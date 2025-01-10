import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from '@/pages/Dashboard';
import Patients from '@/pages/Patients';
import Doctors from '@/pages/Doctors';
import Departments from '@/pages/Departments';
import Rooms from '@/pages/Rooms';
import Treatments from '@/pages/Treatments';
import Admissions from '@/pages/Admissions';
import Sidebar from '@/components/Sidebar';
import { Hospital } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <Hospital className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Hospital Management System
              </h1>
            </motion.div>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/treatments" element={<Treatments />} />
                <Route path="/admissions" element={<Admissions />} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;