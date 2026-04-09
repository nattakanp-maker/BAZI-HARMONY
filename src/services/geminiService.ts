import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Helper to get API Key from various possible sources
const getApiKey = () => {
  // 1. Try Vite's standard env (prefixed with VITE_)
  // 2. Try the injected process.env (from vite.config.ts define)
  return import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
};

// Initialize AI client lazily or with a check to avoid "API Key must be set" crash at load time
let aiInstance: GoogleGenerativeAI | null = null;

function getAIInstance() {
  if (!aiInstance) {
    const key = getApiKey();
    if (!key) {
      console.error("GEMINI_API_KEY is missing! Please set VITE_GEMINI_API_KEY in your deployment environment (e.g., Netlify).");
      // We return a dummy instance to avoid immediate crash, 
      // but it will fail with a clear error on the first request.
      aiInstance = new GoogleGenerativeAI("MISSING_API_KEY");
    } else {
      aiInstance = new GoogleGenerativeAI(key);
    }
  }
  return aiInstance;
}

export interface BaZiPillar {
  stem: string;
  branch: string;
  label: string;
  description: string;
}

export interface BaZiAnalysis {
  dayMaster: string;
  dayMasterTitle: string;
  pillars: BaZiPillar[];
  elements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  supportingElement: string;
  colors: string[];
  directions: string[];
  foods: string[];
  lifestyle: string;
  summary: string;
  advice: string[];
  personality: string;
  career: string;
  health: string;
  healthAdvice: string[];
  spouse: string;
}

export async function analyzeBaZi(
  name: string,
  birthDate: string,
  birthTime: string,
  gender: string
): Promise<BaZiAnalysis> {
  const genAI = getAIInstance();
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          dayMaster: { type: SchemaType.STRING, description: "ธาตุดิถีและความเป็นหยินหยาง (เช่น ดินหยาง)" },
          dayMasterTitle: { type: SchemaType.STRING, description: "ฉายาเปรียบเทียบดิถี (เช่น ภูเขาผู้มั่นคง)" },
          pillars: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                label: { type: SchemaType.STRING, description: "ชื่อเสา (ปี, เดือน, วัน, ยาม)" },
                stem: { type: SchemaType.STRING, description: "ตัวอักษรจีนราศีบน" },
                branch: { type: SchemaType.STRING, description: "ตัวอักษรจีนนักษัตรล่าง" },
                description: { type: SchemaType.STRING, description: "คำอธิบายความหมายของเสานี้ในดวงชะตา" },
              },
              required: ["label", "stem", "branch", "description"],
            },
            description: "ข้อมูล 4 เสาหลัก",
          },
          elements: {
            type: SchemaType.OBJECT,
            properties: {
              wood: { type: SchemaType.NUMBER, description: "เปอร์เซ็นต์ธาตุไม้ (0-100)" },
              fire: { type: SchemaType.NUMBER, description: "เปอร์เซ็นต์ธาตุไฟ (0-100)" },
              earth: { type: SchemaType.NUMBER, description: "เปอร์เซ็นต์ธาตุดิน (0-100)" },
              metal: { type: SchemaType.NUMBER, description: "เปอร์เซ็นต์ธาตุทอง (0-100)" },
              water: { type: SchemaType.NUMBER, description: "เปอร์เซ็นต์ธาตุน้ำ (0-100)" },
            },
            required: ["wood", "fire", "earth", "metal", "water"],
          },
          supportingElement: { type: SchemaType.STRING, description: "ธาตุที่ส่งเสริม" },
          colors: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "สีที่แนะนำ" },
          directions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "ทิศทางมงคล" },
          foods: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "อาหารเสริมธาตุ" },
          lifestyle: { type: SchemaType.STRING, description: "ไลฟ์สไตล์ปรับสมดุล" },
          summary: { type: SchemaType.STRING, description: "สรุปผลการวิเคราะห์สั้นๆ" },
          advice: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "รายการคำแนะนำ 3-5 ข้อเพื่อความสมดุล",
          },
          personality: { type: SchemaType.STRING, description: "คำอธิบายบุคลิกภาพ" },
          career: { type: SchemaType.STRING, description: "คำแนะนำด้านอาชีพตามธาตุ" },
          spouse: { type: SchemaType.STRING, description: "คำวิเคราะห์ด้านคู่ครองและความสัมพันธ์" },
          health: { type: SchemaType.STRING, description: "คำวิเคราะห์ด้านสุขภาพตามธาตุ" },
          healthAdvice: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "รายการคำแนะนำการรักษาสุขภาพ 3-5 ข้อ",
          },
        },
        required: [
          "dayMaster", "dayMasterTitle", "pillars", "elements", 
          "supportingElement", "colors", "directions", "foods", 
          "lifestyle", "summary", "advice", "personality", "career",
          "health", "healthAdvice", "spouse"
        ],
      },
    },
  });

  const prompt = `วิเคราะห์ดวงชะตาตามหลักโป๊ยอักษร (BaZi - Four Pillars of Destiny) สำหรับบุคคลนี้:
ชื่อ: ${name}
วันเกิด: ${birthDate} (ค.ศ.)
เวลาเกิด: ${birthTime}
เพศ: ${gender === 'male' ? 'ชาย' : 'หญิง'}

กรุณาคำนวณและระบุข้อมูลดังนี้:
1. ความสมดุลของธาตุทั้ง 5 (ไม้, ไฟ, ดิน, ทอง, น้ำ) เป็นเปอร์เซ็นต์ (รวมให้ได้ 100%)
2. ระบุดิถี (Day Master) ของบุคคลนี้ (ระบุทั้งธาตุและหยิน/หยาง เช่น ดินหยาง) และตั้งชื่อฉายาเปรียบเทียบ (เช่น "ภูเขาผู้มั่นคง")
3. ระบุ 4 เสาหลัก (ปี, เดือน, วัน, ยาม) โดยแต่ละเสาประกอบด้วย ราศีบน (Stem), นักษัตรล่าง (Branch) เป็นตัวอักษรจีน และคำอธิบายความหมายสั้นๆ ของเสานั้นๆ ในดวงชะตา
4. ระบุธาตุที่ส่งเสริม (Supporting Element) ที่จะช่วยปรับสมดุล
5. ระบุสีที่แนะนำ, ทิศทางมงคล, อาหารเสริมธาตุ และไลฟ์สไตล์ปรับสมดุล
6. ให้สรุปบุคลิกภาพ, คำแนะนำด้านการงาน, คำแนะนำด้านคู่ครองและความสัมพันธ์, คำแนะนำด้านสุขภาพตามธาตุที่ขาดหรือเกิน และคำแนะนำทั่วไปในการสร้างสมดุลชีวิต
**สำคัญ: ต้องตอบเป็นภาษาไทยทั้งหมด (ยกเว้นตัวอักษรจีนในเสาหลัก) และส่งกลับในรูปแบบ JSON**`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  if (!text) {
    throw new Error("Failed to get analysis from Gemini");
  }

  return JSON.parse(text) as BaZiAnalysis;
}
