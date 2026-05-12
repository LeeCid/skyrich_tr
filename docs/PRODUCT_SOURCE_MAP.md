# Product Source Map

This document maps official Skyrich product data to the 12 approved SKUs in the Skyrich TR catalog.

## Approved SKUs

The following 12 SKUs are approved for public display on the Skyrich TR website:

| SKU | Name | Category | Technology |
|-----|------|----------|------------|
| HJTX9-FP | Skyrich HJTX9-FP Lityum Akü | Motorcycle | Lithium |
| HJTX14H-FP | Skyrich HJTX14H-FP Lityum Akü | Motorcycle | Lithium |
| HJTZ10S-FP | Skyrich HJTZ10S-FP Lityum Akü | Motorcycle | Lithium |
| HJTZ14S-FPZ | Skyrich HJTZ14S-FPZ Lityum Akü | Motorcycle | Lithium |
| HJTZ14S-FP | Skyrich HJTZ14S-FP Lityum Akü | Motorcycle | Lithium |
| HJ51913-FP | Skyrich HJ51913-FP Lityum Akü | Motorcycle | Lithium |
| HJTX20HQ-FP | Skyrich HJTX20HQ-FP Lityum Akü | Motorcycle | Lithium |
| HJTZ7S-FPZ | Skyrich HJTZ7S-FPZ Lityum Akü | Motorcycle | Lithium |
| HJTX20CH-FP | Skyrich HJTX20CH-FP Lityum Akü | Motorcycle | Lithium |
| HJ13L-FPZ | Skyrich HJ13L-FPZ Lityum Akü | Motorcycle | Lithium |
| HJT9B-FP | Skyrich HJT9B-FP Lityum Akü | Motorcycle | Lithium |
| HJT7B-FPZ | Skyrich HJT7B-FPZ Lityum Akü | Motorcycle | Lithium |

## Source Status Types

- **official_high**: Official Skyrich HQ source with high confidence
- **official_conflict**: Official Skyrich sources have conflicting specifications
- **official_partial**: Official Skyrich source but partial data for specific SKU
- **official_family_conflict**: Official family source with conflicts, not exact SKU
- **official_partial_secondary_specs**: Official partial source + secondary specs
- **secondary_verified_manual_review**: Secondary sources requiring manual review
- **missing**: No source found

## Source Data by SKU

### A) HJTX9-FP
- **Source:** https://www.skyrichbattery.com/pro.asp?g=en&id=38
- **Source Status:** official_high
- **Category:** ATV battery
- **Cross-Reference Codes:** YTX7A-BS, YTX9-BS, YTR9-BS
- **Dimensions:** 150*87*93 mm
- **Weight:** 0.7 kg
- **Voltage:** 12V
- **CCA:** 180
- **Charge Current:** 2A—15A
- **Missing Fields:** Capacity (Ah)
- **Safe Public Description:** "YTX9-BS sınıfı powersport akü karşılıkları için Skyrich lityum akü modeli. Uyumluluk teknik destek ile doğrulanmalıdır."

### B) HJTX14H-FP
- **Source:** https://www.skyrichbattery.com/pro.asp?g=en&id=29, https://www.skyrichbattery.com/pro.asp?g=en&id=39
- **Source Status:** official_high
- **Category:** UTV / ATV battery
- **Cross-Reference Codes:** YTX14-BS, YTX14H-BS, KMX14-BS, YTX12-BS, YTX12A-BS
- **Dimensions:** 150*87*93 mm
- **Weight:** 0.9 kg
- **Voltage:** 12V
- **CCA:** 240
- **Charge Current:** 2A—20A
- **Missing Fields:** Capacity (Ah)
- **Safe Public Description:** "YTX14-BS ve YTX14H-BS sınıfı powersport uygulamaları için Skyrich lityum akü modeli."

