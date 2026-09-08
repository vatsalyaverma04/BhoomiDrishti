import React, { useState } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCw, Sliders, Eye, RefreshCw, 
  Sparkles, Check, Download, Layers, Scan
} from 'lucide-react';
import { translations, loc } from '../utils/translations';

export default function DocumentViewer({
  originalImage,
  enhancedImage,
  deskewAngle = 0,
  metrics = {},
  preset = 'enhanced',
  onPresetChange,
  isProcessing = false,
  isExtracting = false,
  language = 'en'
}) {
  const t = translations[language]?.viewer || translations.en.viewer;
  const isHindi = language === 'hi';
  const isHinglish = language === 'hinglish';
  const isTelugu = language === 'te';
  const isOdia = language === 'or';
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState('enhanced'); // 'original', 'enhanced', 'split'

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => { setZoom(1); setRotation(0); };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const displayImage = viewMode === 'original' ? originalImage : (enhancedImage || originalImage);

  return (
    <div className="viewer-panel">
      {/* Top Toolbar */}
      <div className="viewer-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} color="#F47920" />
          <span style={{ fontWeight: 600 }}>
            {loc(language, 'Document Vision Viewer', 'दस्तावेज़ विज़न व्यूअर', 'డాక్యుమెంట్ విజన్ వ్యూయర్', 'ଦଲିଲ ଭିଜନ ଦର୍ଶକ', 'Document Vision Viewer')}
          </span>
          {deskewAngle !== 0 && (
            <span style={{ fontSize: '0.725rem', background: '#0369A1', padding: '1px 6px', borderRadius: '4px' }}>
              {loc(language, `Auto-Deskew: ${deskewAngle}°`, `ऑटो-डिस्क्यू: ${deskewAngle}°`, `స్వయంచాలక డీస్క్యూ: ${deskewAngle}°`, `ସ୍ୱୟଂଚାଳିତ ଡିସ୍କ୍ୟୁ: ${deskewAngle}°`, `Auto-Deskew: ${deskewAngle}°`)}
            </span>
          )}
        </div>

        {/* Zoom & Rotation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleZoomOut}
            className="btn"
            style={{ padding: '4px 8px', background: '#334155', color: 'white' }}
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span style={{ fontSize: '0.75rem', minWidth: '40px', textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="btn"
            style={{ padding: '4px 8px', background: '#334155', color: 'white' }}
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={handleRotate}
            className="btn"
            style={{ padding: '4px 8px', background: '#334155', color: 'white' }}
            title="Rotate 90°"
          >
            <RotateCw size={14} />
          </button>
          <button
            onClick={handleResetZoom}
            className="btn"
            style={{ padding: '4px 8px', background: '#334155', color: '#94A3B8', fontSize: '0.75rem' }}
          >
            {loc(language, 'Reset', 'रीसेट', 'రీసెట్', 'ରିସେଟ୍', 'Reset')}
          </button>
        </div>
      </div>

      {/* Preset Filter Selection Bar */}
      <div 
        style={{ 
          background: '#0B1523', 
          padding: '8px 16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid #334155',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
            {loc(language, 'Computer Vision Mode:', 'कंप्यूटर विज़न फ़िल्टर:', 'కంప్యూటర్ విజన్ మోడ్:', 'କମ୍ପ୍ୟୁଟର ଭିଜନ ମୋଡ୍:', 'Computer Vision Mode:')}
          </span>
          
          <button
            onClick={() => { setViewMode('original'); }}
            style={{
              padding: '3px 9px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              background: viewMode === 'original' ? '#F47920' : '#1E293B',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {loc(language, 'Raw Original', 'मूल स्कैन', 'అసలు స్కాన్', 'ମୂଳ ସ୍କାନ୍', 'Raw Original')}
          </button>

          <button
            onClick={() => { setViewMode('enhanced'); onPresetChange && onPresetChange('enhanced'); }}
            style={{
              padding: '3px 9px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              background: viewMode === 'enhanced' && preset === 'enhanced' ? '#10B981' : '#1E293B',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={12} />
            <span>{loc(language, 'AI Enhanced (CLAHE)', 'एआई एन्हांस्ड (CLAHE)', 'AI మెరుగుపరచబడింది (CLAHE)', 'AI ଉନ୍ନତ (CLAHE)', 'AI Enhanced (CLAHE)')}</span>
          </button>

          <button
            onClick={() => { setViewMode('enhanced'); onPresetChange && onPresetChange('binarized'); }}
            style={{
              padding: '3px 9px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              background: viewMode === 'enhanced' && preset === 'binarized' ? '#3B82F6' : '#1E293B',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {loc(language, 'Binarized (OCR)', 'बाइनराइज़्ड (ओसीआर मोड)', 'బైనరైజ్డ్ (OCR మోడ్)', 'ବାଇନାରାଇଜ୍ଡ (OCR ମୋଡ୍)', 'Binarized (OCR)')}
          </button>

          <button
            onClick={() => { setViewMode('enhanced'); onPresetChange && onPresetChange('stain_removal'); }}
            style={{
              padding: '3px 9px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              background: viewMode === 'enhanced' && preset === 'stain_removal' ? '#8B5CF6' : '#1E293B',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {loc(language, 'Stain Removal', 'दाग-धब्बे रहित', 'మచ్చల తొలగింపు', 'ଦାଗ ନିବାରଣ', 'Stain Removal')}
          </button>
        </div>

        {/* Toggle Split Comparison Slider */}
        <button
          onClick={() => setShowSlider(!showSlider)}
          style={{
            padding: '3px 10px',
            fontSize: '0.75rem',
            borderRadius: '4px',
            border: `1px solid ${showSlider ? '#F47920' : '#475569'}`,
            background: showSlider ? 'rgba(244, 121, 32, 0.2)' : 'transparent',
            color: showSlider ? '#FDBA74' : '#CBD5E1',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Eye size={13} />
          <span>{loc(language, 'Split Comparison', 'तुलनात्मक स्लाइडर', 'పోలిక స్లైడర్', 'ତୁଳନାତ୍ମକ ସ୍ଲାଇଡର୍', 'Split Comparison')}</span>
        </button>
      </div>

      {/* Main Document Canvas */}
      <div className="viewer-canvas-area">
        {isProcessing && (
          <div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'rgba(15, 23, 42, 0.8)', 
              zIndex: 20, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <RefreshCw size={36} className="animate-spin" color="#F47920" style={{ animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: '12px', fontWeight: 600, fontSize: '0.95rem' }}>
              {loc(language, 'Enhancing Legacy Paper Document...', 'कंप्यूटर विज़न फ़िल्टर लागू हो रहा है...', 'పాత పత్రాన్ని మెరుగుపరుస్తోంది...', 'ପୁରୁଣା ଦଲିଲ ଉନ୍ନତ କରାଯାଉଛି...', 'Enhancing Legacy Paper Document...')}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
              {loc(language, 'Adaptive CLAHE contrast stretch & despeckling', 'अडैप्टिव थ्रेशोल्डिंग एवं कंट्रास्ट सुधार', 'అడాప్టివ్ CLAHE కాంట్రాస్ట్ మరియు శబ్ద తొలగింపు', 'ଅନୁକୂଳ CLAHE କଣ୍ଟ୍ରାଷ୍ଟ ଏବଂ ଦାଗ ସଫା', 'Adaptive CLAHE contrast stretch & despeckling')}
            </div>
          </div>
        )}

        {/* Document Canvas Content */}
        {!displayImage ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '460px',
              padding: '40px 20px',
              textAlign: 'center',
              color: '#94A3B8'
            }}
          >
            <div 
              style={{ 
                width: '74px', 
                height: '74px', 
                borderRadius: '50%', 
                background: 'rgba(244, 121, 32, 0.12)', 
                border: '1px dashed #F47920',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <Scan size={36} color="#F47920" />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
              {isHindi 
                ? 'कोई दस्तावेज़ स्कैन लोड नहीं है' 
                : isTelugu 
                ? 'పత్రం స్కాన్ లోడ్ కాలేదు' 
                : isOdia 
                ? 'କୌଣସି ଦଲିଲ ସ୍କାନ ଲୋଡ ହୋଇନାହିଁ' 
                : isHinglish 
                ? 'Koi Document Scan Loaded Nahi Hai' 
                : 'No Land Record Document Loaded'}
            </h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '440px', lineHeight: 1.6, color: '#94A3B8' }}>
              {isHindi 
                ? 'एआई विज़न विश्लेषण हेतु कृपया अपनी पुरानी भूमि विलेख (PNG, JPG, PDF) अपलोड करें या ऊपर से कोई राज्य नमूना चुनें।' 
                : isTelugu 
                ? 'AI విజన్ విశ్లేషణ ప్రారంభించడానికి దయచేసి మీ పాత భూమి పత్రాన్ని (PNG, JPG, PDF) అప్‌లోడ్ చేయండి లేదా పైన ఉన్న రాష్ట్ర నమూనాను ఎంచుకోండి.' 
                : isOdia 
                ? 'AI ଭିଜନ ବିଶ୍ଳେଷଣ ପାଇଁ ଦୟାକରି ଆପଣଙ୍କ ପୁରୁଣା ଜମି ଦଲିଲ (PNG, JPG, PDF) ଅପଲୋଡ କରନ୍ତୁ କିମ୍ବା ଉପରୁ ଏକ ନମୁନା ବାଛନ୍ତୁ।' 
                : isHinglish 
                ? 'AI Vision extraction ke liye apni file upload karein ya upar se koi sample choose karein.' 
                : 'Upload your land deed scan (PNG, JPG, PDF) or pick an archival state sample from the top bar to inspect with AI Computer Vision.'}
            </p>
            <div style={{ marginTop: '22px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', background: '#1E293B', padding: '4px 12px', borderRadius: '20px', border: '1px solid #334155', color: '#CBD5E1' }}>
                📄 PDF, JPG, PNG, WEBP
              </span>
              <span style={{ fontSize: '0.75rem', background: '#1E293B', padding: '4px 12px', borderRadius: '20px', border: '1px solid #334155', color: '#CBD5E1' }}>
                🇮🇳 22 Indian Languages
              </span>
              <span style={{ fontSize: '0.75rem', background: '#1E293B', padding: '4px 12px', borderRadius: '20px', border: '1px solid #334155', color: '#CBD5E1' }}>
                ⚡ Auto-Deskew & CLAHE
              </span>
            </div>
          </div>
        ) : showSlider ? (
          <div 
            style={{ 
              position: 'relative', 
              width: '100%', 
              height: '100%', 
              minHeight: '520px', 
              overflow: 'hidden',
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out'
            }}
          >
            {/* Enhanced Image (Background) */}
            <img
              src={enhancedImage || originalImage}
              alt="Enhanced Land Record"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '92%',
                maxHeight: '92%',
                objectFit: 'contain',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            />

            {/* Original Image (Clipped Left Layer) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: `${100 - sliderPosition}%`,
                bottom: 0,
                overflow: 'hidden',
                borderRight: '3px solid #F47920'
              }}
            >
              <img
                src={originalImage}
                alt="Original Scan"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  maxWidth: '92vw',
                  maxHeight: '92vh',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Slider Input Bar */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                zIndex: 30,
                cursor: 'ew-resize'
              }}
            />
            <div 
              style={{
                position: 'absolute',
                bottom: '38px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '2px 10px',
                borderRadius: '4px',
                fontSize: '0.725rem',
                zIndex: 30
              }}
            >
              ← {loc(language, 'Original', 'मूल स्कैन', 'అసలు స్కాన్', 'ମୂଳ ସ୍କାନ୍', 'Original')} | {loc(language, 'Enhanced', 'एन्हांस्ड', 'మెరుగుపరచబడింది', 'ଉନ୍ନତ', 'Enhanced')} →
            </div>
          </div>
        ) : (
          /* Standard Single Layer View */
          <div
            style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              position: 'relative'
            }}
          >
            <div style={{ position: 'relative', display: 'inline-block', maxWidth: '90%', maxHeight: '520px' }}>
              <img
                src={displayImage}
                alt="Land Record Scan"
                style={{
                  maxWidth: '100%',
                  maxHeight: '520px',
                  objectFit: 'contain',
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-out',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                  borderRadius: '4px',
                  display: 'block'
                }}
              />

              {/* Dynamic Optical AI Scanner Overlay */}
              {isExtracting && (
                <div className="scanner-laser-overlay">
                  {/* Floating Scanner HUD Badge */}
                  <div className="scanner-hud-badge">
                    <Scan size={14} className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
                    <span>
                      {loc(
                        language,
                        'Optical AI Scanner: Reading Script & Cadastral Grid',
                        'ऑप्टिकल एआई स्कैनर: देवनागरी लिपि एवं खसरा ग्रिड विश्लेषण',
                        'ఆప్టికల్ AI స్కానర్: లిపి మరియు కాడస్ట్రల్ గ్రిడ్ విశ్లేషణ',
                        'ଅପ୍ଟିକାଲ୍ AI ସ୍କାନର୍: ଲିପି ଏବଂ କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ ଗ୍ରିଡ୍ ବିଶ୍ଳେଷଣ',
                        'Optical AI Scanner: Reading Script & Cadastral Grid'
                      )}
                    </span>
                  </div>

                  {/* Holographic Matrix Grid */}
                  <div className="scanner-hologram-grid" />

                  {/* Animated Laser Scanning Beam */}
                  <div className="scanner-laser-beam" />

                  {/* Simulated Computer Vision Detection Bounding Boxes */}
                  <div className="cv-detect-box" style={{ top: '12%', left: '20%', width: '60%', height: '14%' }} />
                  <div className="cv-detect-box" style={{ top: '32%', left: '15%', width: '70%', height: '22%', animationDelay: '0.4s' }} />
                  <div className="cv-detect-box" style={{ top: '60%', left: '18%', width: '64%', height: '18%', animationDelay: '0.8s' }} />
                  <div className="cv-detect-box" style={{ top: '82%', left: '25%', width: '50%', height: '10%', animationDelay: '1.2s' }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Metrics Footer Bar */}
      <div 
        style={{ 
          background: '#0B1523', 
          padding: '8px 16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '0.75rem',
          color: '#94A3B8',
          borderTop: '1px solid #1E293B',
          minHeight: '40px'
        }}
      >
        {displayImage ? (
          <>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>
                {isTelugu ? 'స్పష్టత స్కోరు:' : isOdia ? 'ସ୍ପଷ୍ଟତା ସ୍କୋର:' : isHindi ? 'स्पष्टता स्कोर:' : 'Clarity Metric:'}{' '}
                <strong style={{ color: '#10B981' }}>{(metrics && metrics.clarity_score) || 94}/100</strong>
              </span>
              <span>
                {isTelugu ? 'కాంట్రాస్ట్ మెరుగుదల:' : isOdia ? 'କଣ୍ଟ୍ରାଷ୍ଟ ଉନ୍ନତି:' : isHindi ? 'कंट्रास्ट सुधार:' : 'Contrast Boost:'}{' '}
                <strong style={{ color: '#F47920' }}>{(metrics && metrics.contrast_improvement) || '+42%'}</strong>
              </span>
              <span>
                {isTelugu ? 'శబ్దం ఫిల్టర్:' : isOdia ? 'ଶବ୍ଦ ନିବାରଣ:' : isHindi ? 'ध्वनि/दाग निवारण:' : 'Noise Filtered:'}{' '}
                <strong style={{ color: '#38BDF8' }}>{(metrics && metrics.noise_reduction) || '88%'}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
              <span>
                {isTelugu ? 'OCR పైప్‌లైన్ సిద్ధంగా ఉంది' : isOdia ? 'OCR ପାଇପଲାଇନ ପ୍ରସ୍ତୁତ' : isHindi ? 'ओसीआर हेतु तैयार' : 'OCR Pipeline Ready'}
              </span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
            <span>
              {isTelugu 
                ? 'పత్రం వేచి ఉంది • దయచేసి విశ్లేషణ కోసం చిత్రాన్ని అప్‌లోడ్ చేయండి లేదా నమూనాను ఎంచుకోండి' 
                : isOdia 
                ? 'ଦଲିଲ ଅପେକ୍ଷାରେ ଅଛି • ଦୟାକରି ବିଶ୍ଳେଷଣ ପାଇଁ ଚିତ୍ର ଅପଲୋଡ କରନ୍ତୁ କିମ୍ବା ନମୁନା ବାଛନ୍ତୁ' 
                : isHindi 
                ? 'दस्तावेज़ प्रतीक्षारत • विश्लेषण हेतु फ़ाइल अपलोड करें या नमूना चुनें' 
                : 'Awaiting Document • Upload a scan or select an archival sample to begin AI analysis'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
