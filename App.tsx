import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronRight, 
  Zap, 
  Lock,
  BrainCircuit,
  Terminal,
  Search,
  Activity
} from 'lucide-react';
import { Section, InfoCardData } from './types';
import { HERO_TEXT, GOALS_DATA, ATTACK_TYPES, FUTURE_THREATS } from './constants';
import CyberChat from './components/CyberChat';
import SystemMonitor from './components/SystemMonitor';

const InfoCard: React.FC<{ data: InfoCardData }> = ({ data }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:bg-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/20 group">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-lg bg-slate-900 ${data.color} group-hover:scale-110 transition-transform duration-300`}>
          <data.icon size={24} />
        </div>
        <h3 className="ml-4 text-xl font-bold text-slate-100">{data.title}</h3>
      </div>
      <p className="text-slate-400 leading-relaxed text-sm md:text-base">
        {data.description}
      </p>
    </div>
  );
};

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavChange = (section: Section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
    setSearchQuery(''); // Clear search when changing sections
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Filter Logic
  const filterData = (data: InfoCardData[]) => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.description.toLowerCase().includes(lowerQuery)
    );
  };

  const filteredAttackTypes = filterData(ATTACK_TYPES);
  const filteredFutureThreats = filterData(FUTURE_THREATS);

  // Search Input Component
  const SearchInput = ({ className = "" }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
      <input 
        type="text" 
        placeholder="Search..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 text-sm rounded-full py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent placeholder-slate-500 transition-all"
      />
    </div>
  );

  const showSearchBar = activeSection === Section.TYPES || activeSection === Section.FUTURE;

  const NavLink: React.FC<{ section: Section; label: string }> = ({ section, label }) => (
    <button
      onClick={() => handleNavChange(section)}
      className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 ${
        activeSection === section 
          ? 'bg-cyber-accent text-slate-900 font-bold shadow-lg shadow-cyan-500/50' 
          : 'text-slate-300 hover:text-white hover:bg-slate-800'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyber-accent selection:text-slate-900">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => handleNavChange(Section.HOME)}>
              <ShieldCheck className="w-8 h-8 text-cyber-accent mr-2" />
              <span className="text-xl font-bold tracking-wider text-white">CYBER<span className="text-cyber-accent">GUARD</span></span>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <NavLink section={Section.HOME} label="OVERVIEW" />
              <NavLink section={Section.TYPES} label="ATTACKS" />
              <NavLink section={Section.FUTURE} label="2025 THREATS" />
              <NavLink section={Section.MONITOR} label="MONITOR" />
              <NavLink section={Section.CHAT} label="AI ADVISOR" />
              
              {showSearchBar && (
                <div className="ml-4 w-48 animate-fade-in">
                  <SearchInput />
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button onClick={toggleMenu} className="text-slate-300 hover:text-white">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800">
            <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
              {showSearchBar && (
                <div className="mb-2">
                  <SearchInput className="w-full" />
                </div>
              )}
              <NavLink section={Section.HOME} label="OVERVIEW" />
              <NavLink section={Section.TYPES} label="ATTACKS" />
              <NavLink section={Section.FUTURE} label="2025 THREATS" />
              <NavLink section={Section.MONITOR} label="MONITOR" />
              <NavLink section={Section.CHAT} label="AI ADVISOR" />
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* HOME SECTION */}
        {activeSection === Section.HOME && (
          <div className="space-y-16 animate-fade-in">
            {/* Hero */}
            <div className="text-center space-y-6 py-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono mb-4">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-ping"></span>
                SYSTEM ALERT: THREAT LEVEL HIGH
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                Cyber Attacks <br className="md:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Awareness</span>
              </h1>
              <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
                {HERO_TEXT}
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button 
                  onClick={() => handleNavChange(Section.MONITOR)}
                  className="px-6 py-3 bg-red-500/90 text-white font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center shadow-lg shadow-red-900/40"
                >
                  <Activity size={20} className="mr-2" />
                  ตรวจสอบความเสี่ยง
                </button>
                <button 
                  onClick={() => handleNavChange(Section.CHAT)}
                  className="px-6 py-3 bg-slate-800 border border-slate-700 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors flex items-center"
                >
                  <Terminal size={18} className="mr-2" />
                  ปรึกษา AI
                </button>
              </div>
            </div>

            {/* Goals Grid */}
            <div>
              <div className="flex items-center mb-8">
                <div className="h-px bg-slate-800 flex-1"></div>
                <h2 className="px-4 text-2xl font-bold text-white uppercase tracking-widest font-mono">
                  Attacker Goals
                </h2>
                <div className="h-px bg-slate-800 flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {GOALS_DATA.map((goal, index) => (
                  <InfoCard key={index} data={goal} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TYPES SECTION */}
        {activeSection === Section.TYPES && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">Common Attack Vectors</h2>
              <p className="text-slate-400">รูปแบบการโจมตีที่พบบ่อยและควรระวังในยุคดิจิทัล</p>
            </div>
            
            {filteredAttackTypes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAttackTypes.map((attack, index) => (
                  <InfoCard key={index} data={attack} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">ไม่พบข้อมูลที่ตรงกับคำค้นหา "{searchQuery}"</p>
              </div>
            )}

             <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 mt-12 text-center">
                <h3 className="text-xl font-bold text-white mb-2">ป้องกันอย่างไร?</h3>
                <p className="text-slate-400 mb-6">การป้องกันที่ดีต้องอาศัยการอัปเดตระบบสม่ำเสมอ การใช้ซอฟต์แวร์ป้องกัน และความตระหนักรู้ของผู้ใช้งาน</p>
                <button 
                  onClick={() => handleNavChange(Section.CHAT)}
                  className="inline-flex items-center text-cyber-accent hover:text-cyan-300 font-bold border-b border-cyber-accent hover:border-cyan-300 pb-1"
                >
                  สอบถามวิธีป้องกันเพิ่มเติมกับ AI <BrainCircuit className="ml-2 w-4 h-4" />
                </button>
             </div>
          </div>
        )}

        {/* FUTURE SECTION */}
        {activeSection === Section.FUTURE && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-mono font-bold border border-purple-500/20">YEAR 2025 PREDICTION</span>
              <h2 className="text-4xl font-bold text-white mt-4 mb-6">The Future of Cyber Threats</h2>
              <p className="text-slate-400 text-lg">
                ในปี 2025 ภัยคุกคามทางไซเบอร์จะไม่ได้มาจากแฮกเกอร์เพียงอย่างเดียว แต่ถูกขับเคลื่อนด้วยเทคโนโลยีปัญญาประดิษฐ์ (AI)
              </p>
            </div>

            {filteredFutureThreats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredFutureThreats.map((threat, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                     <threat.icon className={`w-12 h-12 ${threat.color} mb-6`} />
                     <h3 className="text-2xl font-bold text-white mb-3">{threat.title}</h3>
                     <p className="text-slate-400 leading-relaxed">{threat.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">ไม่พบข้อมูลที่ตรงกับคำค้นหา "{searchQuery}"</p>
              </div>
            )}

            <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-lg flex items-start gap-4">
              <Lock className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-white mb-1">คำแนะนำสำหรับปี 2025</h4>
                <p className="text-slate-400 text-sm">
                  องค์กรและบุคคลทั่วไปจำเป็นต้องปรับตัว โดยไม่เพียงแค่พึ่งพาโปรแกรมแอนตี้ไวรัสแบบเดิม แต่ต้องใช้ระบบตรวจจับพฤติกรรมผิดปกติ (Behavioral Analysis) และให้ความสำคัญกับ Zero Trust Architecture
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MONITOR SECTION */}
        {activeSection === Section.MONITOR && (
          <SystemMonitor />
        )}

        {/* CHAT SECTION */}
        {activeSection === Section.CHAT && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                <Zap className="text-yellow-400 fill-yellow-400" /> 
                CyberGuard AI
              </h2>
              <p className="text-slate-400 mt-2">ผู้ช่วยอัจฉริยะที่พร้อมตอบคำถามด้านความปลอดภัยไซเบอร์เป็นภาษาไทย</p>
            </div>
            <CyberChat />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2025 CyberGuard. Educational Material based on provided text.
          </p>
          <div className="mt-2 flex justify-center gap-4 text-xs text-slate-600 font-mono">
            <span>SECURE_CONNECTION: TRUE</span>
            <span>ENCRYPTION: AES-256</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;