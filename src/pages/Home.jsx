import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, ClipboardList, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/components';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-3xl">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <img 
            src="/assets/main_visual.jpg" 
            alt="3Body 7Code" 
            className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
          />
        </motion.div>
        
        <motion.h1 
          className="text-4xl md:text-5xl font-display font-bold text-slate-800 mb-4 tracking-tight leading-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            3 Body 7 Code
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-lg text-slate-500 font-medium"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          뇌교육 5단계 기반 종합 진단 시스템
        </motion.p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        <Link to="/assessment/new" className="block group">
          <Card className="h-full hover:border-blue-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1 cursor-pointer">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Activity size={28} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">새 진단 시작</h3>
              <p className="text-slate-500 mb-8">회원의 7-Code 종합 진단을 시작합니다.</p>
              
              <div className="flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
                시작하기 <ChevronRight className="ml-2 w-5 h-5" />
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/records" className="block group">
          <Card className="h-full hover:border-emerald-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1 cursor-pointer">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <ClipboardList size={28} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">진단 기록</h3>
              <p className="text-slate-500 mb-8">과거 진단 결과, 이력 및 추이를 확인합니다.</p>
              
              <div className="flex items-center text-emerald-600 font-bold group-hover:translate-x-2 transition-transform">
                기록 보기 <ChevronRight className="ml-2 w-5 h-5" />
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <footer className="mt-24 text-slate-400 text-sm font-medium">
        © {new Date().getFullYear()} BrainTraining Center. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
