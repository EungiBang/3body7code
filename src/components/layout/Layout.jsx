import React from 'react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { label: '홈', path: '/' },
    { label: '새 진단', path: '/assessment/new' },
    { label: '기록 보기', path: '/records' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/logo.jpg" alt="BrainTraining Center" className="h-10 object-contain" />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-brand-primary ${
                location.pathname === item.path ? 'text-brand-primary' : 'text-slate-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-slate-600" onClick={toggleSidebar}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-2xl p-6 pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className="text-lg font-medium text-slate-700 py-2 border-b border-slate-100"
                    onClick={toggleSidebar}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
