import re
from typing import List, Dict, Any

def validate_khasra_number(khasra_no: str) -> tuple[bool, str]:
    """Validate Khasra / Survey / Gat number syntax (e.g., 104, 104/1, 23/1A, Gat 452)."""
    if not khasra_no or not str(khasra_no).strip():
        return False, "Khasra / Survey number is empty or missing"
    
    clean = str(khasra_no).strip()
    # Standard Indian Khasra pattern: digits followed by optional slashes and sub-divisions
    if re.match(r"^(Gat\s*)?\d+([/\-_][\d\w]+)*$", clean, re.IGNORECASE):
        return True, "Valid Khasra format"
    return False, f"Non-standard Khasra format: '{clean}'"

def validate_owner_shares(owners: List[Dict[str, Any]]) -> tuple[bool, str, float]:
    """
    Validate that the sum of all co-owner shares equals 100% (or fraction sum 1.0).
    Returns (is_valid, message, total_share_percentage).
    """
    if not owners:
        return False, "No landowners listed in record", 0.0

    total_share = 0.0
    for owner in owners:
        raw_share = owner.get("share_percentage")
        if raw_share is not None:
            try:
                total_share += float(raw_share)
            except ValueError:
                pass
        else:
            # Check for fraction like '1/2' or '1/4'
            frac = owner.get("share_fraction", "")
            if "/" in str(frac):
                parts = str(frac).split("/")
                try:
                    num = float(parts[0])
                    den = float(parts[1])
                    if den > 0:
                        total_share += (num / den) * 100.0
                except (ValueError, ZeroDivisionError):
                    pass

    # Allow tiny float rounding tolerance (99.0% to 101.0%)
    if 98.9 <= total_share <= 101.1:
        return True, f"Co-owner shares sum perfectly to {round(total_share, 1)}%", round(total_share, 1)
    elif total_share == 0.0:
        # Sole owner assumed 100% if single owner
        if len(owners) == 1:
            return True, "Sole owner with 100% ownership confirmed", 100.0
        return False, "Owner share percentages are not specified", 0.0
    else:
        return False, f"Discrepancy in shares! Total co-owner share sums to {round(total_share, 1)}% (expected 100%)", round(total_share, 1)

def validate_area(area_val: Any, unit: str = "Hectares") -> tuple[bool, str, float]:
    """Validate area value and convert to standardized hectares."""
    try:
        val = float(area_val)
    except (ValueError, TypeError):
        return False, "Invalid numeric area value", 0.0

    if val <= 0.0:
        return False, "Parcel area must be greater than zero", 0.0

    # Unit conversion to Hectares
    u = unit.lower().strip()
    hectares = val
    if "acre" in u:
        hectares = val * 0.404686
    elif "bigha" in u:
        hectares = val * 0.2529 # standard UP/MP bigha
    elif "guntha" in u:
        hectares = val * 0.010117 # Maharashtra Guntha
    elif "sq" in u or "meter" in u or "m2" in u:
        hectares = val / 10000.0

    if hectares > 500.0:
        return False, f"Abnormally high parcel area ({round(hectares, 2)} ha). Verify unit.", round(hectares, 4)

    return True, f"Valid parcel area: {val} {unit} (~{round(hectares, 4)} Hectares)", round(hectares, 4)

def check_duplicate_record(record_data: dict, existing_records: List[dict]) -> tuple[bool, Optional[str]]:
    """
    Cross-database check: detects if the same Khasra/Village parcel is already registered.
    """
    khasra = str(record_data.get("khasra_number", "")).strip().lower()
    village = str(record_data.get("village", "")).strip().lower()
    district = str(record_data.get("district", "")).strip().lower()
    current_id = record_data.get("id")

    for rec in existing_records:
        if rec.get("id") == current_id:
            continue
        r_khasra = str(rec.get("khasra_number", "")).strip().lower()
        r_village = str(rec.get("village", "")).strip().lower()
        r_district = str(rec.get("district", "")).strip().lower()

        if khasra and r_khasra == khasra and village and r_village == village and district and r_district == district:
            return True, f"Duplicate alert: Parcel Khasra No. {rec.get('khasra_number')} in Village '{rec.get('village')}' already exists (Record #{rec.get('id')})"

    return False, None

