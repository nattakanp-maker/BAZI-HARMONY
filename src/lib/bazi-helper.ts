// 1. ตารางพื้นฐาน: Heavenly Stems (天干) และธาตุประจำตัว
export const STEMS = [
  { char: '甲', name: 'ไม้หยาง', element: 'Wood', polarity: 'Yang', color: '#22C55E' },
  { char: '乙', name: 'ไม้หยิน', element: 'Wood', polarity: 'Yin', color: '#4ADE80' },
  { char: '丙', name: 'ไฟหยาง', element: 'Fire', polarity: 'Yang', color: '#EF4444' },
  { char: '丁', name: 'ไฟหยิน', element: 'Fire', polarity: 'Yin', color: '#F87171' },
  { char: '戊', name: 'ดินหยาง', element: 'Earth', polarity: 'Yang', color: '#F59E0B' },
  { char: '己', name: 'ดินหยิน', element: 'Earth', polarity: 'Yin', color: '#FBBF24' },
  { char: '庚', name: 'ทองหยาง', element: 'Metal', polarity: 'Yang', color: '#94A3B8' },
  { char: '辛', name: 'ทองหยิน', element: 'Metal', polarity: 'Yin', color: '#CBD5E1' },
  { char: '壬', name: 'น้ำหยาง', element: 'Water', polarity: 'Yang', color: '#3B82F6' },
  { char: '癸', name: 'น้ำหยิน', element: 'Water', polarity: 'Yin', color: '#60A5FA' },
];

// 2. ตารางพื้นฐาน: Earthly Branches (地支) และปีนักษัตร
export const BRANCHES = [
  { char: '子', animal: 'ชวด', element: 'Water', color: '#3B82F6' },
  { char: '丑', animal: 'ฉลู', element: 'Earth', color: '#F59E0B' },
  { char: '寅', animal: 'ขาล', element: 'Wood', color: '#22C55E' },
  { char: '卯', animal: 'เถาะ', element: 'Wood', color: '#22C55E' },
  { char: '辰', animal: 'มะโรง', element: 'Earth', color: '#F59E0B' },
  { char: '巳', animal: 'มะเส็ง', element: 'Fire', color: '#EF4444' },
  { char: '午', animal: 'มะเมีย', element: 'Fire', color: '#EF4444' },
  { char: '未', animal: 'มะแม', element: 'Earth', color: '#F59E0B' },
  { char: '申', animal: 'วอก', element: 'Metal', color: '#94A3B8' },
  { char: '酉', animal: 'ระกา', element: 'Metal', color: '#94A3B8' },
  { char: '戌', animal: 'จอ', element: 'Earth', color: '#F59E0B' },
  { char: '亥', animal: 'กุน', element: 'Water', color: '#3B82F6' },
];

/**
 * ฟังก์ชันคำนวณเบื้องต้น (Simulated Engine) 
 * สำหรับโปรเจกต์นี้จะใช้ Algorithm การหาเศษส่วนจากปีพื้นฐาน (Epoch)
 */
export const calculateBaZi = (date: string, time: string) => {
  const birth = new Date(`${date}T${time || '00:00'}`);
  
  // Logic จำลองการคำนวณเสาปี (Simplified for MVP)
  const yearIdx = (birth.getFullYear() - 4) % 10;
  const yearBranchIdx = (birth.getFullYear() - 4) % 12;

  return {
    year: { stem: STEMS[yearIdx], branch: BRANCHES[yearBranchIdx] },
    month: { stem: STEMS[(yearIdx + 2) % 10], branch: BRANCHES[(yearBranchIdx + 4) % 12] },
    day: { stem: STEMS[5], branch: BRANCHES[2] }, // ดิถี (Day Master) ตัวอย่าง
    hour: { stem: STEMS[1], branch: BRANCHES[10] },
    elementsCount: {
      Wood: 2,
      Fire: 1,
      Earth: 3,
      Metal: 1,
      Water: 1
    }
  };
};
