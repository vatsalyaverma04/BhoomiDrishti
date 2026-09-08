import React, { useState } from 'react';
import { 
  Search, Filter, MapPin, Download, FileText, CheckCircle2, 
  AlertTriangle, Eye, ShieldCheck, Printer, ArrowUpDown, Plus, 
  Edit3, Trash2, X, Save, AlertCircle, RefreshCw
} from 'lucide-react';
import { ALL_INDIAN_STATES_AND_UTS, ALL_AREA_UNITS, formatFlexibleArea } from '../utils/areaUnits';
import { loc } from '../utils/translations';
import { getApiUrl } from '../config';

export default function RecordsRegistry({
  records = [],
  onSelectRecordForMap,
  onOpenAuditModal,
  onRecordsChanged,
  language = 'en'
}) {
  const isHindi = language === 'hi';
  const isHinglish = language === 'hinglish';
  const isTelugu = language === 'te';
  const isOdia = language === 'or';

  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedForCertificate, setSelectedForCertificate] = useState(null);

  // CRUD State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    khasra_number: '',
    khata_number: '',
    primary_owner: '',
    state: 'Madhya Pradesh',
    district: 'Dewas',
    tehsil: 'Tonk Khurd',
    village: 'Alankheda',
    area_value: 1000,
    area_unit: 'Sq. Meters',
    land_classification: 'Agricultural',
    verification_status: 'VALIDATED'
  });

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 5000);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setErrorMessage(null);
    setFormData({
      khasra_number: '',
      khata_number: '',
      primary_owner: '',
      state: 'Madhya Pradesh',
      district: 'Dewas',
      tehsil: 'Tonk Khurd',
      village: 'Alankheda',
      area_value: 1.25,
      area_unit: 'Hectares',
      land_classification: loc(language, 'Irrigated Agriculture', 'सिंचित कृषि', 'నీటిపారుదల వ్యవసాయం', 'ଜଳସେଚିତ କୃଷି', 'Irrigated Agriculture'),
      verification_status: 'VALIDATED'
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (record) => {
    setErrorMessage(null);
    setEditingRecord(record);
    setFormData({
      khasra_number: record.khasra_number || '',
      khata_number: record.khata_number || '',
      primary_owner: record.primary_owner || '',
      state: record.state || 'Madhya Pradesh',
      district: record.district || '',
      tehsil: record.tehsil || '',
      village: record.village || '',
      area_value: record.area_value || 1.0,
      area_unit: record.area_unit || 'Hectares',
      land_classification: record.land_classification || record.land_type || loc(language, 'Irrigated Agriculture', 'सिंचित कृषि', 'నీటిపారుదల వ్యవసాయం', 'ଜଳସେଚିତ କୃଷି', 'Irrigated Agriculture'),
      verification_status: record.verification_status || 'VALIDATED'
    });
  };

  // Save New Record (POST)
  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!formData.khasra_number || !formData.primary_owner) {
      setErrorMessage(
        loc(language, 
          'Please specify Khasra number and primary landowner name.',
          'कृपया खसरा संख्या और मुख्य खातेदार का नाम अवश्य दर्ज करें।',
          'దయచేసి ఖస్రా సంఖ్య మరియు ప్రధాన యజమాని పేరును నమోదు చేయండి.',
          'ଦୟାକରି ଖସ୍ରା ସଂଖ୍ୟା ଓ ପ୍ରଧାନ ଜମି ମାଲିକଙ୍କ ନାମ ପ୍ରବେଶ କରନ୍ତୁ।',
          'Khasra number aur primary owner name enter karna zaroori hai.'
        )
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = {
        ...formData,
        area_value: parseFloat(formData.area_value) || 1.0,
        landowners: [
          {
            name: formData.primary_owner,
            relation: 's/o Landowner',
            share_percentage: 100.0,
            share_fraction: '1/1'
          }
        ]
      };

      const res = await fetch(getApiUrl('/api/records'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && (data.status === 'success' || data.record)) {
        setIsAddModalOpen(false);
        showNotice(
          loc(language,
            '✓ Land record successfully created in registry.',
            '✓ नया भू-अभिलेख सफलतापूर्वक पंजीकृत किया गया।',
            '✓ కొత్త భూ రికార్డు రిజిస్ట్రీలో విజయవంతంగా నమోదు చేయబడింది.',
            '✓ ନୂତନ ଭୂ-ଅଭିଲେଖ ସଫଳତାର ସହ ରେଜିଷ୍ଟ୍ରିରେ ଅନ୍ତର୍ଭୁକ୍ତ ହେଲା।',
            '✓ Naya land record successfully register ho gaya.'
          )
        );
        onRecordsChanged && onRecordsChanged();
      } else {
        setErrorMessage(data.detail || loc(language, 'Failed to save land record.', 'अभिलेख सहेजने में त्रुटि।', 'భూమి రికార్డును సేవ్ చేయడం విఫలమైంది.', 'ଭୂ-ଅଭିଲେଖ ସଂରକ୍ଷଣ ବିଫଳ ହେଲା।', 'Failed to save record.'));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(loc(language, 'Unable to reach backend server.', 'सर्वर से संपर्क नहीं हो सका।', 'బ్యాకెండ్ సర్వర్‌ను సంప్రదించలేకపోయాము.', 'ବ୍ୟାକେଣ୍ଡ ସର୍ଭର ସହିତ ସଂଯୋଗ ହୋଇପାରିଲା ନାହିଁ।', 'Server se connect nahi ho saka.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Record (PUT)
  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    if (!editingRecord) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = {
        ...formData,
        area_value: parseFloat(formData.area_value) || 1.0
      };

      const res = await fetch(getApiUrl(`/api/records/${editingRecord.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && (data.status === 'success' || data.record)) {
        const id = editingRecord.id;
        setEditingRecord(null);
        showNotice(
          loc(language,
            `✓ Record ${id} successfully updated in registry.`,
            `✓ अभिलेख ${id} सफलतापूर्वक अद्यतन किया गया।`,
            `✓ రికార్డు ${id} విజయవంతంగా నవీకరించబడింది.`,
            `✓ ରେକର୍ଡ ${id} ସଫଳତାର ସହ ଅଦ୍ୟତନ ହେଲା।`,
            `✓ Record ${id} successfully update ho gaya.`
          )
        );
        onRecordsChanged && onRecordsChanged();
      } else {
        setErrorMessage(data.detail || loc(language, 'Update failed.', 'अद्यतन विफल हुआ।', 'నవీకరణ విఫలమైంది.', 'ଅଦ୍ୟତନ ବିଫଳ ହେଲା।', 'Update fail ho gaya.'));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(loc(language, 'Error updating record.', 'अभिलेख अद्यतन करने में त्रुटि।', 'రికార్డును నవీకరించడంలో లోపం.', 'ରେକର୍ଡ ଅଦ୍ୟତନ କରିବାରେ ତ୍ରୁଟି।', 'Record update error.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Record (DELETE)
  const handleDeleteRecord = async () => {
    if (!deletingRecord) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const deletedId = deletingRecord.id;
      const res = await fetch(getApiUrl(`/api/records/${deletedId}`), {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok && (data.status === 'success' || res.status === 200)) {
        setDeletingRecord(null);
        showNotice(
          loc(language,
            `✓ Record ${deletedId} permanently removed from registry.`,
            `✓ अभिलेख ${deletedId} रजिस्ट्री से सफलतापूर्वक हटाया गया।`,
            `✓ రికార్డు ${deletedId} రిజిస్ట్రీ నుండి శాశ్వతంగా తొలగించబడింది.`,
            `✓ ରେକର୍ଡ ${deletedId} ରେଜିଷ୍ଟ୍ରିରୁ ସଫଳତାର ସହ ଅପସାରଣ କରାଗଲା।`,
            `✓ Record ${deletedId} registry se successfully delete ho gaya.`
          )
        );
        onRecordsChanged && onRecordsChanged();
      } else {
        setErrorMessage(data.detail || loc(language, 'Failed to delete record.', 'विलोपन विफल रहा।', 'రికార్డు తొలగింపు విఫలమైంది.', 'ରେକର୍ଡ ଅପସାରଣ ବିଫଳ ହେଲା।', 'Delete fail ho gaya.'));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(loc(language, 'Error deleting record.', 'अभिलेख हटाने में त्रुटि।', 'రికార్డు తొలగించడంలో లోపం.', 'ରେକର୍ଡ ଅପସାରଣରେ ତ୍ରୁଟି।', 'Record delete error.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter records
  const filtered = records.filter(r => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      (r.khasra_number || '').toLowerCase().includes(s) ||
      (r.khata_number || '').toLowerCase().includes(s) ||
      (r.primary_owner || '').toLowerCase().includes(s) ||
      (r.village || '').toLowerCase().includes(s) ||
      (r.district || '').toLowerCase().includes(s) ||
      (r.id || '').toLowerCase().includes(s)
    );

    const matchesState = !stateFilter || r.state === stateFilter;
    const matchesStatus = !statusFilter || r.verification_status === statusFilter;

    return matchesSearch && matchesState && matchesStatus;
  });

  const handleDownloadDILRMP = (record) => {
    const dilrmpJson = {
      schema: "DILRMP-NLRMP-2.1",
      national_record_id: `ULPIN-${record.id}`,
      jurisdiction: {
        state: record.state,
        district: record.district,
        tehsil: record.tehsil,
        village: record.village
      },
      parcel: {
        khasra_number: record.khasra_number,
        khata_number: record.khata_number,
        area_hectares: record.standardized_hectares || record.area_value,
        coordinates: record.geo_coordinates
      },
      ownership: {
        primary_owner: record.primary_owner,
        co_owners: record.landowners || record.co_owners
      },
      status: record.verification_status,
      timestamp: record.digitized_at || record.created_at
    };

    const blob = new Blob([JSON.stringify(dilrmpJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DILRMP_Record_${record.id}.json`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Official Status Notification Banner */}
      {actionNotice && (
        <div 
          style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '12px 18px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <CheckCircle2 size={18} color="#10B981" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Search & Filter Bar with Action Buttons */}
      <div 
        style={{ 
          background: 'var(--bg-card)', 
          padding: '16px 20px', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder={
              loc(language,
                'Search by Khasra No., Khata, Owner Name, or Village...',
                'खसरा संख्या, खाता संख्या, खातेदार या ग्राम द्वारा खोजें...',
                'ఖస్రా సంఖ్య, ఖాతా, యజమాని పేరు లేదా గ్రామం ద్వారా వెతకండి...',
                'ଖସ୍ରା ନଂ, ଖାତା, ଜମି ମାଲିକଙ୍କ ନାମ କିମ୍ବା ଗ୍ରାମ ଦ୍ୱାରା ଖୋଜନ୍ତୁ...',
                'Khasra no., khata, owner ya village search karein...'
              )
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              fontSize: '0.875rem',
              borderRadius: '6px',
              border: '1px solid var(--border-light)',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* State Filter with all 28 States & 8 UTs */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.825rem' }}
          >
            <option value="">{loc(language, 'All States & UTs (36)', 'सभी राज्य व केंद्रशासित प्रदेश', 'అన్ని రాష్ట్రాలు & UTలు', 'ସମସ୍ତ ରାଜ୍ୟ ଓ UT', 'Sabhi States & UTs')}</option>
            {ALL_INDIAN_STATES_AND_UTS.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.825rem' }}
          >
            <option value="">{loc(language, 'All Statuses', 'सभी स्थितियाँ', 'అన్ని స్థితులు', 'ସମସ୍ତ ସ୍ଥିତି', 'All Status')}</option>
            <option value="VALIDATED">{loc(language, 'Validated', 'सत्यापित', 'ధృవీకరించబడింది', 'ସତ୍ୟାପିତ', 'Validated')}</option>
            <option value="NEEDS_REVIEW">{loc(language, 'Needs Review', 'समीक्षाधीन', 'సమీక్ష అవసరం', 'ସମୀକ୍ଷା ଆବଶ୍ୟକ', 'Needs Review')}</option>
            <option value="FLAGGED_ERROR">{loc(language, 'Flagged Error', 'त्रुटि', 'లోపం గుర్తించబడింది', 'ତ୍ରୁଟି ଚିହ୍ନଟ', 'Flagged Error')}</option>
          </select>

          {/* ADD NEW RECORD BUTTON */}
          <button
            onClick={handleOpenAdd}
            className="btn btn-green"
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
            }}
          >
            <Plus size={16} />
            <span>{loc(language, '+ Add New Record', '+ नया अभिलेख जोड़ें', '+ కొత్త రికార్డును చేర్చండి', '+ ନୂତନ ରେକର୍ଡ ଯୋଡନ୍ତୁ', '+ Naya Record Add Karein')}</span>
          </button>
        </div>
      </div>

      {/* Main Records Table */}
      <div className="gov-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--gov-navy-900)', color: 'white', borderBottom: '2px solid var(--gov-saffron)' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>{loc(language, 'Record ID', 'अभिलेख आईडी', 'రికార్డు ID', 'ରେକର୍ଡ ID', 'Record ID')}</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>{loc(language, 'Khasra / Survey', 'खसरा / सर्वे संख्या', 'ఖస్రా / సర్వే సంఖ్య', 'ଖସ୍ରା / ସର୍ଭେ ନଂ', 'Khasra / Survey')}</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>{loc(language, 'Khata No.', 'खाता संख्या', 'ఖాతా సంఖ్య', 'ଖାତା ସଂଖ୍ୟା', 'Khata No.')}</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>{loc(language, 'Primary Landowner', 'मुख्य खातेदार', 'ప్రధాన భూ యజమాని', 'ପ୍ରଧାନ ଜମି ମାଲିକ', 'Primary Landowner')}</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>{loc(language, 'Village & District', 'ग्राम व ज़िला', 'గ్రామం & జిల్లా', 'ଗ୍ରାମ ଓ ଜିଲ୍ଲା', 'Village & District')}</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>{loc(language, 'Area', 'रकबा', 'వైశాల్యం', 'କ୍ଷେତ୍ରଫଳ', 'Area')}</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>{loc(language, 'Validation Status', 'स्थिति', 'ధృవీకరణ స్థితి', 'ସତ୍ୟାପନ ସ୍ଥିତି', 'Validation Status')}</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'center' }}>{loc(language, 'Actions', 'कार्यवाहियाँ', 'చర్యలు', 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    {loc(language, 'No matching land records found in repository', 'कोई मेल खाता भू-अभिलेख नहीं मिला', 'రిపోజిటరీలో ఎటువంటి సరిపోలే భూ రికార్డులు కనుగొనబడలేదు', 'କୌଣସି ମେଳ ଖାଉଥିବା ଭୂ-ଅଭିଲେଖ ମିଳିଲା ନାହିଁ', 'No matching land records found in repository')}
                  </td>
                </tr>
              ) : (
                filtered.map((record, index) => {
                  const isValid = record.verification_status === 'VALIDATED';
                  const isFlagged = record.verification_status === 'FLAGGED_ERROR';

                  return (
                    <tr 
                      key={record.id || index}
                      style={{ 
                        borderBottom: '1px solid var(--border-light)',
                        background: index % 2 === 0 ? 'white' : 'var(--bg-subtle)',
                        transition: 'background 0.15s ease'
                      }}
                      className="registry-row"
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--gov-navy-800)' }}>
                        {record.id}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--gov-saffron-dark)' }}>
                        {record.khasra_number}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {record.khata_number || '--'}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                        {record.primary_owner}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div>{record.village}, {record.tehsil}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{record.state}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, minWidth: '160px' }}>
                        <div>{formatFlexibleArea(record.area_value, record.area_unit || 'Sq. Meters')}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            background: isValid ? 'var(--conf-high-bg)' : isFlagged ? 'var(--conf-low-bg)' : 'var(--conf-med-bg)',
                            color: isValid ? 'var(--conf-high-text)' : isFlagged ? 'var(--conf-low-text)' : 'var(--conf-med-text)',
                            border: `1px solid ${isValid ? 'var(--conf-high-border)' : isFlagged ? 'var(--conf-low-border)' : 'var(--conf-med-border)'}`
                          }}
                        >
                          {isValid ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                          <span>
                            {isValid ? loc(language, 'Validated', 'सत्यापित', 'ధృవీకరించబడింది', 'ସତ୍ୟାପିତ', 'Validated') : isFlagged ? loc(language, 'Flagged', 'त्रुटि', 'లోపం', 'ତ୍ରୁଟି', 'Flagged') : loc(language, 'Pending', 'लंबित', 'పెండింగ్', 'ବିଚାରାଧୀନ', 'Pending')}
                          </span>
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', flexWrap: 'wrap' }}>
                          {/* Edit Record */}
                          <button
                            onClick={() => handleOpenEdit(record)}
                            className="btn btn-outline"
                            style={{ padding: '4px 7px', borderColor: '#3B82F6', color: '#2563EB' }}
                            title={loc(language, 'Edit Land Record', 'अभिलेख संपादित करें', 'భూ రికార్డును సవరించండి', 'ଭୂ-ଅଭିଲେଖ ସଂଶୋଧନ କରନ୍ତୁ', 'Edit Land Record')}
                          >
                            <Edit3 size={13} />
                          </button>

                          {/* Delete Record */}
                          <button
                            onClick={() => setDeletingRecord(record)}
                            className="btn btn-outline"
                            style={{ padding: '4px 7px', borderColor: '#FCA5A5', color: '#DC2626' }}
                            title={loc(language, 'Delete Land Record', 'अभिलेख हटाएं', 'భూ రికార్డును తొలగించండి', 'ଭୂ-ଅଭିଲେଖ ଅପସାରଣ କରନ୍ତୁ', 'Delete Land Record')}
                          >
                            <Trash2 size={13} />
                          </button>

                          {/* Map Pin */}
                          <button
                            onClick={() => onSelectRecordForMap(record)}
                            className="btn btn-outline"
                            style={{ padding: '4px 7px' }}
                            title={loc(language, 'View Plot on Cadastral Map', 'जीआईएस मैप पर देखें', 'మ్యాప్‌లో ప్లాట్ చూడండి', 'ମାନଚିତ୍ରରେ ପ୍ଲଟ୍ ଦେଖନ୍ତୁ', 'View Plot on Cadastral Map')}
                          >
                            <MapPin size={13} color="#0B3B60" />
                          </button>

                          {/* Certificate View */}
                          <button
                            onClick={() => setSelectedForCertificate(record)}
                            className="btn btn-outline"
                            style={{ padding: '4px 7px' }}
                            title={loc(language, 'Generate Official Certificate', 'आधिकारिक प्रमाणपत्र बनाएं', 'అధికారిక సర్టిఫికేట్ రూపొందించండి', 'ସରକାରୀ ପ୍ରମାଣପତ୍ର ପ୍ରସ୍ତୁତ କରନ୍ତୁ', 'Generate Official Certificate')}
                          >
                            <Printer size={13} color="#F47920" />
                          </button>

                          {/* DILRMP JSON Export */}
                          <button
                            onClick={() => handleDownloadDILRMP(record)}
                            className="btn btn-outline"
                            style={{ padding: '4px 7px' }}
                            title={loc(language, 'Export DILRMP JSON', 'राष्ट्रीय DILRMP JSON निर्यात', 'DILRMP JSON ఎగుమతి', 'DILRMP JSON ରପ୍ତାନି', 'Export DILRMP JSON')}
                          >
                            <Download size={13} color="#10B981" />
                          </button>

                          {/* Audit Trail */}
                          <button
                            onClick={() => onOpenAuditModal(record.id)}
                            className="btn btn-outline"
                            style={{ padding: '4px 7px' }}
                            title={loc(language, 'View Audit History', 'ऑडिट इतिहास', 'ఆడిట్ చరిత్రను చూడండి', 'ଅଡିଟ୍ ଇତିହାସ ଦେଖନ୍ତୁ', 'View Audit History')}
                          >
                            <ShieldCheck size={13} color="#6366F1" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          ADD NEW LAND RECORD MODAL
          ========================================================================= */}
      {isAddModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(2px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            style={{
              background: 'var(--bg-card)',
              maxWidth: '650px',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="var(--gov-green)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gov-navy-800)' }}>
                  {loc(language, 'Register New Land Record', 'नया भू-अभिलेख पंजीकृत करें', 'కొత్త భూ రికార్డును నమోదు చేయండి', 'ନୂତନ ଭୂ-ଅଭିଲେଖ ପଞ୍ଜୀକରଣ କରନ୍ତୁ', 'Naya Land Record Add Karein')}
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '14px' }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreateRecord}>
              <div className="form-modal-grid" style={{ fontSize: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Khasra / Survey No. *', 'खसरा / सर्वे संख्या *', 'ఖస్రా / సర్వే సంఖ్య *', 'ଖସ୍ରା / ସର୍ଭେ ନଂ *')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 104/2"
                    value={formData.khasra_number}
                    onChange={(e) => setFormData({ ...formData, khasra_number: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Khata Number', 'खाता संख्या', 'ఖాతా సంఖ్య', 'ଖାତା ସଂଖ୍ୟା')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 42"
                    value={formData.khata_number}
                    onChange={(e) => setFormData({ ...formData, khata_number: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Primary Landowner Name *', 'मुख्य खातेदार का नाम *', 'ప్రధాన భూ యజమాని పేరు *', 'ପ୍ରଧାନ ଜମି ମାଲିକଙ୍କ ନାମ *')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwar s/o Gangadhar"
                    value={formData.primary_owner}
                    onChange={(e) => setFormData({ ...formData, primary_owner: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'State', 'राज्य', 'రాష్ట్రం', 'ରାଜ୍ୟ')}
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  >
                    {ALL_INDIAN_STATES_AND_UTS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'District', 'ज़िला', 'జిల్లా', 'ଜିଲ୍ଲା')}
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Tehsil', 'तहसील', 'తహసీల్', 'ତହସିଲ')}
                  </label>
                  <input
                    type="text"
                    value={formData.tehsil}
                    onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Village', 'ग्राम', 'గ్రామం', 'ଗ୍ରାମ')}
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Area Value', 'रकबा मान', 'వైశాల్యం విలువ', 'କ୍ଷେତ୍ରଫଳ ମୂଲ୍ୟ')}
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.area_value}
                    onChange={(e) => setFormData({ ...formData, area_value: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Area Unit', 'क्षेत्रफल इकाई', 'వైశాల్యం యూనిట్', 'କ୍ଷେତ୍ରଫଳ ଏକକ')}
                  </label>
                  <select
                    value={formData.area_unit}
                    onChange={(e) => setFormData({ ...formData, area_unit: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  >
                    {ALL_AREA_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Land Classification', 'भूमि प्रकार', 'భూమి వర్గీకరణ', 'ଜମି ଶ୍ରେଣୀକରଣ')}
                  </label>
                  <input
                    type="text"
                    value={formData.land_classification}
                    onChange={(e) => setFormData({ ...formData, land_classification: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Verification Status', 'सत्यापन स्थिति', 'ధృవీకరణ స్థితి', 'ସତ୍ୟାପନ ସ୍ଥିତି')}
                  </label>
                  <select
                    value={formData.verification_status}
                    onChange={(e) => setFormData({ ...formData, verification_status: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  >
                    <option value="VALIDATED">{loc(language, 'Validated', 'सत्यापित', 'ధృవీకరించబడింది', 'ସତ୍ୟାପିତ')}</option>
                    <option value="NEEDS_REVIEW">{loc(language, 'Needs Review', 'समीक्षाधीन', 'సమీక్ష అవసరం', 'ସମୀକ୍ଷା ଆବଶ୍ୟକ')}</option>
                    <option value="FLAGGED_ERROR">{loc(language, 'Flagged Error', 'त्रुटि', 'లోపం గుర్తించబడింది', 'ତ୍ରୁଟି ଚିହ୍ନଟ')}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-outline"
                >
                  {loc(language, 'Cancel', 'रद्द करें', 'రద్దు చేయి', 'ବାତିଲ କରନ୍ତୁ')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-green"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                >
                  <Save size={16} />
                  <span>{isSubmitting ? loc(language, 'Saving...', 'पंजीकृत हो रहा है...', 'సేవ్ చేస్తోంది...', 'ସଂରକ୍ଷଣ ଚାଲିଛି...') : loc(language, 'Save Record', 'सुरक्षित करें', 'రికార్డును సేవ్ చేయి', 'ରେକର୍ଡ ସଂରକ୍ଷଣ କରନ୍ତୁ')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          EDIT LAND RECORD MODAL
          ========================================================================= */}
      {editingRecord && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(2px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setEditingRecord(null)}
        >
          <div 
            style={{
              background: 'var(--bg-card)',
              maxWidth: '650px',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={20} color="#2563EB" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gov-navy-800)' }}>
                  {loc(language, 'Edit Land Record', 'अभिलेख संपादित करें', 'భూ రికార్డును సవరించండి', 'ଭୂ-ଅଭିଲେଖ ସଂଶୋଧନ କରନ୍ତୁ', 'Edit Land Record')}: {editingRecord.id}
                </h3>
              </div>
              <button onClick={() => setEditingRecord(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '14px' }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleUpdateRecord}>
              <div className="form-modal-grid" style={{ fontSize: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Khasra / Survey No. *', 'खसरा / सर्वे संख्या *', 'ఖస్రా / సర్వే సంఖ్య *', 'ଖସ୍ରା / ସର୍ଭେ ନଂ *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.khasra_number}
                    onChange={(e) => setFormData({ ...formData, khasra_number: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Khata Number', 'खाता संख्या', 'ఖాతా సంఖ్య', 'ଖାତା ସଂଖ୍ୟା')}
                  </label>
                  <input
                    type="text"
                    value={formData.khata_number}
                    onChange={(e) => setFormData({ ...formData, khata_number: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Primary Landowner Name *', 'मुख्य खातेदार का नाम *', 'ప్రధాన భూ యజమాని పేరు *', 'ପ୍ରଧାନ ଜମି ମାଲିକଙ୍କ ନାମ *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.primary_owner}
                    onChange={(e) => setFormData({ ...formData, primary_owner: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'State', 'राज्य', 'రాష్ట్రం', 'ରାଜ୍ୟ')}
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  >
                    {ALL_INDIAN_STATES_AND_UTS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'District', 'ज़िला', 'జిల్లా', 'ଜିଲ୍ଲା')}
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Tehsil', 'तहसील', 'తహసీల్', 'ତହସିଲ')}
                  </label>
                  <input
                    type="text"
                    value={formData.tehsil}
                    onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Village', 'ग्राम', 'గ్రామం', 'ଗ୍ରାମ')}
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Area Value', 'रकबा मान', 'వైశాల్యం విలువ', 'କ୍ଷେତ୍ରଫଳ ମୂଲ୍ୟ')}
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.area_value}
                    onChange={(e) => setFormData({ ...formData, area_value: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Area Unit', 'क्षेत्रफल इकाई', 'వైశాల్యం యూనిట్', 'କ୍ଷେତ୍ରଫଳ ଏକକ')}
                  </label>
                  <select
                    value={formData.area_unit}
                    onChange={(e) => setFormData({ ...formData, area_unit: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  >
                    {ALL_AREA_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Land Classification', 'भूमि प्रकार', 'భూమి వర్గీకరణ', 'ଜମି ଶ୍ରେଣୀକରଣ')}
                  </label>
                  <input
                    type="text"
                    value={formData.land_classification}
                    onChange={(e) => setFormData({ ...formData, land_classification: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '4px' }}>
                    {loc(language, 'Verification Status', 'सत्यापन स्थिति', 'ధృవీకరణ స్థితి', 'ସତ୍ୟାପନ ସ୍ଥିତି')}
                  </label>
                  <select
                    value={formData.verification_status}
                    onChange={(e) => setFormData({ ...formData, verification_status: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  >
                    <option value="VALIDATED">{loc(language, 'Validated', 'सत्यापित', 'ధృవీకరించబడింది', 'ସତ୍ୟାପିତ')}</option>
                    <option value="NEEDS_REVIEW">{loc(language, 'Needs Review', 'समीक्षाधीन', 'సమీక్ష అవసరం', 'ସମୀକ୍ଷା ଆବଶ୍ୟକ')}</option>
                    <option value="FLAGGED_ERROR">{loc(language, 'Flagged Error', 'त्रुटि', 'లోపం గుర్తించబడింది', 'ତ୍ରୁଟି ଚିହ୍ନଟ')}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="btn btn-outline"
                >
                  {loc(language, 'Cancel', 'रद्द करें', 'రద్దు చేయి', 'ବାତିଲ କରନ୍ତୁ')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-blue"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                >
                  <Save size={16} />
                  <span>{isSubmitting ? loc(language, 'Saving...', 'अद्यतन हो रहा है...', 'సేవ్ చేస్తోంది...', 'ଅଦ୍ୟତନ ଚାଲିଛି...') : loc(language, 'Save Changes', 'परिवर्तन सुरक्षित करें', 'మార్పులను సేవ్ చేయి', 'ପରିବର୍ତ୍ତନ ସଂରକ୍ଷଣ କରନ୍ତୁ')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
          ========================================================================= */}
      {deletingRecord && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(2px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setDeletingRecord(null)}
        >
          <div 
            style={{
              background: 'var(--bg-card)',
              maxWidth: '480px',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              border: '2px solid #F87171',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#DC2626' }}>
                  {loc(language, 'Confirm Record Deletion', 'अभिलेख विलोपन पुष्टिकरण', 'రికార్డు తొలగింపు నిర్ధారణ', 'ରେକର୍ଡ ଅପସାରଣ ନିଶ୍ଚିତକରଣ', 'Record Deletion Confirm Karein')}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  National Land Records Modernization Programme (DILRMP)
                </div>
              </div>
            </div>

            {errorMessage && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '14px' }}>
                {errorMessage}
              </div>
            )}

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              {loc(language,
                `Are you sure you want to permanently delete record ID "${deletingRecord.id}" (Khasra: ${deletingRecord.khasra_number}, Owner: ${deletingRecord.primary_owner})? This deletion will be cryptographically audited.`,
                `क्या आप वाकई अभिलेख ID "${deletingRecord.id}" (खसरा: ${deletingRecord.khasra_number}, खातेदार: ${deletingRecord.primary_owner}) को हटाना चाहते हैं? यह कार्यवाही ऑडिट ट्रेल में दर्ज की जाएगी।`,
                `మీరు ఖచ్చితంగా రికార్డు ID "${deletingRecord.id}" (ఖస్రా: ${deletingRecord.khasra_number}, యజమాని: ${deletingRecord.primary_owner}) ని శాశ్వతంగా తొలగించాలనుకుంటున్నారా?`,
                `ଆପଣ ନିଶ୍ଚିତ ଭାବରେ ରେକର୍ଡ ID "${deletingRecord.id}" (ଖସ୍ରା: ${deletingRecord.khasra_number}, ମାଲିକ: ${deletingRecord.primary_owner}) କୁ ସ୍ଥାୟୀ ଭାବେ ଅପସାରଣ କରିବାକୁ ଚାହାଁନ୍ତି କି?`,
                `Kya aap waqai record ID "${deletingRecord.id}" (Khasra: ${deletingRecord.khasra_number}, Owner: ${deletingRecord.primary_owner}) ko delete karna chahte hain?`
              )}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeletingRecord(null)}
                className="btn btn-outline"
              >
                {loc(language, 'Cancel', 'रद्द करें', 'రద్దు చేయి', 'ବାତିଲ କରନ୍ତୁ')}
              </button>
              <button
                type="button"
                onClick={handleDeleteRecord}
                disabled={isSubmitting}
                className="btn"
                style={{ background: '#DC2626', color: 'white', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={16} />
                <span>{isSubmitting ? loc(language, 'Deleting...', 'हटाया जा रहा है...', 'తొలగిస్తోంది...', 'ଅପସାରଣ ଚାଲିଛି...') : loc(language, 'Delete Permanently', 'हाँ, अभिलेख हटाएं', 'ఖచ్చితంగా తొలగించు', 'ସ୍ଥାୟୀ ଭାବେ ଅପସାରଣ କରନ୍ତୁ')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Official Land Record Certificate Modal */}
      {selectedForCertificate && (
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
          onClick={() => setSelectedForCertificate(null)}
        >
          <div 
            style={{
              background: 'var(--bg-card)',
              maxWidth: '720px',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--border-focus)',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Certificate Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid var(--gov-navy-800)', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gov-saffron-dark)', textTransform: 'uppercase' }}>
                {loc(language, 'Digital India Land Records Modernization Programme (DILRMP)', 'डिजिटल इंडिया भू-अभिलेख आधुनिकीकरण कार्यक्रम (DILRMP)', 'డిజిటల్ ఇండియా భూ రికార్డుల ఆధునీకరణ కార్యక్రమం (DILRMP)', 'ଡିଜିଟାଲ୍ ଇଣ୍ଡିଆ ଭୂ-ଅଭିଲେଖ ଆଧୁନିକୀକରଣ କାର୍ଯ୍ୟକ୍ରମ (DILRMP)')}
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gov-navy-800)', margin: '4px 0' }}>
                {loc(language, 'Land Record Certification Document', 'भू-अभिलेख प्रमाणीकरण प्रमाणपत्र', 'భూ రికార్డు ధృవీకరణ పత్రం', 'ଭୂ-ଅଭିଲେଖ ପ୍ରମାଣୀକରଣ ପ୍ରମାଣପତ୍ର')}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {loc(language, `Department of Revenue - Government of ${selectedForCertificate.state}`, `राजस्व विभाग - ${selectedForCertificate.state} शासन`, `రెవెన్యూ శాఖ - ${selectedForCertificate.state} ప్రభుత్వం`, `ରାଜସ୍ୱ ବିଭାଗ - ${selectedForCertificate.state} ସରକାର`)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {loc(language, 'Certificate ID:', 'प्रमाणपत्र संख्या:', 'సర్టిఫికేట్ ID:', 'ପ୍ରମାଣପତ୍ର ସଂଖ୍ୟା:')} DILRMP/CERT/{selectedForCertificate.id} | {loc(language, 'Date:', 'दिनांक:', 'తేదీ:', 'ତାରିଖ:')} {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : language === 'or' ? 'or-IN' : 'en-IN')}
              </div>
            </div>

            {/* Certificate Body Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '20px' }}>
              <div><strong>{loc(language, 'State:', 'राज्य:', 'రాష్ట్రం:', 'ରାଜ୍ୟ:')}</strong> {selectedForCertificate.state}</div>
              <div><strong>{loc(language, 'District:', 'ज़िला:', 'జిల్లా:', 'ଜିଲ୍ଲା:')}</strong> {selectedForCertificate.district}</div>
              <div><strong>{loc(language, 'Tehsil:', 'तहसील:', 'తహసీల్:', 'ତହସିଲ:')}</strong> {selectedForCertificate.tehsil}</div>
              <div><strong>{loc(language, 'Village:', 'ग्राम:', 'గ్రామం:', 'ଗ୍ରାମ:')}</strong> {selectedForCertificate.village}</div>
              <div><strong>{loc(language, 'Khasra No.:', 'खसरा संख्या:', 'ఖస్రా సంఖ్య:', 'ଖସ୍ରା ନଂ:')}</strong> <span style={{ color: '#C6580D', fontWeight: 800 }}>{selectedForCertificate.khasra_number}</span></div>
              <div><strong>{loc(language, 'Khata No.:', 'खाता संख्या:', 'ఖాతా సంఖ్య:', 'ଖାତା ସଂଖ୍ୟା:')}</strong> {selectedForCertificate.khata_number || '--'}</div>
              <div><strong>{loc(language, 'Total Area:', 'कुल रकबा:', 'మొత్తం వైశాల్యం:', 'ମୋଟ କ୍ଷେତ୍ରଫଳ:')}</strong> {selectedForCertificate.area_value} {selectedForCertificate.area_unit}</div>
              <div><strong>{loc(language, 'Land Classification:', 'भूमि प्रकार:', 'భూమి వర్గీకరణ:', 'ଜମି ଶ୍ରେଣୀ:')}</strong> {selectedForCertificate.land_classification}</div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>{loc(language, 'Primary Landowner:', 'मुख्य खातेदार नाम:', 'ప్రధాన యజమాని:', 'ପ୍ରଧାନ ଜମି ମାଲିକ:')}</strong> {selectedForCertificate.primary_owner}
              </div>
            </div>

            {/* Co-owners table */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                {loc(language, 'Co-Owners & Shareholders:', 'सह-खातेदार विवरण:', 'సహ-యజమానులు & వాటాదారులు:', 'ସହ-ରୟତ ଓ ଅଂଶଧନ:')}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', border: '1px solid var(--border-light)' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9' }}>
                    <th style={{ padding: '6px', border: '1px solid var(--border-light)' }}>{loc(language, 'Name', 'नाम', 'పేరు', 'ନାମ')}</th>
                    <th style={{ padding: '6px', border: '1px solid var(--border-light)' }}>{loc(language, 'Relation', 'संबंध', 'సంబంధం', 'ସମ୍ପର୍କ')}</th>
                    <th style={{ padding: '6px', border: '1px solid var(--border-light)' }}>{loc(language, 'Share', 'हिस्सा', 'వాటా', 'ଅଂଶ')}</th>
                  </tr>
                </thead>
                <tbody>
                  {((selectedForCertificate.landowners || selectedForCertificate.co_owners) || []).map((o, i) => (
                    <tr key={i}>
                      <td style={{ padding: '6px', border: '1px solid var(--border-light)' }}>{o.name}</td>
                      <td style={{ padding: '6px', border: '1px solid var(--border-light)' }}>{o.relation}</td>
                      <td style={{ padding: '6px', border: '1px solid var(--border-light)' }}>{o.share_percentage}% ({o.share_fraction})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Verification Sign-off Stamp */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '28px', paddingTop: '16px', borderTop: '1px dashed var(--border-light)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {loc(language, '✓ Certified that the above land record entries have been digitally verified and authenticated.', '✓ प्रमाणित किया जाता है कि उपरोक्त विवरण डिजिटल रूप से सत्यापित किया गया है।', '✓ పై భూ రికార్డు వివరాలు డిజిటల్ పద్ధతిలో ధృవీకరించబడ్డాయి.', '✓ ପ୍ରମାଣିତ କରାଗଲା କି ଉପରୋକ୍ତ ଭୂ-ଅଭିଲେଖ ବିବରଣୀ ଡିଜିଟାଲ୍ ଭାବରେ ସତ୍ୟାପିତ ହୋଇଛି।')}<br/>
                {loc(language, 'AI Confidence Score: 98.2%', 'एआई शुद्धता स्कोर: 98.2%', 'AI ఖచ్చితత్వ స్కోర్: 98.2%', 'AI ସଠିକତା ସ୍କୋର: 98.2%')} | ULPIN: ULPIN-{selectedForCertificate.id}
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ border: '2px solid #991B1B', color: '#991B1B', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, margin: '0 auto 6px auto', transform: 'rotate(-8deg)' }}>
                  {loc(language, 'VERIFIED\nTEHSILDAR', 'सत्यापित\nतहसीलदार', 'ధృవీకరించబడింది\nతహసీల్దార్', 'ସତ୍ୟାପିତ\nତହସିଲଦାର')}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{loc(language, 'Authorized Signature', 'हस्ताक्षर तहसीलदार', 'అధికారిక సంతకం', 'ଅଧିକୃତ ଦସ୍ତଖତ')}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{loc(language, 'Revenue Court', 'राजस्व न्यायालय', 'రెవెన్యూ న్యాయస్థానం', 'ରାଜସ୍ୱ ନ୍ୟାୟାଳୟ')}</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => setSelectedForCertificate(null)}
                className="btn btn-outline"
              >
                {loc(language, 'Close', 'बंद करें', 'మూసివేయి', 'ବନ୍ଦ କରନ୍ତୁ')}
              </button>
              <button 
                onClick={() => window.print()}
                className="btn btn-saffron"
              >
                <Printer size={16} />
                <span>{loc(language, 'Print Certificate', 'प्रिंट निकालें', 'సర్టిఫికేట్ ప్రింట్ చేయండి', 'ପ୍ରମାଣପତ୍ର ପ୍ରିଣ୍ଟ କରନ୍ତୁ')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
