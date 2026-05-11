#!/usr/bin/env bash
set -uo pipefail

# Usage:
#   API_BASE_URL=https://api.skyrichbattery.com.tr \
#   FRONTEND_URL=https://www.skyrichbattery.com.tr \
#   bash scripts/smoke-production.sh
#
# Do not pass secrets in command line arguments.

API_BASE_URL="${API_BASE_URL:-}"
FRONTEND_URL="${FRONTEND_URL:-}"

if [[ -z "$API_BASE_URL" || -z "$FRONTEND_URL" ]]; then
  echo "Error: Set API_BASE_URL and FRONTEND_URL environment variables."
  echo "Example:"
  echo '  API_BASE_URL=https://api.skyrichbattery.com.tr FRONTEND_URL=https://www.skyrichbattery.com.tr bash scripts/smoke-production.sh'
  exit 1
fi

echo "======================================"
echo "Skyrich Production Smoke Tests"
echo "======================================"
echo "API:     $API_BASE_URL"
echo "Frontend: $FRONTEND_URL"
echo ""

PASS=0
FAIL=0

report() {
  local label="$1"
  local status="$2"
  if [[ "$status" == "PASS" ]]; then
    echo "  [PASS] $label"
    ((PASS++))
  else
    echo "  [FAIL] $label"
    ((FAIL++))
  fi
}

# 1. Health check
echo "[1/7] API health check..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "${API_BASE_URL}/api/healthz" || echo "000")
if [[ "$HEALTH" == "200" ]]; then
  report "GET /api/healthz returns 200" "PASS"
else
  report "GET /api/healthz returned $HEALTH (expected 200)" "FAIL"
fi

# 2. Protected mutation without token
echo ""
echo "[2/7] Protected mutation without token..."
NO_TOKEN=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${API_BASE_URL}/api/batteries" -H "Content-Type: application/json" -d '{}' || echo "000")
if [[ "$NO_TOKEN" == "401" || "$NO_TOKEN" == "403" ]]; then
  report "POST /api/batteries without token returns 401/403" "PASS"
else
  report "POST /api/batteries without token returned $NO_TOKEN (expected 401/403)" "FAIL"
fi

# 3. Admin login wrong password
echo ""
echo "[3/7] Admin login wrong password..."
WRONG_PW=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${API_BASE_URL}/api/admin/login" -H "Content-Type: application/json" -d '{"password":"wrongpassword"}' || echo "000")
if [[ "$WRONG_PW" == "401" || "$WRONG_PW" == "403" ]]; then
  report "Wrong password login returns 401/403" "PASS"
else
  report "Wrong password login returned $WRONG_PW (expected 401/403)" "FAIL"
fi

# 4. Public batteries endpoint returns JSON
echo ""
echo "[4/7] Public batteries endpoint..."
BATTERY_LIST=$(curl -s "${API_BASE_URL}/api/batteries" -w "\nHTTP_CODE:%{http_code}" || echo "HTTP_CODE:000")
HTTP_CODE=$(echo "$BATTERY_LIST" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$BATTERY_LIST" | sed '/HTTP_CODE:/d')
if [[ "$HTTP_CODE" == "200" ]]; then
  report "GET /api/batteries returns 200" "PASS"
  
  # 5. SKU whitelist check
  echo ""
  echo "[5/7] SKU whitelist verification..."
  
  APPROVED_SKUS=(
    "HJTX9-FP" "HJTX14H-FP" "HJTZ10S-FP" "HJTZ14S-FPZ" "HJTZ14S-FP"
    "HJ51913-FP" "HJTX20HQ-FP" "HJTZ7S-FPZ" "HJTX20CH-FP" "HJ13L-FPZ"
    "HJT9B-FP" "HJT7B-FPZ"
  )
  
  # Check if any returned SKU is unapproved
  UNAPPROVED_FOUND="false"
  SKU_MODEL_CODES=$(echo "$BODY" | python3 -c "import sys,json; data=json.load(sys.stdin); [print(b.get('modelCode','')) for b in data]" 2>/dev/null || echo "")
  
  if [[ -n "$SKU_MODEL_CODES" ]]; then
    for sku in $SKU_MODEL_CODES; do
      if [[ -z "$sku" ]]; then continue; fi
      IS_APPROVED="false"
      for approved in "${APPROVED_SKUS[@]}"; do
        if [[ "$sku" == "$approved" ]]; then
          IS_APPROVED="true"
          break
        fi
      done
      if [[ "$IS_APPROVED" == "false" ]]; then
        UNAPPROVED_FOUND="true"
        echo "    [WARN] Unapproved SKU found: $sku"
      fi
    done
    
    if [[ "$UNAPPROVED_FOUND" == "false" ]]; then
      report "All returned SKUs are approved" "PASS"
    else
      report "Unapproved SKU(s) found in public list" "FAIL"
    fi
  else
    report "No batteries returned (database may be empty)" "PASS"
  fi
else
  report "GET /api/batteries returned $HTTP_CODE (expected 200)" "FAIL"
  echo "  Body: $BODY"
fi

# 6. robots.txt on frontend
echo ""
echo "[6/7] robots.txt check..."
ROBOTS=$(curl -s "${FRONTEND_URL}/robots.txt" || echo "")
if echo "$ROBOTS" | grep -q "Disallow: /admin"; then
  report "robots.txt disallows /admin" "PASS"
else
  report "robots.txt missing /admin disallow" "FAIL"
fi

# 7. Sitemap check
echo ""
echo "[7/7] Sitemap check..."
SITEMAP=$(curl -s "${FRONTEND_URL}/sitemap.xml" -w "\nHTTP_CODE:%{http_code}" || echo "HTTP_CODE:000")
SITEMAP_CODE=$(echo "$SITEMAP" | grep "HTTP_CODE:" | cut -d: -f2)
SITEMAP_BODY=$(echo "$SITEMAP" | sed '/HTTP_CODE:/d')

if [[ "$SITEMAP_CODE" == "200" && -n "$SITEMAP_BODY" ]]; then
  report "sitemap.xml accessible and non-empty" "PASS"
else
  # Try API sitemap endpoint
  API_SITEMAP=$(curl -s "${API_BASE_URL}/api/sitemap.xml" -w "\nHTTP_CODE:%{http_code}" || echo "HTTP_CODE:000")
  API_SITEMAP_CODE=$(echo "$API_SITEMAP" | grep "HTTP_CODE:" | cut -d: -f2)
  if [[ "$API_SITEMAP_CODE" == "200" ]]; then
    report "API /api/sitemap.xml accessible" "PASS"
  else
    report "sitemap.xml not accessible (HTTP $SITEMAP_CODE / $API_SITEMAP_CODE)" "FAIL"
  fi
fi

echo ""
echo "======================================"
echo "Smoke Test Results"
echo "======================================"
echo "  PASS: $PASS"
echo "  FAIL: $FAIL"
echo ""

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
