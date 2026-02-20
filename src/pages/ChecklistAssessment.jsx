import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { Card, Button, ProgressBar } from '../components/ui/components';
import { questions, codeNames } from '../data/questions';

const TOTAL_CODES = 7;
const QUESTIONS_PER_CODE = 6;

const ChecklistAssessment = () => {
  const navigate = useNavigate();
  const [currentCode, setCurrentCode] = useState(1);
  const [answers, setAnswers] = useState({});
  const [memberName, setMemberName] = useState('');

  useEffect(() => {
    const name = sessionStorage.getItem('currentMember');
    if (!name) {
      navigate('/assessment/new');
    }
    setMemberName(name);

    const initialAnswers = {};
    for (let i = 1; i <= TOTAL_CODES; i++) {
        initialAnswers[i] = Array(QUESTIONS_PER_CODE).fill(false);
    }
    setAnswers(initialAnswers);
  }, [navigate]);

  const handleToggle = (index) => {
    setAnswers(prev => {
      const newCodeAnswers = [...prev[currentCode]];
      newCodeAnswers[index] = !newCodeAnswers[index];
      return { ...prev, [currentCode]: newCodeAnswers };
    });
  };

  const handleNext = () => {
    if (currentCode < TOTAL_CODES) {
      setCurrentCode(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      finishAssessment();
    }
  };

  const handlePrev = () => {
    if (currentCode > 1) {
      setCurrentCode(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const finishAssessment = () => {
    const scores = {};
    let weakestCode = 1;
    let maxScore = -1;

    for (let i = 1; i <= TOTAL_CODES; i++) {
      const score = answers[i].filter(Boolean).length;
      scores[i] = score;
      if (score > maxScore) {
        maxScore = score;
        weakestCode = i;
      }
    }

    const result = {
      id: Date.now(),
      memberName,
      date: new Date().toISOString(),
      method: 'checklist',
      scores,
      weakestCode,
      answers
    };
    
    localStorage.setItem('lastResult', JSON.stringify(result));
    navigate('/result');
  };

  if (!answers[currentCode]) return null;

  const progress = ((currentCode - 1) * QUESTIONS_PER_CODE) + answers[currentCode].filter(Boolean).length;
  const totalQuestions = TOTAL_CODES * QUESTIONS_PER_CODE;

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Header / Progress */}
      <div className="sticky top-16 bg-white/90 backdrop-blur-md z-30 py-4 mb-6 border-b border-slate-100">
        <div className="flex justify-between items-center mb-2">
            <div>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">단계 {currentCode} / {TOTAL_CODES}</span>
                <h2 className="text-xl font-bold text-slate-800">Code {currentCode}: {codeNames[currentCode]}</h2>
            </div>
            <div className="text-right">
                <div className="text-sm font-medium text-brand-primary">{Math.round((progress/totalQuestions)*100)}%</div>
            </div>
        </div>
        <ProgressBar progress={progress} total={totalQuestions} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            {questions[currentCode].map((q, idx) => (
              <motion.div
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggle(idx)}
                className={`
                  p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4
                  ${answers[currentCode][idx] 
                    ? `bg-blue-50 border-blue-500 shadow-md` 
                    : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'}
                `}
              >
                <div className={`
                  mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors
                  ${answers[currentCode][idx] ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white'}
                `}>
                  {answers[currentCode][idx] && <CheckCircle size={16} />}
                </div>
                <p className={`text-lg font-medium ${answers[currentCode][idx] ? 'text-blue-900' : 'text-slate-700'}`}>
                  {q}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-between max-w-7xl mx-auto w-full z-40">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentCode === 1}
          className="w-32"
        >
          <ChevronLeft size={18} /> 이전
        </Button>
        <Button 
          variant={currentCode === TOTAL_CODES ? "secondary" : "primary"}
          onClick={handleNext}
          className="w-32"
        >
          {currentCode === TOTAL_CODES ? '완료' : '다음'} 
          {currentCode !== TOTAL_CODES && <ChevronRight size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default ChecklistAssessment;
