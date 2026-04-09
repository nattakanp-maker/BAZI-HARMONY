/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LucideSparkles, 
  LucideCalendar, 
  LucideUser, 
  LucideLoader2, 
  LucideRefreshCcw,
  LucideCompass,
  LucideBriefcase,
  LucideHeart,
  LucideInfo,
  LucideShieldCheck,
  LucideUsers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { analyzeBaZi } from './services/geminiService';
import { calculateBaZi } from './lib/bazi-helper';
import { useBaziStore } from './store/useBaziStore';

export default function App() {
  const { 
    appState: state, 
    setAppState: setState, 
    analysis, 
    setAnalysis, 
    userData: formData, 
    setUserData: setFormData 
  } = useBaziStore();

  const [localFormData, setLocalFormData] = useState(formData || {
    name: '',
    birthDate: '',
    birthTime: '',
    gender: 'male'
  });
  
  const [loadingMessage, setLoadingMessage] = useState('กำลังเชื่อมต่อกับดวงดาว...');

  const messages = [
    'กำลังคำนวณรหัสลับ 8 ตัวอักษร...',
    'วิเคราะห์ความสมดุลของ 5 ธาตุ...',
    'ถอดรหัสพลังงานจากวันเกิดของคุณ...',
    'เตรียมคำแนะนำเพื่อความสมดุลของชีวิต...',
    'เกือบเสร็จแล้ว พลังงานกำลังมารวมกัน...'
  ];

  const handleStart = async () => {
    if (!localFormData.birthDate) {
      alert("กรุณาระบุวันเกิดของคุณ");
      return;
    }
    
    setFormData(localFormData);
    setState('loading');
    
    // Cycle through messages
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMessage(messages[msgIndex]);
    }, 2500);

    try {
      // Local calculation for immediate context (could be used to enhance prompt)
      const localBazi = calculateBaZi(localFormData.birthDate, localFormData.birthTime);
      console.log("Local BaZi calculation:", localBazi);

      const result = await analyzeBaZi(
        localFormData.name || "ผู้มาเยือน",
        localFormData.birthDate,
        localFormData.birthTime,
        localFormData.gender
      );
      setAnalysis(result);
      setState('result');
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่อีกครั้ง");
      setState('input');
    } finally {
      clearInterval(interval);
    }
  };

  const chartData = analysis ? [
    { subject: 'ไม้', A: analysis.elements.wood, fullMark: 100 },
    { subject: 'ไฟ', A: analysis.elements.fire, fullMark: 100 },
    { subject: 'ดิน', A: analysis.elements.earth, fullMark: 100 },
    { subject: 'ทอง', A: analysis.elements.metal, fullMark: 100 },
    { subject: 'น้ำ', A: analysis.elements.water, fullMark: 100 },
  ] : [];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2D2D] relative overflow-hidden font-sans selection:bg-indigo-100">
      {/* Vibrant Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-200/30 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[30%] left-[-5%] w-[300px] h-[300px] bg-amber-200/20 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Header (Only show in result state or as a floating logo in input) */}
      {state === 'result' && (
        <header className="p-6 flex justify-between items-center bg-white/60 backdrop-blur-md sticky top-0 z-50 border-b border-indigo-100/50">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <LucideCompass className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-tight text-indigo-900">BaZi Harmony</h1>
          </div>
          <button 
            onClick={() => setState('input')}
            className="text-indigo-700 hover:text-indigo-900 flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <LucideRefreshCcw size={16} />
            เริ่มใหม่
          </button>
        </header>
      )}

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {state === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col justify-center min-h-[80vh]"
            >
              {/* Logo & Symbol */}
              <div className="flex flex-col items-center mb-12">
                <div className="relative mb-6">
                  <div className="absolute inset-0 animate-pulse bg-amber-400/20 rounded-full blur-2xl" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-500 to-rose-400 p-[2px] shadow-2xl shadow-indigo-200">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-4xl font-serif text-indigo-600">八</span>
                    </div>
                  </div>
                </div>
                <h1 className="text-4xl font-serif font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-600 to-rose-600 uppercase">BaZi Harmony</h1>
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-indigo-400 to-transparent mt-2" />
                <p className="mt-4 text-slate-500 font-light italic text-center">"ถอดรหัสธาตุแห่งโชคชะตา ผ่านสมดุลจักรวาล"</p>
              </div>

              {/* Input Form Card (Glassmorphism Style) */}
              <div className="backdrop-blur-xl bg-white/70 rounded-[40px] shadow-[0_20px_60px_rgba(99,102,241,0.1)] border border-white/80 p-8 md:p-12 space-y-8">
                <div className="space-y-6">
                  {/* Input Group: Name */}
                  <div className="relative">
                    <label className="absolute -top-3 left-6 bg-white px-2 text-xs font-bold text-indigo-700 uppercase tracking-tighter z-10">ผู้เป็นเจ้าของชะตา</label>
                    <div className="flex items-center bg-white/50 border border-slate-100 rounded-2xl px-5 transition-all focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-300">
                      <LucideUser className="text-indigo-500" size={18} />
                      <input
                        type="text"
                        placeholder="ระบุชื่อของคุณ"
                        className="w-full p-4 bg-transparent outline-none font-medium text-lg"
                        value={localFormData.name}
                        onChange={(e) => setLocalFormData({...localFormData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Input Group: Birth Date */}
                  <div className="relative">
                    <label className="absolute -top-3 left-6 bg-white px-2 text-xs font-bold text-indigo-700 uppercase tracking-tighter z-10">วันเดือนปีเกิด</label>
                    <div className="flex items-center bg-white/50 border border-slate-100 rounded-2xl px-5 transition-all focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-300">
                      <LucideCalendar className="text-indigo-500" size={18} />
                      <input
                        type="date"
                        className="w-full p-4 bg-transparent outline-none font-medium text-lg"
                        value={localFormData.birthDate}
                        onChange={(e) => setLocalFormData({...localFormData, birthDate: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Input Group: Birth Time */}
                  <div className="relative">
                    <label className="absolute -top-3 left-6 bg-white px-2 text-xs font-bold text-indigo-700 uppercase tracking-tighter z-10">เวลาเกิด (โดยประมาณ)</label>
                    <div className="flex items-center bg-white/50 border border-slate-100 rounded-2xl px-5 transition-all focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-300">
                      <LucideRefreshCcw className="text-indigo-500" size={18} />
                      <input
                        type="time"
                        className="w-full p-4 bg-transparent outline-none font-medium text-lg"
                        value={localFormData.birthTime}
                        onChange={(e) => setLocalFormData({...localFormData, birthTime: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Gender Selection (Orb Style) */}
                  <div className="flex justify-center gap-8 py-2">
                     {['male', 'female'].map((g) => (
                       <button
                          key={g}
                          onClick={() => setLocalFormData({...localFormData, gender: g})}
                          className={`group relative w-20 h-20 rounded-full transition-all duration-500 flex items-center justify-center
                            ${localFormData.gender === g ? 'scale-110 shadow-lg' : 'opacity-40 grayscale'}`}
                       >
                          <div className={`absolute inset-0 rounded-full animate-spin-slow opacity-20 ${g === 'male' ? 'bg-blue-400' : 'bg-rose-400'}`} />
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold border-2 
                            ${g === 'male' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-rose-500 text-rose-600 bg-rose-50'}`}>
                            {g === 'male' ? 'ชาย' : 'หญิง'}
                          </div>
                       </button>
                     ))}
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  className="group relative w-full overflow-hidden rounded-2xl bg-indigo-600 p-6 font-bold text-white transition-all hover:bg-indigo-700 active:scale-[0.98] shadow-xl shadow-indigo-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-3 tracking-[0.2em] ml-2 text-lg">
                    เปิดคำทำนาย <LucideSparkles size={20} className="animate-pulse" />
                  </span>
                </button>
              </div>

              {/* Decorative Quote */}
              <p className="mt-12 text-center text-[10px] text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
                พลังแห่งธาตุทั้งห้า <br/> เผยเส้นทางแห่งความสมดุล
              </p>
            </motion.div>
          )}

          {state === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-amber-200 blur-3xl opacity-30 animate-pulse rounded-full"></div>
                <LucideLoader2 className="w-16 h-16 text-amber-600 animate-spin relative z-10" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-amber-900 mb-2">{loadingMessage}</h3>
              <p className="text-amber-800/50 italic">ความลับของธาตุทั้ง 5 กำลังจะถูกเปิดเผย...</p>
            </motion.div>
          )}

          {state === 'result' && analysis && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10 pt-4 pb-20"
            >
              {/* Day Master Section (The Core Orb) */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 via-purple-500 to-rose-400 p-[2px] shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                    <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center border-4 border-white/50">
                      <span className="text-xs font-bold text-indigo-800 tracking-widest uppercase mb-1">ดิถีธาตุ</span>
                      <span className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-700 to-purple-600">
                        {analysis.dayMaster.includes(' ') ? analysis.dayMaster.split(' ')[0] : analysis.dayMaster.replace('หยาง', '').replace('หยิน', '')}
                      </span>
                      <span className="text-[10px] mt-1 text-indigo-900/60 uppercase tracking-tighter font-bold">
                        {analysis.dayMaster}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl font-serif font-bold italic text-slate-800">"{analysis.dayMasterTitle}"</h3>
                <div className="mt-4 px-4 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100 flex items-center gap-2 shadow-sm">
                  <LucideCompass size={12} /> ธาตุที่ส่งเสริม: {analysis.supportingElement}
                </div>
                <p className="text-slate-500 text-sm text-center mt-4 px-8 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* 4 Pillars Chart (The Gemstones) */}
              <div className="grid grid-cols-4 gap-3 mb-10">
                {analysis.pillars.map((pillar, i) => {
                  let colorClass = "bg-slate-50 text-slate-700";
                  if (pillar.label.includes('ปี')) colorClass = "bg-green-50 text-green-700 border-green-100";
                  if (pillar.label.includes('เดือน')) colorClass = "bg-red-50 text-red-700 border-red-100";
                  if (pillar.label.includes('วัน')) colorClass = "bg-amber-50 text-amber-700 border-amber-200 shadow-lg scale-105 z-10";
                  if (pillar.label.includes('ยาม')) colorClass = "bg-blue-50 text-blue-700 border-blue-100";

                  return (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex flex-col items-center p-4 rounded-[2rem] border transition-all hover:scale-110 ${colorClass}`}
                    >
                      <span className="text-[10px] uppercase font-black mb-3 opacity-40 tracking-widest">{pillar.label}</span>
                      <span className="text-3xl font-serif font-bold mb-1">{pillar.stem}</span>
                      <span className="text-3xl font-serif font-bold mb-2">{pillar.branch}</span>
                      <p className="text-[8px] leading-tight text-center opacity-70 font-medium px-1 line-clamp-3">
                        {pillar.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Elements Chart */}
              <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-8 shadow-xl shadow-amber-100/20 border border-white">
                <h3 className="text-center font-black text-xs tracking-[0.3em] uppercase mb-8 text-slate-400">ความสมดุล 5 ธาตุ</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#F1F5F9" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 800 }} />
                      <Radar
                        name="Elements"
                        dataKey="A"
                        stroke="#6366F1"
                        fill="#818CF8"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-5 gap-2 mt-6">
                  {chartData.map((d, i) => {
                    const colors = [
                      'text-emerald-600', // ไม้
                      'text-rose-600',    // ไฟ
                      'text-amber-600',   // ดิน
                      'text-slate-600',   // ทอง
                      'text-blue-600'     // น้ำ
                    ];
                    return (
                      <div key={d.subject} className="text-center">
                        <div className={`text-[10px] font-bold uppercase tracking-tighter ${colors[i]}`}>{d.subject}</div>
                        <div className="text-sm font-black text-slate-700">{d.A}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-lg shadow-indigo-100/10 border border-white">
                  <h4 className="font-serif font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
                    <LucideHeart size={20} className="text-rose-500" /> ตัวตนและบุคลิก
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {analysis.personality}
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-lg shadow-indigo-100/10 border border-white">
                  <h4 className="font-serif font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
                    <LucideBriefcase size={20} className="text-blue-500" /> การงาน
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {analysis.career}
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-lg shadow-indigo-100/10 border border-white">
                  <h4 className="font-serif font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
                    <LucideUsers size={20} className="text-purple-500" /> คู่ครองและความสัมพันธ์
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {analysis.spouse}
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-lg shadow-indigo-100/10 border border-white">
                  <h4 className="font-serif font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
                    <LucideShieldCheck size={20} className="text-emerald-500" /> สุขภาพตามธาตุ
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {analysis.health}
                  </p>
                </div>
              </div>

              {/* Personalized Insights Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-amber-50/50 backdrop-blur-lg rounded-3xl p-5 border border-amber-100 text-center shadow-sm">
                  <div className="text-amber-500 mb-2 flex justify-center"><LucideSparkles size={20} /></div>
                  <div className="text-[10px] font-black text-amber-600/60 uppercase tracking-widest mb-1">สีที่แนะนำ</div>
                  <div className="text-xs font-bold text-amber-900">{analysis.colors.join(', ')}</div>
                </div>
                <div className="bg-blue-50/50 backdrop-blur-lg rounded-3xl p-5 border border-blue-100 text-center shadow-sm">
                  <div className="text-blue-500 mb-2 flex justify-center"><LucideCompass size={20} /></div>
                  <div className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest mb-1">ทิศทางมงคล</div>
                  <div className="text-xs font-bold text-blue-900">{analysis.directions.join(', ')}</div>
                </div>
                <div className="bg-orange-50/50 backdrop-blur-lg rounded-3xl p-5 border border-orange-100 text-center shadow-sm">
                  <div className="text-orange-500 mb-2 flex justify-center"><LucideInfo size={20} /></div>
                  <div className="text-[10px] font-black text-orange-600/60 uppercase tracking-widest mb-1">อาหารเสริมธาตุ</div>
                  <div className="text-xs font-bold text-orange-900">{analysis.foods.join(', ')}</div>
                </div>
                <div className="bg-emerald-50/50 backdrop-blur-lg rounded-3xl p-5 border border-emerald-100 text-center shadow-sm">
                  <div className="text-emerald-500 mb-2 flex justify-center"><LucideHeart size={20} /></div>
                  <div className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-1">ไลฟ์สไตล์</div>
                  <div className="text-xs font-bold text-emerald-900 line-clamp-2">{analysis.lifestyle}</div>
                </div>
              </div>

                {/* Advice Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* General Advice */}
                  <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] -mr-32 -mt-32" />
                    <div className="flex items-center gap-4 mb-8 relative z-10">
                      <div className="bg-indigo-500 p-3 rounded-2xl shadow-lg shadow-indigo-500/30">
                        <LucideShieldCheck className="text-white" size={28} />
                      </div>
                      <h3 className="text-2xl font-serif font-bold tracking-wide">เคล็ดลับสร้างสมดุล</h3>
                    </div>
                    <ul className="space-y-6 relative z-10">
                      {analysis.advice.map((item, i) => (
                        <motion.li 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-5 items-start"
                        >
                          <div className="bg-indigo-500/20 text-indigo-300 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black mt-0.5 border border-indigo-500/30">
                            {i + 1}
                          </div>
                          <p className="text-indigo-50/80 leading-relaxed text-lg font-light">{item}</p>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Health Advice */}
                  <div className="bg-indigo-900 text-white rounded-[3rem] p-10 shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32" />
                    <div className="flex items-center gap-4 mb-8 relative z-10">
                      <div className="bg-rose-500 p-3 rounded-2xl shadow-lg shadow-rose-500/30">
                        <LucideHeart className="text-white" size={28} />
                      </div>
                      <h3 className="text-2xl font-serif font-bold tracking-wide">การรักษาสุขภาพ</h3>
                    </div>
                    <ul className="space-y-6 relative z-10">
                      {analysis.healthAdvice.map((item, i) => (
                        <motion.li 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-5 items-start"
                        >
                          <div className="bg-rose-500/20 text-rose-300 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black mt-0.5 border border-rose-500/30">
                            {i + 1}
                          </div>
                          <p className="text-indigo-50/80 leading-relaxed text-lg font-light">{item}</p>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

              <div className="pt-10">
                <button
                  onClick={() => setState('input')}
                  className="w-full border-2 border-indigo-200 text-indigo-800 py-6 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all active:scale-95 shadow-lg shadow-indigo-100/50"
                >
                  <LucideRefreshCcw size={24} />
                  วิเคราะห์ใหม่อีกครั้ง
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Decoration */}
      <footer className="py-12 text-center opacity-20 pointer-events-none">
        <div className="text-4xl">☯️</div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      ` }} />
    </div>
  );
}
