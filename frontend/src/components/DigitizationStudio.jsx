import React, { useState, useEffect } from 'react';
import { 
  Upload, Wand2, Sparkles, FileText, CheckCircle2, 
  RotateCcw, RefreshCw, AlertCircle, ArrowRight, Play, 
  MapPin, ShieldCheck, Check, FileCheck, Layers, X
} from 'lucide-react';
import DocumentViewer from './DocumentViewer';
import VerificationForm from './VerificationForm';
import { translations } from '../utils/translations';
import { getApiUrl } from '../config';

// Built-in instant fallback samples so the studio NEVER shows a blank screen
const INSTANT_FALLBACK_RECORDS = {
  "LR-HR-1964-005": {
    id: "LR-HR-1964-005",
    title: "स्वामित्व अधिकार पत्र (Deed of Property Rights)",
    document_type: "Record of Rights / Land Deed",
    state: "Haryana",
    district: "Faridabad",
    tehsil: "Faridabad",
    village: "Rampur",
    pargana: "Rampura",
    patwari_halka: "Halka 04",
    khasra_number: "129",
    khata_number: "45",
    khewat_number: "78",
    area_value: 3.700,
    area_unit: "Bigha",
    standardized_hectares: 0.935,
    land_classification: "Krishi (Agricultural Farmland)",
    soil_type: "Alluvial Loam",
    primary_owner: "Ram Prasad Singh s/o Hari Singh",
    language: "hi",
    language_name: "Hindi",
    landowners: [
      {
        name: "Ram Prasad Singh",
        relation: "s/o Hari Singh",
        share_fraction: "1/1",
        share_percentage: 100.0,
        gender: "Male",
        caste_category: "General",
        aadhaar_masked: "XXXX-XXXX-7712"
      }
    ],
    encumbrances: [],
    mutations: [
      {
        order_number: "DEED-347/1964",
        order_date: "1964-07-12",
        type: "Property Rights Grant",
        passed_by: "Tehsildar Faridabad"
      }
    ],
    revenue_tax: {
      lagaan: "₹22.50",
      panchayat_cess: "₹5.00",
      total_annual_tax: "₹27.50"
    },
    geo_coordinates: { lat: 28.4089, lng: 77.3178 },
    confidence_scores: {
      state: 0.98, district: 0.97, tehsil: 0.95, village: 0.96,
      khasra_number: 0.99, khata_number: 0.96, area: 0.94,
      primary_owner: 0.95, landowners: 0.92, classification: 0.94, mutations: 0.88
    },
    verification_status: "VALIDATED"
  },
  "LR-MP-2026-001": {
    id: "LR-MP-2026-001",
    title: "खसरा / बी-1 नकल (Record of Rights)",
    document_type: "Khasra / Khatoni",
    state: "Madhya Pradesh",
    district: "Dewas",
    tehsil: "Tonk Khurd",
    village: "Alankheda",
    pargana: "Sonkatch",
    patwari_halka: "14",
    khasra_number: "104/2",
    khata_number: "58",
    khewat_number: "12",
    area_value: 1.450,
    area_unit: "Hectares",
    standardized_hectares: 1.450,
    land_classification: "Chahi (Irrigated Agricultural)",
    soil_type: "Medium Black (Kali Mitti)",
    primary_owner: "Ramdayal s/o Kanhaiyalal",
    language: "hi",
    language_name: "Hindi",
    landowners: [
      {
        name: "Ramdayal",
        relation: "s/o Kanhaiyalal",
        share_fraction: "1/2",
        share_percentage: 50.0,
        gender: "Male",
        caste_category: "OBC",
        aadhaar_masked: "XXXX-XXXX-8921"
      },
      {
        name: "Radheshyam",
        relation: "s/o Kanhaiyalal",
        share_fraction: "1/2",
        share_percentage: 50.0,
        gender: "Male",
        caste_category: "OBC",
        aadhaar_masked: "XXXX-XXXX-4318"
      }
    ],
    encumbrances: [
      {
        type: "Bank Mortgage / Kisan Credit Card",
        bank_name: "State Bank of India, Tonk Khurd",
        amount: "₹2,00,000",
        status: "Active",
        date: "2020-03-12"
      }
    ],
    mutations: [
      {
        order_number: "MUT-45/2018-19",
        order_date: "2018-09-14",
        type: "Inheritance (Varisana)",
        passed_by: "Tehsildar Tonk Khurd"
      }
    ],
    revenue_tax: {
      lagaan: "₹45.50",
      panchayat_cess: "₹12.00",
      total_annual_tax: "₹57.50"
    },
    geo_coordinates: { lat: 23.0821, lng: 76.1524 },
    confidence_scores: {
      state: 0.99, district: 0.98, tehsil: 0.96, village: 0.95,
      khasra_number: 0.98, khata_number: 0.97, area: 0.94,
      primary_owner: 0.92, landowners: 0.89, classification: 0.91, mutations: 0.86
    },
    verification_status: "VALIDATED"
  },
  "LR-MH-2026-002": {
    id: "LR-MH-2026-002",
    title: "गाव नमुना सात-बारा (7/12 Utara)",
    document_type: "7/12 Saat-Bara",
    state: "Maharashtra",
    district: "Pune",
    tehsil: "Haveli",
    village: "Wagholi",
    pargana: "Haveli Sub-division",
    patwari_halka: "Talathi Sajja 03",
    khasra_number: "412/1",
    khata_number: "129",
    khewat_number: "--",
    area_value: 0.820,
    area_unit: "Hectares",
    standardized_hectares: 0.820,
    land_classification: "Jirayat (Dry Crop Agricultural)",
    soil_type: "Red Clay Loam",
    primary_owner: "Prakash Tukaram Jadhav",
    language: "mr",
    language_name: "Marathi",
    landowners: [
      {
        name: "Prakash Tukaram Jadhav",
        relation: "s/o Tukaram Jadhav",
        share_fraction: "3/4",
        share_percentage: 75.0,
        gender: "Male",
        caste_category: "General",
        aadhaar_masked: "XXXX-XXXX-6102"
      },
      {
        name: "Sunita Prakash Jadhav",
        relation: "w/o Prakash Jadhav",
        share_fraction: "1/4",
        share_percentage: 25.0,
        gender: "Female",
        caste_category: "General",
        aadhaar_masked: "XXXX-XXXX-9923"
      }
    ],
    encumbrances: [
      {
        type: "Crop Loan Lien",
        bank_name: "Bank of Maharashtra, Wagholi Branch",
        amount: "₹1,50,000",
        status: "Active",
        date: "2021-06-20"
      }
    ],
    mutations: [
      {
        order_number: "FERFAR-782",
        order_date: "2019-11-05",
        type: "Purchase Deed (Kharedikhat)",
        passed_by: "Talathi / Mandal Adhikari"
      }
    ],
    revenue_tax: {
      lagaan: "₹82.00",
      panchayat_cess: "₹15.00",
      total_annual_tax: "₹97.00"
    },
    geo_coordinates: { lat: 18.5793, lng: 73.9823 },
    confidence_scores: {
      state: 0.99, district: 0.97, tehsil: 0.95, village: 0.96,
      khasra_number: 0.96, khata_number: 0.94, area: 0.92,
      primary_owner: 0.90, landowners: 0.88, classification: 0.93, mutations: 0.84
    },
    verification_status: "VALIDATED"
  }
};

