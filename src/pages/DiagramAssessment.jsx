import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button, ProgressBar } from '../components/ui/components';
import { diagramKeywords } from '../data/keywords';
import { codeNames } from '../data/questions';

const TOTAL_CODES = 7;
const CODE_COLORS = ['#EF4444','#F97316','#EAB308','#22C55E','#3B82F6','#6366F1','#A855F7'];

const DiagramAssessment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedByCode, setSelectedByCode] = useState({});
  const [memberName, setMemberName] = useState('');

  useEffect(() => {
    const name = sessionStorage.getItem('currentMember');
    if (!name) {
      navigate('/assessment/new');
      return;
    }
    setMemberName(name);

    // Initialize selection state
    const init = {};
    for (let i = 1; i <= TOTAL_CODES; i++) {
      init[i] = [];
    }
    setSelectedByCode(init);
  }, [navigate]);

  const currentKeywords = diagramKeywords[currentStep] || [];
  const currentColor = CODE_COLORS[currentStep - 1];

  const toggleKeyword = (keyword) => {
    setSelectedByCode(prev => {
      const current = prev[currentStep] || [];
      const exists = current.includes(keyword);
      return {
        ...prev,
        [currentStep]: exists
          ? current.filter(k => k !== keyword)
          : [...current, keyword]
      };
    });
  };

  const handleNext = () => {
    if (currentStep < TOTAL_CODES) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      finishAssessment();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const finishAssessment = () => {
    const scores = {};
    let weakestCode = 1;
    let maxScore = -1;
    const allSelected = [];

    for (let i = 1; i <= TOTAL_CODES; i++) {
      const count = (selectedByCode[i] || []).length;
      scores[i] = count;
      allSelected.push(...(selectedByCode[i] || []).map(k => ({ text: k, code: i })));
      if (count > maxScore) {
        maxScore = count;
        weakestCode = i;
      }
    }

    const result = {
      id: Date.now(),
      memberName,
      date: new Date().toISOString(),
      method: 'diagram',
      scores,
      weakestCode,
      answers: allSelected.map(k => k.text),
      selectedByCode
    };

    localStorage.setItem('lastResult', JSON.stringify(result));
    navigate('/result');
  };

  const totalSelected = Object.values(selectedByCode).flat().length;
  const currentSelected = (selectedByCode[currentStep] || []);

  return (
    <div className="max-w-3xl mx-auto pb-28">
      {/* Header / Progress */}
      <div className="sticky top-16 bg-white/90 backdrop-blur-md z-30 py-4 mb-6 border-b border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              단계 {currentStep} / {TOTAL_CODES}
            </span>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span 
                className="inline-block w-4 h-4 rounded-full" 
                style={{ backgroundColor: currentColor }}
              />
              Code {currentStep}: {codeNames[currentStep]}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium" style={{ color: currentColor }}>
              {currentSelected.length}개 선택
            </div>
          </div>
        </div>
        <ProgressBar progress={currentStep} total={TOTAL_CODES} />
      </div>

      {/* Instruction */}
      <div className="text-center mb-8">
        <p className="text-slate-500">
          아래 키워드 중 현재 자신에게 해당되는 것을 <strong className="text-slate-700">모두</strong> 선택해주세요.
        </p>
      </div>

      {/* Keywords Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 px-2"
        >
          {currentKeywords.map((keyword, idx) => {
            const isSelected = currentSelected.includes(keyword);
            return (
              <motion.button
                key={keyword}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleKeyword(keyword)}
                className={`
                  relative px-5 py-5 rounded-2xl text-base font-semibold transition-all duration-200 
                  border-2 shadow-sm
                  ${isSelected 
                    ? 'text-white shadow-lg scale-[1.02]' 
                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
                `}
                style={isSelected ? { 
                  backgroundColor: currentColor, 
                  borderColor: currentColor,
                  boxShadow: `0 8px 25px ${currentColor}40` 
                } : {}}
              >
                {isSelected && (
                  <Check size={16} className="absolute top-2 right-2 text-white/70" />
                )}
                {keyword}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Total Selected Badge */}
      <div className="flex justify-center mt-8">
        <div className="bg-slate-100 text-slate-600 px-5 py-2 rounded-full text-sm font-medium">
          총 <strong className="text-slate-900">{totalSelected}</strong>개 키워드 선택됨
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-between max-w-7xl mx-auto w-full z-40">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentStep === 1}
          className="w-32"
        >
          <ChevronLeft size={18} /> 이전
        </Button>
        <Button 
          variant={currentStep === TOTAL_CODES ? "secondary" : "primary"}
          onClick={handleNext}
          className="w-32"
        >
          {currentStep === TOTAL_CODES ? '결과 보기' : '다음'} 
          {currentStep !== TOTAL_CODES && <ChevronRight size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default DiagramAssessment;
