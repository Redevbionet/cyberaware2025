import { 
  ShieldAlert, 
  Database, 
  DollarSign, 
  Lock, 
  Mail, 
  Bug, 
  FileWarning, 
  ServerCrash, 
  RadioReceiver, 
  Code, 
  AlertTriangle,
  Cpu,
  Ghost
} from 'lucide-react';
import { InfoCardData } from './types';

export const HERO_TEXT = "การโจมตีทางไซเบอร์ (Cyber Attack) คือความพยายามของบุคคลหรือกลุ่มผู้ไม่หวังดีในการเจาะระบบคอมพิวเตอร์ เครือข่าย หรืออุปกรณ์ดิจิทัลโดยไม่ได้รับอนุญาต เพื่อขโมยข้อมูล, ทำลายระบบ, ขัดขวางการทำงาน, หรือแสวงหาผลประโยชน์ทางการเงิน";

export const GOALS_DATA: InfoCardData[] = [
  {
    title: "การขโมยข้อมูล",
    description: "มุ่งเป้าที่ข้อมูลส่วนตัว (PII), ข้อมูลทางการเงิน, และทรัพย์สินทางปัญญา",
    icon: Database,
    color: "text-blue-400"
  },
  {
    title: "ทำลายหรือขัดขวาง",
    description: "ทำให้ระบบหยุดทำงาน หรือไม่สามารถใช้งานได้ (เช่น DDoS)",
    icon: ServerCrash,
    color: "text-red-400"
  },
  {
    title: "การเรียกร้องค่าไถ่",
    description: "เข้ารหัสไฟล์สำคัญและเรียกเงินเพื่อแลกกับกุญแจถอดรหัส (Ransomware)",
    icon: DollarSign,
    color: "text-green-400"
  },
  {
    title: "เข้าถึงโดยไม่ได้รับอนุญาต",
    description: "แทรกซึมเข้าสู่เครือข่ายเพื่อควบคุมระบบ หรือเปลี่ยนแปลงข้อมูลภายใน",
    icon: Lock,
    color: "text-orange-400"
  }
];

export const ATTACK_TYPES: InfoCardData[] = [
  {
    title: "ฟิชชิ่ง (Phishing)",
    description: "หลอกลวงให้เหยื่อเปิดเผยข้อมูลส่วนตัวผ่านอีเมลหรือข้อความปลอมที่ดูน่าเชื่อถือ",
    icon: Mail,
    color: "text-yellow-400"
  },
  {
    title: "มัลแวร์ (Malware)",
    description: "ซอฟต์แวร์อันตราย เช่น ไวรัส, โทรจัน, สปายแวร์ ที่ถูกสร้างขึ้นเพื่อสร้างความเสียหาย",
    icon: Bug,
    color: "text-red-500"
  },
  {
    title: "แรนซัมแวร์ (Ransomware)",
    description: "การโจมตีที่ทำการเข้ารหัสไฟล์ของผู้ใช้และเรียกค่าไถ่ในการถอดรหัสคืน",
    icon: FileWarning,
    color: "text-rose-500"
  },
  {
    title: "DDoS",
    description: "Distributed Denial of Service: ทำให้ระบบล่มโดยการท่วมท้นด้วยปริมาณการเข้าชมจำนวนมหาศาล",
    icon: ShieldAlert,
    color: "text-purple-500"
  },
  {
    title: "Man-in-the-Middle (MitM)",
    description: "การดักฟังหรือแอบแก้ไขข้อมูลระหว่างการสื่อสารของสองฝ่าย",
    icon: RadioReceiver,
    color: "text-blue-500"
  },
  {
    title: "SQL Injection",
    description: "โจมตีฐานข้อมูลโดยการแทรกคำสั่ง SQL ที่เป็นอันตรายผ่านช่องกรอกข้อมูล",
    icon: Code,
    color: "text-cyan-500"
  },
  {
    title: "Zero-day Exploits",
    description: "ใช้ประโยชน์จากช่องโหว่ใหม่ที่ผู้ผลิตยังไม่รู้และยังไม่มีแพทช์ป้องกัน",
    icon: AlertTriangle,
    color: "text-amber-500"
  }
];

export const FUTURE_THREATS: InfoCardData[] = [
  {
    title: "AI & Deepfake",
    description: "การโจมตีมีความซับซ้อนมากขึ้น โดยใช้ AI สร้างภาพหรือเสียงปลอมเพื่อหลอกลวง (Deepfake)",
    icon: Cpu,
    color: "text-pink-500"
  },
  {
    title: "Fileless Malware",
    description: "เทคนิคการโจมตีแบบไร้ไฟล์ที่ทำงานในหน่วยความจำ ทำให้โปรแกรมแอนตี้ไวรัสทั่วไปตรวจจับยาก",
    icon: Ghost,
    color: "text-gray-400"
  }
];