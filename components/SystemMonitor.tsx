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
  Wifi
} from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';

const MOCK_ALERTS = [
  "ตรวจพบการสแกนพอร์ตจาก IP ไม่ทราบฝ่าย (Port Scan Detected)",
  "บล็อกการเชื่อมต่อ Phishing Domain: secure-bank-login-update.com",
  "แจ้งเตือน: มัลแวร์เรียกค่าไถ่สายพันธุ์ใหม่ระบาดในภูมิภาคเอเชีย",
  "ตรวจพบความพยายาม Login ผิดพลาดเกินกำหนด (Brute Force Attempt)",
  "อัปเดตฐานข้อมูลไวรัส: เพิ่ม Signature ใหม่ 1,024 รายการ",
  "แจ้งเตือน: อีเมลปลอมแปลง (Spoofing) อ้างเป็นหน่วยงานรัฐ",
  "ตรวจพบ Traffic ผิดปกติในเครือข่ายย่อย (DDoS Signature)"
];

const SystemMonitor: React.FC = () => {
  const [blockedCount, setBlockedCount] = useState(14582);
  const [activeThreats, setActiveThreats] = useState(3);
  const [alerts, setAlerts] = useState<string[]>(MOCK_ALERTS.slice(0, 3));
  
  // Scanner State
  const [scanInput, setScanInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{safe: boolean; message: string} | null>(null);

  // Simulation Effects
  useEffect(() => {
    const interval = setInterval(() => {
      // Increment blocked count randomly
      setBlockedCount(prev => prev + Math.floor(Math.random() * 5));
      
      // Randomly update active threats
      if (Math.random() > 0.7) {
        setActiveThreats(prev => Math.max(0, Math.min(10, prev + (Math.random() > 0.5 ? 1 : -1))));
      }

      // Add new random alert
      if (Math.random() > 0.6) {
        const newAlert = MOCK_ALERTS[Math.floor(Math.random() * MOCK_ALERTS.length)];
        setAlerts(prev => [newAlert, ...prev].slice(0, 5));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleScan = async () => {
    if (!scanInput.trim()) return;
    
    setIsScanning(true);
    setScanResult(null);

    try {
      const prompt = `
        ทำหน้าที่เป็นระบบสแกนความปลอดภัย (Security Scanner)
        วิเคราะห์ข้อความหรือ URL ต่อไปนี้: "${scanInput}"
        
        ให้ตอบกลับในรูปแบบ JSON เท่านั้น โดยมีโครงสร้างดังนี้:
        {
          "safe": boolean, (true ถ้าดูปลอดภัย, false ถ้าดูมีความเสี่ยงหรือเป็น phishing/scam)
          "message": "คำอธิบายสั้นๆ ภาษาไทย ไม่เกิน 2 บรรทัด"
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert size={64} className="text-cyber-accent" />
          </div>
          <h3 className="text-slate-400 text-sm font-mono mb-2">ATTACKS BLOCKED</h3>
          <div className="text-4xl font-bold text-white font-mono tracking-wider">
            {blockedCount.toLocaleString()}
          </div>
          <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
            <Activity size={12} /> +24% from yesterday
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe size={64} className="text-red-500" />
          </div>
          <h3 className="text-slate-400 text-sm font-mono mb-2">GLOBAL THREAT LEVEL</h3>
          <div className="text-4xl font-bold text-yellow-500 font-mono tracking-wider">
            ELEVATED
          </div>
          <div className="w-full bg-slate-700 h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-yellow-500 h-full w-[65%] animate-pulse-slow"></div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wifi size={64} className="text-purple-500" />
          </div>
          <h3 className="text-slate-400 text-sm font-mono mb-2">ACTIVE THREATS</h3>
          <div className="text-4xl font-bold text-red-400 font-mono tracking-wider">
            {activeThreats}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Monitoring active sessions...
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Alerts Feed */}
        <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-yellow-500" />
            Recent Alerts
          </h3>
          <div className="flex-1 space-y-3 overflow-hidden">
            {alerts.map((alert, index) => (
              <div key={index} className="p-3 bg-slate-800/50 border-l-2 border-red-500 rounded text-sm text-slate-300 animate-fade-in">
                <span className="text-xs text-slate-500 block mb-1 font-mono">
                  {new Date().toLocaleTimeString()}
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
              <ScanLine className="text-cyber-accent" /> AI Risk Scanner
            </h3>
            <p className="text-slate-400 mt-1">
              ตรวจสอบลิงก์ (URL) หรือข้อความ SMS ที่น่าสงสัยด้วย AI เพื่อประเมินความเสี่ยงเบื้องต้น
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
                placeholder="วางลิงก์ หรือข้อความที่ต้องการตรวจสอบที่นี่..."
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg py-4 pl-12 pr-4 focus:ring-2 focus:ring-cyber-accent focus:border-transparent transition-all font-mono"
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
                <>Analyzing...</>
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
                    {scanResult.safe ? 'Low Risk Detected' : 'High Risk Detected'}
                  </h4>
                  <p className="text-slate-200">
                    {scanResult.message}
                  </p>
                  <div className="mt-3 text-xs text-slate-500 font-mono">
                    Analysis provided by AI. Always verify with official sources.
                  </div>
                </div>
              </div>
            </div>
          )}

          {!scanResult && !isScanning && (
            <div className="mt-6 text-center text-slate-600 text-sm">
              <p>รองรับการตรวจสอบ: URL, SMS, Email Subject, ข้อความชักชวนลงทุน</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;