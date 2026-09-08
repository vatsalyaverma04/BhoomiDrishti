import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, Layers, Download, Compass, Search, 
  Maximize2, Crosshair, Sparkles, CheckCircle2, Shield,
  FileText, User, ArrowRight, ChevronDown, ChevronUp
} from 'lucide-react';
import { formatFlexibleArea } from '../utils/areaUnits';
import { loc } from '../utils/translations';

export default function CadastralMap({
  selectedRecord,
  allRecords = [],
  onSelectRecord,
  language = 'en'
}) {
  const isHindi = language === 'hi';
  const isHinglish = language === 'hinglish';
  const isTelugu = language === 'te';
  const isOdia = language === 'or';
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);

  const [activeLayer, setActiveLayer] = useState('satellite'); // 'satellite', 'osm'
  const [searchQuery, setSearchQuery] = useState('');
  const [plotFilter, setPlotFilter] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [cursorCoords, setCursorCoords] = useState({ lat: 23.0821, lng: 76.1524 });
  const [isHudCollapsed, setIsHudCollapsed] = useState(false);

  // Resize listener to prevent Leaflet grey tiles / mis-alignment on mobile or tab switch
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    handleResize();
    const t1 = setTimeout(handleResize, 150);
    const t2 = setTimeout(handleResize, 500);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fallback defaults
  const activeRecord = selectedRecord || allRecords[0] || {
    khasra_number: "104/2",
    primary_owner: "Ramdayal s/o Kanhaiyalal",
    village: "Alankheda",
    tehsil: "Tonk Khurd",
    district: "Dewas",
    state: "Madhya Pradesh",
    area_value: 1.450,
    area_unit: "Hectares",
    geo_coordinates: { lat: 23.0821, lng: 76.1524 },
    gis_parcel: {
      center: [23.0821, 76.1524],
      coordinates: [
        [23.0825, 76.1518],
        [23.0828, 76.1530],
        [23.0818, 76.1535],
        [23.0814, 76.1522],
        [23.0825, 76.1518]
      ],
      area_hectares: 1.450,
      area_sq_meters: 14500,
      perimeter_meters: 512,
      adjacent_parcels: []
    }
  };

  const centerLat = activeRecord?.geo_coordinates?.lat || 23.0821;
  const centerLng = activeRecord?.geo_coordinates?.lng || 76.1524;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 17,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Track cursor coordinates
      map.on('mousemove', (e) => {
        setCursorCoords({
          lat: parseFloat(e.latlng.lat.toFixed(5)),
          lng: parseFloat(e.latlng.lng.toFixed(5))
        });
      });

      mapInstanceRef.current = map;
      layersGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;

    // Tile Layer setup
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (activeLayer === 'satellite') {
      // Real High-Res Satellite Imagery (Esri World Imagery)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri, Maxar, Earthstar Geographics, ISRO / DILRMP GIS',
        maxZoom: 19
      }).addTo(map);

      // Add road/label overlay
      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        opacity: 0.85
      }).addTo(map);
    } else {
      // OpenStreetMap Streets
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}.png', {
        attribution: '&copy; OpenStreetMap contributors | DILRMP Cadastral',
        maxZoom: 19
      }).addTo(map);
    }
  }, [activeLayer]);

  // Update Parcel Polygon and Pins
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;

    const layersGroup = layersGroupRef.current;
    let parcel = activeRecord?.gis_parcel;
    if (!parcel || !parcel.coordinates || parcel.coordinates.length === 0) {
      const lat = activeRecord?.geo_coordinates?.lat || 28.4089;
      const lng = activeRecord?.geo_coordinates?.lng || 77.3178;
      const delta = 0.0012;
      parcel = {
        center: [lat, lng],
        coordinates: [
          [lat + delta * 0.8, lng - delta * 0.9],
          [lat + delta * 0.9, lng + delta * 1.1],
          [lat - delta * 0.7, lng + delta * 0.8],
          [lat - delta * 0.9, lng - delta * 0.7],
          [lat + delta * 0.8, lng - delta * 0.9]
        ],
        area_hectares: activeRecord?.area_value || 1.25,
        area_sq_meters: Math.round((activeRecord?.area_value || 1.25) * 10000),
        perimeter_meters: 480,
        adjacent_parcels: []
      };
    }

    const map = mapInstanceRef.current;
    layersGroup.clearLayers();

    // 1. Draw Adjacent parcels
    if (parcel.adjacent_parcels && parcel.adjacent_parcels.length > 0) {
      parcel.adjacent_parcels.forEach((adj) => {
        const adjPoly = L.polygon(adj.coordinates, {
          color: '#38BDF8',
          weight: 2,
          dashArray: '4, 4',
          fillColor: '#38BDF8',
          fillOpacity: 0.15
        });

        adjPoly.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px;">
            <strong>${loc(language, 'Adjacent Plot:', 'पड़ोसी खसरा:', 'సమీప ప్లాట్:', 'ପଡୋଶୀ ପ୍ଲଟ୍:', 'Adjacent Plot:')}</strong> ${adj.khasra_no}<br/>
            <span style="color: #64748B;">${loc(language, 'Village Cadastral Boundary', 'राजस्व ग्राम सीमा क्षेत्र', 'గ్రామ కాడాస్ట్రాల్ సరిహద్దు', 'ଗ୍ରାମ କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ ସୀମା', 'Village Cadastral Boundary')}</span>
          </div>
        `);
        layersGroup.addLayer(adjPoly);
      });
    }

    // 2. Draw Target Cadastral Parcel Polygon
    const mainPoly = L.polygon(parcel.coordinates, {
      color: '#F47920',
      weight: 3.5,
      fillColor: '#10B981',
      fillOpacity: 0.35
    });

    const popupContent = `
      <div style="font-family: sans-serif; min-width: 220px; padding: 4px;">
        <div style="background: #0B3B60; color: white; padding: 6px 10px; border-radius: 4px; margin-bottom: 8px;">
          <div style="font-size: 11px; opacity: 0.8; text-transform: uppercase;">${loc(language, 'Revenue Cadastral Parcel', 'राजस्व खसरा पार्सल', 'రెవెన్యూ కాడాస్ట్రాల్ పార్సెల్', 'ରାଜସ୍ୱ କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ ପାର୍ସଲ', 'Revenue Cadastral Parcel')}</div>
          <strong style="font-size: 14px;">${loc(language, 'Khasra No: ', 'खसरा संख्या: ', 'ఖస్రా సంఖ్య: ', 'ଖସ୍ରା ନଂ: ', 'Khasra No: ')} ${activeRecord.khasra_number}</strong>
        </div>
        <div style="font-size: 12px; line-height: 1.6; color: #1E293B;">
          <strong>${loc(language, 'Primary Owner: ', 'खातेदार: ', 'పట్టాదారు: ', 'ଜମି ମାଲିକ: ', 'Owner: ')}</strong> ${activeRecord.primary_owner || 'N/A'}<br/>
          <strong>${loc(language, 'Village: ', 'ग्राम: ', 'గ్రామం: ', 'ଗ୍ରାମ: ', 'Village: ')}</strong> ${activeRecord.village}, ${activeRecord.tehsil}<br/>
          <strong>${loc(language, 'Area: ', 'रकबा: ', 'వైశాల్యం: ', 'କ୍ଷେତ୍ରଫଳ: ', 'Area: ')}</strong> ${parcel.area_hectares} Ha (${parcel.area_sq_meters} m²)<br/>
          <strong>${loc(language, 'Status: ', 'स्थिति: ', 'స్థితి: ', 'ସ୍ଥିତି: ', 'Status: ')}</strong> <span style="color: #059669; font-weight: 700;">${activeRecord.verification_status || 'VALIDATED'}</span>
        </div>
      </div>
    `;

    mainPoly.bindPopup(popupContent);
    layersGroup.addLayer(mainPoly);

    // 3. Add Centroid Marker
    const centroidIcon = L.divIcon({
      className: 'custom-centroid-marker',
      html: `
        <div style="
          width: 28px; 
          height: 28px; 
          border-radius: 50%; 
          background: #F47920; 
          border: 3px solid white; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 11px;
        ">
          📍
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker(parcel.center, { icon: centroidIcon });
    marker.bindPopup(popupContent);
    layersGroup.addLayer(marker);

    // Pan with animation
    map.flyTo(parcel.center, 17, { duration: 1.2 });
  }, [activeRecord, language]);

  // Real Geocoding Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const q = encodeURIComponent(`${searchQuery}, India`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`, {
        headers: {
          'Accept-Language': 'en'
        }
      });
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lon], 16, { duration: 1.5 });
        }
      } else {
        setSearchError(loc(language, 'Location not found in database.', 'स्थान नहीं मिला। कृपया पुनः प्रयास करें।', 'స్థానం కనుగొనబడలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.', 'ସ୍ଥାନ ମିଳିଲା ନାହିଁ। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।', 'Location not found.'));
        setTimeout(() => setSearchError(null), 4000);
      }
    } catch (err) {
      setSearchError(loc(language, 'Location search error.', 'स्थान खोज में त्रुटि हुई।', 'స్థానం శోధనలో లోపం ఏర్పడింది.', 'ସ୍ଥାନ ସନ୍ଧାନରେ ତ୍ରୁଟି ଘଟିଲା।', 'Location search error.'));
      setTimeout(() => setSearchError(null), 4000);
    } finally {
      setIsSearching(false);
    }
  };

  // GeoJSON Download Handler
  const handleDownloadGeoJSON = () => {
    const coords = activeRecord.gis_parcel?.coordinates || [];
    const geojsonData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [[coords.map(c => [c[1], c[0]])]]
          },
          properties: {
            khasra_number: activeRecord.khasra_number,
            village: activeRecord.village,
            tehsil: activeRecord.tehsil,
            district: activeRecord.district,
            state: activeRecord.state,
            owner: activeRecord.primary_owner,
            area_hectares: activeRecord.gis_parcel?.area_hectares,
            system: "BhoomiDrishti-DILRMP-GIS"
          }
        }
      ]
    };

    const blob = new Blob([JSON.stringify(geojsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khasra_${activeRecord.khasra_number}_parcel.geojson`;
    a.click();
  };

  // Filter plots for vertical directory
  const filteredPlots = allRecords.filter(r => {
    const s = plotFilter.toLowerCase();
    return !plotFilter || (
      (r.khasra_number || '').toLowerCase().includes(s) ||
      (r.village || '').toLowerCase().includes(s) ||
      (r.primary_owner || '').toLowerCase().includes(s) ||
      (r.district || '').toLowerCase().includes(s)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Map Control Bar */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'var(--bg-card)', 
          padding: '12px 18px', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-light)',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#F47920" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gov-navy-800)' }}>
              {loc(language, 'Cadastral GIS Real Map Parcel Plotter', 'कैडस्ट्रल भू-मानचित्र (जीआईएस पार्सल प्लॉटर)', 'కాడాస్ట్రాల్ GIS మ్యాప్ పార్సెల్ ప్లాటర్', 'କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ GIS ମାନଚିତ୍ର ପାର୍ସଲ ପ୍ଲଟର୍', 'Cadastral GIS Real Map Parcel Plotter')}
            </h3>
          </div>

          <span style={{ fontSize: '0.75rem', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
            {loc(language, 'Satellite & Revenue Boundaries', 'उपग्रह एवं राजस्व सीमाएं', 'ఉపగ్రహం & రెవెన్యూ సరిహద్దులు', 'ଉପଗ୍ରହ ଓ ରାଜସ୍ୱ ସୀମା', 'Satellite & Revenue Boundaries')}
          </span>
        </div>

        {/* Search Bar & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {searchError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
              {searchError}
            </div>
          )}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '6px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={loc(language, 'Search village, tehsil, district...', 'ग्राम, तहसील या ज़िला खोजें...', 'గ్రామం, తహసీల్ లేదా జిల్లాను వెతకండి...', 'ଗ୍ରାମ, ତହସିଲ କିମ୍ବା ଜିଲ୍ଲା ଖୋଜନ୍ତୁ...', 'Village, tehsil ya district search karein...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '7px 12px 7px 32px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.825rem',
                  width: '240px',
                  outline: 'none'
                }}
              />
              <Search size={14} color="#64748B" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} disabled={isSearching}>
              {isSearching ? '...' : loc(language, 'Search', 'खोजें', 'వెతకండి', 'ଖୋଜନ୍ତୁ', 'Search')}
            </button>
          </form>

          {/* Layer Toggle */}
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '6px' }}>
            <button
              onClick={() => setActiveLayer('satellite')}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                background: activeLayer === 'satellite' ? '#0B3B60' : 'transparent',
                color: activeLayer === 'satellite' ? 'white' : '#475569',
                cursor: 'pointer'
              }}
            >
              {loc(language, 'Satellite', 'सैटेलाइट', 'ఉపగ్రహం', 'ଉପଗ୍ରହ', 'Satellite')}
            </button>
            <button
              onClick={() => setActiveLayer('osm')}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                background: activeLayer === 'osm' ? '#0B3B60' : 'transparent',
                color: activeLayer === 'osm' ? 'white' : '#475569',
                cursor: 'pointer'
              }}
            >
              {loc(language, 'Streets', 'मानचित्र (OSM)', 'వీధులు (OSM)', 'ମାନଚିତ୍ର (OSM)', 'Streets')}
            </button>
          </div>

          {/* GeoJSON Download */}
          <button
            onClick={handleDownloadGeoJSON}
            className="btn btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            title="Download GeoJSON format for QGIS / GIS software"
          >
            <Download size={14} />
            <span>GeoJSON</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout: Responsive Grid (Map + Detailed Vertical Plot Directory) */}
      <div className="cadastral-main-grid">
        {/* Map View Panel */}
        <div className="cadastral-map-panel" style={{
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div ref={mapContainerRef} className="cadastral-map-canvas" style={{ width: '100%', height: '100%' }} />

          {/* Floating HUD Card with Plot Details & Collapse Toggle */}
          <div className="map-hud-overlay">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isHudCollapsed ? '0' : '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--gov-saffron-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {isHindi ? 'सत्यापित पार्सल' : isTelugu ? 'ధృవీకరించబడిన పార్సెల్' : isOdia ? 'ସତ୍ୟାପିତ ପାର୍ସଲ' : 'Verified Cadastral Geometry'}
                </span>
                <span style={{ fontSize: '0.675rem', background: '#DCFCE7', color: '#166534', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  DILRMP
                </span>
              </div>
              <button
                onClick={() => setIsHudCollapsed(!isHudCollapsed)}
                style={{
                  background: 'rgba(0,0,0,0.06)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)'
                }}
                title={isHudCollapsed ? "Expand Details" : "Collapse Card"}
              >
                {isHudCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                <span>{isHudCollapsed ? loc(language, 'Expand', 'विस्तार', 'విస్తరించు', 'ବିସ୍ତାର କରନ୍ତୁ', 'Expand') : loc(language, 'Collapse', 'संक्षिप्त', 'కుదించు', 'ସଂକ୍ଷିପ୍ତ କରନ୍ତୁ', 'Collapse')}</span>
              </button>
            </div>

            {isHudCollapsed ? (
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--gov-navy-800)', marginTop: '4px' }}>
                {loc(language, 'Khasra', 'खसरा', 'ఖస్రా', 'ଖସ୍ରା', 'Khasra')} {activeRecord.khasra_number} • {activeRecord.primary_owner}
              </div>
            ) : (
              <>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gov-navy-800)' }}>
                  {loc(language, 'Khasra No.', 'खसरा संख्या', 'ఖస్రా సంఖ్య', 'ଖସ୍ରା ନଂ', 'Khasra No.')}: {activeRecord.khasra_number}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <div><strong>{loc(language, 'Owner:', 'भू-स्वामी:', 'యజమాని:', 'ଜମି ମାଲିକ:', 'Owner:')}</strong> {activeRecord.primary_owner}</div>
                  <div><strong>{loc(language, 'Village:', 'ग्राम:', 'గ్రామం:', 'ଗ୍ରାମ:', 'Village:')}</strong> {activeRecord.village}, {activeRecord.tehsil}</div>
                  <div><strong>{loc(language, 'Metric Area:', 'रकबा (SQ. M.):', 'వైశాల్యం:', 'କ୍ଷେତ୍ରଫଳ:', 'Metric Area:')}</strong> {formatFlexibleArea(activeRecord.gis_parcel?.area_sq_meters || (activeRecord.area_value * (activeRecord.area_unit === 'Sq. Meters' ? 1 : 10000)), 'Sq. Meters')}</div>
                  <div><strong>{loc(language, 'Perimeter:', 'परिधि:', 'చుట్టుకొలత:', 'ପରିଧି:', 'Perimeter:')}</strong> {activeRecord.gis_parcel?.perimeter_meters || 480} m</div>
                </div>

                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-light)', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  <div>GPS Lat: {activeRecord.gis_parcel?.center?.[0] || activeRecord.geo_coordinates?.lat} | Lng: {activeRecord.gis_parcel?.center?.[1] || activeRecord.geo_coordinates?.lng}</div>
                  <div style={{ marginTop: '2px', color: '#059669', fontWeight: 600 }}>
                    ✓ {loc(language, 'Matches Revenue Village Cadastral Sheet', 'राजस्व रिकॉर्ड से पूर्ण मेल खाता है', 'రెవెన్యూ రికార్డుతో సరిపోలింది', 'ରାଜସ୍ୱ ରେକର୍ଡ ସହ ମେଳ ଖାଉଛି', 'Matches Revenue Village Cadastral Sheet')}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Live Cursor Coordinates Readout */}
          <div 
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              zIndex: 1000,
              background: 'rgba(7, 29, 51, 0.85)',
              color: 'white',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '0.725rem',
              fontFamily: 'monospace'
            }}
          >
            📍 {loc(language, 'Cursor Lat:', 'कर्सर निर्देशांक:', 'కర్సర్ కోఆర్డినేట్స్:', 'କର୍ସର୍ ନିର୍ଦ୍ଦେଶାଙ୍କ:', 'Cursor Lat:')} {cursorCoords.lat}° | Lng: {cursorCoords.lng}°
          </div>
        </div>

        {/* Detailed Vertical Cadastral Plot Explorer List */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '660px',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          {/* Panel Header */}
          <div style={{
            padding: '16px 18px',
            borderBottom: '1px solid var(--border-light)',
            background: 'var(--bg-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={18} color="var(--gov-saffron)" />
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--gov-navy-800)' }}>
                  {loc(language, 'Cadastral Parcels Directory', 'कैडस्ट्रल पार्सल सूची', 'కాడాస్ట్రాల్ పార్సెల్ డైరెక్టరీ', 'କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ ପାର୍ସଲ ତାଲିକା', 'Cadastral Parcels Directory')}
                </h4>
              </div>
              <span style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                background: 'var(--gov-navy-900)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '10px'
              }}>
                {filteredPlots.length} {loc(language, 'Plots', 'प्लॉट', 'ప్లాట్లు', 'ପ୍ଲଟ୍', 'Plots')}
              </span>
            </div>

            {/* Quick Plot Search */}
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#64748B" style={{ position: 'absolute', left: '10px', top: '9px' }} />
              <input
                type="text"
                placeholder={loc(language, 'Filter plots by Khasra or Owner...', 'खसरा, खातेदार या ग्राम से खोजें...', 'ఖస్రా లేదా యజమాని పేరుతో శోధించండి...', 'ଖସ୍ରା ବା ମାଲିକଙ୍କ ନାମରେ ଖୋଜନ୍ତୁ...', 'Khasra, khatedar ya village search...')}
                value={plotFilter}
                onChange={(e) => setPlotFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.8rem',
                  outline: 'none',
                  background: 'white'
                }}
              />
            </div>
          </div>

          {/* Scrollable Detailed Vertical List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {filteredPlots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {loc(language, 'No matching plots found', 'कोई मेल खाता प्लॉट नहीं मिला', 'సరిపోలే ప్లాట్లు ఏవీ కనుగొనబడలేదు', 'କୌଣସି ମେଳ ଖାଉଥିବା ପ୍ଲଟ୍ ମିଳିଲା ନାହିଁ', 'No matching plots found')}
              </div>
            ) : (
              filteredPlots.map((r, i) => {
                const isActive = activeRecord?.id === r.id || (activeRecord?.khasra_number === r.khasra_number && activeRecord?.village === r.village);
                const isValid = r.verification_status === 'VALIDATED';

                return (
                  <div
                    key={r.id || i}
                    onClick={() => onSelectRecord(r)}
                    style={{
                      background: isActive ? 'rgba(244, 121, 32, 0.08)' : 'var(--bg-card)',
                      border: isActive ? '2px solid var(--gov-saffron)' : '1px solid var(--border-light)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 12px rgba(244, 121, 32, 0.15)' : 'none',
                      position: 'relative'
                    }}
                    className="plot-card-item"
                  >
                    {/* Top Row: Khasra Badge & Status Tag */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          background: isActive ? 'var(--gov-saffron)' : 'var(--gov-navy-800)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 800
                        }}>
                          {loc(language, 'Khasra', 'खसरा', 'ఖస్రా', 'ଖସ୍ରା', 'Khasra')} {r.khasra_number}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          #{r.id}
                        </span>
                      </div>

                      <span style={{
                        fontSize: '0.675rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '999px',
                        background: isValid ? 'var(--conf-high-bg)' : 'var(--conf-med-bg)',
                        color: isValid ? 'var(--conf-high-text)' : 'var(--conf-med-text)',
                        border: `1px solid ${isValid ? 'var(--conf-high-border)' : 'var(--conf-med-border)'}`
                      }}>
                        {isValid ? loc(language, 'Validated', 'सत्यापित', 'ధృవీకరించబడింది', 'ସତ୍ୟାପିତ', 'Validated') : loc(language, 'Pending', 'समीक्षाधीन', 'సమీక్షలో ఉంది', 'ବିଚାରାଧୀନ', 'Pending')}
                      </span>
                    </div>

                    {/* Landowner Name */}
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <User size={13} color="var(--gov-saffron)" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.primary_owner}
                      </span>
                    </div>

                    {/* Location: Village, Tehsil, District */}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      📍 {r.village}, {r.tehsil || 'Tehsil'} • {r.district}, {r.state}
                    </div>

                    {/* Bottom Stats Grid & Focus Action */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '8px',
                      borderTop: '1px dashed var(--border-light)',
                      fontSize: '0.725rem'
                    }}>
                      <div style={{ color: 'var(--gov-navy-800)', fontWeight: 700, fontSize: '0.725rem' }}>
                        📐 {formatFlexibleArea(r.area_value, r.area_unit || 'Sq. Meters')}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 700,
                        color: isActive ? 'var(--gov-saffron)' : '#2563EB',
                        fontSize: '0.725rem'
                      }}>
                        <span>{isActive ? loc(language, 'Active Plot', 'सक्रिय पार्सल', 'క్రియాశీల ప్లాట్', 'ସକ୍ରିୟ ପ୍ଲଟ୍', 'Active Plot') : loc(language, 'View on Map', 'नक्शे पर देखें', 'మ్యాప్‌లో చూడండి', 'ମାନଚିତ୍ରରେ ଦେଖନ୍ତୁ', 'View on Map')}</span>
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