### C) HJTZ10S-FP
- **Source:** https://www.skyrichbattery.com/pro.asp?g=en&id=35, https://www.skyrichbattery.com/pro.asp?g=en&id=7
- **Source Status:** official_conflict
- **Category:** Motorcycle battery
- **Cross-Reference Codes:** YTZ10S
- **Dimensions:** 150*87*93 mm
- **Weight:** 0.8-0.9 kg (conflict between sources)
- **Voltage:** 12V
- **CCA:** 230-240 (conflict between sources)
- **Charge Current:** 2A—18A / 2.0-20.0A (conflict)
- **Missing Fields:** Capacity (Ah), weight, cca, chargeCurrent (recommended to leave null due to conflict)
- **Source Notes:** Official Skyrich pages have conflicting specifications. id=35 has YTZ10S replacement data. Recommended to use id=35 as primary but mark as conflict.
- **Safe Public Description:** "YTZ10S sınıfı powersport akü karşılığı için Skyrich lityum akü modeli. Resmi kaynak varyantı nedeniyle teknik doğrulama önerilir."

### D) HJTZ14S-FP
- **Source:** https://www.skyrichbattery.com/pro.asp?g=en&id=8
- **Source Status:** official_high
- **Category:** Motorcycle battery
- **Cross-Reference Codes:** YTZ14S(Gel), YTZ14S, YTZ14S-BS, HTZ14S, HTZ14S-BS, CTZ14S, CTZ14S-BS, GTZ14S, GTZ14S-BS
- **Dimensions:** 150*87*93 mm
- **Weight:** 1.1 kg
- **Voltage:** 12V
- **CCA:** 290
- **Charge Current:** 2.5-22.0A
- **Missing Fields:** Capacity (Ah)
- **Safe Public Description:** "YTZ14S sınıfı powersport akü karşılıkları için Skyrich lityum akü modeli."

### E) HJTZ14S-FPZ
- **Source:** https://www.skyrichbattery.com/pro.asp?g=en
- **Source Status:** official_partial
- **Category:** Motorcycle battery
- **Cross-Reference Codes:** YTZ14S, YTZ14S-BS
- **Dimensions:** null
- **Weight:** null
- **Voltage:** null
- **CCA:** null
- **Charge Current:** null
- **Missing Fields:** All technical specs
- **Source Notes:** Official brand/OEM page references HJTZ14S-FPZ as replacement for YTZ14S in Triumph context. Exact spec table for HJTZ14S-FPZ not found in official HQ source. Do NOT copy HJTZ14S-FP specs.
- **Safe Public Description:** "YTZ14S sınıfı uygulamalar için Skyrich FPZ varyantı. Teknik değerler ve uyumluluk distribütör desteğiyle doğrulanmalıdır."

### F) HJ51913-FP
- **Source:** https://www.skyrichbattery.com/pro.asp?g=en&id=3
- **Source Status:** official_high
- **Category:** Motorcycle battery
- **Cross-Reference Codes:** 51913-BS(Gel), 51913-BS(FA), 51913-BS, 51913
- **Dimensions:** 181*77*170 mm
- **Weight:** 1.7 kg
- **Voltage:** 12V
- **CCA:** 450
- **Charge Current:** 4.0-28A
- **Missing Fields:** Capacity (Ah)
- **Safe Public Description:** "51913 sınıfı powersport akü karşılıkları için Skyrich lityum akü modeli."

### G) HJTX20HQ-FP
- **Source:** https://www.skyrichbattery.com/pro.asp?g=en&id=1, https://www.skyrichbattery.com/pro.asp?g=en&id=40
- **Source Status:** official_conflict
- **Category:** Motorcycle / Scooter / ATV battery
- **Cross-Reference Codes:** YTX20H-BS, YTX20-BS, YTX20HL-BS, YTX20L-BS, YTX15L-BS, YTX18L-BS, YTX24HL-BS, YB18-A
- **Dimensions:** 175*87*130 mm
- **Weight:** 1.3-1.7 kg (conflict: id=1=1.7kg, id=40=1.3kg)
- **Voltage:** 12V
- **CCA:** 380-420 (conflict: id=1=420, id=40=380)
- **Charge Current:** 2A—24A / 3.5-28A (conflict)
- **Missing Fields:** Capacity (Ah)
- **Source Notes:** id=1 motorcycle/scooter, id=40 ATV Quad Terminal design. Category variant causes specification conflicts. Recommended: display dimensions and voltage, show CCA as "380–420 arası resmi kaynak varyantı / teknik doğrulama önerilir" or keep null with source conflict panel.
- **Safe Public Description:** "YTX20 sınıfı geniş powersport uygulamaları için Skyrich lityum akü modeli. Resmi kaynaklarda kategori varyantı bulunduğu için teknik doğrulama önerilir."

