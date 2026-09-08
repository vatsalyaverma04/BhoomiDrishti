import io
import os
import json
import base64
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from PIL import Image

from .config import HOST, PORT, SUPPORTED_LANGUAGES, GEMINI_API_KEY
from .preprocessing import preprocess_document, pil_to_base64
from .ai_extractor import extract_land_record
from .validation import run_all_validation_rules
from .gis_service import geocode_location, generate_cadastral_polygon, create_geojson_feature
from .learning_engine import learning_engine
from .database import db
from .sample_records import SAMPLE_LAND_RECORDS

app = FastAPI(
    title="BhoomiDrishti AI - Intelligent Land Record Digitization API",
    description="Smart India Hackathon 2026 - AI-Powered Legacy Land Record Digitization, Validation, and Cadastral GIS Platform",
    version="1.0.0"
)

# CORS middleware for seamless communication with React frontend (supports localhost, Vercel domains, and Render)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    """System health and operational status check."""
    return {
        "status": "healthy",
        "service": "BhoomiDrishti-DILRMP-AI-Backend",
        "version": "1.0.0",
        "gemini_api_configured": bool(os.getenv("GEMINI_API_KEY", "") or GEMINI_API_KEY),
        "database_records_count": len(db.records),
        "supported_languages_count": len(SUPPORTED_LANGUAGES)
    }

@app.get("/api/config")
def get_config():
    """Retrieve platform configuration and supported capabilities."""
    return {
        "supported_languages": SUPPORTED_LANGUAGES,
        "gemini_api_configured": bool(os.getenv("GEMINI_API_KEY", "") or GEMINI_API_KEY),
        "features": {
            "legacy_paper_enhancement": True,
            "multilingual_ocr": True,
            "business_rules_validation": True,
            "cadastral_gis_mapping": True,
            "active_learning_loop": True,
            "dilrmp_export": True
        }
    }

try:
    import pypdfium2 as pdfium
except ImportError:
    pdfium = None

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SAMPLE_DOCS_DIR = BASE_DIR.parent / "sample_documents"

SAMPLE_FILE_MAP = {
    "LR-HR-1964-005": "1_Indian_Gov_Land_Record_Deed.jpg",
    "LR-MH-2026-002": "2_Maharashtra_7_12_SaatBara_1978.jpg",
    "LR-MP-2026-001": "3_MP_Khasra_Khatoni_Vintage.jpg",
    "LR-UP-2026-003": "4_UP_Khatoni_Jamabandi_Faded.jpg",
    "LR-BR-2026-004": "5_Bihar_Jamabandi_Patti.jpg"
}

def load_file_as_pil(contents: bytes, filename: str = "", mime_type: str = "") -> tuple[Image.Image, bytes, str]:
    """
    Converts uploaded image or PDF bytes into a PIL Image and normalized JPEG bytes.
    """
    is_pdf = filename.lower().endswith(".pdf") or "pdf" in (mime_type or "").lower() or contents.startswith(b"%PDF")
    if is_pdf and pdfium is not None:
        try:
            pdf = pdfium.PdfDocument(contents)
            page = pdf[0]
            pil_img = page.render(scale=2.0).to_pil().convert("RGB")
            buf = io.BytesIO()
            pil_img.save(buf, format="JPEG", quality=90)
            return pil_img, buf.getvalue(), "image/jpeg"
        except Exception as e:
            print(f"Error rendering PDF with pdfium: {e}")

    pil_img = Image.open(io.BytesIO(contents)).convert("RGB")
    buf = io.BytesIO()
    pil_img.save(buf, format="JPEG", quality=90)
    return pil_img, buf.getvalue(), "image/jpeg"

def get_sample_image_b64(sample_id: str) -> str:
    """Read high-res scan from sample_documents if present, else call synthetic generator."""
    filename = SAMPLE_FILE_MAP.get(sample_id)
    if filename and (SAMPLE_DOCS_DIR / filename).exists():
        with open(SAMPLE_DOCS_DIR / filename, "rb") as f:
            b64_img = base64.b64encode(f.read()).decode("utf-8")
            return f"data:image/jpeg;base64,{b64_img}"

    sample = next((s for s in SAMPLE_LAND_RECORDS if s["id"] == sample_id), None)
    if sample and "sample_image_generator" in sample:
        return sample["sample_image_generator"]()
    return ""

