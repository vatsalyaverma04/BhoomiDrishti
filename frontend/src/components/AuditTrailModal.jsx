import React, { useEffect, useState } from 'react';
import { ShieldCheck, Clock, User, X, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { loc } from '../utils/translations';
import { getApiUrl } from '../config';

export default function AuditTrailModal({ isOpen, onClose, recordId, language = 'en' }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchAuditLog();
    }
  }, [isOpen, recordId]);

  const fetchAuditLog = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/audit-trail'));
      const data = await res.json();
      let list = data.events || [];
      if (recordId) {
        list = list.filter(e => !e.record_id || e.record_id === recordId || e.record_id.includes(recordId));
      }
      setEvents(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm(loc(language, 'Delete this audit event from database?', 'क्या आप वाकई इस इवेंट को डेटाबेस से हटाना चाहते हैं?', 'డేటాబేస్ నుండి ఈ ఆడిట్ ఈవెంట్‌ను తొలగించాలనుకుంటున్నారా?', 'ଡାଟାବେସରୁ ଏହି ଅଡିଟ୍ ଇଭେଣ୍ଟକୁ ବିଲୋପ କରିବାକୁ ଚାହାଁନ୍ତି କି?'))) return;
    try {
      await fetch(getApiUrl(`/api/audit-trail/${encodeURIComponent(eventId)}`), { method: 'DELETE' });
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'var(--bg-card)',
          maxWidth: '780px',
          width: '100%',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="var(--gov-saffron)" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {loc(
                  language,
                  'Immutable Audit Trail & Compliance Log',
                  'अपरिवर्तनीय ऑडिट ट्रेल',
                  'మార్చలేని ఆడిట్ ట్రయల్ & చట్టబద్ధ లాగ్',
                  'ଅପରିବର୍ତ୍ତନୀୟ ଅଡିଟ୍ ଟ୍ରେଲ୍ ଓ ଅନୁପାଳନ ଲଗ୍'
                )}
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {recordId 
                  ? (loc(language, 'Target Record: ', 'अभिलेख संख्या: ', 'లక్ష్య రికార్డు: ', 'ଲକ୍ଷ୍ୟ ଅଭିଲେଖ: ') + recordId)
                  : loc(language, 'Complete System Audit Stream', 'समस्त सिस्टम ऑडिट इवेंट्स', 'మొత్తం సిస్టమ్ ఆడిట్ స్ట్రీమ్', 'ସମସ୍ତ ସିଷ୍ଟମ୍ ଅଡିଟ୍ ଷ୍ଟ୍ରିମ୍')}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Event Timeline List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px' }}>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              {loc(
                language,
                'No audit trail records found',
                'कोई ऑडिट लॉग प्रविष्टि उपलब्ध नहीं है',
                'ఎలాంటి ఆడిట్ లాగ్ రికార్డులు కనుగొనబడలేదు',
                'କୌଣସି ଅଡିଟ୍ ଲଗ୍ ପ୍ରବିଷ୍ଟି ମିଳିଲା ନାହିଁ'
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {events.map((evt, idx) => (
                <div 
                  key={evt.id || idx}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div 
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'var(--gov-navy-800)'
                    }}
                  >
                    <Clock size={18} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--gov-navy-800)' }}>
                        {evt.action}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                          {evt.timestamp}
                        </span>
                        <button
                          onClick={() => handleDelete(evt.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#DC2626',
                            borderRadius: '4px',
                            padding: '3px 6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title={loc(language, 'Delete event', 'हटाएं', 'తొలగించండి', 'ବିଲୋପ କରନ୍ତୁ')}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      <strong>{loc(language, 'Actor:', 'कर्ता:', 'కర్త:', 'କର୍ତ୍ତା:')}</strong> {evt.actor} | <strong>{loc(language, 'Record:', 'अभिलेख:', 'రికార్డు:', 'ଅଭିଲେଖ:')}</strong> {evt.record_id}
                    </div>

                    {evt.details && (
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '4px', background: 'var(--bg-subtle)', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                        {evt.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '8px 20px' }}>
            {loc(language, 'Close Audit Log', 'बंद करें', 'మూసివేయండి', 'ବନ୍ଦ କରନ୍ତୁ')}
          </button>
        </div>
      </div>
    </div>
  );
}