### H) HJTZ7S-FPZ
- **Source:** https://www.skyrichbattery.com/pro.asp?g=en&id=34, https://www.skyrichbattery.com/pro.asp?g=en&id=5
- **Source Status:** official_family_conflict
- **Category:** Motorcycle battery
- **Cross-Reference Codes:** YTX4L-BS, YTX5L-BS, YTX7L-BS, YTZ5S, YTZ7S
- **Dimensions:** 113*70*85 mm
- **Weight:** 0.5-0.6 kg (conflict: id=34=0.6kg, id=5=0.5kg)
- **Voltage:** 12V
- **CCA:** 120-150 (conflict: id=34=150, id=5=120)
- **Charge Current:** 1.0-10.0A / 2A—12A (conflict)
- **Missing Fields:** Capacity (Ah), exact specs (recommended null due to family source conflict)
- **Source Notes:** Exact HJTZ7S-FPZ source not found; HJTZ7S-FP family source found. Use cross refs, not final exact numeric specs unless owner approves.
- **Safe Public Description:** "YTZ7S/YTX7L-BS sınıfı küçük powersport uygulamaları için Skyrich FPZ varyantı. Teknik değerler distribütör desteğiyle doğrulanmalıdır."

### I) HJTX20CH-FP
- **Source:** https://www.skyrichbattery.com/pro.asp?g=en&id=2, https://www.skyrichbattery.com/pro.asp?g=en&id=41
- **Source Status:** official_conflict
- **Category:** Motorcycle / Scooter / ATV battery
- **Cross-Reference Codes:** YTX20CH-BS, HTX20CH-BS, CTX20CH-BS, GTX20CH-BS, YTX16-BS, YB16B-A
- **Dimensions:** 150*87*93 / 150*87*105 mm (conflict: id=2=150*87*93, id=41=150*87*105)
- **Weight:** 1.2-1.4 kg (conflict: id=2=1.4kg, id=41=1.2kg)
- **Voltage:** 12V
- **CCA:** 300-360 (conflict: id=2=360, id=41=300)
- **Charge Current:** 2A—20A / 3.0-24A (conflict)
- **Missing Fields:** Capacity (Ah)
- **Source Notes:** id=2 motorcycle/scooter, id=41 ATV Quad Terminal design. Category variant causes specification conflicts. Do not silently choose final CCA/dimensions without source note.
- **Safe Public Description:** "YTX20CH-BS sınıfı powersport akü karşılıkları için Skyrich lityum akü modeli. Resmi kaynak varyantı nedeniyle teknik doğrulama önerilir."

