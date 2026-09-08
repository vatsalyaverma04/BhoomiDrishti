import io
import base64
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

def create_synthetic_legacy_land_document(
    title: str = "खसरा (फार्म-क)",
    state: str = "मध्य प्रदेश शासन",
    district: str = "देवास",
    tehsil: str = "टोंक खुर्द",
    village: str = "आलनखेड़ा",
    khasra_no: str = "104/2",
    khata_no: str = "58",
    owners: str = "1. रामदयाल व. कन्हैयालाल (1/2)\n2. राधेश्याम व. कन्हैयालाल (1/2)",
    area: str = "1.450 हेक्टेयर",
    classification: str = "चाही (सिंचित)",
    degraded: bool = True
) -> str:
    """
    Synthesizes a photorealistic historical Indian land record document scan.
    Simulates aged sepia paper, vintage table gridlines, official stamp seal, and ink fading.
    Returns base64 data URL.
    """
    width, height = 900, 1200
    
    # Base paper color: aged cream/sepia
    img = Image.new("RGB", (width, height), color=(244, 237, 218))
    draw = ImageDraw.Draw(img)

    # 1. Add vintage parchment noise and fiber texture
    np_img = np.array(img, dtype=np.int16)
    noise = np.random.normal(0, 14, (height, width, 3)).astype(np.int16)
    np_img = np.clip(np_img + noise, 0, 255).astype(np.uint8)
    img = Image.fromarray(np_img)
    draw = ImageDraw.Draw(img)

    # 2. Add realistic vintage water/coffee stain rings if degraded
    if degraded:
        stain_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        stain_draw = ImageDraw.Draw(stain_layer)
        # Top-right corner moisture stain
        stain_draw.ellipse([620, 40, 880, 300], fill=(190, 160, 110, 55))
        stain_draw.ellipse([650, 70, 850, 270], fill=(170, 140, 90, 70))
        # Bottom crease stain
        stain_draw.rectangle([0, 1100, 900, 1200], fill=(180, 150, 110, 45))
        stain_layer = stain_layer.filter(ImageFilter.GaussianBlur(12))
        img.paste(stain_layer, (0, 0), stain_layer)
        draw = ImageDraw.Draw(img)

    # Ink colors
    border_color = (65, 50, 35)
    header_ink = (40, 30, 20)
    text_ink = (35, 45, 60) # vintage dark blue-black fountain pen ink
    stamp_ink = (175, 45, 45) # official purple-red revenue stamp ink

    # Outer decorative cadastral register border
    draw.rectangle([30, 30, width - 30, height - 30], outline=border_color, width=3)
    draw.rectangle([36, 36, width - 36, height - 36], outline=border_color, width=1)

    # Header section
    draw.text((340, 60), f"★★★ {state} ★★★", fill=header_ink)
    draw.text((320, 90), "राजस्व विभाग - भू-अभिलेख प्रपत्र", fill=header_ink)
    draw.text((370, 120), title, fill=header_ink)

    # Metadata bar
    draw.line([50, 160, width - 50, 160], fill=border_color, width=2)
    meta_text_1 = f"जिला: {district}    तहसील: {tehsil}    पटवारी हल्का क्र.: 14"
    meta_text_2 = f"ग्राम: {village}    फसली वर्ष: 1428 (सन 2021)    बंदोबस्त वर्ष: 1985"
    draw.text((65, 175), meta_text_1, fill=header_ink)
    draw.text((65, 205), meta_text_2, fill=header_ink)
    draw.line([50, 240, width - 50, 240], fill=border_color, width=2)

    # Table Header columns
    col_x = [50, 130, 230, 490, 640, 760, width - 50]
    headers = [
        "क्र.", "खसरा / सर्वे नं.", "खाता / खेवट नं.", "खातेदार का नाम व पिता/पति का नाम",
        "रकबा (क्षेत्रफल)", "भूमि का वर्गीकरण"
    ]
    
    # Draw table outline
    table_top = 260
    row_height = 50
    draw.rectangle([50, table_top, width - 50, table_top + row_height], fill=(235, 222, 195), outline=border_color)

    for i, h_name in enumerate(headers):
        draw.text((col_x[i] + 8, table_top + 16), h_name, fill=header_ink)
        if i > 0:
            draw.line([col_x[i], table_top, col_x[i], table_top + 550], fill=border_color, width=1)

    # Data Rows
    current_y = table_top + row_height
    rows = [
        ("1", khasra_no, khata_no, owners, area, classification),
        ("2", "104/3", "59", "मदनलाल व. गोवर्धन (1/1)", "0.850 हे.", "चाही"),
        ("3", "105", "60", "ग्राम पंचायत चरनोई भूमि", "3.200 हे.", "गैर-मुमकिन"),
        ("4", "106/1", "61", "सुरेश कुमार व. नारायण (1/1)", "1.100 हे.", "बारानी"),
        ("5", "106/2", "62", "कैलाश चन्द्र व. नारायण (1/1)", "1.050 हे.", "बारानी"),
    ]

    for idx, r in enumerate(rows):
        r_h = 100 if idx == 0 else 70
        draw.line([50, current_y, width - 50, current_y], fill=border_color, width=1)
        
        # Draw columns
        draw.text((col_x[0] + 12, current_y + 15), r[0], fill=text_ink)
        draw.text((col_x[1] + 12, current_y + 15), r[1], fill=text_ink)
        draw.text((col_x[2] + 12, current_y + 15), r[2], fill=text_ink)
        
        # Multi-line owners in first row
        lines = r[3].split("\n")
        for line_idx, line in enumerate(lines):
            draw.text((col_x[3] + 12, current_y + 12 + line_idx * 22), line, fill=text_ink)
            
        draw.text((col_x[4] + 12, current_y + 15), r[4], fill=text_ink)
        draw.text((col_x[5] + 12, current_y + 15), r[5], fill=text_ink)

        current_y += r_h

    # Close table bottom
    draw.line([50, current_y, width - 50, current_y], fill=border_color, width=2)

    # Remarks / Mutation / Encumbrance Section
    rem_y = current_y + 30
    draw.rectangle([50, rem_y, width - 50, rem_y + 130], outline=border_color, width=1)
    draw.text((65, rem_y + 10), "कैफियत व आदेश नामांतरण (Mutation Notes & Remarks):", fill=header_ink)
    draw.text((65, rem_y + 35), "• नामांतरण पंजी क्रमांक 45/2018-19 आदेशानुसार वारिसाना दर्ज किया गया।", fill=text_ink)
    draw.text((65, rem_y + 60), "• स्टेट बैंक ऑफ इंडिया, शाखा टोंक खुर्द बंधक लोन रु. 2,00,000/- दिनांक 12/03/2020।", fill=text_ink)
    draw.text((65, rem_y + 85), "• सत्यापन: राजस्व निरीक्षक द्वारा मौके पर भौतिक सत्यापन पूर्ण पाया गया।", fill=text_ink)

    # Official Revenue Circular Stamp & Patwari Signature
    stamp_x, stamp_y = 660, 1020
    draw.ellipse([stamp_x - 60, stamp_y - 60, stamp_x + 60, stamp_y + 60], outline=stamp_ink, width=3)
    draw.ellipse([stamp_x - 52, stamp_y - 52, stamp_x + 52, stamp_y + 52], outline=stamp_ink, width=1)
    draw.text((stamp_x - 45, stamp_y - 30), "तहसील कार्यालय", fill=stamp_ink)
    draw.text((stamp_x - 38, stamp_y - 10), "★ टोंक खुर्द ★", fill=stamp_ink)
    draw.text((stamp_x - 42, stamp_y + 10), "सत्यापित प्रतिलिपि", fill=stamp_ink)

    # Patwari Sign
    draw.text((120, 1020), "हस्ताक्षर हल्का पटवारी", fill=header_ink)
    draw.line([100, 1060, 260, 1060], fill=header_ink, width=1)
    draw.text((110, 1070), "हल्का क्र. 14, तहसील टोंक खुर्द", fill=header_ink)

    # Slight rotation to simulate realistic scanner bed skew if degraded
    if degraded:
        img = img.rotate(-1.8, resample=Image.Resampling.BICUBIC, expand=False, fillcolor=(235, 230, 215))

    buffered = io.BytesIO()
    img.save(buffered, format="JPEG", quality=85)
    img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return f"data:image/jpeg;base64,{img_b64}"

