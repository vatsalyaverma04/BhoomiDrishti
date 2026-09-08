import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, X, Server, Layers, Globe, Save } from 'lucide-react';
import { loc } from '../utils/translations';
import { getApiUrl, getActiveApiUrl, setCustomApiUrl } from '../config';

export default function SupabaseModal({ isOpen, onClose, language = 'en' }) {
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  const [backendUrlInput, setBackendUrlInput] = useState(getActiveApiUrl());
  const [urlSaved, setUrlSaved] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/database/status'));
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (err) {
      console.warn('DB status error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setSyncMessage(null);
    }
  }, [isOpen]);

  const handleManualSync = async () => {
    try {
      setLoading(true);
      setSyncMessage(null);
      const res = await fetch(getApiUrl('/api/database/sync'), { method: 'POST' });
      const data = await res.json();
      setDbStatus(data);
      if (data.supabase_connected) {
        setSyncMessage({
          type: 'success',
          text: loc(
            language,
            '✓ All land records successfully synchronized with Supabase PostgreSQL cloud.',
            '✓ सुपाबेस क्लाउड डेटाबेस के साथ सभी अभिलेख सफलतापूर्वक समन्वयित (Synced) हैं।',
            '✓ సుపాబేస్ క్లౌడ్ డేటాబేస్‌తో అన్ని భూమి రికార్డులు విజయవంతంగా సమకాలీకరించబడ్డాయి.',
            '✓ ସୁପାବେସ୍ କ୍ଲାଉଡ୍ ଡାଟାବେସ୍ ସହିତ ସମସ୍ତ ଅଭିଲେଖ ସଫଳତାର ସହ ସମନ୍ୱିତ ହୋଇଛି।'
          )
        });
      } else {
        setSyncMessage({
          type: 'info',
          text: loc(
            language,
            'ℹ️ Operating on Local Sovereign Ledger (Offline Resilience Mode)',
            'ℹ️ स्थानीय संप्रभु लेजर सक्रिय है (ऑफलाइन मोड)',
            'ℹ️ స్థానిక సార్వభౌమ లెడ్జర్ క్రియాశీలకంగా ఉంది (ఆఫ్‌లైన్ మోడ్)',
            'ℹ️ ସ୍ଥାନୀୟ ସାର୍ବଭୌମ ଲେଜର ସକ୍ରିୟ ଅଛି (ଅଫଲାଇନ୍ ମୋଡ୍)'
          )
        });
      }
    } catch (err) {
      setSyncMessage({
        type: 'error',
        text: loc(language, 'Sync error: ', 'समन्वय त्रुटि: ', 'సమకాలీకరణ లోపం: ', 'ସମନ୍ୱୟ ତ୍ରୁଟି: ') + err.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(4, 18, 33, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #071D33 0%, #0B3B60 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(244, 121, 32, 0.25)',
              border: '1px solid #F47920',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FDBA74'
            }}>
              <Database size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                {loc(
                  language,
                  'Supabase Cloud Connection',
                  'सुपाबेस डेटाबेस कनेक्शन स्थिति',
                  'సుపాబేస్ క్లౌడ్ కనెక్షన్ స్థితి',
                  'ସୁପାବେସ୍ କ୍ଲାଉଡ୍ ସଂଯୋଗ ସ୍ଥିତି'
                )}
              </h3>
              <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>
                PostgreSQL • DILRMP National Cloud Architecture
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Active Status Badge Box */}
          <div style={{
            background: dbStatus?.supabase_connected ? 'var(--conf-high-bg)' : 'var(--bg-subtle)',
            border: `1px solid ${dbStatus?.supabase_connected ? 'var(--conf-high-border)' : 'var(--border-light)'}`,
            borderRadius: '8px',
            padding: '16px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={24} color="var(--conf-high-text)" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {dbStatus ? dbStatus.provider : 'Checking...'}
                  </span>
                  {dbStatus?.supabase_connected && (
                    <span style={{
                      fontSize: '0.675rem',
                      background: 'var(--gov-green)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontWeight: 800
                    }}>
                      ONLINE & READY
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                  {dbStatus?.supabase_connected
                    ? (loc(language, 'Cloud Endpoint: ', 'क्लाउड एंडपॉइंट: ', 'క్లౌడ్ ఎండ్‌పాయింట్: ', 'କ୍ଲାଉଡ୍ ଏଣ୍ଡପଏଣ୍ଟ: ') + dbStatus.supabase_url_masked)
                    : loc(language, 'Operating on sovereign local store', 'स्थानीय लेजर सक्रिय है', 'స్థానిక స్టోరేజ్‌లో పనిచేస్తోంది', 'ସ୍ଥାନୀୟ ଲେଜର ସକ୍ରିୟ ଅଛି')}
                </div>
              </div>
            </div>

            <button
              onClick={handleManualSync}
              disabled={loading}
              className="btn btn-primary"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                whiteSpace: 'nowrap'
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>{loc(language, 'Check Sync', 'सिंक जांचें', 'సింక్ తనిఖీ చేయండి', 'ସିଙ୍କ୍ ଯାଞ୍ଚ କରନ୍ତୁ')}</span>
            </button>
          </div>

          {/* Sync Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div style={{
              background: 'var(--bg-subtle)',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Server size={13} />
                <span>{loc(language, 'Total Synced Records', 'कुल समन्वयित अभिलेख', 'మొత్తం సమకాలీకరించిన రికార్డులు', 'ମୋଟ ସମନ୍ୱିତ ଅଭିଲେଖ')}</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gov-navy-800)', marginTop: '4px' }}>
                {dbStatus ? `${dbStatus.total_records} Records` : '--'}
              </div>
            </div>

            <div style={{
              background: 'var(--bg-subtle)',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={13} />
                <span>{loc(language, 'Active Cloud Tables', 'सक्रिय क्लाउड टेबल्स', 'క్రియాశీల క్లౌడ్ పట్టికలు', 'ସକ୍ରିୟ କ୍ଲାଉଡ୍ ଟେବୁଲ୍')}</span>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gov-navy-800)', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-light)', paddingBottom: '2px' }}>
                  <span>land_records:</span>
                  <span style={{ color: 'var(--gov-green)', fontWeight: 800 }}>{dbStatus?.table_counts?.land_records ?? dbStatus?.total_records ?? 5} rows</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-light)', paddingBottom: '2px' }}>
                  <span>record_landowners:</span>
                  <span style={{ color: 'var(--gov-green)', fontWeight: 800 }}>{dbStatus?.table_counts?.record_landowners ?? 5} rows</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>audit_events:</span>
                  <span style={{ color: 'var(--gov-green)', fontWeight: 800 }}>{dbStatus?.table_counts?.audit_events ?? 61} events</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cloud API Endpoint Config (Render / Custom) */}
          <div style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={15} style={{ color: 'var(--gov-navy-800)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {loc(language, 'Backend API Endpoint (Render / Local)', 'बैकएंड एपीआई एंडपॉइंट (रेंडर / लोकल)', 'బ్యాకెండ్ API ఎండ్‌పాయింట్', 'ବ୍ୟାକଏଣ୍ଡ API ଏଣ୍ଡପଏଣ୍ଟ')}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {dbStatus?.status === 'connected' ? '● Connected' : '○ Active'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={backendUrlInput}
                onChange={(e) => {
                  setBackendUrlInput(e.target.value);
                  setUrlSaved(false);
                }}
                placeholder="e.g. https://bhoomidrishti-backend.onrender.com or http://127.0.0.1:8000"
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.775rem',
                  fontFamily: 'monospace'
                }}
              />
              <button
                onClick={() => {
                  setCustomApiUrl(backendUrlInput);
                  setUrlSaved(true);
                  fetchStatus();
                  setTimeout(() => setUrlSaved(false), 3000);
                }}
                className="btn btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Save size={13} />
                <span>{urlSaved ? '✓ Saved' : 'Save'}</span>
              </button>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.675rem', color: 'var(--text-muted)' }}>
              {loc(
                language,
                'When deployed on Vercel, paste your Render backend service URL here or configure VITE_API_URL in Vercel.',
                'वर्सेल (Vercel) पर डिप्लॉय करने पर अपना रेंडर बैकएंड URL यहाँ दर्ज करें।',
                'Vercel లో డిప్లాయ్ చేసినప్పుడు మీ Render బ్యాకెండ్ URL ఇక్కడ నమోదు చేయండి.',
                'Vercel ରେ ଡିପ୍ଲୟ କରିବା ସମୟରେ Render URL ଏଠାରେ ପ୍ରବେଶ କରନ୍ତୁ।'
              )}
            </p>
          </div>

          {/* Sync Feedback Alert */}
          {syncMessage && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '0.825rem',
              fontWeight: 700,
              background: syncMessage.type === 'success' ? 'var(--conf-high-bg)' : 'var(--conf-low-bg)',
              color: syncMessage.type === 'success' ? 'var(--conf-high-text)' : 'var(--conf-low-text)',
              border: `1px solid ${syncMessage.type === 'success' ? 'var(--conf-high-border)' : 'var(--conf-low-border)'}`
            }}>
              {syncMessage.text}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          background: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            {loc(language, 'Last Synced:', 'अंतिम समन्वय:', 'చివరి సమకాలీకరణ:', 'ଶେଷ ସମନ୍ୱୟ:')} {dbStatus?.last_sync_time || 'Just now'}
          </div>
          <button
            onClick={onClose}
            className="btn btn-outline"
            style={{ padding: '6px 16px', fontSize: '0.8rem', fontWeight: 700 }}
          >
            {loc(language, 'Close', 'बंद करें', 'మూసివేయండి', 'ବନ୍ଦ କରନ୍ତୁ')}
          </button>
        </div>
      </div>
    </div>
  );
}
