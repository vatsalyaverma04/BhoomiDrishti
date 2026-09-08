import React from 'react';
import { Sun, Moon, Globe, UserCheck, Shield, Sparkles, Database } from 'lucide-react';
import { translations } from '../utils/translations';

export default function GovHeader({
  language,
  setLanguage,
  role,
  setRole,
  fontSize,
  setFontSize,
  theme,
  setTheme,
  onOpenDbModal,
  dbConnected
}) {
  const t = translations[language] || translations.en;

  return (
    <header className="gov-header-wrapper">
      {/* Indian National Tricolor Ribbon */}
      <div className="tricolor-ribbon" />

      {/* Top Utility Bar */}
      <div className="gov-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontWeight: 600, letterSpacing: '0.01em' }}>
            {t.govIndia}
          </span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span style={{ opacity: 0.85, fontWeight: 500 }}>
            {t.deptLand}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Accessibility Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: '4px' }}>
            <button
              onClick={() => setFontSize('sm')}
              style={{ background: 'none', border: 'none', color: fontSize === 'sm' ? '#F47920' : 'white', cursor: 'pointer', fontWeight: 700, padding: '0 4px', fontSize: '0.75rem' }}
              title="Small Text"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('normal')}
              style={{ background: 'none', border: 'none', color: fontSize === 'normal' ? '#F47920' : 'white', cursor: 'pointer', fontWeight: 700, padding: '0 4px', fontSize: '0.75rem' }}
              title="Normal Text"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              style={{ background: 'none', border: 'none', color: fontSize === 'lg' ? '#F47920' : 'white', cursor: 'pointer', fontWeight: 700, padding: '0 4px', fontSize: '0.75rem' }}
              title="Large Text"
            >
              A+
            </button>
          </div>

          {/* Supabase Cloud Database Status & Configuration Modal Trigger */}
          <button
            onClick={onOpenDbModal}
            style={{
              background: dbConnected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 121, 32, 0.2)',
              border: `1px solid ${dbConnected ? '#34D399' : '#F97316'}`,
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            title="Database Configuration & Supabase Cloud Status"
          >
            <Database size={13} color={dbConnected ? '#6EE7B7' : '#FED7AA'} />
            <span>{dbConnected ? 'Supabase: Active' : 'Database: Local (Cloud Sync)'}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ 
              background: theme === 'dark' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.1)', 
              border: `1px solid ${theme === 'dark' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255,255,255,0.2)'}`, 
              color: 'white', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={14} color="#FBBF24" /> : <Moon size={14} color="#CBD5E1" />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* 5-Language Selector: English | हिंदी | Hinglish | తెలుగు | ଓଡ଼ିଆ */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.12)', borderRadius: '6px', padding: '2px', flexWrap: 'wrap', gap: '2px' }}>
            <button
              onClick={() => setLanguage('en')}
              style={{
                background: language === 'en' ? 'var(--gov-saffron)' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '3px 8px',
                fontSize: '0.725rem',
                fontWeight: language === 'en' ? 700 : 500,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              style={{
                background: language === 'hi' ? 'var(--gov-saffron)' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '3px 8px',
                fontSize: '0.725rem',
                fontWeight: language === 'hi' ? 700 : 500,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('hinglish')}
              style={{
                background: language === 'hinglish' ? 'var(--gov-saffron)' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '3px 8px',
                fontSize: '0.725rem',
                fontWeight: language === 'hinglish' ? 700 : 500,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              Hinglish
            </button>
            <button
              onClick={() => setLanguage('te')}
              style={{
                background: language === 'te' ? 'var(--gov-saffron)' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '3px 8px',
                fontSize: '0.725rem',
                fontWeight: language === 'te' ? 700 : 500,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              title="Telugu (తెలుగు)"
            >
              తెలుగు
            </button>
            <button
              onClick={() => setLanguage('or')}
              style={{
                background: language === 'or' ? 'var(--gov-saffron)' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '3px 8px',
                fontSize: '0.725rem',
                fontWeight: language === 'or' ? 700 : 500,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              title="Odia (ଓଡ଼ିଆ)"
            >
              ଓଡ଼ିଆ
            </button>
          </div>
        </div>
      </div>

      {/* Main National Branding Header */}
      <div className="gov-branding-header">
        <div className="gov-emblem-section">
          {/* Ashoka Emblem Graphic */}
          <svg className="ashoka-emblem-svg" viewBox="0 0 100 125" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="125" rx="6" fill="#F8FAFC" stroke="#CBD5E1"/>
            <circle cx="50" cy="38" r="24" fill="#0B3B60"/>
            <path d="M40 30 C45 20, 55 20, 60 30 C65 40, 55 52, 50 54 C45 52, 35 40, 40 30 Z" fill="#D97706"/>
            <circle cx="50" cy="38" r="10" fill="#F47920"/>
            <circle cx="50" cy="85" r="16" stroke="#0B3B60" strokeWidth="3" fill="#FFFFFF"/>
            <circle cx="50" cy="85" r="4" fill="#0B3B60"/>
            {Array.from({ length: 12 }).map((_, idx) => (
              <line
                key={idx}
                x1="50"
                y1="85"
                x2={50 + 15 * Math.cos((idx * 30 * Math.PI) / 180)}
                y2={85 + 15 * Math.sin((idx * 30 * Math.PI) / 180)}
                stroke="#0B3B60"
                strokeWidth="1.5"
              />
            ))}
            <text x="50" y="114" textAnchor="middle" fill="#0B3B60" fontSize="9" fontWeight="800" fontFamily="sans-serif">
              सत्यमेव जयते
            </text>
          </svg>

          <div className="gov-title-group">
            <div className="dept-subtext">
              {t.dilrmpFull}
            </div>
            <h1>
              <span>{t.portalTitle}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 9px', borderRadius: '4px', background: '#E0F2FE', color: '#0369A1', border: '1px solid #BAE6FD' }}>
                SIH 2026 EDITION
              </span>
              <span 
                style={{ 
                  fontSize: '0.725rem', 
                  fontWeight: 800, 
                  padding: '3px 10px', 
                  borderRadius: '999px', 
                  background: 'linear-gradient(135deg, #F47920 0%, #138808 100%)', 
                  color: 'white', 
                  boxShadow: '0 0 12px rgba(244, 121, 32, 0.45)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  letterSpacing: '0.02em'
                }}
                title="Developed by Team Data_Vasu"
              >
                <Sparkles size={11} color="#FEF08A" />
                Team Data_Vasu
              </span>
            </h1>
            <p>{t.portalSubtitle}</p>
          </div>
        </div>

        {/* User Persona & Role Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t.officerRole}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-card)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <option value="Tehsildar">{t.roles.Tehsildar}</option>
                <option value="Patwari">{t.roles.Patwari}</option>
                <option value="DataEntry">{t.roles.DataEntry}</option>
                <option value="Auditor">{t.roles.Auditor}</option>
              </select>
            </div>
          </div>

          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-subtle)',
              border: '2px solid var(--border-focus)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--border-focus)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <UserCheck size={22} />
          </div>
        </div>
      </div>
    </header>
  );
}
