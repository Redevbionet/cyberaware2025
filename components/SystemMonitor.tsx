import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Globe, 
  ScanLine, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Search,
  Wifi,
  FileKey,
  HardDrive,
  Siren,
  Eye,
  Info
} from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ATTACK_TYPES } from '../constants';

const MOCK_ALERTS = [
  "RANSOMWARE BLOCKED: หยุดการเข้ารหัสไฟล์ในโฟลเดอร์ /Documents",
  "Decoy File Triggered: ตรวจพบความพยายามแก้ไขไฟล์ล่อ (Honeypot)",
  "ตรวจพบการสแกนพอร์ตจาก IP ไม่ทราบฝ่าย (Port Scan Detected)",
  "แจ้งเตือน: พบไฟล์นามสกุล .encrypted ผิดปกติ 50 ไฟล์",
  "บล็อกการเชื่อมต่อ Phishing Domain: secure-bank-login-update.com",
  "Threat Intel: พบ Signature ของ Ransomware สายพันธุ์ใหม่ 'LockBit 4.0'",
  "System: ทำการสำรองข้อมูลอัตโนมัติ (Shadow Copy Protection) สำเร็จ"
];

const SystemMonitor: React.FC = () => {
  const [blockedCount, setBlockedCount] = useState(14582);
  const [filesMonitored, setFilesMonitored] = useState(124050);
  const [activeThreats, setActiveThreats] = useState(1);
  const [alerts, setAlerts] = useState<string[]>(MOCK_ALERTS.slice(0, 4));
  
  // Scanner State
  const [scanInput, setScanInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{safe: boolean; message: string} | null>(null);

  // Simulation Effects
  useEffect(() => {
    const interval = setInterval(() => {
      // Increment stats
      setBlockedCount(prev => prev + Math.floor(Math.random() * 2));
      setFilesMonitored(prev => prev + Math.floor(Math.random() * 15));
      
      // Randomly update active threats
      if (Math.random() > 0.8) {
        setActiveThreats(prev => Math.max(0, Math.min(5, prev + (Math.random() > 0.5 ? 1 : -1))));
      }

      // Add new random alert
      if (Math.random() > 0.6) {
        const newAlert = MOCK_ALERTS[Math.floor(Math.random() * MOCK_ALERTS.length)];
        setAlerts(prev => [newAlert, ...prev].slice(0, 5));
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleScan = async () => {
    if (!scanInput.trim()) return;
    
    setIsScanning(true);
    setScanResult(null);

    try {
      const prompt = `
        ทำหน้าที่เป็นระบบสแกนความปลอดภัย (Security Scanner) เน้นตรวจจับ Ransomware และ Phishing
        วิเคราะห์ข้อความ, ข้อความเรียกค่าไถ่ (Ransom Note), หรือ URL ต่อไปนี้: "${scanInput}"
        
        ให้ตอบกลับในรูปแบบ JSON เท่านั้น โดยมีโครงสร้างดังนี้:
        {
          "safe": boolean, (true ถ้าดูปลอดภัย, false ถ้าดูมีความเสี่ยง, เป็นไฟล์นามสกุลอันตราย หรือข้อความเรียกค่าไถ่)
          "message": "คำอธิบายสั้นๆ ภาษาไทย เน้นบอกว่าเป็น Ransomware สายพันธุ์ไหนถ้าพอจะระบุได้"
        }
        ถ้าไม่แน่ใจให้ตอบตามความน่าจะเป็น
      `;
      
      const response = await sendMessageToGemini(prompt);
      
      // Clean up response to ensure JSON parsing (Gemini might add markdown code blocks)
      const cleanJson = response.replace(/```json|```/g, '').trim();
      
      try {
        const result = JSON.parse(cleanJson);
        setScanResult(result);
      } catch (e) {
        // Fallback if JSON parse fails
        setScanResult({
          safe: false,
          message: "ไม่สามารถประมวลผลรูปแบบข้อมูลได้ แต่ควรระมัดระวังเป็นพิเศษ (Parse Error)"
        });
      }
    } catch (error) {
      setScanResult({
        safe: false,
        message: "เกิดข้อผิดพลาดในการเชื่อมต่อระบบ AI"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="text-green-500 animate-pulse" />
            Live Threat Monitor
          </h2>
          <p className="text-slate-400">ศูนย์เฝ้าระวังภัยคุกคามและตรวจสอบความปลอดภัยแบบเรียลไทม์</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-mono text-green-400">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Ransomware Special Panel */}
      <div className="bg-gradient-to-r from-red-900/20 to-slate-900 border border-red-500/30 p-6 rounded-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-red-500/10 rotate-12">
           <FileKey size={180} />
        </div>
        <div className="p-4 bg-red-500/10 rounded-full border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
           <ShieldAlert size={40} className="text-red-500" />
        </div>
        <div className="flex-1 z-10">
           <h3 className="text-xl font-bold text-red-100 flex items-center gap-2">
             Ransomware Defense Shield <span className="px-2 py-0.5 rounded text-[10px] bg-red-500 text-white font-mono animate-pulse">ACTIVE</span>
           </h3>
           <p className="text-red-200/60 text-sm mt-1">
             กำลังตรวจสอบพฤติกรรมการเข้ารหัสไฟล์ที่ผิดปกติ (Heuristic Analysis) และป้องกันโฟลเดอร์สำคัญ
           </p>
           <div className="mt-4 flex items-center gap-4 text-sm font-mono text-slate-400">
              <span className="flex items-center gap-1"><HardDrive size={14} /> FILES: {filesMonitored.toLocaleString()}</span>
              <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-500" /> INTEGRITY: 100%</span>
           </div>
        </div>
        <div className="hidden md:block w-px h-16 bg-red-500/30"></div>
        <div className="flex flex-col items-center min-w-[120px]">
           <span className="text-3xl font-bold text-white font-mono">{blockedCount.toLocaleString()}</span>
           <span className="text-xs text-slate-500 uppercase tracking-wider">Threats Blocked</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe size={64} className="text-blue-500" />
          </div>
          <h3 className="text-slate-400 text-sm font-mono mb-2">GLOBAL THREAT LEVEL</h3>
          <div className="text-4xl font-bold text-yellow-500 font-mono tracking-wider">
            ELEVATED
          </div>
          <div className="w-full bg-slate-700 h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-yellow-500 h-full w-[65%] animate-pulse-slow"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wifi size={64} className="text-purple-500" />
          </div>
          <h3 className="text-slate-400 text-sm font-mono mb-2">NETWORK TRAFFIC</h3>
          <div className="text-4xl font-bold text-cyan-400 font-mono tracking-wider">
            SECURE
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Firewall Active • IPS Enabled
          </p>
        </div>

         {/* Card 3 */}
         <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Siren size={64} className="text-red-500" />
          </div>
          <h3 className="text-slate-400 text-sm font-mono mb-2">ACTIVE INCIDENTS</h3>
          <div className="text-4xl font-bold text-red-400 font-mono tracking-wider">
            {activeThreats}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Investigation in progress...
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Alerts Feed */}
        <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-yellow-500" />
            Security Alerts Feed
          </h3>
          <div className="flex-1 space-y-3 overflow-hidden">
            {alerts.map((alert, index) => (
              <div key={index} className="p-3 bg-slate-800/50 border-l-2 border-red-500 rounded text-sm text-slate-300 animate-fade-in hover:bg-slate-800 transition-colors">
                <span className="text-xs text-slate-500 block mb-1 font-mono flex justify-between">
                  {new Date().toLocaleTimeString()}
                  <span className="text-red-400 font-bold">CRITICAL</span>
                </span>
                {alert}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Scanner */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-900/30 rounded-xl p-8 shadow-2xl shadow-cyan-900/10">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <ScanLine className="text-cyber-accent" /> AI Threat Scanner
            </h3>
            <p className="text-slate-400 mt-1">
              วิเคราะห์ความเสี่ยงจาก <span className="text-red-400 font-bold">ข้อความเรียกค่าไถ่ (Ransom Note)</span>, URL ที่น่าสงสัย หรือข้อความ SMS
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-slate-500" />
              </div>
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder='วางข้อความเรียกค่าไถ่, ชื่อไฟล์แปลกๆ หรือ URL ที่นี่...'
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg py-4 pl-12 pr-4 focus:ring-2 focus:ring-cyber-accent focus:border-transparent transition-all font-mono placeholder-slate-600"
              />
            </div>
            
            <button
              onClick={handleScan}
              disabled={isScanning || !scanInput}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                isScanning 
                  ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                  : 'bg-cyber-accent hover:bg-cyan-400 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/20'
              }`}
            >
              {isScanning ? (
                <>Analyzing Artifacts...</>
              ) : (
                <>SCAN NOW <ScanLine size={20} /></>
              )}
            </button>
          </div>

          {/* Results Area */}
          {scanResult && (
            <div className={`mt-6 p-6 rounded-xl border animate-fade-in ${
              scanResult.safe 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-start gap-4">
                {scanResult.safe ? (
                  <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                )}
                <div>
                  <h4 className={`text-lg font-bold mb-1 ${
                    scanResult.safe ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {scanResult.safe ? 'Analysis: Low Risk' : 'Analysis: High Risk Detected'}
                  </h4>
                  <p className="text-slate-200">
                    {scanResult.message}
                  </p>
                  <div className="mt-3 text-xs text-slate-500 font-mono">
                    Analysis provided by CyberGuard AI. Always isolate infected systems immediately.
                  </div>
                </div>
              </div>
            </div>
          )}

          {!scanResult && !isScanning && (
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
               <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-slate-700">รองรับ: Ransom Notes</span>
               <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-slate-700">Phishing URLs</span>
               <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-slate-700">Suspicious File Extensions</span>
            </div>
          )}
        </div>
      </div>

       {/* Active Monitoring Definitions */}
       <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Eye size={24} className="text-cyan-400" /> Active Monitoring Rules
        </h3>
        <p className="text-slate-400 text-sm mb-6">
           ระบบกำลังตรวจสอบพฤติกรรมที่เข้าข่ายภัยคุกคามดังต่อไปนี้ (Signature-based Detection):
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ATTACK_TYPES.map((type, index) => (
             <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700">
                <div className="mt-1">
                   <type.icon size={20} className={type.color} />
                </div>
                <div>
                   <h4 className="font-bold text-slate-200 text-sm">{type.title}</h4>
                   <p className="text-xs text-slate-500 mt-1 line-clamp-2">{type.description}</p>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;