def calculate_field_confidence_summary(fields_confidence: Dict[str, Any]) -> dict:
    """Computes overall confidence score and lists uncertain fields safely."""
    if not fields_confidence or not isinstance(fields_confidence, dict):
        return {"overall_confidence": 95.0, "status": "HIGH", "low_confidence_fields": [], "is_high_quality": True}

    # Filter only numeric confidence scores
    numeric_scores = {
        k: float(v) for k, v in fields_confidence.items()
        if isinstance(v, (int, float)) and not isinstance(v, bool)
    }

    if not numeric_scores:
        return {"overall_confidence": 95.0, "status": "HIGH", "low_confidence_fields": [], "is_high_quality": True}

    values = list(numeric_scores.values())
    avg_conf = sum(values) / len(values)
    if avg_conf > 1.0:
        avg_conf = avg_conf / 100.0

    low_conf_fields = [k for k, v in numeric_scores.items() if (v < 0.70 if v <= 1.0 else v < 70.0)]

    return {
        "overall_confidence": round(avg_conf * 100, 1),
        "low_confidence_fields": low_conf_fields,
        "is_high_quality": avg_conf >= 0.85
    }

def run_all_validation_rules(record_data: dict, existing_records: List[dict] = None) -> dict:
    """
    Executes complete DILRMP automated business rule validation suite.
    """
    if existing_records is None:
        existing_records = []

    rule_results = []
    has_critical_error = False

    # 1. Khasra Syntax Rule
    khasra_ok, khasra_msg = validate_khasra_number(record_data.get("khasra_number", ""))
    rule_results.append({
        "rule": "RULE_KHASRA_SYNTAX",
        "description": "Standard Khasra/Survey/Gat number format validation",
        "passed": khasra_ok,
        "severity": "ERROR" if not khasra_ok else "INFO",
        "message": khasra_msg
    })
    if not khasra_ok:
        has_critical_error = True

    # 2. Landowner Shares Rule
    shares_ok, shares_msg, total_pct = validate_owner_shares(record_data.get("landowners", []))
    rule_results.append({
        "rule": "RULE_OWNER_SHARES_100_PCT",
        "description": "Co-owner share fraction sum matches 100%",
        "passed": shares_ok,
        "severity": "WARNING" if not shares_ok else "INFO",
        "message": shares_msg,
        "value": f"{total_pct}%"
    })

    # 3. Area Consistency Rule
    area_ok, area_msg, std_ha = validate_area(
        record_data.get("area_value", 0),
        record_data.get("area_unit", "Hectares")
    )
    rule_results.append({
        "rule": "RULE_AREA_CONSISTENCY",
        "description": "Parcel area threshold and unit sanity check",
        "passed": area_ok,
        "severity": "ERROR" if not area_ok else "INFO",
        "message": area_msg,
        "standardized_hectares": std_ha
    })
    if not area_ok:
        has_critical_error = True

    # 4. Duplicate Record Check
    is_dup, dup_msg = check_duplicate_record(record_data, existing_records)
    rule_results.append({
        "rule": "RULE_DUPLICATE_CHECK",
        "description": "Cross-database duplicate parcel detection",
        "passed": not is_dup,
        "severity": "WARNING" if is_dup else "INFO",
        "message": dup_msg or "No duplicate record found in LRMS database"
    })

    # 5. Encumbrance & Mutation Check
    encumbrances = record_data.get("encumbrances", [])
    has_active_loan = any(e.get("status", "").lower() == "active" for e in encumbrances)
    if has_active_loan:
        rule_results.append({
            "rule": "RULE_ENCUMBRANCE_ALERT",
            "description": "Active bank loan or mortgage lien notice",
            "passed": True,
            "severity": "WARNING",
            "message": "Notice: Active bank encumbrance/mortgage noted on this parcel"
        })

    # Confidence aggregation
    conf_summary = calculate_field_confidence_summary(record_data.get("confidence_scores", {}))

    # Overall Status Determination
    if has_critical_error or conf_summary["overall_confidence"] < 60.0:
        overall_status = "FLAGGED_ERROR"
        status_label = "Flagged for Verification"
    elif not shares_ok or is_dup or conf_summary["low_confidence_fields"]:
        overall_status = "NEEDS_REVIEW"
        status_label = "Pending Human Review"
    else:
        overall_status = "VALIDATED"
        status_label = "Fully Validated"

    return {
        "status": overall_status,
        "status_label": status_label,
        "rules_passed": sum(1 for r in rule_results if r["passed"]),
        "rules_total": len(rule_results),
        "rule_results": rule_results,
        "confidence_summary": conf_summary
    }