### J) HJ13L-FPZ
- **Source:** https://www.skyrich.es/en/standard-li-on-batteries/1303-lithium-ion-battery-hj13l-fp.html, https://www.buese.com/en/skyrich/skyrich-hj13l-fp-lithium-battery.html, https://www.motoracingshop.com/en/skyrich-lithium-battery-for-honda-nt-1100-abs-2025-model-hj13l-fpz-da-12v-72wh-dimesioni-110x70x110-mm.html, https://www.motoracingshop.com/en/skyrich-lithium-battery-for-kove-x-800-rally-2024-model-hj13l-fpz-da-12v-72wh-dimesioni-110x70x110-mm-replacement-for-the-original-honda-battery-31500-mln-d02-corresponding-to-the-skyrich-hj13l.html
- **Source Status:** secondary_verified_manual_review
- **Category:** Motorcycle battery
- **Cross-Reference Codes:** HY110, 31500-MKK-D02, 31500-MLN-D02 (if source supports)
- **Dimensions:** ~112*70*110 mm
- **Weight:** ~1.2 kg
- **Voltage:** 12V / 12.8V
- **Capacity:** 6Ah
- **Energy:** 72Wh
- **CCA:** 420
- **Vehicle Hints:** Honda Africa Twin CRF1000 / CRF1100 from 2018 including Adventure Sports, Honda NT1100 ABS 2025-2026, Kove X 800 Rally 2024
- **Source Notes:** Secondary / regional distributor sources. Not official HQ data. Can show specs if marked "Kaynak: bölgesel/ikincil kaynak, teknik doğrulama önerilir."
- **Safe Public Description:** "Honda Africa Twin / NT1100 gibi belirli uygulamalarda kaynaklarda görülen Skyrich lityum akü modeli. Uyumluluk teknik destek ile doğrulanmalıdır."

### K) HJT9B-FP
- **Source:** https://www.skyrichbattery.com/pro.asp?g=en&id=36, https://www.skyrichbattery.com/pro.asp?g=en&id=9
- **Source Status:** official_high
- **Category:** Motorcycle battery
- **Cross-Reference Codes:** YT7B-BS, YT7B-4, YT9B-BS, YT9B-4
- **Dimensions:** 150*65*92 mm
- **Weight:** 0.7 kg
- **Voltage:** 12V
- **CCA:** 190
- **Charge Current:** 1.5-15.0A / 2A—15A (minor variant)
- **Missing Fields:** Capacity (Ah)
- **Source Notes:** Official Skyrich pages with minor charge-current variant between sources.
- **Safe Public Description:** "YT9B / YT7B sınıfı powersport akü karşılıkları için Skyrich lityum akü modeli."

### L) HJT7B-FPZ
- **Source:** https://www.skyrichbattery.com/pro.asp?g=en&id=66, https://www.buese.com/en/skyrich/skyrich-hjt7b-fpz-oem-ducati-607071, https://www.motoracingshop.com/en/yuasa-battery-for-ducati-panigale-v4-18-19-model-yt7b-bs-12v-6-5ah-150x65x93.html, https://www.antigravitybatteries-uk.co.uk/oem-case-type-batteries/antigravity-batteries-yt7b-bs-ducati-panigale.html
- **Source Status:** official_partial_secondary_specs
- **Category:** Motorcycle battery
- **Cross-Reference Codes:** YT7B-BS, YT7BZ-BS
- **Dimensions:** ~150*65*92 mm (from secondary sources)
- **Weight:** Unknown
- **Voltage:** Unknown
- **CCA:** ~280 (from secondary sources)
- **Vehicle Hints:** Ducati Panigale / Panigale V4
- **Source Notes:** Official Skyrich source mentions HJT7B-FPZ-SC in Ducati OEM context. Secondary sources provide approximate specs. Do not state exact vehicle fitment as guaranteed.
- **Safe Public Description:** "YT7B/YT7BZ-BS sınıfı Ducati/powersport uygulamaları için kaynaklarda görülen Skyrich FPZ varyantı."

## Manual Review Required

Before using any extracted specs in production:
1. Verify voltage, capacity, CCA values match official documentation
2. Confirm dimensions are accurate
3. Check weight is correct
4. Review application lists for accuracy
5. Ensure no aggressive marketing claims are included
6. Mark source confidence as "official_high" after verification

## Safe Data Enrichment Approach

1. **Phase 1**: Extract modelCode, name, type, technology from official pages (already done in seed script)
2. **Phase 2**: Manually extract technical specs from official pages (requires manual review)
3. **Phase 3**: Extract cross-reference codes for battery finder (safe to implement)
4. **Phase 4**: Extract application/compatibility data (requires careful verification)

## Next Steps

1. Manual extraction of technical specs from skyrichbattery.com product pages
2. Verification of cross-reference codes
3. Update seed script with extracted safe specs
4. Add cross-reference mapping for battery finder code search mode
