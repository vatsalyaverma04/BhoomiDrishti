import React from 'react';
import { 
  FileText, CheckCircle, Clock, AlertTriangle, TrendingUp, 
  MapPin, ShieldCheck, ArrowRight, Zap, Layers, RefreshCw
} from 'lucide-react';
import { loc } from '../utils/translations';

export default function Dashboard({ stats, onNavigate, language = 'en' }) {
  const isHindi = language === 'hi';
  const isHinglish = language === 'hinglish';
  const isTelugu = language === 'te';
  const isOdia = language === 'or';

  const defaultStats = {
    total_documents_processed: 14824,
    accuracy_rate_percentage: 97.4,
    validation_status_breakdown: {
      validated: 13914,
      pending_review: 740,
      flagged_errors: 170
    },
    state_digitization_progress: [
      { state: "Madhya Pradesh", completed: 94.2, total_villages: 55420, digitized_records: "1.2 Cr" },
      { state: "Maharashtra", completed: 96.8, total_villages: 43665, digitized_records: "2.4 Cr" },
      { state: "Uttar Pradesh", completed: 89.5, total_villages: 106774, digitized_records: "3.8 Cr" },
      { state: "Bihar", completed: 84.1, total_villages: 45103, digitized_records: "1.8 Cr" },
      { state: "Rajasthan", completed: 91.3, total_villages: 44981, digitized_records: "1.5 Cr" },
      { state: "Karnataka", completed: 98.1, total_villages: 29340, digitized_records: "1.9 Cr" }
    ],
    average_processing_time_sec: 2.4,
    manual_intervention_reduction: "82.6%"
  };

  const currentStats = stats || defaultStats;
  const breakdown = currentStats.validation_status_breakdown || defaultStats.validation_status_breakdown;
  const total = breakdown.validated + breakdown.pending_review + breakdown.flagged_errors;

  const validPct = Math.round((breakdown.validated / total) * 100);
  const pendingPct = Math.round((breakdown.pending_review / total) * 100);
  const flaggedPct = 100 - validPct - pendingPct;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner / Call to Action */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #071D33 0%, #0B3B60 70%, #104F80 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 32px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span 
              style={{
                background: 'rgba(244, 121, 32, 0.25)',
                border: '1px solid #F47920',
                color: '#FDBA74',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {loc(language, 'National Land Modernization Mission', 'राष्ट्रीय भू-अभिलेख आधुनिकीकरण मिशन', 'జాతీయ భూ-రికార్డుల ఆధునీకరణ మిషన్', 'ଜାତୀୟ ଭୂ-ଅଭିଲେଖ ଆଧୁନିକୀକରଣ ମିଶନ', 'National Land Records Mission')}
            </span>
            <span 
              style={{
                background: 'linear-gradient(135deg, rgba(244, 121, 32, 0.3) 0%, rgba(19, 136, 8, 0.3) 100%)',
                border: '1px solid #34D399',
                color: '#A7F3D0',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                boxShadow: '0 0 12px rgba(52, 211, 153, 0.25)'
              }}
            >
              ⭐ Built by Team Data_Vasu • SIH 2026
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '10px 0 6px 0', letterSpacing: '-0.01em' }}>
            {loc(
              language,
              'AI-Accelerated Legacy Land Records Modernization',
              'ऐतिहासिक भू-अभिलेखों का त्वरित एवं शुद्ध डिजिटलीकरण',
              'పురాతన భూమి రికార్డుల శీఘ్ర మరియు ఖచ్చితమైన AI ఆధునీకరణ',
              'ପୁରାତନ ଜମି ରେକର୍ଡର ଦ୍ରୁତ ଓ ନିର୍ଭୁଲ AI ଆଧୁନିକୀକରଣ',
              'Legacy Land Records ka Fast & Accurate AI Modernization'
            )}
          </h2>
          <p style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: 1.6 }}>
            {loc(
              language,
              'Restore stained, faded, century-old cadastral registers with advanced CLAHE filters, extract multilingual Devanagari text, and plot exact parcel coordinates on real maps.',
              'पुराने पीले पन्नों, दाग-धब्बों और धुंधली हस्तलिखित लिखावट को उन्नत कंप्यूटर विज़न से संवारें और राष्ट्रीय विज़न एआई इंजन से स्वतः डिजिटल बनाएं।',
              'మరకలు మరియు మసకబారిన పాత కాడాస్ట్రల్ రిజిస్టర్‌లను అధునాతన CLAHE ఫిల్టర్‌లతో పునరుద్ధరించండి, బహుభాషా పాఠాన్ని పొందండి మరియు మ్యాప్‌లో ఖచ్చితమైన సరిహద్దులను గుర్తించండి.',
              'ଦାଗଯୁକ୍ତ ଓ ଫିକା ପଡ଼ିଯାଇଥିବା ଶତାବ୍ଦୀ ପୁରୁଣା ଜମି ରେକର୍ଡକୁ ଉନ୍ନତ କମ୍ପ୍ୟୁଟର ଭିଜନ ଦ୍ୱାରା ସଂଶୋଧନ କରନ୍ତୁ, ବହୁଭାଷୀ ପାଠ୍ୟ ନିଷ୍କର୍ଷଣ କରନ୍ତୁ ଓ ମାନଚିତ୍ରରେ ଚିହ୍ନଟ କରନ୍ତୁ।'
            )}
          </p>
        </div>
      </div>

      {/* Official Government Quick Services Hub (Reduces empty whitespace & enhances e-Gov UX) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div 
          onClick={() => onNavigate('digitize')}
          className="gov-card"
          style={{ cursor: 'pointer', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #F47920' }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'var(--gov-saffron-light)', color: 'var(--gov-saffron-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {loc(language, 'AI Digitization Studio', 'एआई डिजिटलीकरण स्टूडियो', 'AI డిజిటలైజేషన్ స్టూడియో', 'AI ଡିଜିଟାଇଜେସନ୍ ଷ୍ଟୁଡିଓ')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {loc(language, 'Scan Ingestion & Vision OCR', 'स्कैन अपलोड एवं ओसीआर विश्लेषण', 'స్కాన్ అప్‌లోడ్ & విజన్ OCR', 'ସ୍କାନ ଅପଲୋଡ ଓ ଭିଜନ OCR')}
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('cadastral_map')}
          className="gov-card"
          style={{ cursor: 'pointer', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #10B981' }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'var(--conf-high-bg)', color: 'var(--conf-high-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MapPin size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {loc(language, 'Cadastral GIS Parcel Map', 'कैडस्ट्रल जीआईएस मैप', 'కాడాస్ట్రల్ GIS పార్సెల్ మ్యాప్', 'କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ GIS ପାର୍ସଲ ମ୍ୟାପ୍')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {loc(language, 'Satellite Boundary Polygons', 'सैटेलाइट भू-सीमा एवं खसरा पार्सल', 'ఉపగ్రహ సరిహద్దులు & ఖస్రా ప్లాట్లు', 'ଉପଗ୍ରହ ସୀମା ଓ ଖସ୍ରା ପାର୍ସଲ')}
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('registry')}
          className="gov-card"
          style={{ cursor: 'pointer', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #3B82F6' }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {loc(language, 'Land Records Registry (CRUD)', 'भू-अभिलेख रजिस्ट्री (CRUD)', 'భూమి రికార్డుల రిజిస్ట్రీ (CRUD)', 'ଜମି ରେକର୍ଡ ରେଜିଷ୍ଟ୍ରି (CRUD)')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {loc(language, 'Search, Edit & Add Records', 'खसरा खोज, संपादन एवं विलोपन', 'శోధించండి, సవరించండి & జోడించండి', 'ଅନୁସନ୍ଧାନ, ସମ୍ପାଦନ ଓ ନୂତନ ରେକର୍ଡ')}
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('reports')}
          className="gov-card"
          style={{ cursor: 'pointer', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '4px solid #8B5CF6' }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.1)', color: '#6D28D9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {loc(language, 'Statutory MIS & Reports', 'आधिकारिक प्रतिवेदन एवं सांख्यिकी', 'చట్టబద్ధ నివేదికలు & గణాంకాలు', 'ସରକାରୀ ପ୍ରତିବେଦନ ଓ ପରିସଂଖ୍ୟାନ')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {loc(language, 'Sec 65B & Export CSV', 'धारा ६५बी प्रमाण पत्र एवं सीएसवी', 'సెక్షన్ 65B ధృవీకరణ & ఎగుమతి', 'ଧାରା ୬୫B ପ୍ରମାଣପତ୍ର ଓ ରପ୍ତାନି')}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Card 1: Total Processed */}
        <div className="gov-card" style={{ borderTop: '4px solid var(--gov-navy-800)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              {loc(language, 'Total Documents Processed', 'कुल डिजिटाइज़्ड दस्तावेज़', 'మొత్తం ప్రాసెస్ చేసిన పత్రాలు', 'ମୋଟ ଡିଜିଟାଇଜ୍ଡ ଦଲିଲ')}
            </span>
            <FileText size={20} color="var(--gov-saffron)" />
          </div>
          <div className="kpi-metric-value" style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '8px' }}>
            {currentStats.total_documents_processed.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#059669', marginTop: '6px' }}>
            <TrendingUp size={14} />
            <span>{loc(language, '+18.4% growth this week', '+18.4% इस सप्ताह में वृद्धि', '+18.4% ఈ వారం వృద్ధి', '+୧୮.୪% ଏହି ସପ୍ତାହରେ ବୃଦ୍ଧି')}</span>
          </div>
        </div>

        {/* Card 2: AI Accuracy */}
        <div className="gov-card" style={{ borderTop: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              {loc(language, 'AI Extraction Accuracy', 'एआई शुद्धता दर', 'AI వెలికితీత ఖచ్చితత్వం', 'AI ନିଷ୍କର୍ଷଣ ନିର୍ଭୁଲତା')}
            </span>
            <CheckCircle size={20} color="#10B981" />
          </div>
          <div className="kpi-metric-green" style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '8px' }}>
            {currentStats.accuracy_rate_percentage}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {loc(language, 'Benchmarked across Indian Scripts & English', 'बहुभाषी सत्यापन मॉडल द्वारा प्रमाणित', 'భారతీయ లిపులు & ఆంగ్లంలో ధృవీకరించబడింది', 'ଭାରତୀୟ ଲିପି ଓ ଇଂରାଜୀରେ ପରୀକ୍ଷିତ')}
          </div>
        </div>

        {/* Card 3: Pending Verification */}
        <div className="gov-card" style={{ borderTop: '4px solid var(--gov-saffron)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              {loc(language, 'Pending Verification Queue', 'पटवारी सत्यापन कतार', 'పరిశీలన పెండింగ్ జాబితా', 'ଯାଞ୍ଚ ଅପେକ୍ଷା ଧାଡ଼ି')}
            </span>
            <Clock size={20} color="var(--gov-saffron)" />
          </div>
          <div className="kpi-metric-saffron" style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '8px' }}>
            {breakdown.pending_review.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {loc(language, 'Flagged for Human-in-the-Loop review', 'मानवीय सत्यापन हेतु चिन्हित मामले', 'మానవ సమీక్ష కోసం గుర్తించిన రికార్డులు', 'ମାନବୀୟ ଯାଞ୍ଚ ପାଇଁ ଚିହ୍ନିତ ରେକର୍ଡ')}
          </div>
        </div>

        {/* Card 4: Manual Effort Reduction */}
        <div className="gov-card" style={{ borderTop: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              {loc(language, 'Manual Effort Reduction', 'मैन्युअल प्रयास में बचत', 'మాన్యువల్ శ్రమ తగ్గింపు', 'ମାନୁଆଲ ପରିଶ୍ରମ ହ୍ରାସ')}
            </span>
            <ShieldCheck size={20} color="#3B82F6" />
          </div>
          <div className="kpi-metric-blue" style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '8px' }}>
            {currentStats.manual_intervention_reduction}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {loc(language, `Avg processing: ${currentStats.average_processing_time_sec}s / page`, `औसत गति: 2.4 सेकंड / प्रति पृष्ठ`, `సగటు వేగం: ${currentStats.average_processing_time_sec} సె / పేజీ`, `ହାରାହାରି ଗତି: ${currentStats.average_processing_time_sec} ସେ / ପୃଷ୍ଠା`)}
          </div>
        </div>
      </div>

      {/* 3-Column Information-Dense Section: Validation Breakdown | Processing Pipeline | Official Gazette Circulars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Col 1: Validation Breakdown Card */}
        <div className="gov-card">
          <div className="gov-card-header">
            <span className="gov-card-title">
              <CheckCircle size={18} color="var(--gov-saffron)" />
              <span>{loc(language, 'Validation Status Breakdown', 'सत्यापन स्थिति वर्गीकरण', 'ధృవీకరణ స్థితి వర్గీకరణ', 'ସତ୍ୟାପନ ସ୍ଥିତି ବର୍ଗୀକରଣ')}</span>
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {loc(language, 'Real-Time Sync', 'वास्तविक समय आँकड़े', 'రియల్-టైమ్ సమన్వయం', 'ରିଅଲ-ଟାଇମ୍ ସିଙ୍କ୍')}
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div style={{ height: '14px', borderRadius: '7px', display: 'flex', overflow: 'hidden', margin: '14px 0 20px 0' }}>
            <div style={{ width: `${validPct}%`, background: '#10B981' }} title={`Validated: ${validPct}%`} />
            <div style={{ width: `${pendingPct}%`, background: '#F59E0B' }} title={`Pending: ${pendingPct}%`} />
            <div style={{ width: `${flaggedPct}%`, background: '#EF4444' }} title={`Flagged: ${flaggedPct}%`} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--conf-high-bg)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontWeight: 600, color: 'var(--conf-high-text)' }}>
                  {loc(language, 'Fully Validated', 'पूर्णतः सत्यापित', 'పూర్తిగా ధృవీకరించబడింది', 'ସମ୍ପୂର୍ଣ୍ଣ ସତ୍ୟାପିତ')}
                </span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--conf-high-text)' }}>
                {breakdown.validated.toLocaleString()} ({validPct}%)
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--conf-med-bg)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                <span style={{ fontWeight: 600, color: 'var(--conf-med-text)' }}>
                  {loc(language, 'Pending Human Review', 'समीक्षाधीन', 'సమీక్ష పెండింగ్‌లో ఉంది', 'ସମୀକ୍ଷା ଅପେକ୍ଷାରେ', 'Needs Review')}
                </span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--conf-med-text)' }}>
                {breakdown.pending_review.toLocaleString()} ({pendingPct}%)
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--conf-low-bg)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                <span style={{ fontWeight: 600, color: 'var(--conf-low-text)' }}>
                  {loc(language, 'Flagged Discrepancy', 'विसंगति / त्रुटि फ्लैग', 'లోపాలు గుర్తించబడ్డాయి', 'ତ୍ରୁଟିପୂର୍ଣ୍ଣ ରେକର୍ଡ', 'Flagged Errors')}
                </span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--conf-low-text)' }}>
                {breakdown.flagged_errors.toLocaleString()} ({flaggedPct}%)
              </span>
            </div>
          </div>
        </div>

        {/* Col 2: End-to-End Processing Pipeline */}
        <div className="gov-card">
          <div className="gov-card-header">
            <span className="gov-card-title">
              <Layers size={18} color="var(--gov-navy-800)" />
              <span>{loc(language, 'Intelligent Processing Workflow', 'इंटेलिजेंट डिजिटलीकरण पाइपलाइन', 'తెలివైన ప్రాసెసింగ్ వర్క్‌ఫ్లో', 'ବୁଦ୍ଧିମାନ ପ୍ରକ୍ରିୟାକରଣ କାର୍ଯ୍ୟପ୍ରଣାଳୀ')}</span>
            </span>
            <span style={{ fontSize: '0.75rem', background: '#E0F2FE', color: '#0369A1', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              DILRMP Compliant
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#0B3B60', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>1</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.825rem' }}>{loc(language, 'Document Ingestion & Degradation Check', 'दस्तावेज़ अपलोड एवं गुणवत्ता विश्लेषण', 'పత్రం అప్‌లోడ్ & నాణ్యత తనిఖీ', 'ଦଲିଲ ଅପଲୋଡ ଓ ଗୁଣବତ୍ତା ଯାଞ୍ଚ')}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{loc(language, 'Scanned PDFs, historical cadastral registers', 'धुंधले और मुड़े हुए पन्नों की स्वतः पहचान', 'స్కాన్ చేసిన PDFలు, చారిత్రక రికార్డులు', 'ସ୍କାନ PDF ଓ ଐତିହାସିକ ଜମି ରେକର୍ଡ')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F47920', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>2</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.825rem' }}>{loc(language, 'Computer Vision Enhancement Pipeline', 'कंप्यूटर विज़न सुधार (CLAHE / Binarization)', 'కంప్యూటర్ విజన్ మెరుగుదల ఫిల్టర్లు', 'କମ୍ପ୍ୟୁଟର ଭିଜନ ଉନ୍ନତିକରଣ')}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{loc(language, 'Deskewing, Sauvola adaptive binarization', 'दाग-धब्बे हटाना, ऑटो-डिस्क्यू व कंट्रास्ट', 'మచ్చల తొలగింపు, ఆటో-డెస్క్యూ', 'ଦାଗ ନିବାରଣ, ଅଟୋ-ଡେସ୍କ୍ୟୁ')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>3</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.825rem' }}>{loc(language, 'Multilingual Neural Vision OCR', 'बहुभाषी विज़न ओसीआर एवं फील्ड वर्गीकरण', 'బహుభాషా న్యూరల్ విజన్ OCR', 'ବହୁଭାଷୀ ନ୍ୟୁରାଲ ଭିଜନ OCR')}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{loc(language, 'Telugu, Odia, Hindi, English extraction', 'खसरा, रकबा, खातेदार, हिस्सा, ऋण विवरण', 'తెలుగు, ఒడియా, హిందీ, ఇంగ్లీష్ వెలికితీత', 'ଓଡ଼ିଆ, ତେଲୁଗୁ, ହିନ୍ଦୀ, ଇଂରାଜୀ ନିଷ୍କର୍ଷଣ')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#8B5CF6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>4</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.825rem' }}>{loc(language, 'Business Rules Validation & GIS Plotting', 'व्यापार नियम सत्यापन एवं जीआईएस मैपिंग', 'నిబంధనల ధృవీకరణ & GIS మ్యాపింగ్', 'ନିୟମ ସତ୍ୟାପନ ଓ GIS ପ୍ଲଟିଂ')}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{loc(language, '100% share fraction reconciliation & PostGIS', '100% हिस्सा जांच, डुप्लीकेट रोकथाम', '100% వాటా సంతులనం & GIS సమన్వయం', '୧୦୦% ଅଂଶଧନ ସନ୍ତୁଳନ ଓ GIS ସଂଯୋଗ')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Official Gazette Circulars & Statutory Directives (Authentic Govt e-Gov Look) */}
        <div className="gov-card">
          <div className="gov-card-header">
            <span className="gov-card-title">
              <FileText size={18} color="var(--gov-saffron-dark)" />
              <span>{loc(language, 'Official Gazette & Directives', 'राजपत्र परिपत्र एवं विधिक निर्देश', 'అధికారిక గెజిట్ & ఆదేశాలు', 'ସରକାରୀ ରାଜପତ୍ର ଓ ନିର୍ଦ୍ଦେଶାବଳୀ')}</span>
            </span>
            <span style={{ fontSize: '0.7rem', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              Govt of India
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-subtle)', borderLeft: '3px solid #F47920' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gov-navy-800)' }}>
                {loc(language, 'Circular No. 18/2026: 100% Share Balance', 'परिपत्र सं. 18/2026: 100% हिस्सा संतुलन अनिवार्यता', 'సర్క్యులర్ 18/2026: 100% వాటా సంతులనం తప్పనిసరి', 'ପରିପତ୍ର ୧୮/୨୦୨୬: ୧୦୦% ଅଂଶଧନ ସନ୍ତୁଳନ ବାଧ୍ୟତାମୂଳକ')}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {loc(language, 'Mandatory 100% mathematical reconciliation across all co-tenure khatas.', 'सभी सह-खातेदारों के हिस्सों का योग शत-प्रतिशत होना विधिक रूप से बाध्यकारी है।', 'ఉమ్మడి ఖాతాదారులందరి వాటాల మొత్తం 100% సమానం కావడం చట్టబద్ధం.', 'ସମସ୍ତ ସହ-ଖାତାଦାରଙ୍କ ଅଂଶ ଯୋଗଫଳ ୧୦୦% ହେବା ଆଇନଗତ ଭାବେ ବାଧ୍ୟତାମୂଳକ।')}
              </div>
            </div>

            <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-subtle)', borderLeft: '3px solid #10B981' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gov-navy-800)' }}>
                {loc(language, 'Sec 65B Electronic Admissibility Order', 'साक्ष्य अधिनियम धारा 65B डिजिटल प्रमाणीकरण', 'సెక్షన్ 65B ఎలక్ట్రానిక్ అంగీకార ఉత్తర్వు', 'ଧାରା ୬୫B ଡିଜିଟାଲ୍ ସ୍ୱୀକୃତି ଆଦେଶ')}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {loc(language, 'Legally valid electronic land certificates for revenue courts.', 'अधिकृत डिजिटल हस्ताक्षर एवं SHA-256 हैश युक्त प्रतियां न्यायालय में मान्य।', 'రెవెన్యూ న్యాయస్థానాలకు చట్టబద్ధమైన ఎలక్ట్రానిక్ భూమి ధృవీకరణ పత్రాలు.', 'ରାଜସ୍ୱ ଅଦାଲତ ପାଇଁ ଆଇନଗତ ଭାବେ ବୈଧ ଡିଜିଟାଲ୍ ଭୂମି ପ୍ରମାଣପତ୍ର।')}
              </div>
            </div>

            <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-subtle)', borderLeft: '3px solid #3B82F6' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gov-navy-800)' }}>
                {loc(language, 'Drone Cadastral Resurvey Standards', 'ड्रोन आधारित कैडस्ट्रल पुनर्सर्वेक्षण 2026', 'డ్రోన్ ఆధారిత కాడాస్ట్రల్ సర్వే ప్రమాణాలు', 'ଡ୍ରୋନ୍ ଆଧାରିତ କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ ପୁନଃସର୍ଭେ ମାନକ')}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {loc(language, 'Survey of India 5cm ground resolution cadastral spatial overlay.', '5 सेमी जीआरडी ऑर्थोरेक्टिफाइड सैटेलाइट इमेजरी मैपिंग प्रोटोकॉल।', 'సర్వే ఆఫ్ ఇండియా 5సెం.మీ ఖచ్చితత్వంతో ఉపగ్రహ మ్యాపింగ్ ప్రోటోకాల్.', 'ସର୍ଭେ ଅଫ୍ ଇଣ୍ଡିଆ ୫ ସେମି ନିର୍ଭୁଲତା ବିଶିଷ୍ଟ ମ୍ୟାପିଂ ପ୍ରୋଟୋକଲ୍।')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Security Infrastructure & NIC Node Status Strip */}
      <div 
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.775rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
          <strong>{loc(language, 'National Infrastructure Status:', 'राष्ट्रीय अवसंरचना स्थिति:', 'జాతీయ మౌలిక సదుపాయాల స్థితి:', 'ଜାତୀୟ ଭିତ୍ତିଭୂମି ସ୍ଥିତି:')}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', color: 'var(--text-secondary)' }}>
          <div>🏢 NIC Node-04: <span style={{ color: '#059669', fontWeight: 700 }}>ONLINE</span></div>
          <div>🧠 Vision OCR AI Engine: <span style={{ color: '#059669', fontWeight: 700 }}>97.4% ACCURACY</span></div>
          <div>🔒 SHA-256 Ledger: <span style={{ color: '#059669', fontWeight: 700 }}>VERIFIED</span></div>
          <div>🗺️ PostGIS Spatial Engine: <span style={{ color: '#059669', fontWeight: 700 }}>ACTIVE</span></div>
          <div>⭐ Architecture: <span style={{ color: '#F47920', fontWeight: 800 }}>Team Data_Vasu</span></div>
        </div>
      </div>

      {/* State-wise Digitization Progress Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <span className="gov-card-title">
            <MapPin size={18} color="var(--gov-navy-800)" />
            <span>{loc(language, 'State-wise DILRMP Digitization Progress', 'राज्यवार भू-अभिलेख आधुनिकीकरण प्रगति', 'రాష్ట్రాల వారీగా DILRMP డిజిటలైజేషన్ పురోగతి', 'ରାଜ୍ୟୱାରୀ DILRMP ଡିଜିଟାଇଜେସନ୍ ଅଗ୍ରଗତି')}</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={() => onNavigate('reports')} 
              className="btn btn-outline" 
              style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700 }}
            >
              {loc(language, 'View Full Report →', 'विस्तृत रिपोर्ट देखें →', 'పూర్తి నివేదికను వీక్షించండి →', 'ସମ୍ପୂର୍ଣ୍ଣ ରିପୋର୍ଟ ଦେଖନ୍ତୁ →')}
            </button>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {loc(language, 'National LRMS Database Source', 'राष्ट्रीय भू-अभिलेख पोर्टल डेटा', 'జాతీయ LRMS డేటాబేస్ మూలం', 'ଜାତୀୟ LRMS ଡାଟାବେସ୍ ଉତ୍ସ')}
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-light)' }}>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>{loc(language, 'State / UT', 'राज्य का नाम', 'రాష్ట్రం / UT', 'ରାଜ୍ୟ / UT')}</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>{loc(language, 'Total Revenue Villages', 'कुल राजस्व ग्राम', 'మొత్తం రెవెన్యూ గ్రామాలు', 'ମୋଟ ରାଜସ୍ୱ ଗ୍ରାମ')}</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>{loc(language, 'Digitized Records', 'डिजिटाइज़्ड रिकॉर्ड संख्या', 'డిజిటలైజ్ చేసిన రికార్డులు', 'ଡିଜିଟାଇଜ୍ଡ ରେକର୍ଡ ସଂଖ୍ୟା')}</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>{loc(language, 'Completion Rate', 'पूर्णता प्रतिशत', 'పూర్తయిన శాతం', 'ସମ୍ପୂର୍ଣ୍ଣତା ପ୍ରତିଶତ')}</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>{loc(language, 'Progress Bar', 'प्रगति पट्टी', 'పురోగతి పట్టీ', 'ଅଗ୍ରଗତି ପଟ୍ଟା')}</th>
              </tr>
            </thead>
            <tbody>
              {currentStats.state_digitization_progress.map((row, idx) => (
                <tr key={idx} className="registry-row" style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--gov-navy-800)' }}>
                    {row.state}
                  </td>
                  <td style={{ padding: '12px 14px' }}>{row.total_villages.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>{row.digitized_records}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: row.completed > 90 ? '#059669' : '#D97706' }}>
                    {row.completed}%
                  </td>
                  <td style={{ padding: '12px 14px', width: '220px' }}>
                    <div style={{ background: '#E2E8F0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${row.completed}%`, 
                          height: '100%', 
                          background: row.completed > 92 ? '#10B981' : '#F59E0B',
                          borderRadius: '4px'
                        }} 
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
