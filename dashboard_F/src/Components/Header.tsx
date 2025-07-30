import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function Header() {
  const { state, dispatch } = useDashboard();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <motion.header
      className="bg-white shadow-lg border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png.jpg" 
              alt="Naaree Collections" 
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                Naaree Collections
              </h1>
              <p className="text-xs text-gray-500">Seller Dashboard</p>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">{state.user?.name}</p>
                <p className="text-gray-500">{state.user?.email}</p>
              </div>
            </div>
            
            <motion.button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
