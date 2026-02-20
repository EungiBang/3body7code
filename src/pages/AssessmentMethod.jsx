import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Grid, ChevronRight, User } from 'lucide-react';
import { Card, Button } from '../components/ui/components';

const AssessmentMethod = () => {
  const navigate = useNavigate();
  const [memberName, setMemberName] = useState('');

  const handleStart = (method) => {
    if (!memberName.trim()) {
      alert('회원 이름을 입력해주세요.');
      return;
    }
    sessionStorage.setItem('currentMember', memberName);
    navigate(`/assessment/${method}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-4">새 진단 시작</h1>
        <p className="text-slate-500">회원 정보를 입력하고 진단 방법을 선택하세요.</p>
      </motion.div>

      <div className="mb-12 max-w-md mx-auto">
        <label className="block text-sm font-medium text-slate-700 mb-2">회원 이름</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            placeholder="이름을 입력하세요 (예: 홍길동)"
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Checklist Method */}
        <motion.div whileHover={{ y: -5 }} className="cursor-pointer" onClick={() => handleStart('checklist')}>
          <Card className="h-full border-2 border-transparent hover:border-blue-500 transition-all">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <CheckSquare size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">체크리스트</h3>
            <p className="text-slate-500 mb-6 min-h-[48px]">7개 Code별 42개 문항으로 상세 진단합니다.</p>
            <div className="space-y-2 mb-8">
              <div className="flex items-center text-sm text-slate-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                높은 정확도
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                약 10분 소요
              </div>
            </div>
            <Button className="w-full">
              체크리스트 선택 <ChevronRight size={18} />
            </Button>
          </Card>
        </motion.div>

        {/* Diagram Method */}
        <motion.div whileHover={{ y: -5 }} className="cursor-pointer" onClick={() => handleStart('diagram')}>
          <Card className="h-full border-2 border-transparent hover:border-emerald-500 transition-all">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
              <Grid size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">다이어그램</h3>
            <p className="text-slate-500 mb-6 min-h-[48px]">키워드 선택으로 빠르고 직관적으로 진단합니다.</p>
            <div className="space-y-2 mb-8">
              <div className="flex items-center text-sm text-slate-600">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                직관적 & 빠름
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                약 3분 소요
              </div>
            </div>
            <Button variant="secondary" className="w-full">
              다이어그램 선택 <ChevronRight size={18} />
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentMethod;
