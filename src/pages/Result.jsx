import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Share2, Download, RefreshCw, Heart, Sparkles } from 'lucide-react';
import { Card, Button } from '../components/ui/components';
import { codeNames } from '../data/questions';
import { diagramKeywords } from '../data/keywords';
import { recommendations } from '../data/recommendations';

const CODE_COLORS = {
  1: '#EF4444', 2: '#F97316', 3: '#EAB308', 4: '#22C55E', 5: '#3B82F6', 6: '#6366F1', 7: '#A855F7'
};

const CODE_LABELS = {
  1: '생존·안정', 2: '감정·관계', 3: '의지·자존감', 4: '사랑·연민', 
  5: '표현·소통', 6: '통찰·직관', 7: '영성·연결'
};

// Generate heptagon (7-sided polygon) points
function getHeptagonPoints(cx, cy, radius, count = 7) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2; // start from top
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return points;
}

// Star Diagram Component
const StarDiagram = ({ scores, maxScore }) => {
  const size = 420;
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = 160;
  const innerLabelRadius = 195;

  const outerPoints = getHeptagonPoints(cx, cy, outerRadius);
  const outerPath = outerPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Score polygon (radar-like)
  const scoreMax = Math.max(maxScore, 1);
  const scorePoints = Object.entries(scores).map(([code, score], i) => {
    const ratio = score / scoreMax;
    const r = outerRadius * Math.max(ratio, 0.1);
    const angle = (Math.PI * 2 * i) / 7 - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
  const scorePath = scorePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-md mx-auto">
      <defs>
        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background heptagon */}
      <path d={outerPath} fill="none" stroke="#e2e8f0" strokeWidth="2" />

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((ratio, ri) => {
        const gridPts = getHeptagonPoints(cx, cy, outerRadius * ratio);
        const gPath = gridPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={ri} d={gPath} fill="none" stroke="#f1f5f9" strokeWidth="1" />;
      })}

      {/* Axis lines from center to each vertex */}
      {outerPoints.map((p, i) => (
        <line key={`axis-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth="1" />
      ))}

      {/* Score polygon */}
      <motion.path
        d={scorePath}
        fill="url(#scoreGrad)"
        stroke="#3B82F6"
        strokeWidth="2.5"
        filter="url(#glow)"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Score dots */}
      {scorePoints.map((p, i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={p.x}
          cy={p.y}
          r="6"
          fill={CODE_COLORS[i + 1]}
          stroke="white"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        />
      ))}

      {/* Labels */}
      {outerPoints.map((p, i) => {
        const lp = getHeptagonPoints(cx, cy, innerLabelRadius)[i];
        const code = i + 1;
        return (
          <g key={`label-${i}`}>
            <circle cx={lp.x} cy={lp.y} r="14" fill={CODE_COLORS[code]} opacity="0.15" />
            <text 
              x={lp.x} y={lp.y - 10} 
              textAnchor="middle" 
              fontSize="11" 
              fontWeight="700" 
              fill={CODE_COLORS[code]}
            >
              C{code}
            </text>
            <text 
              x={lp.x} y={lp.y + 5} 
              textAnchor="middle" 
              fontSize="9" 
              fontWeight="500" 
              fill="#64748b"
            >
              {CODE_LABELS[code]}
            </text>
            <text 
              x={lp.x} y={lp.y + 18} 
              textAnchor="middle" 
              fontSize="11" 
              fontWeight="700" 
              fill="#1e293b"
            >
              {scores[code]}점
            </text>
          </g>
        );
      })}

      {/* Center label */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="#64748b">7-CODE</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="10" fontWeight="500" fill="#94a3b8">DIAGRAM</text>
    </svg>
  );
};

const Result = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedResult = localStorage.getItem('lastResult');
    if (!savedResult) {
      navigate('/');
      return;
    }
    setResult(JSON.parse(savedResult));
  }, [navigate]);

  if (!result) return null;

  const maxScore = Math.max(...Object.values(result.scores));
  const weakestData = recommendations[result.weakestCode];

  // Sort codes by score descending
  const sortedCodes = Object.entries(result.scores)
    .sort(([,a], [,b]) => b - a)
    .map(([code, score]) => ({ code: parseInt(code), score }));

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">진단 결과</h1>
          <p className="text-slate-500">
            <span className="font-semibold text-slate-900">{result.memberName}</span>님 분석 결과 • {new Date(result.date).toLocaleDateString('ko-KR')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Download size={18} /> PDF 저장
          </Button>
          <Button variant="outline">
            <Share2 size={18} /> 공유
          </Button>
        </div>
      </div>

      {/* Star Diagram */}
      <Card className="py-8">
        <h3 className="text-xl font-bold text-slate-800 text-center mb-4">7-Code 균형 다이어그램</h3>
        <StarDiagram scores={result.scores} maxScore={maxScore} />
      </Card>

      {/* Score Summary Bar */}
      <div className="grid grid-cols-7 gap-2">
        {sortedCodes.map(({ code, score }) => (
          <motion.div 
            key={code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: code * 0.1 }}
            className="text-center"
          >
            <div 
              className="h-24 rounded-xl flex items-end justify-center pb-2 mb-1 transition-all"
              style={{ 
                background: `linear-gradient(to top, ${CODE_COLORS[code]}20, ${CODE_COLORS[code]}${Math.min(score * 20 + 10, 99).toString(16)})`,
                border: `2px solid ${CODE_COLORS[code]}30`
              }}
            >
              <span className="text-lg font-bold" style={{ color: CODE_COLORS[code] }}>{score}</span>
            </div>
            <span className="text-xs font-medium text-slate-500">C{code}</span>
          </motion.div>
        ))}
      </div>

      {/* Weakest Code Analysis */}
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-orange-100">
        <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          우선 관리 필요
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          <span className="inline-block w-5 h-5 rounded-full mr-2" style={{ backgroundColor: CODE_COLORS[result.weakestCode] }} />
          Code {result.weakestCode} : {codeNames[result.weakestCode]}
        </h2>
        <p className="text-slate-600 leading-relaxed mb-6">
          이 코드가 가장 높은 불균형 점수를 나타냅니다. 이 영역을 집중적으로 관리하면 전체적인 뇌-체 균형 개선에 가장 큰 효과가 있습니다.
        </p>
        
        {/* Keywords that were selected for weakest code */}
        {result.selectedByCode && result.selectedByCode[result.weakestCode] && (
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-500 mb-2">선택된 키워드:</p>
            <div className="flex flex-wrap gap-2">
              {result.selectedByCode[result.weakestCode].map((kw, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-sm font-medium text-white" 
                  style={{ backgroundColor: CODE_COLORS[result.weakestCode] }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* 7-CODE 라이프 처방 */}
      <h3 className="text-2xl font-bold text-slate-800 mt-8">7-CODE 라이프 처방</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 처방 */}
        <Card className="hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: CODE_COLORS[result.weakestCode] }}>
              <Heart size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">라이프 처방</h4>
              <p className="text-sm text-slate-400">Code {result.weakestCode} · {codeNames[result.weakestCode]}</p>
            </div>
          </div>
          <ul className="space-y-3">
            {weakestData.prescriptions.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span 
                  className="mt-2 w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CODE_COLORS[result.weakestCode] }}
                />
                <span className="text-slate-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* BT프로그램 */}
        <Card className="hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent shadow-md">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">추천 BT 프로그램</h4>
              <p className="text-sm text-slate-400">Brain Training Center</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {weakestData.btPrograms.map((item, i) => (
              <div key={i} className="flex-1 min-w-[120px] p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 text-center">
                <span className="text-base font-bold text-slate-800 whitespace-pre-line">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex justify-center pt-8 pb-12">
        <Button onClick={() => navigate('/')} className="px-8">
           <RefreshCw size={18} /> 새 진단 시작
        </Button>
      </div>
    </div>
  );
};

export default Result;