@app.post("/api/preprocess")
async def preprocess_image_endpoint(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    preset: str = Form("enhanced"),
    deskew: bool = Form(True),
    contrast: float = Form(1.3),
    brightness: float = Form(1.05)
):
    """
    Computer Vision pipeline for restoring degraded, stained, low-contrast legacy land records.
    """
    try:
        if file:
            contents = await file.read()
            pil_img, _, _ = load_file_as_pil(contents, file.filename or "", file.content_type or "")
        elif sample_id:
            b64_img = get_sample_image_b64(sample_id)
            if not b64_img:
                raise HTTPException(status_code=404, detail="Sample record not found")
            raw_b64 = b64_img.split(",")[1]
            pil_img = Image.open(io.BytesIO(base64.b64decode(raw_b64)))
        else:
            raise HTTPException(status_code=400, detail="Provide either an uploaded file or sample_id")

        result = preprocess_document(
            image=pil_img,
            preset=preset,
            deskew=deskew,
            contrast_boost=contrast,
            brightness=brightness
        )

        return {
            "status": "success",
            "preset": result["preset"],
            "deskew_angle": result["deskew_angle"],
            "metrics": result["metrics"],
            "enhanced_image_base64": result["base64"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image preprocessing failed: {str(e)}")

@app.post("/api/extract")
async def extract_record_endpoint(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    api_key: Optional[str] = Form(None)
):
    """
    Multilingual AI Vision extraction of structured land record fields from Image or PDF.
    """
    try:
        image_bytes = b""
        mime_type = "image/jpeg"
        filename = ""

        if file:
            contents = await file.read()
            _, image_bytes, mime_type = load_file_as_pil(contents, file.filename or "", file.content_type or "")
            filename = file.filename or "uploaded_record.jpg"
        elif sample_id:
            b64_img = get_sample_image_b64(sample_id)
            if not b64_img:
                raise HTTPException(status_code=404, detail="Sample record not found")
            raw_b64 = b64_img.split(",")[1]
            image_bytes = base64.b64decode(raw_b64)
            filename = f"{sample_id}.jpg"
        else:
            raise HTTPException(status_code=400, detail="Provide either an image file or sample_id")

        # Extract structured data using Google Gemini Vision or Heuristic fallback
        extracted = extract_land_record(
            image_bytes=image_bytes,
            mime_type=mime_type,
            image_name=filename,
            sample_id=sample_id,
            custom_api_key=api_key or ""
        )


        # Populate coordinates & GIS parcel
        loc = geocode_location(
            village=extracted.get("village", ""),
            tehsil=extracted.get("tehsil", ""),
            district=extracted.get("district", ""),
            state=extracted.get("state", "")
        )
        extracted["geo_coordinates"] = {"lat": loc["lat"], "lng": loc["lng"]}
        area_val = float(extracted.get("area_value") or 1.0)
        khasra = str(extracted.get("khasra_number") or "101")
        extracted["gis_parcel"] = generate_cadastral_polygon(loc["lat"], loc["lng"], area_val, khasra)

        # Run automated business validation
        validation_report = run_all_validation_rules(extracted, db.records)
        extracted["validation_report"] = validation_report
        extracted["verification_status"] = validation_report["status"]

        # Log audit trail
        learning_engine.log_audit_event(
            record_id=extracted.get("id") or "TEMP-NEW",
            action="AI_DOCUMENT_EXTRACTED",
            actor="Gemini Multilingual Vision Engine",
            details=f"Extracted Khasra No: {extracted.get('khasra_number')} from {extracted.get('village', 'Unknown')}"
        )

        return {
            "status": "success",
            "extracted_data": extracted,
            "validation_report": validation_report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@app.post("/api/validate")
def validate_record_endpoint(record_data: Dict[str, Any]):
    """Run automated DILRMP business rules and duplicate checks."""
    report = run_all_validation_rules(record_data, db.records)
    return {
        "status": "success",
        "validation_report": report
    }

@app.get("/api/records")
def get_records(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    """List digitized land records with optional filtering and search."""
    records = db.get_all(state=state, district=district, status=status)
    if search:
        s = search.lower()
        records = [
            r for r in records if (
                s in str(r.get("khasra_number", "")).lower() or
                s in str(r.get("khata_number", "")).lower() or
                s in str(r.get("primary_owner", "")).lower() or
                s in str(r.get("village", "")).lower() or
                s in str(r.get("id", "")).lower()
            )
        ]
    return {
        "total": len(records),
        "records": records
    }

@app.get("/api/records/{record_id}")
def get_record_details(record_id: str):
    """Retrieve full details of a specific digitized land record."""
    rec = db.get_by_id(record_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Land record not found")
    return rec

@app.post("/api/records")
def create_record(record_data: Dict[str, Any]):
    """Save newly verified land record to database."""
    saved = db.create(record_data)
    learning_engine.log_audit_event(
        record_id=saved["id"],
        action="RECORD_REGISTERED",
        actor="Patwari / Officer",
        details=f"Record {saved['id']} saved to Land Records Management System"
    )
    return {
        "status": "success",
        "record": saved
    }

@app.put("/api/records/{record_id}")
def update_record(record_id: str, update_data: Dict[str, Any]):
    """Update record after human-assisted verification."""
    updated = db.update(record_id, update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Land record not found")

    learning_engine.log_audit_event(
        record_id=record_id,
        action="RECORD_VERIFIED_AND_UPDATED",
        actor="Revenue Inspector / Tehsildar",
        details=f"Status set to {updated.get('verification_status')}"
    )
    return {
        "status": "success",
        "record": updated
    }

@app.delete("/api/records/{record_id}")
def delete_record(record_id: str):
    """Delete a land record from database with tamper-evident audit logging."""
    record = db.get_by_id(record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Land record not found")

    success = db.delete(record_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete land record")

    learning_engine.log_audit_event(
        record_id=record_id,
        action="RECORD_DELETED",
        actor="Tehsildar / Admin",
        details=f"Record {record_id} (Khasra: {record.get('khasra_number')}, Village: {record.get('village')}) deleted from registry"
    )
    return {
        "status": "success",
        "message": f"Land record {record_id} has been permanently expunged from the registry"
    }

@app.get("/api/database/status")
def get_database_status():
    """Retrieve operational cloud database status (Supabase / Local)."""
    return db.get_db_status()

@app.post("/api/database/sync")
def sync_database():
    """Trigger manual bi-directional sync between local storage and Supabase cloud."""
    return db.manual_sync()

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    """Retrieve high-level SIH metrics, accuracy, and regional progress."""
    return db.get_dashboard_metrics()

@app.get("/api/samples")
def get_samples():
    """List preloaded historical legacy records for instant demonstration."""
    samples = []
    for s in SAMPLE_LAND_RECORDS:
        samples.append({
            "id": s["id"],
            "title": s["title"],
            "state": s["state"],
            "district": s["district"],
            "village": s["village"],
            "khasra_number": s["khasra_number"],
            "language": s["language"],
            "language_name": s["language_name"],
            "document_type": s["document_type"]
        })
    return {"samples": samples}

@app.get("/api/samples/{sample_id}/image")
def get_sample_image(sample_id: str):
    """Return high-res legacy document image for testing."""
    b64_img = get_sample_image_b64(sample_id)
    if not b64_img:
        raise HTTPException(status_code=404, detail="Sample image not found")
    return {"image_base64": b64_img}


@app.post("/api/learning/correction")
def submit_correction(payload: Dict[str, Any]):
    """Submit human correction into Active Learning feedback engine."""
    feedback = learning_engine.submit_human_correction(
        record_id=payload.get("record_id", "UNKNOWN"),
        field_name=payload.get("field_name", ""),
        original_ai_value=payload.get("original_ai_value"),
        corrected_value=payload.get("corrected_value"),
        language=payload.get("language", "hi"),
        officer_note=payload.get("officer_note", "")
    )
    return {
        "status": "success",
        "message": "Human correction successfully assimilated into AI continuous learning engine",
        "feedback": feedback
    }

@app.get("/api/learning/stats")
def get_learning_stats():
    """Retrieve continuous learning improvement metrics."""
    return learning_engine.get_learning_statistics()

@app.get("/api/audit-trail")
def get_audit_trail():
    """Fetch immutable audit logs synchronized with Supabase cloud."""
    return {"events": learning_engine.audit_log}

@app.delete("/api/audit-trail/{event_id}")
def delete_audit_event_endpoint(event_id: str):
    """Delete an audit event from Supabase cloud and local ledger."""
    learning_engine.delete_audit_event(event_id)
    return {
        "status": "success",
        "message": f"Audit event {event_id} successfully deleted from cloud ledger and local storage",
        "deleted_id": event_id
    }

@app.post("/api/audit-trail/batch-delete")
def batch_delete_audit_events_endpoint(payload: Dict[str, Any]):
    """Delete multiple audit events from Supabase cloud and local ledger."""
    event_ids = payload.get("event_ids", [])
    if not event_ids:
        raise HTTPException(status_code=400, detail="No event IDs provided for deletion")
    count = learning_engine.delete_audit_events_batch(event_ids)
    return {
        "status": "success",
        "message": f"Successfully deleted {count} audit events from cloud and local ledger",
        "deleted_count": count,
        "deleted_ids": event_ids
    }


@app.get("/api/export/geojson/{record_id}")
def export_geojson(record_id: str):
    """Export parcel as standard GIS GeoJSON."""
    rec = db.get_by_id(record_id)
    if not rec or "gis_parcel" not in rec:
        raise HTTPException(status_code=404, detail="Record or GIS parcel geometry not found")

    geojson_data = create_geojson_feature(rec["gis_parcel"], rec)
    return JSONResponse(
        content=geojson_data,
        headers={"Content-Disposition": f"attachment; filename=parcel_{record_id}.geojson"}
    )

@app.get("/api/export/dilrmp-json/{record_id}")
def export_dilrmp_standard_json(record_id: str):
    """Export in DILRMP National Land Record Standard JSON format."""
    rec = db.get_by_id(record_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found")

    dilrmp_export = {
        "schema_version": "DILRMP-NLRMP-2.1",
        "jurisdiction": {
            "country": "India",
            "state": rec.get("state"),
            "district": rec.get("district"),
            "tehsil": rec.get("tehsil"),
            "village": rec.get("village"),
            "pargana": rec.get("pargana"),
            "patwari_halka": rec.get("patwari_halka")
        },
        "parcel_identifiers": {
            "unique_land_parcel_id": f"ULPIN-{rec.get('id')}",
            "khasra_number": rec.get("khasra_number"),
            "khata_number": rec.get("khata_number"),
            "khewat_number": rec.get("khewat_number")
        },
        "spatial_extent": {
            "area_standardized_hectares": rec.get("standardized_hectares"),
            "centroid": rec.get("geo_coordinates"),
            "boundary_polygon": rec.get("gis_parcel", {}).get("coordinates", [])
        },
        "rights_and_ownership": {
            "land_classification": rec.get("land_classification"),
            "soil_type": rec.get("soil_type"),
            "primary_owner": rec.get("primary_owner"),
            "co_owners": rec.get("landowners", []),
            "encumbrances": rec.get("encumbrances", []),
            "mutations": rec.get("mutations", [])
        },
        "verification_metadata": {
            "verification_status": rec.get("verification_status"),
            "validation_report": rec.get("validation_report"),
            "digitized_at": rec.get("digitized_at"),
            "system": "BhoomiDrishti AI v1.0.0"
        }
    }
    return JSONResponse(
        content=dilrmp_export,
        headers={"Content-Disposition": f"attachment; filename=dilrmp_{record_id}.json"}
    )