# Curated High-Fidelity Preloaded Land Records
SAMPLE_LAND_RECORDS = [
    {
        "id": "LR-MP-2026-001",
        "title": "खसरा / बी-1 नकल (Record of Rights)",
        "document_type": "Khasra / Khatoni",
        "state": "Madhya Pradesh",
        "district": "Dewas",
        "tehsil": "Tonk Khurd",
        "village": "Alankheda",
        "pargana": "Sonkatch",
        "patwari_halka": "14",
        "khasra_number": "104/2",
        "khata_number": "58",
        "khewat_number": "12",
        "area_value": 1.450,
        "area_unit": "Hectares",
        "standardized_hectares": 1.450,
        "land_classification": "Chahi (Irrigated Agricultural)",
        "soil_type": "Medium Black (Kali Mitti)",
        "primary_owner": "Ramdayal s/o Kanhaiyalal",
        "language": "hi",
        "language_name": "Hindi",
        "landowners": [
            {
                "name": "Ramdayal",
                "relation": "s/o Kanhaiyalal",
                "share_fraction": "1/2",
                "share_percentage": 50.0,
                "gender": "Male",
                "caste_category": "OBC",
                "aadhaar_masked": "XXXX-XXXX-8921"
            },
            {
                "name": "Radheshyam",
                "relation": "s/o Kanhaiyalal",
                "share_fraction": "1/2",
                "share_percentage": 50.0,
                "gender": "Male",
                "caste_category": "OBC",
                "aadhaar_masked": "XXXX-XXXX-4318"
            }
        ],
        "encumbrances": [
            {
                "type": "Bank Mortgage / Kisan Credit Card",
                "bank_name": "State Bank of India, Tonk Khurd",
                "amount": "₹2,00,000",
                "status": "Active",
                "date": "2020-03-12"
            }
        ],
        "mutations": [
            {
                "order_number": "MUT-45/2018-19",
                "order_date": "2018-09-14",
                "type": "Inheritance (Varisana)",
                "passed_by": "Tehsildar Tonk Khurd"
            }
        ],
        "revenue_tax": {
            "lagaan": "₹45.50",
            "panchayat_cess": "₹12.00",
            "total_annual_tax": "₹57.50"
        },
        "geo_coordinates": {
            "lat": 23.0821,
            "lng": 76.1524
        },
        "confidence_scores": {
            "state": 0.99,
            "district": 0.98,
            "tehsil": 0.96,
            "village": 0.95,
            "khasra_number": 0.98,
            "khata_number": 0.97,
            "area": 0.94,
            "primary_owner": 0.92,
            "landowners": 0.89,
            "classification": 0.91,
            "mutations": 0.86
        },
        "verification_status": "VALIDATED",
        "degraded_scan": True,
        "sample_image_generator": lambda: create_synthetic_legacy_land_document(
            title="खसरा (फार्म-क)", state="मध्य प्रदेश शासन", district="देवास",
            tehsil="टोंक खुर्द", village="आलनखेड़ा", khasra_no="104/2", khata_no="58"
        )
    },
    {
        "id": "LR-MH-2026-002",
        "title": "गाव नमुना सात-बारा (7/12 Utara)",
        "document_type": "7/12 Saat-Bara",
        "state": "Maharashtra",
        "district": "Pune",
        "tehsil": "Haveli",
        "village": "Wagholi",
        "pargana": "Haveli Sub-division",
        "patwari_halka": "Talathi Sajja 03",
        "khasra_number": "412/1",
        "khata_number": "129",
        "khewat_number": "--",
        "area_value": 0.820,
        "area_unit": "Hectares",
        "standardized_hectares": 0.820,
        "land_classification": "Jirayat (Dry Crop Agricultural)",
        "soil_type": "Red Clay Loam",
        "primary_owner": "Prakash Tukaram Jadhav",
        "language": "mr",
        "language_name": "Marathi",
        "landowners": [
            {
                "name": "Prakash Tukaram Jadhav",
                "relation": "s/o Tukaram Jadhav",
                "share_fraction": "3/4",
                "share_percentage": 75.0,
                "gender": "Male",
                "caste_category": "General",
                "aadhaar_masked": "XXXX-XXXX-6102"
            },
            {
                "name": "Sunita Prakash Jadhav",
                "relation": "w/o Prakash Jadhav",
                "share_fraction": "1/4",
                "share_percentage": 25.0,
                "gender": "Female",
                "caste_category": "General",
                "aadhaar_masked": "XXXX-XXXX-9923"
            }
        ],
        "encumbrances": [
            {
                "type": "Crop Loan Lien",
                "bank_name": "Bank of Maharashtra, Wagholi Branch",
                "amount": "₹1,50,000",
                "status": "Active",
                "date": "2021-06-20"
            }
        ],
        "mutations": [
            {
                "order_number": "FERFAR-782",
                "order_date": "2019-11-05",
                "type": "Purchase Deed (Kharedikhat)",
                "passed_by": "Talathi / Mandal Adhikari"
            }
        ],
        "revenue_tax": {
            "lagaan": "₹82.00",
            "panchayat_cess": "₹15.00",
            "total_annual_tax": "₹97.00"
        },
        "geo_coordinates": {
            "lat": 18.5793,
            "lng": 73.9823
        },
        "confidence_scores": {
            "state": 0.99,
            "district": 0.97,
            "tehsil": 0.95,
            "village": 0.96,
            "khasra_number": 0.96,
            "khata_number": 0.94,
            "area": 0.92,
            "primary_owner": 0.90,
            "landowners": 0.88,
            "classification": 0.93,
            "mutations": 0.84
        },
        "verification_status": "VALIDATED",
        "degraded_scan": True,
        "sample_image_generator": lambda: create_synthetic_legacy_land_document(
            title="गाव नमुना ७/१२", state="महाराष्ट्र शासन", district="पुणे",
            tehsil="हवेली", village="वाघोली", khasra_no="412/1", khata_no="129",
            owners="1. प्रकाश तुकाराम जाधव (3/4)\n2. सुनिता प्रकाश जाधव (1/4)",
            area="0.820 हे.आर.", classification="जिरायत (शेतजमीन)"
        )
    },
    {
        "id": "LR-UP-2026-003",
        "title": "उद्धरण खतौनी (Record of Rights Jamabandi)",
        "document_type": "Khasra / Khatoni",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "tehsil": "Bakshi Ka Talab",
        "village": "Bhitehra",
        "pargana": "Mahona",
        "patwari_halka": "Lekhpal Kshetra 08",
        "khasra_number": "287/1",
        "khata_number": "84",
        "khewat_number": "19",
        "area_value": 2.120,
        "area_unit": "Hectares",
        "standardized_hectares": 2.120,
        "land_classification": "Barani (Unirrigated Farmland)",
        "soil_type": "Alluvial Gangetic Soil",
        "primary_owner": "Ram Autar s/o Shiv Prasad",
        "language": "hi",
        "language_name": "Hindi",
        "landowners": [
            {
                "name": "Ram Autar",
                "relation": "s/o Shiv Prasad",
                "share_fraction": "1/1",
                "share_percentage": 100.0,
                "gender": "Male",
                "caste_category": "SC",
                "aadhaar_masked": "XXXX-XXXX-1934"
            }
        ],
        "encumbrances": [],
        "mutations": [
            {
                "order_number": "VAD-2015/09",
                "order_date": "2015-04-18",
                "type": "Will Registration (Vasiyat)",
                "passed_by": "Nayab Tehsildar"
            }
        ],
        "revenue_tax": {
            "lagaan": "₹65.00",
            "panchayat_cess": "₹18.00",
            "total_annual_tax": "₹83.00"
        },
        "geo_coordinates": {
            "lat": 26.9800,
            "lng": 80.9200
        },
        "confidence_scores": {
            "state": 0.98,
            "district": 0.96,
            "tehsil": 0.94,
            "village": 0.93,
            "khasra_number": 0.95,
            "khata_number": 0.92,
            "area": 0.90,
            "primary_owner": 0.93,
            "landowners": 0.91,
            "classification": 0.88,
            "mutations": 0.82
        },
        "verification_status": "VALIDATED",
        "degraded_scan": True,
        "sample_image_generator": lambda: create_synthetic_legacy_land_document(
            title="उद्धरण खतौनी (प्रपत्र 11)", state="उत्तर प्रदेश सरकार", district="लखनऊ",
            tehsil="बक्शी का तालाब", village="भितहरा", khasra_no="287/1", khata_no="84",
            owners="1. राम अवतार व. शिव प्रसाद (1/1)",
            area="2.120 हेक्टेयर", classification="बारानी (कृषि)"
        )
    },
    {
        "id": "LR-BR-2026-004",
        "title": "जमाबंदी पंजी (Jamabandi Register)",
        "document_type": "Jamabandi Register",
        "state": "Bihar",
        "district": "Patna",
        "tehsil": "Dhanarua",
        "village": "Bhelura",
        "pargana": "Phulwari",
        "patwari_halka": "Karamchari Halka 05",
        "khasra_number": "735",
        "khata_number": "92",
        "khewat_number": "04",
        "area_value": 0.650,
        "area_unit": "Hectares",
        "standardized_hectares": 0.650,
        "land_classification": "Dhanhar (Paddy Cultivation)",
        "soil_type": "Clayey Silt",
        "primary_owner": "Arvind Kumar Singh s/o Ram Ekbal Singh",
        "language": "hi",
        "language_name": "Hindi",
        "landowners": [
            {
                "name": "Arvind Kumar Singh",
                "relation": "s/o Ram Ekbal Singh",
                "share_fraction": "1/1",
                "share_percentage": 100.0,
                "gender": "Male",
                "caste_category": "General",
                "aadhaar_masked": "XXXX-XXXX-5512"
            }
        ],
        "encumbrances": [],
        "mutations": [
            {
                "order_number": "DAKHIL-KHARIJ-120/2017",
                "order_date": "2017-08-22",
                "type": "Sale Deed Mutation (Kewala)",
                "passed_by": "Circle Officer (CO) Dhanarua"
            }
        ],
        "revenue_tax": {
            "lagaan": "₹32.50",
            "panchayat_cess": "₹8.00",
            "total_annual_tax": "₹40.50"
        },
        "geo_coordinates": {
            "lat": 25.4000,
            "lng": 85.1800
        },
        "confidence_scores": {
            "state": 0.97,
            "district": 0.95,
            "tehsil": 0.91,
            "village": 0.90,
            "khasra_number": 0.92,
            "khata_number": 0.89,
            "area": 0.88,
            "primary_owner": 0.89,
            "landowners": 0.87,
            "classification": 0.85,
            "mutations": 0.80
        },
    },
    {
        "id": "LR-HR-1964-005",
        "title": "स्वामित्व अधिकार पत्र (Deed of Property Rights)",
        "document_type": "Record of Rights / Land Deed",
        "state": "Haryana",
        "district": "Faridabad",
        "tehsil": "Faridabad",
        "village": "Rampur",
        "pargana": "Rampura",
        "patwari_halka": "Halka 04",
        "khasra_number": "129",
        "khata_number": "45",
        "khewat_number": "78",
        "area_value": 3.700,
        "area_unit": "Bigha",
        "standardized_hectares": 0.935,
        "land_classification": "Krishi (Agricultural Farmland)",
        "soil_type": "Alluvial Loam",
        "primary_owner": "Ram Prasad Singh s/o Hari Singh",
        "language": "hi",
        "language_name": "Hindi",
        "landowners": [
            {
                "name": "Ram Prasad Singh",
                "relation": "s/o Hari Singh",
                "share_fraction": "1/1",
                "share_percentage": 100.0,
                "gender": "Male",
                "caste_category": "General",
                "aadhaar_masked": "XXXX-XXXX-7712"
            }
        ],
        "encumbrances": [],
        "mutations": [
            {
                "order_number": "DEED-347/1964",
                "order_date": "1964-07-12",
                "type": "Property Rights Grant",
                "passed_by": "Tehsildar Faridabad"
            }
        ],
        "revenue_tax": {
            "lagaan": "₹22.50",
            "panchayat_cess": "₹5.00",
            "total_annual_tax": "₹27.50"
        },
        "geo_coordinates": {
            "lat": 28.4089,
            "lng": 77.3178
        },
        "confidence_scores": {
            "state": 0.98,
            "district": 0.97,
            "tehsil": 0.95,
            "village": 0.96,
            "khasra_number": 0.99,
            "khata_number": 0.96,
            "area": 0.94,
            "primary_owner": 0.95,
            "landowners": 0.92,
            "classification": 0.94,
            "mutations": 0.88
        },
        "verification_status": "VALIDATED",
        "degraded_scan": True,
        "sample_image_generator": lambda: create_synthetic_legacy_land_document(
            title="स्वामित्व अधिकार पत्र", state="भारत सरकार", district="फरीदाबाद",
            tehsil="फरीदाबाद", village="रामपुर", khasra_no="129", khata_no="45",
            owners="1. राम प्रसाद सिंह पुत्र श्री हरि सिंह (1/1)",
            area="3 बीघे 14 बिस्वे", classification="कृषि भूमि"
        )
    }
]

