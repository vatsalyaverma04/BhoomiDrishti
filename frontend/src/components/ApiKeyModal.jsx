import React, { useState } from 'react';
import { Key, ExternalLink, CheckCircle2, ShieldAlert, Sparkles, X, Copy, Check } from 'lucide-react';
import { loc } from '../utils/translations';

export default function ApiKeyModal({ isOpen, onClose, currentKey, onSaveKey, language = 'en' }) {
  const [apiKeyInput, setApiKeyInput] = useState(currentKey || '');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(apiKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText(`GEMINI_API_KEY=${apiKeyInput || 'your_key_here'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        style={{
          background: 'white',
          maxWidth: '740px',
          width: '100%',
          borderRadius: 'var(--radius-md)',
          border: '2px solid var(--gov-navy-800)',
          padding: '28px',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#FFF4EC', padding: '8px', borderRadius: '8px', border: '1px solid #FDBA74' }}>
              <Key size={22} color="#F47920" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gov-navy-800)' }}>
                {loc(
                  language,
                  'Free API Keys Configuration & Setup Guide',
                  'मुफ़्त API कुंजी सेटअप एवं विन्यास मार्गदर्शिका',
                  'ఉచిత API కీ సెటప్ మరియు కాన్ఫిగరేషన్ మార్గదర్శకం',
                  'ମାଗଣା API କି ସେଟଅପ୍ ଏବଂ ବିନ୍ୟାସ ମାର୍ଗଦର୍ଶିକା',
                  'Free API Keys Configuration Guide'
                )}
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {loc(
                  language,
                  '100% Free Tier Services - No Credit Card Required',
                  '100% मुफ़्त टियर - स्मार्ट इंडिया हैकाथॉन (SIH) प्रोटोटाइप',
                  '100% ఉచిత సర్వీసులు - క్రెడిట్ కార్డ్ అవసరం లేదు',
                  '୧୦୦% ମାଗଣା ସେବା - କ୍ରେଡିଟ୍ କାର୍ଡ ଆବଶ୍ୟକ ନାହିଁ',
                  '100% Free Tier Services'
                )}
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={20} />
          </button>
        </div>

        {/* API 1: Google Gemini API (Free) */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '18px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#0B3B60" />
              <strong style={{ fontSize: '0.95rem', color: 'var(--gov-navy-800)' }}>
                {loc(
                  language,
                  '1. Google Gemini Multimodal Vision API (100% Free)',
                  '1. Google Gemini मल्टीमॉडल विजन API (100% मुफ़्त)',
                  '1. గూగుల్ జెమిని మల్టీమోడల్ విజన్ API (100% ఉచితం)',
                  '୧. ଗୁଗଲ୍ ଜେମିନି ମଲ୍ଟିମୋଡାଲ୍ ଭିଜନ୍ API (୧୦୦% ମାଗଣା)',
                  '1. Google Gemini Multimodal Vision API'
                )}
              </strong>
            </div>
            <span style={{ fontSize: '0.75rem', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
              15 RPM / 1,500 RPD Free
            </span>
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
            {loc(
              language,
              'Used for multilingual handwriting OCR, table parsing, and structured extraction of legacy Indian land records.',
              'यह एपीआई पीले/धुंधले पुराने पन्नों तथा हिंदी, मराठी, तेलुगु, तमिल आदि भारतीय भाषाओं के हस्तलिखित भू-अभिलेखों के उच्च-सटीक ओसीआर एवं संरचित एक्सट्रैक्शन हेतु प्रयुक्त होती है।',
              'ప్రాచీన పసుపు/మసక పత్రాలు మరియు తెలుగు, హిందీ, ఒడియా మొదలైన భారతీయ భాషల చేతిరాత భూ రికార్డుల ఖచ్చితమైన OCR మరియు సంగ్రహణ కోసం ఉపయోగించబడుతుంది.',
              'ପୁରୁଣା ହଳଦିଆ/ଅସ୍ପଷ୍ଟ ପୃଷ୍ଠା ଏବଂ ଓଡ଼ିଆ, ହିନ୍ଦୀ, ତେଲୁଗୁ ଇତ୍ୟାଦି ଭାରତୀୟ ଭାଷାର ହସ୍ତଲିଖିତ ଭୂ-ଅଭିଲେଖର ସଠିକ୍ OCR ଓ ତଥ୍ୟ ଉଦ୍ଧାର ପାଇଁ ବ୍ୟବହୃତ ହୁଏ।',
              'Used for multilingual handwriting OCR, table parsing, and structured extraction of legacy Indian land records.'
            )}
          </p>

          {/* Step-by-Step Instructions */}
          <div style={{ background: 'white', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '12px 16px', fontSize: '0.8rem', lineHeight: 1.7, marginBottom: '14px' }}>
            <div style={{ fontWeight: 700, color: 'var(--gov-navy-800)', marginBottom: '4px' }}>
              {loc(
                language,
                'How to get your free key in 30 seconds:',
                'कुंजी कैसे प्राप्त करें (30 सेकंड में):',
                '30 సెకన్లలో మీ ఉచిత కీని ఎలా పొందాలి:',
                '୩୦ ସେକେଣ୍ଡରେ ଆପଣଙ୍କ ମାଗଣା କି କିପରି ପାଇବେ:',
                'How to get your free key in 30 seconds:'
              )}
            </div>
            <div>
              {loc(language, '1. Go to Google AI Studio:', '1. Google AI Studio पर जाएं:', '1. Google AI Studio కి వెళ్లండి:', '୧. Google AI Studio କୁ ଯାଆନ୍ତୁ:', '1. Go to Google AI Studio:')}{' '}
              <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: '#0369A1', fontWeight: 600 }}>
                https://aistudio.google.com/ <ExternalLink size={12} style={{ display: 'inline' }} />
              </a>
            </div>
            <div>
              {loc(
                language,
                '2. Sign in with any regular Google account.',
                '2. किसी भी नियमित Google खाते से साइन इन करें।',
                '2. ఏదైనా సాధారణ Google ఖాతాతో సైన్ ఇన్ చేయండి.',
                '୨. ଯେକୌଣସି ନିୟମିତ Google ଆକାଉଣ୍ଟ୍ ସହିତ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ।',
                '2. Sign in with any regular Google account.'
              )}
            </div>
            <div>
              {loc(
                language,
                '3. Click the blue "Get API key" button, then click "Create API key in new project".',
                '3. नीले "Get API key" बटन पर क्लिक करें, फिर "Create API key in new project" चुनें।',
                '3. నీలిరంగు "Get API key" బటన్ క్లిక్ చేసి, "Create API key in new project" ఎంచుకోండి.',
                '୩. ନୀଳ "Get API key" ବଟନ୍ କ୍ଲିକ୍ କରନ୍ତୁ, ତା\'ପରେ "Create API key in new project" ବାଛନ୍ତୁ।',
                '3. Click "Get API key", then "Create API key in new project".'
              )}
            </div>
            <div>
              {loc(
                language,
                '4. Copy the API key string (starts with AIza...).',
                '4. API कुंजी स्ट्रिंग कॉपी करें (AIza... से शुरू होती है)।',
                '4. API కీ స్ట్రింగ్‌ను కాపీ చేయండి (AIza... తో ప్రారంభమవుతుంది).',
                '୪. API କି ଷ୍ଟ୍ରିଙ୍ଗ୍ କପି କରନ୍ତୁ (AIza... ରୁ ଆରମ୍ଭ ହୁଏ)।',
                '4. Copy the API key string (starts with AIza...).'
              )}
            </div>
          </div>

          {/* Key Input Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--gov-navy-800)' }}>
              {loc(
                language,
                'Paste your Gemini API Key here:',
                'अपनी जेमिनी एपीआई कुंजी यहाँ दर्ज करें:',
                'మీ జెమిని API కీని ఇక్కడ పేస్ట్ చేయండి:',
                'ଆପଣଙ୍କ ଜେମିନି API କି ଏଠାରେ ପେଷ୍ଟ କରନ୍ତୁ:',
                'Paste your Gemini API Key here:'
              )}
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace'
                }}
              />
              <button
                onClick={handleSave}
                className="btn btn-saffron"
                style={{ padding: '8px 18px' }}
              >
                {savedSuccess ? <Check size={16} /> : <Key size={16} />}
                <span>
                  {savedSuccess
                    ? loc(language, 'Saved!', 'सहेजा गया!', 'సేవ్ చేయబడింది!', 'ସାଇତା ଗଲା!', 'Saved!')
                    : loc(language, 'Save Key', 'कुंजी सहेजें', 'కీని సేవ్ చేయండి', 'କି ସାଇତନ୍ତୁ', 'Save Key')}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Alternate Configuration in backend/.env */}
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '14px', marginBottom: '16px', fontSize: '0.8rem' }}>
          <div style={{ fontWeight: 700, color: '#92400E', marginBottom: '4px' }}>
            {loc(
              language,
              'Alternative: Add to backend/.env file',
              'वैकल्पिक विधि (बैकएंड .env फ़ाइल में दर्ज करें):',
              'ప్రత్యామ్నాయం: backend/.env ఫైల్‌లో చేర్చండి',
              'ବିକଳ୍ପ: backend/.env ଫାଇଲ୍‌ରେ ଯୋଡନ୍ତୁ',
              'Alternative: backend/.env file'
            )}
          </div>
          <div style={{ color: '#78350F', marginBottom: '8px' }}>
            {loc(
              language,
              'You can also create/edit the `backend/.env` file directly:',
              'आप प्रोजेक्ट के `backend/.env` फ़ाइल में भी यह लाइन जोड़ सकते हैं:',
              'మీరు ప్రాజెక్ట్‌లోని `backend/.env` ఫైల్‌లో కూడా ఈ లైన్‌ను జోడించవచ్చు:',
              'ଆପଣ ପ୍ରୋଜେକ୍ଟର `backend/.env` ଫାଇଲ୍‌ରେ ମଧ୍ୟ ଏହି ଧାଡି ଯୋଡିପାରିବେ:',
              'You can also create/edit the `backend/.env` file directly:'
            )}
          </div>
          <div style={{ background: '#1E293B', color: '#38BDF8', padding: '8px 12px', borderRadius: '4px', fontFamily: 'monospace', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>GEMINI_API_KEY={apiKeyInput || 'AIzaSyYourKeyHere'}</span>
            <button onClick={copyEnvSnippet} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Other APIs: OpenStreetMap & Bhuvan */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem' }}>
          <div style={{ padding: '12px', background: '#F1F5F9', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontWeight: 700, color: 'var(--gov-navy-800)', marginBottom: '4px' }}>
              2. OpenStreetMap & Nominatim
            </div>
            <div style={{ color: '#059669', fontWeight: 600 }}>
              {loc(
                language,
                '✓ 100% Free - No Key Required',
                '✓ 100% मुफ़्त - कुंजी की आवश्यकता नहीं',
                '✓ 100% ఉచితం - కీ అవసరం లేదు',
                '✓ ୧୦୦% ମାଗଣା - କୌଣସି କି ଆବଶ୍ୟକ ନାହିଁ',
                '✓ 100% Free - No Key Required'
              )}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.725rem', marginTop: '2px' }}>
              {loc(
                language,
                'Preconfigured out of the box for village geocoding and base maps.',
                'ग्राम भू-कोडिंग एवं आधार मानचित्र हेतु पूर्व-विन्यस्त।',
                'గ్రామ జియోకోడింగ్ మరియు బేస్ మ్యాప్‌ల కోసం ముందస్తుగా కాన్ఫిగర్ చేయబడింది.',
                'ଗ୍ରାମ ଜିଓକୋଡିଂ ଏବଂ ମୂଳ ମାନଚିତ୍ର ପାଇଁ ପୂର୍ବ-ବିନ୍ୟାସିତ।',
                'Preconfigured out of the box for village geocoding and base maps.'
              )}
            </div>
          </div>

          <div style={{ padding: '12px', background: '#F1F5F9', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontWeight: 700, color: 'var(--gov-navy-800)', marginBottom: '4px' }}>
              3. Esri Satellite & Bhuvan ISRO
            </div>
            <div style={{ color: '#059669', fontWeight: 600 }}>
              {loc(
                language,
                '✓ 100% Free - No Key Required',
                '✓ 100% मुफ़्त - कुंजी की आवश्यकता नहीं',
                '✓ 100% ఉచితం - కీ అవసరం లేదు',
                '✓ ୧୦୦% ମାଗଣା - କୌଣସି କି ଆବଶ୍ୟକ ନାହିଁ',
                '✓ 100% Free - No Key Required'
              )}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.725rem', marginTop: '2px' }}>
              {loc(
                language,
                'Public high-resolution satellite imagery tiles for real parcel overlays.',
                'वास्तविक भूखंड सीमांकन हेतु उच्च-रिज़ॉल्यूशन उपग्रह इमेजरी टाइल्स।',
                'రియల్ పార్సెల్ సరిహద్దుల కోసం హై-రెజల్యూషన్ ఉపగ్రహ చిత్రాలు.',
                'ପ୍ରକୃତ ପ୍ଲଟ୍ ସୀମାଙ୍କନ ପାଇଁ ଉଚ୍ଚ-ବିଭେଦନ ଉପଗ୍ରହ ଚିତ୍ରାବଳୀ।',
                'Public high-resolution satellite imagery tiles for real parcel overlays.'
              )}
            </div>
          </div>
        </div>

        {/* Offline Fallback Notice */}
        <div style={{ marginTop: '16px', padding: '10px 14px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '6px', fontSize: '0.775rem', color: '#065F46' }}>
          💡 <strong>{loc(language, 'Built-in Demo Fallback:', 'ऑफ़लाइन प्रोटोटाइप मोड:', 'అంతర్నిర్మిత డెమో ఫాల్‌బ్యాక్:', 'ଅନ୍ତର୍ନିହିତ ଡେମୋ ମୋଡ୍:', 'Built-in Demo Fallback:')}</strong>{' '}
          {loc(
            language,
            'Even without an API key, the prototype functions 100% seamlessly using the built-in heuristic engine and realistic sample records!',
            'यदि आपके पास अभी एपीआई कुंजी नहीं है, तो भी ऐप पूर्णतः काम करता है! इसमें मध्य प्रदेश, महाराष्ट्र, उत्तर प्रदेश और बिहार के ऐतिहासिक भू-अभिलेख पहले से अंतर्निहित हैं।',
            'API కీ లేకపోయినా, అంతర్నిర్మిత హ్యూరిస్టిక్ ఇంజిన్ మరియు వాస్తవిక నమూనా రికార్డులతో ప్రోటోటైప్ 100% సజావుగా పనిచేస్తుంది!',
            'API କି ନଥିଲେ ମଧ୍ୟ, ଅନ୍ତର୍ନିହିତ ଇଞ୍ଜିନ୍ ଏବଂ ନମୁନା ଅଭିଲେଖ ସହିତ ପ୍ରୋଟୋଟାଇପ୍ ୧୦୦% ସୁରୁଖୁରୁରେ କାମ କରେ!',
            'Even without an API key, the prototype functions 100% seamlessly using built-in heuristic engine and realistic sample records!'
          )}
        </div>

        {/* Modal Close Button */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '8px 20px' }}>
            {loc(language, 'Close', 'बंद करें', 'మూసివేయండి', 'ବନ୍ଦ କରନ୍ତୁ', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
}
