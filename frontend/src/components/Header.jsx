import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center max-w-7xl">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-shadow"
          >
            TN
          </motion.div>
          <span className="text-slate-800 text-xl font-bold tracking-tight group-hover:text-primary-600 transition-colors">
            Testers<span className="text-primary-600">Note</span>
          </span>
        </Link>
        
        {location.pathname !== '/create' && (
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Yeni Not
            </motion.button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;