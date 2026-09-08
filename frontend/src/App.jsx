import React, { useState, useEffect } from 'react';
import { Shield, Sparkles } from 'lucide-react';
import GovHeader from './components/GovHeader';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import DigitizationStudio from './components/DigitizationStudio';
import CadastralMap from './components/CadastralMap';
import RecordsRegistry from './components/RecordsRegistry';
import ActiveLearningQueue from './components/ActiveLearningQueue';
import AuditTrailModal from './components/AuditTrailModal';
import AuditTrailView from './components/AuditTrailView';
import ReportsView from './components/ReportsView';
import FAQView from './components/FAQView';
import SupabaseModal from './components/SupabaseModal';
import { getApiUrl } from './config';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState('hi'); // Default Hindi / bilingual / hinglish
  const [role, setRole] = useState('Tehsildar');
  const [fontSize, setFontSize] = useState('normal');
  const [theme, setTheme] = useState(() => localStorage.getItem('bhoomi_theme') || 'light');

  // Data states
  const [records, setRecords] = useState([]);
  const [samples, setSamples] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [selectedRecordForMap, setSelectedRecordForMap] = useState(null);

  // Modals
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [targetAuditRecordId, setTargetAuditRecordId] = useState(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchRecords();
    fetchSamples();
    fetchStats();
    fetchDbStatus();
  }, []);

  const fetchDbStatus = async () => {
    try {
      const res = await fetch(getApiUrl('/api/database/status'));
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (err) {
      console.warn('Database status check warning:', err);
    }
  };

  // Update HTML data attributes for theme and font scale
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('bhoomi_theme', theme);
  }, [theme, fontSize]);

  const fetchRecords = async () => {
    try {
      const res = await fetch(getApiUrl('/api/records'));
      const data = await res.json();
      setRecords(data.records || []);
    } catch (err) {
      console.warn('Backend not ready yet, using offline defaults:', err);
    }
  };

  const fetchSamples = async () => {
    try {
      const res = await fetch(getApiUrl('/api/samples'));
      const data = await res.json();
      setSamples(data.samples || []);
    } catch (err) {
      console.warn('Samples fetch error:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(getApiUrl('/api/dashboard/stats'));
      const data = await res.json();
      setDashboardStats(data);
    } catch (err) {
      console.warn('Stats fetch error:', err);
    }
  };

  const handleLocateOnMap = (record) => {
    setSelectedRecordForMap(record);
    setActiveTab('cadastral_map');
  };

  const handleOpenAuditModal = (recordId) => {
    setTargetAuditRecordId(recordId);
    setIsAuditModalOpen(true);
  };

  const handleRecordSaved = (newRecord) => {
    fetchRecords();
    fetchStats();
    setSelectedRecordForMap(newRecord);
  };

  const isHindi = language === 'hi';
  const isHinglish = language === 'hinglish';
  const isTelugu = language === 'te';
  const isOdia = language === 'or';

  return (
    <div className="app-root">
      {/* Official Government Header */}
      <GovHeader
        language={language}
        setLanguage={setLanguage}
        role={role}
        setRole={setRole}
        fontSize={fontSize}
        setFontSize={setFontSize}
        theme={theme}
        setTheme={setTheme}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        dbConnected={dbStatus?.supabase_connected}
      />

      {/* Navigation Tab Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={records.filter(r => r.verification_status === 'NEEDS_REVIEW').length}
        language={language}
      />

      {/* Official Government Live Gazette & News Bulletin Ticker */}
      <div className="gov-news-ticker">
        <div className="ticker-label">
          <span className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gov-saffron)', display: 'inline-block' }} />
          <span>
            {isTelugu 
              ? 'తాజా అప్‌డేట్ / గెజిట్ సమాచారం:' 
              : isOdia 
              ? 'ନୂତନ ଅପଡେଟ୍ / ରାଜପତ୍ର ସୂଚନା:' 
              : isHindi 
              ? 'ताज़ा अपडेट / राजपत्र सूचना:' 
              : isHinglish 
              ? 'LATEST GAZETTE BULLETIN:' 
              : 'OFFICIAL GAZETTE BULLETIN:'}
          </span>
        </div>
        <div className="ticker-content">
          <span>
            {isTelugu
              ? '🔔 [అధికారిక గెజిట్]: డిజిటల్ ఇండియా భూ-రికార్డుల ఆధునీకరణ (DILRMP) 2.4 మిషన్ 18 రాష్ట్రాల్లో క్రియాశీలంగా ఉంది • 100% ఖస్రా మరియు ఉమ్మడి వాటా పునరుద్దరణ తప్పనిసరి • 24x7 జాతీయ సహాయం: 1800-111-BHOOMI • రూపకల్పన: Team Data_Vasu (SIH 2026)'
              : isOdia
              ? '🔔 [ସରକାରୀ ବିଜ୍ଞପ୍ତି]: ଡିଜିଟାଲ୍ ଇଣ୍ଡିଆ ଭୂ-ଅଭିଲେଖ ଆଧୁନିକୀକରଣ (DILRMP) ୨.୪ ମିଶନ ୧୮ଟି ରାଜ୍ୟରେ ସକ୍ରିୟ • ଶତପ୍ରତିଶତ (୧୦୦%) ଖସ୍ରା ଓ ଖାତା ଅଂଶଧନ ସତ୍ୟାପନ ବାଧ୍ୟତାମୂଳକ • ୨୪x୭ ଜାତୀୟ ହେଲ୍ପଲାଇନ: 1800-111-BHOOMI • ନିର୍ମାଣ: Team Data_Vasu (SIH 2026)'
              : isHindi 
              ? '🔔 [अधिसूचना]: डिजिटल इंडिया भू-अभिलेख आधुनिकीकरण (DILRMP) 2.4 मिशन 18 राज्यों में सक्रिय • शत-प्रतिशत (100%) खसरा एवं खाता हिस्सा सत्यापन अनिवार्य • 24x7 राष्ट्रीय सहायता: 1800-111-BHOOMI • नवाचार एवं विकास: Team Data_Vasu (SIH 2026)'
              : isHinglish
              ? '🔔 [OFFICIAL BULLETIN]: DILRMP 2.4 Mission 18 States me Active hai • 100% Khasra & Co-Owner Share Reconciliation Mandated • 24x7 LRMS Helpline: 1800-111-BHOOMI • Innovated by Team Data_Vasu (SIH 2026)'
              : '🔔 [OFFICIAL BULLETIN]: DILRMP 2.4 Cadastral Resurvey Active across 18 States • 100% Khasra & Co-Owner Share Reconciliation Mandated • 24x7 LRMS Toll-Free Helpline: 1800-111-BHOOMI • Architected by Team Data_Vasu (SIH 2026)'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="app-container">
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={dashboardStats}
            onNavigate={(tab) => setActiveTab(tab)}
            language={language}
          />
        )}

        {activeTab === 'digitize' && (
          <DigitizationStudio
            samples={samples}
            onRecordSaved={handleRecordSaved}
            onLocateOnMap={handleLocateOnMap}
            role={role}
            language={language}
          />
        )}

        {activeTab === 'cadastral_map' && (
          <CadastralMap
            selectedRecord={selectedRecordForMap}
            allRecords={records}
            onSelectRecord={(rec) => setSelectedRecordForMap(rec)}
            language={language}
          />
        )}

        {activeTab === 'registry' && (
          <RecordsRegistry
            records={records}
            onSelectRecordForMap={handleLocateOnMap}
            onOpenAuditModal={handleOpenAuditModal}
            onRecordsChanged={() => {
              fetchRecords();
              fetchStats();
            }}
            language={language}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            records={records}
            language={language}
          />
        )}

        {activeTab === 'active_learning' && (
          <ActiveLearningQueue language={language} />
        )}

        {activeTab === 'audit_trail' && (
          <AuditTrailView
            language={language}
            onLocateRecord={handleLocateOnMap}
          />
        )}

        {activeTab === 'faq' && (
          <FAQView
            language={language}
          />
        )}
      </main>

      <AuditTrailModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        recordId={targetAuditRecordId}
        language={language}
      />

      <SupabaseModal
        isOpen={isDbModalOpen}
        onClose={() => {
          setIsDbModalOpen(false);
          fetchRecords();
          fetchStats();
          fetchDbStatus();
        }}
        language={language}
      />

      {/* Official Government Footer with Animated Tricolor & Team Data_Vasu Showcase */}
      <footer className="gov-footer" style={{ marginTop: 'auto', width: '100%', padding: 0, background: 'var(--gov-navy-950)', color: 'white' }}>
        {/* Animated Indian National Tricolor Ribbon at top of footer */}
        <div className="tricolor-ribbon" />

        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 24px 32px 24px' }}>
          {/* Main 4-Column Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', marginBottom: '36px' }}>
            {/* Col 1: National Program Identity */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F47920' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white', letterSpacing: '0.02em' }}>
                    भूमिदृष्टि (BhoomiDrishti AI)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Digital India Land Modernization (DILRMP)
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.6, marginTop: '8px' }}>
                {isTelugu
                  ? 'భూ వనరుల శాఖ, గ్రామీణాభివృద్ధి మంత్రిత్వ శాఖ, భారత ప్రభుత్వం ఆధ్వర్యంలో పాత భూమి రికార్డుల AI ఆధారిత డిజిటలైజేషన్ మరియు పారదర్శక ధృవీకరణ వేదిక.'
                  : isOdia
                  ? 'ଭୂସମ୍ପଦ ବିଭାଗ, ଗ୍ରାମୀଣ ବିକାଶ ମନ୍ତ୍ରଣାଳୟ, ଭାରତ ସରକାରଙ୍କ ଅଧୀନରେ ପୁରାତନ ଜମି ରେକର୍ଡର AI-ଚାଳିତ ଡିଜିଟାଇଜେସନ୍ ଓ ସ୍ୱଚ୍ଛ ସତ୍ୟାପନ ପ୍ଲାଟଫର୍ମ।'
                  : isHindi 
                  ? 'भूमि संसाधन विभाग, ग्रामीण विकास मंत्रालय, भारत सरकार के अंतर्गत ऐतिहासिक भूमि अभिलेखों का एआई-संचालित डिजिटलीकरण एवं पारदर्शी सत्यापन मंच।' 
                  : 'An intelligent AI-powered platform for automated digitization, validation, and cadastral mapping of vintage Indian land registers under Department of Land Resources (DoLR), MoRD, Govt. of India.'}
              </p>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#CBD5E1' }}>
                  NIC Compliant 3.0
                </span>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#CBD5E1' }}>
                  WCAG 2.1 AA
                </span>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#CBD5E1' }}>
                  Sec 65B Evidence Act
                </span>
              </div>
            </div>

            {/* Col 2: High-Impact Team Data_Vasu Credit Showcase */}
            <div 
              style={{ 
                background: 'linear-gradient(145deg, rgba(244, 121, 32, 0.12) 0%, rgba(11, 59, 96, 0.4) 100%)', 
                padding: '20px 22px', 
                borderRadius: '12px', 
                border: '1px solid rgba(244, 121, 32, 0.35)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Sparkles size={18} color="#F47920" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#FDBA74', letterSpacing: '0.06em' }}>
                  {isTelugu ? 'అధికారిక ఆవిష్కర్తలు & డెవలపర్లు' : isOdia ? 'ଅଧିକୃତ ଉଦ୍ଭାବକ ଓ ବିକାଶକାରୀ' : isHindi ? 'आधिकारिक अन्वेषक एवं डेवलपर' : 'Official Innovators & Developers'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white', margin: '4px 0 8px 0', letterSpacing: '0.02em' }}>
                Team Data_Vasu
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                Proudly engineered and architected for the <strong>Smart India Hackathon (SIH 2026)</strong>. Pushing the boundaries of multilingual Computer Vision, Devanagari OCR, Cadastral GIS, and tamper-evident audit infrastructure.
              </p>
              <div style={{ marginTop: '14px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.675rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(244, 121, 32, 0.25)', color: '#FED7AA', border: '1px solid rgba(244, 121, 32, 0.4)' }}>
                  Vision AI
                </span>
                <span style={{ fontSize: '0.675rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.2)', color: '#BAE6FD', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  Cadastral GIS
                </span>
                <span style={{ fontSize: '0.675rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.2)', color: '#BBF7D0', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                  SIH 2026
                </span>
              </div>
            </div>

            {/* Col 3: Core Capabilities & Quick Navigation */}
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
                {isTelugu ? 'శీఘ్ర లింకులు & సేవలు' : isOdia ? 'ଦ୍ରୁତ ଲିଙ୍କ୍ ଓ ସେବା' : isHindi ? 'त्वरित लिंक एवं सेवाएँ' : 'Core Capabilities'}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: '10px', color: '#94A3B8' }}>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setActiveTab('dashboard')}>
                  → {isTelugu ? 'జాతీయ విశ్లేషణలు & గణాంకాలు' : isOdia ? 'ଜାତୀୟ ଡ୍ୟାସବୋର୍ଡ ଓ ପରିସଂଖ୍ୟାନ' : isHindi ? 'राष्ट्रीय डैशबोर्ड एवं सांख्यिकी' : 'National Analytics & KPIs'}
                </li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setActiveTab('digitize')}>
                  → {isTelugu ? 'AI డిజిటలైజేషన్ స్టూడియో (బహుభాషా)' : isOdia ? 'AI ଡିଜିଟାଇଜେସନ୍ ଷ୍ଟୁଡିଓ (ବହୁଭାଷୀ)' : isHindi ? 'दस्तावेज़ डिजिटलीकरण स्टूडियो' : 'AI Digitization Studio (Multilingual)'}
                </li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setActiveTab('cadastral_map')}>
                  → {isTelugu ? 'కాడాస్ట్రల్ GIS పార్శిల్ మ్యాపింగ్' : isOdia ? 'କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ GIS ମ୍ୟାପ୍ ଭ୍ୟୁଅର' : isHindi ? 'भू-स्थानिक भूखंड मैपिंग (GIS)' : 'Cadastral GIS Parcel Viewer'}
                </li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setActiveTab('registry')}>
                  → {isTelugu ? 'భూమి రికార్డుల రిజిస్ట్రీ (CRUD)' : isOdia ? 'ଜମି ରେକର୍ଡ ରେଜିଷ୍ଟ୍ରି (CRUD)' : isHindi ? 'भू-अभिलेख रजिस्ट्री' : 'Land Records Registry (CRUD)'}
                </li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setActiveTab('reports')}>
                  → {isTelugu ? 'అధికారిక చట్టబద్ధ నివేదికలు' : isOdia ? 'ସରକାରୀ ପ୍ରତିବେଦନ ଓ ପରିସଂଖ୍ୟାନ' : isHindi ? 'आधिकारिक प्रतिवेदन एवं सांख्यिकी' : 'Official Statutory Reports & MIS'}
                </li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setActiveTab('audit_trail')}>
                  → {isTelugu ? 'క్రిప్టోగ్రాఫిక్ ఆడిట్ ట్రయల్ (SHA-256)' : isOdia ? 'ଅପରିବର୍ତ୍ତନୀୟ ଅଡିଟ୍ ଟ୍ରେଲ୍ (SHA-256)' : isHindi ? 'अपरिवर्तनीय ऑडिट ट्रेल' : 'Cryptographic Audit Trail (SHA-256)'}
                </li>
                <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setActiveTab('faq')}>
                  → {isTelugu ? 'పౌర ప్రశ్నలు & సహాయ కేంద్రం' : isOdia ? 'ନାଗରିକ ପ୍ରଶ୍ନୋତ୍ତର ଓ ସହାୟତା କେନ୍ଦ୍ର' : isHindi ? 'नागरिक प्रश्नोत्तरी एवं सहायता केंद्र' : 'Citizen FAQs & Knowledgebase'}
                </li>
              </ul>
            </div>

            {/* Col 4: National Helpdesk & Emergency Support */}
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
                {isTelugu ? 'సహాయం & అత్యవసర సంప్రదింపులు' : isOdia ? 'ସହାୟତା ଓ ଜରୁରୀ ସମ୍ପର୍କ' : isHindi ? 'सहायता एवं संपर्क' : 'Support & Emergency'}
              </div>
              <div style={{ fontSize: '0.825rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ color: '#E2E8F0', fontWeight: 700 }}>{isTelugu ? 'జాతీయ టోల్-ఫ్రీ హెల్ప్‌లైన్:' : isOdia ? 'ଜାତୀୟ ଟୋଲ୍-ଫ୍ରି ହେଲ୍ପଲାଇନ:' : isHindi ? 'राष्ट्रीय टोल-फ्री हेल्पलाइन:' : 'Toll-Free LRMS Helpline:'}</div>
                  <div style={{ color: '#F47920', fontWeight: 800, fontSize: '1rem', marginTop: '2px' }}>1800-111-BHOOMI (24x7)</div>
                </div>
                <div>
                  <div style={{ color: '#E2E8F0', fontWeight: 700 }}>{isTelugu ? 'సాంకేతిక సహాయ డెస్క్:' : isOdia ? 'ବୈଷୟିକ ସହାୟତା ଡେସ୍କ:' : isHindi ? 'तकनीकी सहायता डेस्क:' : 'Technical Support Desk:'}</div>
                  <div style={{ color: '#38BDF8' }}>support.bhoomi@nic.in</div>
                </div>
                <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                    {isTelugu ? 'సత్యమేవ జయతే | సత్యమే పరమ ధర్మం' : isOdia ? 'ସତ୍ୟମେବ ଜୟତେ | ସତ୍ୟ ହିଁ ପରମ ଧର୍ମ' : isHindi ? 'सत्यमेव जयते | सत्य ही सर्वोच्च धर्म है' : 'Satyameva Jayate • Truth Alone Triumphs'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & National Seal Row */}
          <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.775rem', color: '#94A3B8' }}>
            <div>
              © 2026 Digital India Land Records Modernization Programme (DILRMP). Built with pride by <strong>Team Data_Vasu</strong> for <strong>Smart India Hackathon 2026</strong>.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span>Version 2.4.0 (SIH Production)</span>
              <div 
                style={{ 
                  background: 'rgba(255,255,255,0.08)', 
                  padding: '4px 10px', 
                  borderRadius: '4px', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  color: '#FDBA74'
                }}
              >
                सत्यमेव जयते
              </div>
            </div>
          </div>
        </div>

        {/* Indian National Tricolor Ribbon at bottom of footer */}
        <div className="tricolor-ribbon-footer" />
      </footer>
    </div>
  );
}