export default function DigitizationStudio({
  samples = [],
  onRecordSaved,
  onLocateOnMap,
  role = 'Tehsildar',
  language = 'en'
}) {
  const s = translations[language]?.studio || translations.en.studio;
  const isHindi = language === 'hi';
  const isHinglish = language === 'hinglish';
  const isTelugu = language === 'te';
  const isOdia = language === 'or';

  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [preset, setPreset] = useState('enhanced');
  const [deskewAngle, setDeskewAngle] = useState(0);
  const [metrics, setMetrics] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgressStep, setExtractionProgressStep] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [endorsementData, setEndorsementData] = useState(null);
  const [statusNotice, setStatusNotice] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Initialize with null so the screen starts clean until user uploads or picks a sample
  const [recordData, setRecordData] = useState(null);
  const [validationReport, setValidationReport] = useState(null);

  const loadSampleRecord = async (sampleId) => {
    setSelectedSampleId(sampleId);
    setUploadedFile(null);
    setFileName(`${sampleId}.jpg`);
    setIsProcessing(true);

    // 1. Immediately populate from instant fallback so UI is never empty
    if (INSTANT_FALLBACK_RECORDS[sampleId]) {
      setRecordData(INSTANT_FALLBACK_RECORDS[sampleId]);
    }

    try {
      // 2. Fetch high-res scan image from backend
      const imgRes = await fetch(getApiUrl(`/api/samples/${sampleId}/image`));
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        setOriginalImage(imgData.image_base64);
        setEnhancedImage(imgData.image_base64);
      }

      // 3. Preprocess for enhanced view
      const form = new FormData();
      form.append('sample_id', sampleId);
      form.append('preset', preset);

      const prepRes = await fetch(getApiUrl('/api/preprocess'), { method: 'POST', body: form });
      if (prepRes.ok) {
        const prepData = await prepRes.json();
        if (prepData.enhanced_image_base64) {
          setEnhancedImage(prepData.enhanced_image_base64);
        }
        setDeskewAngle(prepData.deskew_angle || 0);
        setMetrics(prepData.metrics || {});
      }
    } catch (err) {
      console.warn('Backend not running or slow; loaded local instant sample cache:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setSelectedSampleId(null);
    setFileName(file.name);
    setIsProcessing(true);

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type.includes('pdf');

    if (isPdf) {
      // For PDFs, send to backend for rendering page 1 to image preview
      const form = new FormData();
      form.append('file', file);
      form.append('preset', preset);

      fetch(getApiUrl('/api/preprocess'), { method: 'POST', body: form })
        .then(res => res.json())
        .then(data => {
          if (data.enhanced_image_base64) {
            setOriginalImage(data.enhanced_image_base64);
            setEnhancedImage(data.enhanced_image_base64);
            setDeskewAngle(data.deskew_angle || 0);
            setMetrics(data.metrics || {});
          }
        })
        .catch(err => console.error('PDF preview error:', err))
        .finally(() => setIsProcessing(false));
    } else {
      // For Images, preview locally right away
      const reader = new FileReader();
      reader.onload = (event) => {
        const b64 = event.target.result;
        setOriginalImage(b64);
        setEnhancedImage(b64);

        // Enhance via backend
        const form = new FormData();
        form.append('file', file);
        form.append('preset', preset);

        fetch(getApiUrl('/api/preprocess'), { method: 'POST', body: form })
          .then(res => res.json())
          .then(data => {
            if (data.enhanced_image_base64) {
              setEnhancedImage(data.enhanced_image_base64);
              setDeskewAngle(data.deskew_angle || 0);
              setMetrics(data.metrics || {});
            }
          })
          .catch(err => console.warn('CV enhancement notice:', err))
          .finally(() => setIsProcessing(false));
      };
      reader.readAsDataURL(file);
    }
  };

  // Main Scan & Analyze trigger handler
  const handleScanAndAnalyze = async () => {
    if (!uploadedFile && !selectedSampleId) {
      setErrorMessage(
        isHindi 
          ? 'कृपया पहले एक भू-अभिलेख दस्तावेज़ अपलोड करें अथवा कोई नमूना चुनें।' 
          : isHinglish 
          ? 'Pehle ek document upload karein ya sample select karein.' 
          : language === 'te'
          ? 'దయచేసి ముందుగా భూమి రिकార్డు పత్రాన్ని అప్‌లోడ్ చేయండి లేదా నమూనాను ఎంచుకోండి.'
          : language === 'or'
          ? 'ଦୟାକରି ପ୍ରଥମେ ଏକ ଜମି ଦଲିଲ ଅପଲୋଡ କରନ୍ତୁ କିମ୍ବା ଏକ ନମୁନା ବାଛନ୍ତୁ।'
          : 'Please upload a land record document or select an archival sample first.'
      );
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    setIsExtracting(true);
    setExtractionProgressStep(
      isTelugu
        ? 'పత్రం విశ్లేషణ మరియు ఆటో-డెస్క్యూ ప్రక్రియ...'
        : isOdia
        ? 'ଦଲିଲ ବିଶ୍ଳେଷଣ ଓ ଅଟୋ-ଡେସ୍କ୍ୟୁ ଚାଲୁଅଛି...'
        : isHindi 
        ? 'दस्तावेज़ का विश्लेषण एवं स्वतः सीधाकरण (Deskew)...' 
        : isHinglish 
        ? 'Document analyze aur auto-deskew ho raha hai...' 
        : 'Preprocessing & Deskewing Document...'
    );

    try {
      const form = new FormData();
      if (uploadedFile) {
        form.append('file', uploadedFile);
      } else if (selectedSampleId) {
        form.append('sample_id', selectedSampleId);
      }

      setExtractionProgressStep(
        isTelugu
          ? 'జాతీయ విజన్ AI ఇంజిన్ ద్వారా బహుభాషా లిపి, పట్టికలు మరియు ఖస్రా రూపకల్పన విశ్లేషణ...'
          : isOdia
          ? 'ଜାତୀୟ ଭିଜନ AI ଇଞ୍ଜିନ ଦ୍ୱାରା ଲିପି, ସାରଣୀ ଓ ଖସ୍ରା ଗ୍ରିଡ୍ ବିଶ୍ଳେଷଣ...'
          : isHindi 
          ? 'राष्ट्रीय विज़न एआई इंजन द्वारा लिपि, तालिका एवं खसरा संरचना का विश्लेषण...' 
          : isHinglish 
          ? 'National Vision AI Engine se script aur tables scan ho rahi hain...' 
          : 'National Vision AI Engine: Decoding multilingual script & cadastral layout...'
      );

      const res = await fetch(getApiUrl('/api/extract'), { method: 'POST', body: form });
      const data = await res.json();

      if (data.status === 'success') {
        setExtractionProgressStep(
          isTelugu
            ? 'DILRMP వ్యాపార నిబంధనలు మరియు 100% వాటాదారుల బ్యాలెన్స్ ధృవీకరణ...'
            : isOdia
            ? 'DILRMP ନିୟମାବଳୀ ଓ ୧୦୦% ଅଂଶଧନ ସନ୍ତୁଳନ ଯାଞ୍ଚ...'
            : isHindi 
            ? 'डीआईएलआरएमपी व्यापार नियमों एवं 100% हिस्सेदारी की जांच...' 
            : isHinglish 
            ? 'DILRMP rules aur 100% shareholder balance check ho raha hai...' 
            : 'Validating DILRMP Business Rules & Share Sums...'
        );
        setRecordData(data.extracted_data);
        setValidationReport(data.validation_report);

        // Dignified government status certification notice
        setStatusNotice(
          isTelugu
            ? '✓ పత్రం విశ్లేషణ పూర్తయింది: బహుభాషా లిపి, ఖస్రా సంఖ్యలు మరియు భూ-రికార్డు వివరాలు విజయవంతంగా పొందబడ్డాయి.'
            : isOdia
            ? '✓ ଦଲିଲ ବିଶ୍ଳେଷଣ ସମ୍ପୂର୍ଣ୍ଣ: ଲିପି, ଖସ୍ରା ସଂଖ୍ୟା ଓ ଜମି ରେକର୍ଡ ସଫଳତାର ସହ ନିଷ୍କର୍ଷିତ ହୋଇଛି।'
            : isHindi 
            ? '✓ दस्तावेज़ विश्लेषण पूर्ण: देवनागरी लिपि, खसरा संख्या एवं भू-अभिलेख विवरण सफलतापूर्वक निष्कर्षित किए गए।' 
            : isHinglish 
            ? '✓ Document analysis complete: Devanagari script, Khasra numbers aur cadastral details extract ho gaye.' 
            : '✓ Document processed: Multilingual script, Khasra numbers & cadastral entities extracted with high fidelity.'
        );
        setTimeout(() => setStatusNotice(null), 5000);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        isTelugu
          ? 'విశ్లేషణలో లోపం ఏర్పడింది. దయచేసి బ్యాకెండ్ సర్వర్‌ను తనిఖీ చేయండి.'
          : isOdia
          ? 'ବିଶ୍ଳେଷଣରେ ତ୍ରୁଟି ଘଟିଲା, ଦୟାକରି ବ୍ୟାକଏଣ୍ଡ ସର୍ଭର ଯାଞ୍ଚ କରନ୍ତୁ।'
          : isHindi 
          ? 'विश्लेषण प्रक्रिया में त्रुटि, कृपया बैकएंड सर्वर जांचें।' 
          : isHinglish 
          ? 'Analysis me error, backend server check karein.' 
          : 'Analysis error. Ensure backend is running.'
      );
      setTimeout(() => setErrorMessage(null), 6000);
    } finally {
      setIsExtracting(false);
      setExtractionProgressStep('');
    }
  };

  const handlePresetChange = async (newPreset) => {
    setPreset(newPreset);
    setIsProcessing(true);
    try {
      const form = new FormData();
      if (uploadedFile) {
        form.append('file', uploadedFile);
      } else if (selectedSampleId) {
        form.append('sample_id', selectedSampleId);
      }
      form.append('preset', newPreset);

      const res = await fetch(getApiUrl('/api/preprocess'), { method: 'POST', body: form });
      const data = await res.json();
      if (data.enhanced_image_base64) {
        setEnhancedImage(data.enhanced_image_base64);
        setMetrics(data.metrics || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateField = (field, value) => {
    setRecordData(prev => {
      const updated = { ...prev, [field]: value };
      fetch(getApiUrl('/api/validate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
      .then(res => res.json())
      .then(data => {
        if (data.validation_report) setValidationReport(data.validation_report);
      })
      .catch(() => {});
      return updated;
    });
  };

  const handleSubmitCorrection = async (feedbackData) => {
    try {
      const res = await fetch(getApiUrl('/api/learning/correction'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      const data = await res.json();
      if (data.status === 'success') {
        setStatusNotice(
          isTelugu
            ? '✓ దిద్దుబాటు AI నిరంతర అభ్యాస ఇంజిన్‌లో నమోదు చేయబడింది!'
            : isOdia
            ? '✓ ସଂଶୋଧନ AI ନିରନ୍ତର ଶିକ୍ଷା ଇଞ୍ଜିନରେ ପଞ୍ଜିକୃତ ହେଲା!'
            : isHindi 
            ? '✓ सुधार एआई कंटीन्यूअस लर्निंग इंजन में दर्ज कर लिया गया!' 
            : isHinglish 
            ? '✓ Correction AI Learning Engine me register ho gaya!' 
            : '✓ Correction assimilated into AI Continuous Learning Engine!'
        );
        setTimeout(() => setStatusNotice(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRecord = async (statusOverride) => {
    setIsSaving(true);
    try {
      const payload = {
        ...recordData,
        verification_status: statusOverride || 'VALIDATED',
        verified_by: role
      };

      const res = await fetch(getApiUrl('/api/records'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.status === 'success') {
        // Dignified official notification (no celebratory popups)
        setStatusNotice(
          isTelugu
            ? '✓ రికార్డు అధికారికంగా ధృవీకరించబడింది మరియు జాతీయ భూమి రిజిస్ట్రీ (DILRMP) లో నమోదు చేయబడింది.'
            : isOdia
            ? '✓ ରେକର୍ଡ ବିଧିବଦ୍ଧ ଭାବେ ସତ୍ୟାପିତ ହୋଇ ଜାତୀୟ DILRMP ରେଜିଷ୍ଟ୍ରିରେ ପଞ୍ଜିକୃତ ହୋଇଛି।'
            : isHindi 
            ? '✓ अभिलेख राष्ट्रीय भू-अभिलेख डेटाबेस (DILRMP) में विधिवत पंजीकृत एवं हस्ताक्षरित किया गया।' 
            : isHinglish 
            ? '✓ Record successfully validate ho gaya aur National Land Registry (DILRMP) me enter ho gaya.' 
            : '✓ Record officially validated, digitally countersigned, and committed to National Land Registry (DILRMP).'
        );
        setTimeout(() => setStatusNotice(null), 6000);
        
        // Official Dignified Government Endorsement Certificate Data
        setEndorsementData({
          certificate_id: `DILRMP-DL-2026-${data.record.khasra_number || '104'}-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString(),
          record: data.record
        });

        onRecordSaved && onRecordSaved(data.record);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        isTelugu
          ? 'రికార్డును సేవ్ చేయడంలో లోపం, దయచేసి మళ్లీ ప్రయత్నించండి.'
          : isOdia
          ? 'ରେକର୍ଡ ସଂରକ୍ଷଣରେ ତ୍ରୁଟି, ଦୟାକରି ପୁନଃ ଚେଷ୍ଟା କରନ୍ତୁ।'
          : isHindi 
          ? 'अभिलेख सहेजने में त्रुटि, कृपया पुनः प्रयास करें।' 
          : isHinglish 
          ? 'Record save karne me error, dubara try karein.' 
          : 'Error saving record. Please retry.'
      );
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const sampleButtons = [
    { 
      id: 'LR-HR-1964-005', 
      label: isTelugu ? '1964 హక్కు పత్రం (ఫరీదాబాద్)' : isOdia ? '୧୯୬୪ ଅଧିକାର ପତ୍ର (ଫରିଦାବାଦ)' : isHindi ? '1964 अधिकार पत्र (फरीदाबाद)' : isHinglish ? '1964 Deed (Faridabad)' : '1964 Deed (Faridabad)', 
      state: 'Haryana' 
    },
    { 
      id: 'LR-MP-2026-001', 
      label: isTelugu ? 'మధ్యప్రదేశ్ ఖస్రా 104/2' : isOdia ? 'ମଧ୍ୟପ୍ରଦେଶ ଖସ୍ରା ୧୦୪/୨' : isHindi ? 'मध्य प्रदेश खसरा 104/2' : isHinglish ? 'MP Khasra 104/2' : 'MP Khasra 104/2', 
      state: 'MP' 
    },
    { 
      id: 'LR-MH-2026-002', 
      label: isTelugu ? 'మహారాష్ట్ర 7/12 (పుణే)' : isOdia ? 'ମହାରାଷ୍ଟ୍ର ୭/୧୨ (ପୁଣେ)' : isHindi ? 'महाराष्ट्र 7/12 (पुणे)' : isHinglish ? 'MH 7/12 Utara (Pune)' : 'MH 7/12 (Pune)', 
      state: 'Maharashtra' 
    },
    { 
      id: 'LR-UP-2026-003', 
      label: isTelugu ? 'ఉత్తరప్రదేశ్ ఖతౌని 287/1' : isOdia ? 'ଉତ୍ତରପ୍ରଦେଶ ଖତୌନି ୨୮୭/୧' : isHindi ? 'उत्तर प्रदेश खतौनी 287/1' : isHinglish ? 'UP Khatoni 287/1' : 'UP Khatoni 287/1', 
      state: 'UP' 
    },
    { 
      id: 'LR-BR-2026-004', 
      label: isTelugu ? 'బీహార్ జమాబందీ 735' : isOdia ? 'ବିହାର ଜମାବନ୍ଦୀ ୭୩୫' : isHindi ? 'बिहार जमाबंदी 735' : isHinglish ? 'Bihar Jamabandi 735' : 'Bihar Jamabandi 735', 
      state: 'Bihar' 
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Dynamic Status / Feedback Banners */}
      {statusNotice && (
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #10B981',
          color: '#065F46',
          padding: '12px 18px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{statusNotice}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #EF4444',
          color: '#991B1B',
          padding: '12px 18px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} color="#EF4444" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#991B1B' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Document Ingestion & Command Center */}
      <div 
        style={{ 
          background: 'var(--bg-card)', 
          padding: '20px 24px', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wand2 size={22} color="#F47920" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gov-navy-800)' }}>
                {s.title}
              </h3>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {s.subtitle}
            </p>
          </div>

          {/* AI Connection Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0'
              }}
            >
              <Sparkles size={14} color="#10B981" />
              <span>
                {isTelugu 
                  ? 'జాతీయ విజన్ AI ఇంజిన్ (DILRMP-CV) సక్రియం' 
                  : isOdia 
                  ? 'ଜାତୀୟ ଭିଜନ AI ଇଞ୍ଜିନ (DILRMP-CV) ସକ୍ରିୟ' 
                  : isHindi 
                  ? 'राष्ट्रीय विज़न एआई इंजन (DILRMP-CV) सक्रिय' 
                  : isHinglish 
                  ? 'National Vision AI Engine (DILRMP-CV) Active' 
                  : 'National Vision AI Engine (DILRMP-CV) Active'}
              </span>
            </span>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: 'var(--bg-subtle)', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            border: '1px solid var(--border-light)',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Preloaded Samples Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {s.sampleDocs}
            </span>
            {sampleButtons.map((sampleBtn) => (
              <button
                key={sampleBtn.id}
                onClick={() => loadSampleRecord(sampleBtn.id)}
                className="btn btn-outline"
                style={{
                  padding: '5px 12px',
                  fontSize: '0.775rem',
                  borderColor: selectedSampleId === sampleBtn.id ? 'var(--border-focus)' : 'var(--border-light)',
                  background: selectedSampleId === sampleBtn.id ? 'var(--gov-navy-800)' : 'var(--bg-card)',
                  color: selectedSampleId === sampleBtn.id ? 'white' : 'var(--text-primary)',
                  fontWeight: selectedSampleId === sampleBtn.id ? 700 : 500,
                  boxShadow: selectedSampleId === sampleBtn.id ? '0 2px 6px rgba(11,59,96,0.2)' : 'none'
                }}
              >
                {sampleBtn.label}
              </button>
            ))}
          </div>

          {/* Upload Button */}
          <label className="btn btn-outline" style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '0.825rem', fontWeight: 700 }}>
            <Upload size={16} />
            <span>{s.uploadBtn}</span>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {/* Selected Document Info Banner with THE SCAN/ANALYZE BUTTON */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: fileName ? 'var(--conf-high-bg)' : 'var(--bg-subtle)', 
            border: `1px solid ${fileName ? 'var(--conf-high-border)' : 'var(--border-light)'}`, 
            padding: '14px 20px', 
            borderRadius: '8px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: fileName ? '#166534' : '#475569',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {fileName ? <FileCheck size={22} /> : <Upload size={20} />}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: fileName ? 'var(--conf-high-text)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                {fileName 
                  ? s.targetLoaded 
                  : (isHindi ? 'दस्तावेज़ प्रतीक्षारत' : language === 'te' ? 'పత్రం వేచి ఉంది' : language === 'or' ? 'ଦଲିଲ ଅପେକ୍ଷାରେ' : isHinglish ? 'Document Awaiting' : 'Awaiting Document Input')}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: fileName ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {fileName || (isHindi ? 'कोई दस्तावेज़ चयनित नहीं' : language === 'te' ? 'ఏ పత్రం ఎంపిక కాలేదు' : language === 'or' ? 'କୌଣସି ଦଲିଲ ଚୟନ ହୋଇନାହିଁ' : 'No Document Selected')}
              </div>
              {recordData ? (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {isTelugu ? 'గుర్తించబడింది:' : isOdia ? 'ଚିହ୍ନଟ ହୋଇଛି:' : isHindi ? 'पहचाना गया:' : isHinglish ? 'Classified:' : 'Classified:'} <strong>{recordData.document_type}</strong> | {recordData.village}, {recordData.district} ({recordData.state})
                </div>
              ) : (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {isHindi ? 'विश्लेषण हेतु अपनी छवि अपलोड करें अथवा कोई नमूना चुनें' : language === 'te' ? 'విశ్లేషణ ప్రారంభించడానికి పై నుండి పత్రాన్ని అప్‌లోడ్ చేయండి లేదా నమూనాను ఎంచుకోండి' : language === 'or' ? 'ବିଶ୍ଳେଷଣ ପାଇଁ ଦଲିଲ ଅପଲୋଡ କରନ୍ତୁ କିମ୍ବା ଉପରୁ ନମୁନା ବାଛନ୍ତୁ' : 'Upload your own land deed scan or pick an archival sample above'}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons: Scan/Analyze and View On Real Map */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* View Plotted Parcel on GIS Map */}
            {recordData && (
              <button
                onClick={() => onLocateOnMap(recordData)}
                className="btn btn-outline"
                style={{ 
                  padding: '10px 18px', 
                  fontSize: '0.875rem', 
                  fontWeight: 700
                }}
              >
                <MapPin size={16} />
                <span>{s.viewMapBtn}</span>
              </button>
            )}

            {/* Prominent Primary Scan & Analyze Button */}
            <button
              onClick={handleScanAndAnalyze}
              disabled={isExtracting}
              className="btn btn-saffron"
              style={{ 
                padding: '10px 24px', 
                fontSize: '0.95rem', 
                fontWeight: 800,
                letterSpacing: '0.02em',
                boxShadow: '0 4px 14px rgba(244, 121, 32, 0.35)'
              }}
            >
              {isExtracting ? (
                <>
                  <RefreshCw size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>{s.scanning}</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>{s.scanBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Extraction Progress HUD if running */}
        {isExtracting && (
          <div 
            style={{ 
              background: '#EFF6FF', 
              border: '1px solid #93C5FD', 
              padding: '12px 18px', 
              borderRadius: '6px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              color: '#1E40AF',
              fontSize: '0.85rem'
            }}
          >
            <RefreshCw size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
            <div>
              <strong>{extractionProgressStep || (isTelugu ? 'విశ్లేషణ కొనసాగుతోంది...' : isOdia ? 'ପ୍ରକ୍ରିୟା ଚାଲୁଅଛି...' : isHindi ? 'प्रक्रिया जारी है...' : 'Processing...')}</strong>
              <div style={{ fontSize: '0.75rem', color: '#3B82F6', marginTop: '2px' }}>
                {isTelugu 
                  ? 'బహుభాషా లిపి, ఖస్రా సంఖ్యలు, సహ-వాటాదారులు మరియు విస్తీర్ణ విశ్లేషణ జరుగుతోంది'
                  : isOdia 
                  ? 'ଲିପି, ଖସ୍ରା ସଂଖ୍ୟା, ସହ-ରୟତ ଓ କ୍ଷେତ୍ରଫଳ ବିଶ୍ଳେଷଣ ଚାଲୁଅଛି'
                  : isHindi 
                  ? 'देवनागरी लिपि, खसरा संख्या, सह-खातेदार और रकबा निष्कर्षण' 
                  : isHinglish 
                  ? 'Devanagari script, Khasra numbers, co-owners aur area analysis chal raha hai' 
                  : 'Parsing multilingual script, Khasra numbers, landowner shares & area'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Split Screen Interface: Document Viewer (Left) + HITL Form (Right) */}
      <div className="hitl-split-container">
        {/* Left: Document Viewer with Real Scan Image and Optical Laser Beam Scanner */}
        <DocumentViewer
          originalImage={originalImage}
          enhancedImage={enhancedImage}
          deskewAngle={deskewAngle}
          metrics={metrics || {}}
          preset={preset}
          onPresetChange={handlePresetChange}
          isProcessing={isProcessing}
          isExtracting={isExtracting}
          language={language}
        />

        {/* Right: Structured HITL Verification Form with Manual Addition & Endorsement Banner */}
        <VerificationForm
          recordData={recordData}
          validationReport={validationReport}
          onUpdateField={handleUpdateField}
          onSubmitCorrection={handleSubmitCorrection}
          onSaveRecord={handleSaveRecord}
          onLocateOnMap={onLocateOnMap}
          isSaving={isSaving}
          role={role}
          language={language}
          endorsementData={endorsementData}
          onDismissEndorsement={() => setEndorsementData(null)}
        />
      </div>
    </div>
  );
}
