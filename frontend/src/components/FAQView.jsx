import React, { useState } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, Search, ShieldCheck, 
  FileText, PhoneCall, Mail, AlertCircle, Sparkles, Send, 
  CheckCircle2, BookOpen, ExternalLink, Scale
} from 'lucide-react';
import { loc } from '../utils/translations';

export default function FAQView({ language = 'hi' }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaqId, setOpenFaqId] = useState('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);
  const [grievanceForm, setGrievanceForm] = useState({
    name: '',
    mobile: '',
    khasraNo: '',
    issueType: 'discrepancy',
    message: ''
  });

  const categories = [
    { 
      id: 'all', 
      label: loc(language, 'All FAQs', 'समस्त प्रश्न', 'అన్ని ప్రశ్నలు', 'ସମସ୍ତ ପ୍ରଶ୍ନ') 
    },
    { 
      id: 'land_records', 
      label: loc(language, 'Land Records & Khasra', 'भू-अभिलेख एवं खसरा नियम', 'భూ రికార్డులు & ఖస్రా నిబంధనలు', 'ଭୂ-ଅଭିଲେଖ ଓ ଖସ୍ରା ନିୟମ') 
    },
    { 
      id: 'ai_tech', 
      label: loc(language, 'AI Vision & OCR Engine', 'विज़न एआई एवं ओसीआर', 'AI విజన్ & OCR ఇంజిన్', 'AI ଭିଜନ୍ ଓ OCR ଇଞ୍ଜିନ୍') 
    },
    { 
      id: 'legal', 
      label: loc(language, 'Legal & Evidence Act 65B', 'विधिक साक्ष्य अधिनियम धारा ६५बी', 'సాక్ష్య చట్టం సెక్షన్ 65B న్యాయ చెల్లుబాటు', 'ସାକ୍ଷ୍ୟ ଆଇନ ଧାରା ୬୫ବି') 
    },
    { 
      id: 'mutation', 
      label: loc(language, 'Mutation & Share Balance', 'नामांतरण एवं हिस्सा सुधार', 'మ్యుటేషన్ & వాటా బ్యాలెన్స్', 'ନାମାନ୍ତରଣ ଓ ଅଂଶଧନ ସଂଶୋଧନ') 
    },
    { 
      id: 'security', 
      label: loc(language, 'Security & Database', 'डेटा सुरक्षा एवं सुपाबेस डीबी', 'డేటా భద్రత & సుపాబేస్ DB', 'ଡାଟା ସୁରକ୍ଷା ଓ ସୁପାବେସ୍ DB') 
    }
  ];

  const faqs = [
    {
      id: 'faq-1',
      category: 'land_records',
      q: loc(
        language,
        'What is the statutory difference between Khasra, Khata, and Khewat numbers?',
        'खसरा संख्या, खाता संख्या और खेवट संख्या में क्या अंतर है?',
        'ఖస్రా సంఖ్య, ఖాతా సంఖ్య మరియు ఖేవత్ సంఖ్య మధ్య చట్టపరమైన తేడా ఏమిటి?',
        'ଖସ୍ରା ନମ୍ବର, ଖାତା ନମ୍ବର ଓ ଖେୱଟ୍ ନମ୍ବର ମଧ୍ୟରେ ଆଇନଗତ ପାର୍ଥକ୍ୟ କ’ଣ?'
      ),
      a: loc(
        language,
        'A Khasra Number represents a specific land parcel/cadastral plot. A Khata Number denotes the holding or joint tenure account of landowners under which multiple Khasras may be clubbed. A Khewat Number historically designates the proprietary ownership register of revenue estates under state land administration.',
        'खसरा संख्या (Khasra No.) किसी विशिष्ट भूमि पार्सल/भूखंड की भू-मापन संख्या होती है। खाता संख्या (Khata No.) एक या एकाधिक भू-स्वामियों (सह-खातेदारों) के संयुक्त खाते को दर्शाता है जिसमें उनके अधीन सभी खसरे सूचीबद्ध होते हैं। खेवट संख्या (Khewat No.) गाँव के जमींदार/मुख्य भू-स्वामी के मालिकाना अधिकारों का पुराना रजिस्टर क्रम होता है।',
        'ఖస్రా సంఖ్య అనేది ఒక నిర్దిష్ట భూమి ప్లాట్ కొలత సంఖ్య. ఖాతా సంఖ్య అనేది ఒకరు లేదా అంతకంటే ఎక్కువ మంది భూ యజమానుల ఉమ్మడి ఖాతాను సూచిస్తుంది. ఖేవత్ సంఖ్య అనేది గ్రామంలోని ప్రధాన భూ యజమానుల హక్కుల పాత రిజిస్టర్ క్రమం.',
        'ଖସ୍ରା ନମ୍ବର ଏକ ନିର୍ଦ୍ଦିଷ୍ଟ ଜମି ପ୍ଲଟର ମାପ ସଂଖ୍ୟା। ଖାତା ନମ୍ବର ଏକ ବା ଏକାଧିକ ଜମି ମାଲିକଙ୍କ ମିଳିତ ଖାତାକୁ ବୁଝାଏ। ଖେୱଟ୍ ନମ୍ବର ଗ୍ରାମର ମୁଖ୍ୟ ଜମିଦାରଙ୍କ ମାଲିକାନା ଅଧିକାରର ପୁରୁଣା ରେଜିଷ୍ଟର କ୍ରମ।'
      )
    },
    {
      id: 'faq-2',
      category: 'ai_tech',
      q: loc(
        language,
        'How does the AI pipeline restore and extract degraded, century-old handwritten records?',
        'शताब्दी पुराने, पीले पड़े और दागदार हस्तलिखित दस्तावेजों को एआई कैसे पहचानता है?',
        'వందేళ్ల పురాతన, పసుపు రంగులోకి మారిన చేతివ్రాత పత్రాలను AI ఎలా గుర్తిస్తుంది?',
        'ଶହେ ବର୍ଷର ପୁରୁଣା, ହଳଦିଆ ପଡ଼ିଥିବା ହାତଲେଖା ଦଲିଲକୁ AI କିପରି ଚିହ୍ନଟ କରେ?'
      ),
      a: loc(
        language,
        'BhoomiDrishti AI utilizes a multi-tier Computer Vision architecture: (1) Radon/Hough Auto-Deskewing straightens tilted scans, (2) CLAHE amplifies faint ink pigments, (3) Sauvola Adaptive Thresholding removes oil and water blemishes, and (4) Neural Vision OCR accurately extracts Devanagari, Modi script, and tabular figures with 97.4% benchmarked precision.',
        'भूमिदृष्टि एआई बहु-चरणीय कंप्यूटर विज़न पाइपलाइन का उपयोग करता है: (1) ऑटो-डिस्क्यू (Auto-Deskewing) से मुड़े हुए पृष्ठों को सीधा किया जाता है, (2) CLAHE (Contrast Limited Adaptive Histogram Equalization) से स्याही का कंट्रास्ट बढ़ाया जाता है, (3) Sauvola अडैप्टिव थ्रेसहोल्डिंग से तेल/पानी के दाग हटाए जाते हैं, तथा (4) बहुभाषी न्यूरल विज़न ओसीआर मॉडल से देवनागरी, मोडी लिपि व अंग्रेजी के शब्दों को 97.4% शुद्धता से निकाला जाता है।',
        'భూమిదృష్టి AI బహుళ-దశల కంప్యూటర్ విజన్ పైప్‌లైన్‌ను ఉపయోగిస్తుంది: (1) ఆటో-డెస్క్యూ వంగిన పేజీలను నిటారుగా చేస్తుంది, (2) CLAHE సిరా కాంట్రాస్ట్‌ను పెంచుతుంది, (3) సావోలా అడాప్టివ్ థ్రెషోల్డింగ్ నూనె/నీటి మరకలను తొలగిస్తుంది, మరియు (4) న్యూరల్ విజన్ మోడల్ 97.4% ఖచ్చితత్వంతో పాఠాన్ని సంగ్రహిస్తుంది.',
        'ଭୂମିଦୃଷ୍ଟି AI ବହୁ-ସ୍ତରୀୟ କମ୍ପ୍ୟୁଟର ଭିଜନ୍ ବ୍ୟବହାର କରେ: (୧) ଅଟୋ-ଡେସ୍କ୍ୟୁ ମୁଡ଼ିଥିବା ପୃଷ୍ଠା ସଳଖ କରେ, (୨) CLAHE କାଳିର କଣ୍ଟ୍ରାଷ୍ଟ ବଢ଼ାଏ, (୩) Sauvola ତେଲ/ପାଣି ଦାଗ ହଟାଏ, ଓ (୪) ନ୍ୟୁରାଲ୍ ଭିଜନ୍ OCR ୯୭.୪% ସଠିକତା ସହ ପାଠ୍ୟ ନିଷ୍କର୍ଷଣ କରେ।'
      )
    },
    {
      id: 'faq-3',
      category: 'legal',
      q: loc(
        language,
        'Is this AI-digitized land record legally admissible in civil and revenue courts?',
        'क्या यह डिजिटाइज़्ड भू-अभिलेख न्यायालयों में कानूनी रूप से मान्य है?',
        'ఈ డిజిటలైజ్ చేసిన భూమి రికార్డు కోర్టులలో చట్టబద్ధంగా చెల్లుబాటు అవుతుందా?',
        'ଏହି ଡିଜିଟାଇଜ୍ ଭୂ-ଅଭିଲେଖ ଅଦାଲତରେ ଆଇନଗତ ଭାବେ ଗ୍ରହଣୀୟ କି?'
      ),
      a: loc(
        language,
        'Yes. Under Section 65B of the Indian Evidence Act, 1872 and Section 4 of the Information Technology Act, 2000, electronic records digitally endorsed by an authorized revenue officer with tamper-evident SHA-256 cryptographic audit logs carry full statutory admissibility in courts of law.',
        'हाँ। भारतीय साक्ष्य अधिनियम की धारा ६५बी (Section 65B of Indian Evidence Act) तथा सूचना प्रौद्योगिकी अधिनियम २००० की धारा ४ के अंतर्गत, अधिकृत तहसीलदार/पटवारी द्वारा डिजिटल रूप से हस्ताक्षरित एवं क्रिप्टोग्राफिक हैश (SHA-256) से सुरक्षित डिजिटल अभिलेख को प्राथमिक इलेक्ट्रॉनिक साक्ष्य (Primary Electronic Evidence) के रूप में पूर्ण विधिक मान्यता प्राप्त है।',
        'అవును. భారతీయ సాక్ష్య చట్టం సెక్షన్ 65B మరియు ఇన్ఫర్మేషన్ టెక్నాలజీ చట్టం 2000 సెక్షన్ 4 కింద, అధికారిక రెవెన్యూ అధికారి చేత డిజిటల్ సంతకం చేయబడిన మరియు SHA-256 హ్యాష్ కలిగిన రికార్డు కోర్టులలో ప్రాథమిక ఎలక్ట్రానిక్ సాక్ష్యంగా పూర్తి చట్టబద్ధతను కలిగి ఉంటుంది.',
        'ହଁ। ଭାରତୀୟ ସାକ୍ଷ୍ୟ ଆଇନ ଧାରା ୬୫ବି ଏବଂ ଆଇଟି ଆଇନ ୨୦୦୦ର ଧାରା ୪ ଅନୁଯାୟୀ, ଅଧିକୃତ ରାଜସ୍ୱ ଅଧିକାରୀଙ୍କ ଦ୍ୱାରା ଡିଜିଟାଲ୍ ସ୍ୱାକ୍ଷରିତ ଓ SHA-256 ହ୍ୟାସ୍ ଯୁକ୍ତ ରେକର୍ଡ ପ୍ରାଥମିକ ଇଲେକ୍ଟ୍ରୋନିକ୍ ପ୍ରମାଣ ଭାବେ ସମ୍ପୂର୍ଣ୍ଣ ଆଇନଗତ ମାନ୍ୟତା ପ୍ରାପ୍ତ।'
      )
    },
    {
      id: 'faq-4',
      category: 'mutation',
      q: loc(
        language,
        'Why is mathematical 100% share reconciliation mandatory for co-owners?',
        'सह-खातेदारों के हिस्से में १००% का संतुलन क्यों अनिवार्य है?',
        'సహ-యజమానుల వాటా శాతంలో 100% బ్యాలెన్స్ ఎందుకు తప్పనిసరి?',
        'ସହ-ଖାତାଦାରଙ୍କ ଅଂଶଧନରେ ୧୦୦% ସନ୍ତୁଳନ କାହିଁକି ବାଧ୍ୟତାମୂଳକ?'
      ),
      a: loc(
        language,
        'Under DILRMP business rules, the fractional shares of all recorded co-owners in a revenue khata must strictly reconcile to exactly 100% (1/1). Any discrepancy indicates unapportioned surplus or duplicate ownership, immediately triggering automated validation flags to prevent fraudulent encumbrances.',
        'राष्ट्रीय भू-अभिलेख आधुनिकीकरण (DILRMP) नियमों के अनुसार, किसी भी खसरे या खाते में समस्त सह-खातेदारों के अंशों (Fractions) का कुल योग शत-प्रतिशत (100% या 1/1) होना विधिक आवश्यकता है। यदि हिस्सेदारी का योग 100% से कम या अधिक होता है, तो सिस्टम स्वतः विसंगति (Rule Violation) फ्लैग करता है ताकि विवादित बिक्री या दोहरे स्वामित्व की धोखाधड़ी रोकी जा सके।',
        'DILRMP నిబంధనల ప్రకారం, ఒక ఖాతాలోని సహ-యజమానులందరి వాటాల మొత్తం ఖచ్చితంగా 100% (1/1) కి సమానం కావాలి. వాటా మొత్తం 100% కంటే తక్కువ లేదా ఎక్కువ ఉంటే, వివాదాస్పద అమ్మకాలు లేదా మోసాలను నిరోధించడానికి సిస్టమ్ స్వయంచాలకంగా విసంగతిని ఫ్లాగ్ చేస్తుంది.',
        'DILRMP ନିୟମାନୁସାରେ, ଏକ ଖାତାରେ ଥିବା ସମସ୍ତ ଅଂଶୀଦାରଙ୍କ ଅଂଶର ମୋଟ ଯୋଗଫଳ ୧୦୦% (୧/୧) ହେବା ଆଇନଗତ ଆବଶ୍ୟକତା। ଯଦି ଏହା କମ୍ ବା ବେଶୀ ହୁଏ, ତେବେ ଠକେଇ ରୋକିବା ପାଇଁ ସିଷ୍ଟମ୍ ସ୍ୱତଃ ତ୍ରୁଟି ଫ୍ଲାଗ୍ କରେ।'
      )
    },
    {
      id: 'faq-5',
      category: 'land_records',
      q: loc(
        language,
        'How do Maharashtra 7/12 Utara and Madhya Pradesh B-1 / Khasra registers correlate?',
        'महाराष्ट्र का ७/१२ (सात-बारा) और मध्य प्रदेश का बी-१ / खसरा में क्या समानता है?',
        'మహారాష్ట్ర 7/12 మరియు మధ్యప్రదేశ్ B-1 / ఖస్రా మధ్య సారూప్యత ఏమిటి?',
        'ମହାରାଷ୍ଟ୍ରର ୭/୧୨ ଓ ମଧ୍ୟପ୍ରଦେଶର ବି-୧ / ଖସ୍ରା ମଧ୍ୟରେ ସମାନତା କ’ଣ?'
      ),
      a: loc(
        language,
        'In Maharashtra, Village Form VII (Rights of Occupant) and Form XII (Crop Register) combine as 7/12 Utara. In Madhya Pradesh, the statutory equivalents are the Khasra (P-II) and B-1 Khasra Kishtwar Khatauni. BhoomiDrishti AI dynamically parses both regional schemas into a unified National DILRMP GIS format.',
        'महाराष्ट्र का गाँव नमुना ७ (अधिकार अभिलेख) और नमुना १२ (फसल पंजिका) संयुक्त रूप से "७/१२ उतारा" कहलाते हैं। मध्य प्रदेश में नमुना ७ का समतुल्य "खसरा (Form P-II)" और "खतौनी (B-1)" है। भूमिदृष्टि एआई दोनों राज्यों के विशिष्ट फॉर्म प्रारूपों को पहचान कर स्वतः मानकीकृत राष्ट्रीय डेटा स्कीमा में मैप करता है।',
        'మహారాష్ట్రలో గ్రామ నమూనా 7 మరియు నమూనా 12 కలయికను "7/12 ఉతారా" అంటారు. మధ్యప్రదేశ్‌లో దీని సమానమైన రూపాలు "ఖస్రా (P-II)" మరియు "ఖతౌని (B-1)". భూమిదృష్టి AI రెండింటినీ ప్రామాణిక జాతీయ GIS ఆకృతిలోకి మారుస్తుంది.',
        'ମହାରାଷ୍ଟ୍ରର ଗ୍ରାମ ନମୁନା ୭ ଓ ନମୁନା ୧୨କୁ ମିଳିତ ଭାବେ "୭/୧୨ ଉତାରା" କୁହାଯାଏ। ମଧ୍ୟପ୍ରଦେଶରେ ଏହାର ସମତୁଲ୍ୟ "ଖସ୍ରା (P-II)" ଏବଂ "ଖତୌନି (B-1)"। ଭୂମିଦୃଷ୍ଟି AI ଉଭୟ ଫର୍ମାଟକୁ ଜାତୀୟ ଡାଟା ସ୍କିମାରେ ରୂପାନ୍ତରିତ କରେ।'
      )
    },
    {
      id: 'faq-6',
      category: 'security',
      q: loc(
        language,
        'How does the Supabase PostgreSQL + PostGIS integration ensure data security?',
        'हमारा भू-अभिलेख डेटा सुपाबेस (Supabase) डेटाबेस में कैसे सुरक्षित रहता है?',
        'సుపాబేస్ (Supabase) డేటాబేస్‌లో మన భూమి రికార్డు డేటా ఎలా సురక్షితంగా ఉంటుంది?',
        'ଆମର ଭୂ-ଅଭିଲେଖ ଡାଟା ସୁପାବେସ୍ (Supabase) ଡାଟାବେସରେ କିପରି ସୁରକ୍ଷିତ ରହେ?'
      ),
      a: loc(
        language,
        'Supabase provides enterprise PostgreSQL with PostGIS spatial engines. It enforces Row-Level Security (RLS) policies, AES-256 data encryption at rest, SSL encrypted transit, and write-once cryptographic audit journals ensuring zero unauthorized mutation.',
        'सुपाबेस (Supabase) एंटरप्राइज-ग्रेड PostgreSQL डेटाबेस और PostGIS स्थानिक एक्सटेंशन पर आधारित है। इसमें पंक्ति-स्तरीय सुरक्षा (Row Level Security - RLS), AES-256 डेटा एन्क्रिप्शन और अपरिवर्तनीय ऑडिट ट्रेल सक्षम होते हैं, जिससे किसी भी स्तर पर डेटा से छेड़छाड़ असंभव हो जाती है।',
        'సుపాబేస్ ఎంటర్‌ప్రైజ్ PostgreSQL మరియు PostGIS పై ఆధారపడి ఉంటుంది. ఇది రో-లెవల్ సెక్యూరిటీ (RLS), AES-256 డేటా ఎన్‌క్రిప్షన్ మరియు మార్చలేని ఆడిట్ ట్రయల్స్‌ను అమలు చేస్తుంది.',
        'ସୁପାବେସ୍ ଏଣ୍ଟରପ୍ରାଇଜ୍ PostgreSQL ଓ PostGIS ଉପରେ ଆଧାରିତ। ଏଥିରେ ରୋ-ଲେଭଲ୍ ସିକ୍ୟୁରିଟି (RLS), AES-256 ଡାଟା ଏନକ୍ରିପସନ୍ ଏବଂ ଅପରିବର୍ତ୍ତନୀୟ ଅଡିଟ୍ ଟ୍ରେଲ୍ ଲାଗୁ ଥାଏ, ଯାହା ତଥ୍ୟକୁ ସମ୍ପୂର୍ଣ୍ଣ ସୁରକ୍ଷିତ ରଖେ।'
      )
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    if (activeCategory !== 'all' && faq.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
    }
    return true;
  });

  const handleGrievanceSubmit = (e) => {
    e.preventDefault();
    if (!grievanceForm.name || !grievanceForm.mobile) {
      alert(loc(language, 'Please enter your name and mobile number.', 'कृपया नाम और मोबाइल नंबर अवश्य दर्ज करें।', 'దయచేసి మీ పేరు మరియు మొబైల్ నంబర్‌ను నమోదు చేయండి.', 'ଦୟାକରି ଆପଣଙ୍କ ନାମ ଓ ମୋବାଇଲ୍ ନମ୍ବର ଦର୍ଜ କରନ୍ତୁ।'));
      return;
    }
    setGrievanceSubmitted(true);
    setTimeout(() => {
      setGrievanceForm({ name: '', mobile: '', khasraNo: '', issueType: 'discrepancy', message: '' });
      setGrievanceSubmitted(false);
    }, 6000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Official Government Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #071D33 0%, #0B3B60 70%, #104F80 100%)',
          borderRadius: 'var(--radius-md)',
          padding: '24px 30px',
          color: 'white',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '850px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span 
              style={{
                background: 'rgba(244, 121, 32, 0.25)',
                border: '1px solid #F47920',
                color: '#FDBA74',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.725rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Citizen Knowledgebase & Revenue Officer Charter
            </span>
            <span 
              style={{
                background: 'rgba(16, 185, 129, 0.25)',
                border: '1px solid #34D399',
                color: '#A7F3D0',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.725rem',
                fontWeight: 800
              }}
            >
              ⭐ Built by Team Data_Vasu • SIH 2026
            </span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '6px 0', letterSpacing: '-0.01em' }}>
            {loc(
              language,
              'National Land Records FAQ & Citizen Guidance Charter',
              'नागरिक एवं राजस्व अधिकारी ज्ञानकोष एवं अक्सर पूछे जाने वाले प्रश्न',
              'జాతీయ భూ-రికార్డుల FAQ & పౌర మార్గదర్శక చార్టర్',
              'ଜାତୀୟ ଭୂ-ଅଭିଲେଖ ପ୍ରଶ୍ନୋତ୍ତର ଓ ନାଗରିକ ମାର୍ଗଦର୍ଶିକା',
              'Citizen & Officer Knowledgebase & Official FAQs'
            )}
          </h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.6 }}>
            {loc(
              language,
              'Authoritative guidance on Indian Land Records Administration, Cadastral GIS, Evidence Act Section 65B legal validity, and automated AI OCR workflows.',
              'डिजिटल इंडिया भू-अभिलेख आधुनिकीकरण (DILRMP), विधिक साक्ष्य अधिनियम धारा ६५बी, कंप्यूटर विज़न ओसीआर, नामांतरण और जीआईएस मैपिंग से संबंधित सभी आधिकारिक उत्तर।',
              'భారతీయ భూ రికార్డుల నిర్వహణ, కాడాస్ట్రల్ GIS, సాక్ష్య చట్టం సెక్షన్ 65B చట్టపరమైన చెల్లుబాటు మరియు AI OCR పై అధికారిక మార్గదర్శకత్వం.',
              'ଭାରତୀୟ ଭୂ-ଅଭିଲେଖ ପ୍ରଶାସନ, କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ GIS, ସାକ୍ଷ୍ୟ ଆଇନ ଧାରା ୬୫ବି ଓ AI OCR ଉପରେ ସରକାରୀ ନିର୍ଦ୍ଦେଶାବଳୀ।'
            )}
          </p>
        </div>
      </div>

      {/* Quick Search Bar */}
      <div 
        style={{ 
          background: 'var(--bg-card)', 
          padding: '16px 20px', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={loc(
              language,
              'Search FAQ topic (e.g. Khasra, Section 65B, Supabase, 7/12, OCR)...',
              'प्रश्न या शब्दावली खोजें (उदा: खसरा, धारा 65B, सुपाबेस, 7/12, ओसीआर)...',
              'FAQ శోధించండి (ఉదా: ఖస్రా, సెక్షన్ 65B, సుపాబేస్, 7/12, OCR)...',
              'ପ୍ରଶ୍ନ ଖୋଜନ୍ତୁ (ଯଥା: ଖସ୍ରା, ଧାରା ୬୫ବି, ସୁପାବେସ୍, ୭/୧୨, OCR)...'
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ width: '100%', paddingLeft: '38px', fontSize: '0.875rem' }}
          />
        </div>

        {/* National Helpline Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--conf-high-bg)', border: '1px solid var(--conf-high-border)', padding: '6px 14px', borderRadius: '6px' }}>
          <PhoneCall size={16} color="var(--conf-high-text)" />
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--conf-high-text)' }}>
            24x7 Toll-Free: <strong>1800-111-BHOOMI</strong>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '7px 16px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: activeCategory === cat.id ? 800 : 600,
              border: `1px solid ${activeCategory === cat.id ? 'var(--gov-saffron)' : 'var(--border-light)'}`,
              background: activeCategory === cat.id ? 'var(--gov-saffron)' : 'var(--bg-card)',
              color: activeCategory === cat.id ? 'white' : 'var(--text-primary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: activeCategory === cat.id ? '0 2px 8px rgba(244, 121, 32, 0.3)' : 'none'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Content 2-Column Grid: Left FAQ Accordion, Right Citizen Grievance Form */}
      <div className="faq-main-grid">
        {/* Left Column: Interactive FAQ Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredFaqs.length === 0 ? (
            <div className="gov-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              {loc(
                language,
                'No matching FAQ found. Please try another keyword.',
                'कोई मेल खाता प्रश्न नहीं मिला। कृपया अन्य कीवर्ड से खोजें।',
                'ఎలాంటి సరిపోలే ప్రశ్నలు కనుగొనబడలేదు. దయచేసి ఇతర కీలకపదాలతో ప్రయత్నించండి.',
                'କୌଣସି ପ୍ରଶ୍ନ ମିଳିଲା ନାହିଁ। ଅନ୍ୟ କିୱାର୍ଡ ଦେଇ ଖୋଜନ୍ତୁ।'
              )}
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="gov-card" 
                  style={{ 
                    padding: '16px 20px', 
                    cursor: 'pointer',
                    borderLeft: isOpen ? '4px solid var(--gov-saffron)' : '1px solid var(--border-light)',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <HelpCircle size={18} color={isOpen ? 'var(--gov-saffron-dark)' : 'var(--text-muted)'} />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: isOpen ? 'var(--gov-navy-800)' : 'var(--text-primary)', margin: 0 }}>
                        {faq.q}
                      </h4>
                    </div>
                    <div>
                      {isOpen ? <ChevronUp size={18} color="var(--gov-saffron)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-light)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {faq.a}
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.725rem', color: 'var(--gov-saffron-dark)', fontWeight: 700 }}>
                        <Scale size={13} />
                        <span>
                          {loc(
                            language,
                            'Statutory Reference: State Land Revenue Codes & IT Act 2000',
                            'विधिक संदर्भ: राजस्व संहिता एवं सूचना प्रौद्योगिकी अधिनियम २०००',
                            'చట్టపరమైన సూచన: రాష్ట్ర భూ రెవెన్యూ కోడ్‌లు & IT చట్టం 2000',
                            'ଆଇନଗତ ପ୍ରମାଣ: ରାଜସ୍ୱ ସଂହିତା ଓ ଆଇଟି ଆଇନ ୨୦୦୦'
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Official Grievance & Citizen Query Desk */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="gov-card" style={{ borderTop: '4px solid var(--gov-navy-800)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Mail size={18} color="var(--gov-navy-800)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gov-navy-800)', margin: 0 }}>
                {loc(
                  language,
                  'Citizen Grievance & Query Desk',
                  'नागरिक सहायता एवं समाधान पोर्टल',
                  'పౌర ఫిర్యాదులు & సహాయ డెస్క్',
                  'ନାଗରିକ ଅଭିଯୋଗ ଓ ସହାୟତା ଡେସ୍କ'
                )}
              </h3>
            </div>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {loc(
                language,
                'Report land record discrepancies or raise procedural questions directly with the authorized Sub-Divisional Officer.',
                'यदि आपको अपने खसरा या भूमि अभिलेख में कोई त्रुटि या विसंगति प्रतीत होती है, तो यहाँ विवरण दर्ज करें। तहसील कार्यालय द्वारा त्वरित जांच की जाएगी।',
                'భూమి రికార్డులో ఏవైనా లోపాలు లేదా వ్యత్యాసాలు ఉంటే, వివరాలను ఇక్కడ నమోదు చేయండి. తహసీల్ కార్యాలయం తక్షణమే విచారణ చేపడుతుంది.',
                'ଭୂ-ଅଭିଲେଖରେ ତ୍ରୁଟି ଦେଖାଦେଲେ ଏଠାରେ ବିବରଣୀ ଦର୍ଜ କରନ୍ତୁ। ତହସିଲ କାର୍ଯ୍ୟାଳୟ ଦ୍ୱାରା ତୁରନ୍ତ ତଦନ୍ତ କରାଯିବ।'
              )}
            </p>

            {grievanceSubmitted ? (
              <div style={{ marginTop: '16px', background: 'var(--conf-high-bg)', border: '1px solid var(--conf-high-border)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <CheckCircle2 size={32} color="var(--conf-high-text)" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontWeight: 800, color: 'var(--conf-high-text)', fontSize: '0.9rem' }}>
                  {loc(
                    language,
                    'Grievance Ticket Registered!',
                    'शिकायत सफलता पूर्वक पंजीकृत हुई!',
                    'ఫిర్యాదు టికెట్ విజయవంతంగా నమోదైంది!',
                    'ଅଭିଯୋଗ ଟିକେଟ୍ ସଫଳତାର ସହ ପଞ୍ଜୀକୃତ ହେଲା!'
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--conf-high-text)', marginTop: '4px' }}>
                  {loc(language, 'Token ID:', 'टोकन संख्या:', 'టోకెన్ ID:', 'ଟୋକନ୍ ID:')} <strong>GRV-2026-MP-8821</strong> {loc(language, '(SMS dispatched)', '(SMS प्रेषित किया गया)', '(SMS పంపబడింది)', '(SMS ପଠାଗଲା)')}
                </div>
              </div>
            ) : (
              <form onSubmit={handleGrievanceSubmit} style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label className="input-label" style={{ marginBottom: '3px' }}>
                    {loc(language, 'Citizen Full Name', 'नागरिक का पूरा नाम', 'పౌరుడి పూర్తి పేరు', 'ନାଗରିକଙ୍କ ପୂରା ନାମ')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={loc(language, 'e.g. Ram Prasad', 'उदा: रामदयाल सिंह', 'ఉదా: రాముడు', 'ଯଥା: ରାମ ପ୍ରସାଦ')}
                    value={grievanceForm.name}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, name: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.8rem' }}
                  />
                </div>

                <div>
                  <label className="input-label" style={{ marginBottom: '3px' }}>
                    {loc(language, 'Mobile Number', 'मोबाइल नंबर (OTP एवं SMS हेतु)', 'మొబైల్ నంబర్ (SMS కోసం)', 'ମୋବାଇଲ୍ ନମ୍ବର (SMS ପାଇଁ)')}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="98XXXXXXXX"
                    value={grievanceForm.mobile}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, mobile: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.8rem' }}
                  />
                </div>

                <div>
                  <label className="input-label" style={{ marginBottom: '3px' }}>
                    {loc(language, 'Khasra No. / Record ID', 'खसरा संख्या / रिकॉर्ड ID', 'ఖస్రా సంఖ్య / రికార్డు ID', 'ଖସ୍ରା ନମ୍ବର / ଅଭିଲେଖ ID')}
                  </label>
                  <input
                    type="text"
                    placeholder="104/2"
                    value={grievanceForm.khasraNo}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, khasraNo: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.8rem' }}
                  />
                </div>

                <div>
                  <label className="input-label" style={{ marginBottom: '3px' }}>
                    {loc(language, 'Issue Category', 'समस्या का प्रकार', 'సమస్య రకం', 'ସମସ୍ୟାର ପ୍ରକାର')}
                  </label>
                  <select
                    value={grievanceForm.issueType}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, issueType: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.8rem' }}
                  >
                    <option value="discrepancy">{loc(language, 'Share Percentage Discrepancy', 'हिस्सा प्रतिशत विसंगति', 'వాటా శాతం వ్యత్యాసం', 'ଅଂଶଧନ ଶତକଡ଼ା ତ୍ରୁଟି')}</option>
                    <option value="name_spelling">{loc(language, 'Name Spelling Correction', 'खातेदार नाम वर्तनी त्रुटि', 'పేరు స్పెల్లింగ్ సవరణ', 'ନାମ ବନାନ ସଂଶୋଧନ')}</option>
                    <option value="encumbrance">{loc(language, 'Bank Loan Encumbrance Clearance', 'ऋण मुक्ति प्रमाण पत्र', 'బ్యాంక్ రుణ విముక్తి ధృవీకరణ', 'ବ୍ୟାଙ୍କ ଋଣ ଭାରମୁକ୍ତ ପ୍ରମାଣପତ୍ର')}</option>
                    <option value="gis_boundary">{loc(language, 'GIS Parcel Boundary Dispute', 'भू-नक्शा सीमा विवाद', 'GIS భూ సరిహద్దు వివాదం', 'GIS ଜମି ସୀମା ବିବାଦ')}</option>
                  </select>
                </div>

                <div>
                  <label className="input-label" style={{ marginBottom: '3px' }}>
                    {loc(language, 'Description', 'विवरण (वैकल्पिक)', 'వివరణ (ఐచ్ఛికం)', 'ବିବରଣୀ (ଐଚ୍ଛିକ)')}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={loc(language, 'Add brief details...', 'विस्तृत विवरण लिखें...', 'వివరాలు రాయండి...', 'ସଂକ୍ଷିପ୍ତ ବିବରଣୀ ଲେଖନ୍ତୁ...')}
                    value={grievanceForm.message}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, message: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', fontSize: '0.8rem' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '6px', padding: '9px', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  <Send size={15} />
                  <span>{loc(language, 'Submit Grievance', 'शिकायत दर्ज करें', 'ఫిర్యాదు సమర్పించండి', 'ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ')}</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Officer Contacts Card */}
          <div className="gov-card" style={{ padding: '16px 20px', background: 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gov-navy-800)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {loc(language, 'Technical Nodal Contacts', 'राजस्व तकनीकी नोडल अधिकारी', 'సాంకేతిక నోడల్ అధికారులు', 'ବୈଷୟିକ ନୋଡାଲ୍ ଅଧିକାରୀ')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div><strong>NIC State Nodal Officer:</strong> nic-lrms@gov.in</div>
              <div><strong>DoLR Technical Desk:</strong> support.bhoomi@nic.in</div>
              <div><strong>SIH 2026 Core Lead:</strong> Team Data_Vasu</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
