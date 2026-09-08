import React from 'react';
import { LayoutDashboard, Wand2, MapPin, Database, Brain, History, BarChart3, HelpCircle } from 'lucide-react';
import { translations, loc } from '../utils/translations';

export default function Navigation({ activeTab, setActiveTab, pendingCount, language = 'en' }) {
  const t = translations[language]?.nav || translations.en.nav;

  const tabs = [
    {
      id: 'dashboard',
      label: t.dashboard,
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'digitize',
      label: t.digitize,
      icon: Wand2,
      badge: loc(language, 'AI Active', 'AI सक्रिय', 'AI క్రియాశీలం', 'AI ସକ୍ରିୟ', 'AI Active')
    },
    {
      id: 'cadastral_map',
      label: t.cadastralMap,
      icon: MapPin,
      badge: loc(language, 'Geo-Spatial', 'भू-स्थानिक', 'భూ-ప్రాదేశిక', 'ଭୂ-ସ୍ଥାନିକ', 'Geo-Spatial')
    },
    {
      id: 'registry',
      label: t.registry,
      icon: Database,
      badge: pendingCount ? `${pendingCount}` : null
    },
    {
      id: 'reports',
      label: t.reports,
      icon: BarChart3,
      badge: loc(language, 'MIS', 'एमआईएस', 'MIS', 'MIS', 'MIS')
    },
    {
      id: 'active_learning',
      label: t.learning,
      icon: Brain,
      badge: '+12'
    },
    {
      id: 'audit_trail',
      label: t.auditTrail,
      icon: History,
      badge: null
    },
    {
      id: 'faq',
      label: t.faq,
      icon: HelpCircle,
      badge: null
    }
  ];

  return (
    <nav className="gov-nav-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab-button ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} />
            <span>{tab.label}</span>
            {tab.badge && <span className="nav-badge">{tab.badge}</span>}
          </button>
        );
      })}
    </nav>
  );
}
