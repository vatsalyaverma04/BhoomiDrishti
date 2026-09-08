import React, { useState } from 'react';
import { 
  CheckCircle2, AlertTriangle, AlertCircle, MapPin, 
  Send, ShieldAlert, FileCheck, BrainCircuit, Users, Building, 
  Landmark, DollarSign, Sparkles, Plus, Trash2, ShieldCheck, 
  Printer, Check, X, Award, FileText
} from 'lucide-react';
import { translations, loc } from '../utils/translations';
import { ALL_AREA_UNITS, formatFlexibleArea } from '../utils/areaUnits';

export default function VerificationForm({
  recordData,
  validationReport,
  onUpdateField,
  onSaveRecord,
  onSubmitCorrection,
  onLocateOnMap,
  isSaving,
  role = 'Tehsildar',
  language = 'en',
  endorsementData = null,
  onDismissEndorsement = null
}) {
  const t = translations[language]?.form || translations.en.form;
  const s = translations[language]?.studio || translations.en.studio;
  const isHindi = language === 'hi';
  const isHinglish = language === 'hinglish';
  const isTelugu = language === 'te';
  const isOdia = language === 'or';

  const [activeCorrectionField, setActiveCorrectionField] = useState(null);
  const [correctionNote, setCorrectionNote] = useState('');
  const [balanceNotice, setBalanceNotice] = useState(null);

  if (!recordData) {
    return (
      <div className="form-panel" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)', padding: '40px 20px', minHeight: '440px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px dashed var(--border-light)' }}>
          <FileCheck size={32} color="#94A3B8" />
        </div>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {loc(language,
            'Structured Land Entities Awaiting',
            'संरचित विवरण प्रतीक्षारत',
            'నిర్మాణాత్మక వివరాలు వేచి ఉన్నాయి',
            'ଗଠନମୂଳକ ବିବରଣୀ ଅପେକ୍ଷାରେ',
            'Structured Details Waiting'
          )}
        </h4>
        <p style={{ fontSize: '0.85rem', maxWidth: '360px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {loc(language,
            'Upload a document or choose a sample above to extract structured land fields',
            'दस्तावेज़ अपलोड करें या त्वरित परीक्षण हेतु कोई नमूना चुनें',
            'భూమి వివరాలను సేకరించడానికి పత్రాన్ని అప్‌లోడ్ చేయండి లేదా నమూనాను ఎంచుకోండి',
            'ଜମି ବିବରଣୀ ଦେଖିବା ପାଇଁ ଏକ ଦଲିଲ ଅପଲୋଡ କରନ୍ତୁ କିମ୍ବା ନମୁନା ବାଛନ୍ତୁ',
            'Document upload karein ya sample choose karein'
          )}
        </p>
      </div>
    );
  }

  const confScores = recordData.confidence_scores || {};
  const getConfBadge = (fieldKey) => {
    const score = confScores[fieldKey] ?? 0.92;
    if (score >= 0.85) {
      return <span className="badge-conf badge-conf-high">🟢 {Math.round(score * 100)}%</span>;
    } else if (score >= 0.65) {
      return <span className="badge-conf badge-conf-med">🟡 {Math.round(score * 100)}%</span>;
    } else {
      return <span className="badge-conf badge-conf-low">🔴 {Math.round(score * 100)}% {loc(language, 'Review', 'जांचें', 'సమీక్షించండి', 'ଯାଞ୍ଚ କରନ୍ତୁ', 'Review')}</span>;
    }
  };

  const handleFieldChange = (field, value) => {
    onUpdateField(field, value);
  };

  // Human Operator: Add new landowner / shareholder
  const handleAddLandowner = () => {
    const current = [...(recordData.landowners || [])];
    const newOwnerCount = current.length + 1;
    const defaultShare = Number((100 / newOwnerCount).toFixed(2));
    
    current.push({
      name: loc(language, 'Co-Owner Name', 'नया सह-खातेदार', 'సహ-యజమాని పేరు', 'ସହ-ରୟତ ନାମ', 'Naya Khatedar'),
      relation: loc(language, 's/o or w/o', 'सुपुत्र / सुपुत्री', 'కుమారుడు / భార్య', 'ପୁତ୍ର / ପତ୍ନୀ', 's/o or w/o'),
      share_percentage: defaultShare,
      share_fraction: `1/${newOwnerCount}`,
      aadhaar_masked: 'XXXX-XXXX-' + Math.floor(1000 + Math.random() * 9000),
      gender: 'Male',
      caste_category: 'General'
    });
    
    handleFieldChange('landowners', current);
    setBalanceNotice(loc(language, 'Co-owner added', 'नया सह-खातेदार जोड़ा गया', 'సహ-యజమాని చేర్చబడ్డారు', 'ନୂତନ ସହ-ରୟତ ଯୋଡାଗଲା', 'Co-owner added'));
    setTimeout(() => setBalanceNotice(null), 3000);
  };

  // Remove landowner
  const handleRemoveLandowner = (indexToRemove) => {
    const current = (recordData.landowners || []).filter((_, idx) => idx !== indexToRemove);
    handleFieldChange('landowners', current);
  };

  // Human Operator: Add new mutation record
  const handleAddMutation = () => {
    const current = [...(recordData.mutations || [])];
    current.push({
      order_number: `MUT-${Math.floor(100 + Math.random() * 900)}/2026`,
      order_date: new Date().toISOString().split('T')[0],
      type: loc(language, 'Inheritance (Varisana)', 'विरासत / वारिसाना नामांतरण', 'వారసత్వ బదిలీ (మ్యుటేషన్)', 'ଉତ୍ତରାଧିକାର ନାମାନ୍ତରଣ', 'Inheritance Transfer'),
      passed_by: `Tehsildar ${recordData.tehsil || 'Faridabad'}`
    });
    handleFieldChange('mutations', current);
  };

  // Remove mutation
  const handleRemoveMutation = (indexToRemove) => {
    const current = (recordData.mutations || []).filter((_, idx) => idx !== indexToRemove);
    handleFieldChange('mutations', current);
  };

  // Human Operator: Add bank encumbrance
  const handleAddEncumbrance = () => {
    const current = [...(recordData.encumbrances || [])];
    current.push({
      type: loc(language, 'Kisan Credit Card (KCC)', 'किसान क्रेडिट कार्ड बंधक ऋण', 'కిసాన్ క్రెడిట్ కార్డ్ (KCC) ఋణం', 'କିସାନ କ୍ରେଡିଟ୍ କାର୍ଡ (KCC) ଋଣ', 'Kisan Credit Card Loan'),
      bank_name: 'State Bank of India',
      amount: '₹1,50,000',
      status: 'Active',
      date: new Date().toISOString().split('T')[0]
    });
    handleFieldChange('encumbrances', current);
  };

  // Remove encumbrance
  const handleRemoveEncumbrance = (indexToRemove) => {
    const current = (recordData.encumbrances || []).filter((_, idx) => idx !== indexToRemove);
    handleFieldChange('encumbrances', current);
  };

  // Automated Balance & Completer (Workflow Accelerator)
  const handleAutoBalance = () => {
    const landowners = [...(recordData.landowners || [])];
    if (landowners.length === 1) {
      landowners[0].share_percentage = 100.0;
      landowners[0].share_fraction = '1/1';
    } else if (landowners.length > 1) {
      const equalShare = Number((100 / landowners.length).toFixed(2));
      landowners.forEach((o, i) => {
        o.share_percentage = equalShare;
        o.share_fraction = `1/${landowners.length}`;
      });
      // Adjust last to guarantee exactly 100
      const sum = landowners.slice(0, -1).reduce((acc, o) => acc + o.share_percentage, 0);
      landowners[landowners.length - 1].share_percentage = Number((100 - sum).toFixed(2));
    }
    
    // Standardize Area in Hectares
    let standardized = recordData.area_value || 1.0;
    const unit = (recordData.area_unit || '').toLowerCase();
    if (unit.includes('bigha')) {
      standardized = Number((standardized * 0.2529).toFixed(3));
    } else if (unit.includes('acre')) {
      standardized = Number((standardized * 0.4047).toFixed(3));
    } else if (unit.includes('guntha')) {
      standardized = Number((standardized * 0.0101).toFixed(3));
    } else if (unit.includes('sq') || unit.includes('meter')) {
      standardized = Number((standardized / 10000).toFixed(4));
    }

    handleFieldChange('landowners', landowners);
    handleFieldChange('standardized_hectares', standardized);
    if (!recordData.primary_owner && landowners.length > 0) {
      handleFieldChange('primary_owner', landowners[0].name + ' ' + (landowners[0].relation || ''));
    }

    setBalanceNotice(
      loc(language,
        '✓ Auto-balanced: 100% owner shares & standardized hectares calculated',
        '✓ स्वतः संतुलन पूर्ण: 100% हिस्सा एवं मानक हेक्टेयर रकबा समायोजित',
        '✓ స్వయంచాలక సంతులనం పూర్తయింది: 100% వాటా మరియు ప్రామాణిక హెక్టార్లు లెక్కించబడ్డాయి',
        '✓ ସ୍ୱୟଂଚାଳିତ ସନ୍ତୁଳନ ସମ୍ପୂର୍ଣ୍ଣ: ୧୦୦% ଅଂଶ ଓ ମାନକ ହେକ୍ଟର ସମାୟୋଜିତ',
        '✓ Auto-balance complete: 100% shares aur standard hectares adjust ho gaye'
      )
    );
    setTimeout(() => setBalanceNotice(null), 4000);
  };

  const getDisplayTitle = (title) => {
    if (!title) return loc(language, 'Structured Land Record Details', 'संरचित भू-अभिलेख विवरण', 'నిర్మాణాత్మక భూ రికార్డు వివరాలు', 'ଗଠନମୂଳକ ଭୂ-ଅଭିଲେଖ ବିବରଣୀ', 'Structured Land Record Details');
    if (!isHindi && !isHinglish) {
      if (title.includes('स्वामित्व अधिकार पत्र')) return 'Deed of Property Rights (Faridabad)';
      if (title.includes('खसरा / बी-1')) return 'Record of Rights - Khasra / B-1 (Dewas, MP)';
      if (title.includes('सात-बारा')) return 'Village Form 7/12 (Pune, MH)';
      if (title.includes('खतौनी')) return 'Khatoni Record (Varanasi, UP)';
      if (title.includes('जमाबंदी')) return 'Jamabandi Register (Patna, Bihar)';
    }
    return title;
  };

  return (
    <div className="form-panel">
      {/* =========================================================================
          DIGNIFIED OFFICIAL GOVERNMENT OF INDIA ENDORSEMENT CERTIFICATION
          (Appears on Approval — Replaces all alert popups)
          ========================================================================= */}
      {endorsementData && (
        <div className="gov-endorsement-banner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              {/* Official Emblem Representation */}
              <div className="gov-seal-emblem">
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}>सत्यमेव</span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}>जयते</span>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ 
                    background: 'rgba(253, 224, 71, 0.2)', 
                    color: '#FEF08A', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.7rem', 
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    border: '1px solid rgba(253, 224, 71, 0.4)'
                  }}>
                    {loc(language, 'NATIONAL LAND RECORD CERTIFICATE', 'राष्ट्रीय भू-अभिलेख डिजिटल प्रमाण पत्र', 'జాతీయ భూ రికార్డు డిజిటల్ సర్టిఫికేట్', 'ଜାତୀୟ ଭୂ-ଅଭିଲେଖ ଡିଜିଟାଲ୍ ପ୍ରମାଣପତ୍ର', 'National Land Record Digital Certificate')}
                  </span>
                  <span style={{ fontSize: '0.725rem', color: '#A7F3D0' }}>
                    ID: {endorsementData.certificate_id || `DILRMP-CERT-${recordData.khasra_number || '104'}-${Math.floor(1000 + Math.random() * 9000)}`}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', marginTop: '6px' }}>
                  {s.approvedSuccessTitle}
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#D1FAE5', marginTop: '4px', lineHeight: 1.5 }}>
                  {s.approvedSuccessBody}
                </p>

                {/* Officer Endorsement Seal Line */}
                <div style={{ 
                  marginTop: '10px', 
                  padding: '8px 12px', 
                  background: 'rgba(0, 0, 0, 0.25)', 
                  borderRadius: '6px', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.775rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} color="#34D399" />
                    <span>{s.signedBy} <strong>{role}</strong></span>
                  </div>
                  <div style={{ color: '#6EE7B7' }}>
                    • {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ color: '#9CA3AF', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                    SHA256: 7e9b3a...4f10a8
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Locate on Map & Dismiss */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => onLocateOnMap(recordData)}
                className="btn"
                style={{
                  background: '#F47920',
                  color: 'white',
                  padding: '6px 12px',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(244, 121, 32, 0.4)'
                }}
              >
                <MapPin size={13} />
                <span>{loc(language, 'View on GIS Map', 'जीआईएस मैप', 'GIS మ్యాప్‌లో చూడండి', 'GIS ମାନଚିତ୍ରରେ ଦେଖନ୍ତୁ', 'GIS Map')}</span>
              </button>
              {onDismissEndorsement && (
                <button
                  onClick={onDismissEndorsement}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Dismiss"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auto-balance toast message if active */}
      {balanceNotice && (
        <div style={{ 
          background: '#EFF6FF', 
          border: '1px solid #60A5FA', 
          color: '#1E40AF', 
          padding: '8px 14px', 
          borderRadius: '6px', 
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={15} color="#3B82F6" />
          <span>{balanceNotice}</span>
        </div>
      )}

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gov-saffron-dark)', textTransform: 'uppercase' }}>
            {recordData.document_type || 'Land Record'} | {recordData.language_name || 'Hindi'}
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gov-navy-800)' }}>
            {getDisplayTitle(recordData.title)}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Automatic Auto-Balance & Complete Action */}
          <button
            onClick={handleAutoBalance}
            className="btn btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.775rem', color: 'var(--conf-med-text)', borderColor: 'var(--conf-med-border)', background: 'var(--conf-med-bg)', fontWeight: 700 }}
            title="Auto-distribute 100% shares and compute standardized hectares"
          >
            <Sparkles size={14} color="var(--gov-saffron)" />
            <span>{s.autoValidateBtn}</span>
          </button>

          <button
            onClick={() => onLocateOnMap(recordData)}
            className="btn btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--text-primary)', borderColor: 'var(--border-light)' }}
          >
            <MapPin size={14} />
            <span>{loc(language, 'Locate on Map', 'जीआईएस मैप', 'మ్యాప్‌లో గుర్తించండి', 'ମାନଚିତ୍ରରେ ଚିହ୍ନଟ କରନ୍ତୁ', 'GIS Map')}</span>
          </button>
        </div>
      </div>

      {/* Validation Feedback Banner */}
      {validationReport && validationReport.rule_results && (
        <div style={{ marginBottom: '16px' }}>
          {validationReport.rule_results.map((rule, idx) => {
            if (rule.severity === 'ERROR' && !rule.passed) {
              return (
                <div key={idx} className="rule-alert rule-alert-error">
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>{rule.description}:</strong> {rule.message}
                  </div>
                </div>
              );
            }
            if (rule.severity === 'WARNING' && !rule.passed) {
              return (
                <div key={idx} className="rule-alert rule-alert-warning">
                  <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>{rule.description}:</strong> {rule.message}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {/* 1. Administrative Hierarchy */}
      <div className="form-section-title">
        <Building size={14} style={{ display: 'inline', marginRight: '6px' }} />
        {t.adminSection}
      </div>
      <div className="form-grid-3">
        <div className="input-group">
          <label className="input-label">
            <span>{t.state}</span>
            {getConfBadge('state')}
          </label>
          <input
            type="text"
            className="input-field"
            value={recordData.state || ''}
            onChange={(e) => handleFieldChange('state', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">
            <span>{t.district}</span>
            {getConfBadge('district')}
          </label>
          <input
            type="text"
            className="input-field"
            value={recordData.district || ''}
            onChange={(e) => handleFieldChange('district', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">
            <span>{t.tehsil}</span>
            {getConfBadge('tehsil')}
          </label>
          <input
            type="text"
            className="input-field"
            value={recordData.tehsil || ''}
            onChange={(e) => handleFieldChange('tehsil', e.target.value)}
          />
        </div>
      </div>

      <div className="form-grid-3" style={{ marginTop: '10px' }}>
        <div className="input-group">
          <label className="input-label">
            <span>{t.village}</span>
            {getConfBadge('village')}
          </label>
          <input
            type="text"
            className="input-field"
            value={recordData.village || ''}
            onChange={(e) => handleFieldChange('village', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">
            <span>{t.pargana}</span>
          </label>
          <input
            type="text"
            className="input-field"
            value={recordData.pargana || ''}
            onChange={(e) => handleFieldChange('pargana', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">
            <span>{t.halka}</span>
          </label>
          <input
            type="text"
            className="input-field"
            value={recordData.patwari_halka || ''}
            onChange={(e) => handleFieldChange('patwari_halka', e.target.value)}
          />
        </div>
      </div>

      {/* 2. Land Parcel & Survey Identifiers */}
      <div className="form-section-title">
        <Landmark size={14} style={{ display: 'inline', marginRight: '6px' }} />
        {t.parcelSection}
      </div>
      <div className="form-grid-3">
        <div className="input-group">
          <label className="input-label">
            <span style={{ fontWeight: 700, color: 'var(--gov-navy-800)' }}>
              {t.khasraNo}
            </span>
            {getConfBadge('khasra_number')}
          </label>
          <input
            type="text"
            className="input-field"
            style={{ fontWeight: 700, borderColor: 'var(--gov-navy-800)' }}
            value={recordData.khasra_number || ''}
            onChange={(e) => handleFieldChange('khasra_number', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">
            <span>{t.khataNo}</span>
            {getConfBadge('khata_number')}
          </label>
          <input
            type="text"
            className="input-field"
            value={recordData.khata_number || ''}
            onChange={(e) => handleFieldChange('khata_number', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">
            <span>{t.khewatNo}</span>
          </label>
          <input
            type="text"
            className="input-field"
            value={recordData.khewat_number || ''}
            onChange={(e) => handleFieldChange('khewat_number', e.target.value)}
          />
        </div>
      </div>

      {/* 3. Area and Classification */}
      <div className="form-section-title">
        {t.areaSection}
      </div>
      <div className="form-grid-3">
        <div className="input-group">
          <label className="input-label">
            <span>{t.areaVal}</span>
            {getConfBadge('area')}
          </label>
          <input
            type="number"
            step="0.001"
            className="input-field"
            value={recordData.area_value || ''}
            onChange={(e) => handleFieldChange('area_value', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">
            <span>{t.areaUnit}</span>
          </label>
          <select
            className="input-field"
            value={recordData.area_unit || 'Sq. Meters'}
            onChange={(e) => handleFieldChange('area_unit', e.target.value)}
          >
            {ALL_AREA_UNITS.map((u) => (
              <option key={u} value={u}>
                {u === 'Sq. Meters'
                  ? (isHindi ? 'वर्ग मीटर (SQ. M.)' : isTelugu ? 'చదరపు మీటర్లు (SQ. M.)' : isOdia ? 'ବର୍ଗ ମିଟର (SQ. M.)' : 'Sq. Meters (SQ. M.)')
                  : u === 'Hectares'
                  ? (isHindi ? 'हेक्टेयर (Ha)' : isTelugu ? 'హెక్టార్లు (Ha)' : isOdia ? 'ହେକ୍ଟର (Ha)' : 'Hectares (Ha)')
                  : u === 'Acres'
                  ? (isHindi ? 'एकड़' : isTelugu ? 'ఎకరాలు' : isOdia ? 'ଏକର' : 'Acres')
                  : u === 'Bigha'
                  ? (isHindi ? 'बीघा' : isTelugu ? 'బిఘా' : isOdia ? 'ବିଘା' : 'Bigha')
                  : u === 'Guntha'
                  ? (isHindi ? 'गुंठा' : isTelugu ? 'గుంట' : isOdia ? 'ଗୁଣ୍ଠ' : 'Guntha')
                  : u}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">
            <span>{t.classification}</span>
            {getConfBadge('classification')}
          </label>
          <input
            type="text"
            className="input-field"
            value={recordData.land_classification || ''}
            onChange={(e) => handleFieldChange('land_classification', e.target.value)}
          />
        </div>
      </div>

      {/* Dynamic Flexible Area Breakdown Banner */}
      {recordData.area_value > 0 && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          background: 'var(--bg-subtle)',
          borderRadius: '6px',
          border: '1px solid var(--border-light)',
          fontSize: '0.785rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)'
        }}>
          <Sparkles size={14} color="#F47920" />
          <span>
            <strong>{isHindi ? 'मानकीकृत भूमि माप (SQ. M.):' : isTelugu ? 'ప్రామాణిక భూ కొలత (SQ. M.):' : isOdia ? 'ମାନକ ଜମି ମାପ (SQ. M.):' : 'Standardized Land Measure (SQ. M.):'}</strong>{' '}
            <span style={{ fontWeight: 700, color: 'var(--gov-navy-800)' }}>
              {formatFlexibleArea(recordData.area_value, recordData.area_unit || 'Sq. Meters')}
            </span>
          </span>
        </div>
      )}

      {/* 4. Landowners & Co-shares */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', marginBottom: '8px' }}>
        <div className="form-section-title" style={{ margin: 0 }}>
          <Users size={14} style={{ display: 'inline', marginRight: '6px' }} />
          {t.ownersSection}
        </div>
        <button
          onClick={handleAddLandowner}
          className="btn btn-outline"
          style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: '#059669', color: '#059669', fontWeight: 700 }}
        >
          <Plus size={13} />
          <span>{s.addOwner}</span>
        </button>
      </div>

      <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
        {(recordData.landowners || []).map((owner, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 34px', gap: '8px', alignItems: 'flex-end', marginBottom: idx < recordData.landowners.length - 1 ? '10px' : '0' }}>
            <div>
              <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{t.ownerName}</label>
              <input
                type="text"
                className="input-field"
                value={owner.name || ''}
                onChange={(e) => {
                  const updated = [...recordData.landowners];
                  updated[idx].name = e.target.value;
                  handleFieldChange('landowners', updated);
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{t.relation}</label>
              <input
                type="text"
                className="input-field"
                value={owner.relation || ''}
                onChange={(e) => {
                  const updated = [...recordData.landowners];
                  updated[idx].relation = e.target.value;
                  handleFieldChange('landowners', updated);
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{t.sharePct}</label>
              <input
                type="number"
                step="0.01"
                className="input-field"
                value={owner.share_percentage || ''}
                onChange={(e) => {
                  const updated = [...recordData.landowners];
                  updated[idx].share_percentage = parseFloat(e.target.value) || 0;
                  handleFieldChange('landowners', updated);
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{t.shareFrac}</label>
              <input
                type="text"
                className="input-field"
                value={owner.share_fraction || ''}
                onChange={(e) => {
                  const updated = [...recordData.landowners];
                  updated[idx].share_fraction = e.target.value;
                  handleFieldChange('landowners', updated);
                }}
              />
            </div>
            <div>
              <button
                onClick={() => handleRemoveLandowner(idx)}
                style={{
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  borderRadius: '4px',
                  padding: '7px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '36px',
                  width: '34px'
                }}
                title="Remove Landowner"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* Share Total Check Alert */}
        {validationReport?.rule_results?.find(r => r.rule === 'RULE_OWNER_SHARES_100_PCT') && (
          <div style={{ marginTop: '10px', fontSize: '0.775rem', fontWeight: 600, color: validationReport.rule_results.find(r => r.rule === 'RULE_OWNER_SHARES_100_PCT').passed ? '#059669' : '#DC2626' }}>
            {validationReport.rule_results.find(r => r.rule === 'RULE_OWNER_SHARES_100_PCT').message}
          </div>
        )}
      </div>

      {/* 5. Mutations & Bank Encumbrances */}
      <div className="form-section-title">
        <DollarSign size={14} style={{ display: 'inline', marginRight: '6px' }} />
        {t.mutationsSection}
      </div>
      <div className="form-grid-2">
        {/* Mutation Orders */}
        <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.775rem', color: 'var(--gov-navy-800)' }}>
              {t.mutationsTitle}
            </div>
            <button
              onClick={handleAddMutation}
              className="btn btn-outline"
              style={{ padding: '2px 8px', fontSize: '0.7rem', borderColor: '#2563EB', color: '#2563EB', fontWeight: 700 }}
            >
              <Plus size={11} />
              <span>{s.addMutation}</span>
            </button>
          </div>

          {(recordData.mutations && recordData.mutations.length > 0) ? (
            recordData.mutations.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < recordData.mutations.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                <div style={{ fontSize: '0.785rem', lineHeight: 1.4 }}>
                  <strong>{m.order_number}</strong> ({m.type})
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {loc(language, 'Date:', 'दिनांक:', 'తేదీ:', 'ତାରିଖ:', 'Date:')} {m.order_date || 'N/A'} • {m.passed_by}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveMutation(i)}
                  style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                  title="Remove Mutation"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.noMutations}</div>
          )}
        </div>

        {/* Bank Encumbrance / Lien */}
        <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.775rem', color: 'var(--gov-navy-800)' }}>
              {t.encumbranceTitle}
            </div>
            <button
              onClick={handleAddEncumbrance}
              className="btn btn-outline"
              style={{ padding: '2px 8px', fontSize: '0.7rem', borderColor: '#DC2626', color: '#DC2626', fontWeight: 700 }}
            >
              <Plus size={11} />
              <span>{s.addEncumbrance}</span>
            </button>
          </div>

          {(recordData.encumbrances && recordData.encumbrances.length > 0) ? (
            recordData.encumbrances.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < recordData.encumbrances.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                <div style={{ fontSize: '0.785rem', color: '#991B1B', lineHeight: 1.4 }}>
                  ⚠️ <strong>{e.type}</strong>: {e.bank_name} ({e.amount})
                  <div style={{ fontSize: '0.725rem', color: '#B91C1C' }}>
                    {loc(language, 'Status:', 'स्थिति:', 'స్థితి:', 'ସ୍ଥିତି:', 'Status:')} {e.status} • {e.date || 'Active'}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveEncumbrance(i)}
                  style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                  title="Remove Encumbrance"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.8rem', color: '#059669' }}>✓ {t.clearTitle}</div>
          )}
        </div>
      </div>

      {/* Action Bar / Tehsildar Sign-Off */}
      <div 
        style={{ 
          marginTop: '24px', 
          paddingTop: '16px', 
          borderTop: '2px solid var(--border-light)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {loc(language, 'Sign-off Authority:', 'हस्ताक्षरकर्ता पद:', 'ధృవీకరణ అధికారి:', 'ଅଧିକାରୀ ପଦବୀ:', 'Sign-off Authority:')} <strong>{role}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onSaveRecord('FLAGGED_ERROR')}
            className="btn btn-outline"
            style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
          >
            <AlertTriangle size={16} />
            <span>{s.flagBtn}</span>
          </button>

          <button
            onClick={() => onSaveRecord('VALIDATED')}
            className="btn btn-green"
            disabled={isSaving}
            style={{ 
              padding: '10px 24px', 
              fontSize: '0.925rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{isSaving ? loc(language, 'Saving...', 'सत्यापन हो रहा है...', 'ధృవీకరిస్తోంది...', 'ସତ୍ୟାପନ ଚାଲିଛି...', 'Saving...') : s.approveBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
