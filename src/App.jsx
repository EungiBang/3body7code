import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import AssessmentMethod from './pages/AssessmentMethod';
import ChecklistAssessment from './pages/ChecklistAssessment';
import DiagramAssessment from './pages/DiagramAssessment';
import Result from './pages/Result';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assessment/new" element={<AssessmentMethod />} />
          <Route path="/assessment/checklist" element={<ChecklistAssessment />} />
          <Route path="/assessment/diagram" element={<DiagramAssessment />} />
          <Route path="/result" element={<Result />} />
          <Route path="/records" element={
            <div className="p-8 text-center text-slate-500">
              <h2 className="text-2xl font-bold text-slate-400 mb-2">진단 기록</h2>
              <p>이 기능은 준비 중입니다.</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
