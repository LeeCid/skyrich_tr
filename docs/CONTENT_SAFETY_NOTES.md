# Content Safety Notes

This document records claims that are intentionally avoided and official specs that are sourced for the Skyrich TR website.

## Intentionally Avoided Claims

The following claims are intentionally avoided to prevent misleading marketing, legal issues, or unverified performance assertions:

### E-Commerce Related Terms
- **Stokta** (In stock) - No inventory tracking, no stock claims
- **Sepete ekle** (Add to cart) - No shopping cart functionality
- **Satın al** (Buy) - No e-commerce purchase flow
- **indirim** (discount) - No discount pricing
- **kampanya** (campaign) - No promotional campaigns
- **ücretsiz kargo** (free shipping) - No shipping functionality

### Unsupported Warranty/Performance Claims
- **garanti** (warranty) - Warranty terms require official documentation; not added without verified source
- **%65 lighter** - Specific percentage claims without official source verification
- **4x / 4 kat** (4 times) - Multiplier claims without official source verification
- **2000 cycles** - Cycle life claims without official source verification
- **fastest / best / guaranteed** - Superlative claims without verification
- **kesin uyumlu** (guaranteed compatible) - Absolute compatibility claims without verification

### Allowed Safe Phrasing
- **teknik destek** (technical support)
- **uyumlu model seçimi** (compatible model selection)
- **doğrulanacak** (to be verified) - Used for missing specs
- **katalog** (catalog)
- **model bilgisi** (model information)
- **lityum akü modelleri** (lithium battery models)
- **teknik bilgi** (technical information)
- **WhatsApp ile yönlendirme** (WhatsApp redirection)
- **uyumluluğu birlikte kontrol edelim** (let's verify compatibility together)

## Official Specs Sourced

### Cross-Reference Codes
The following cross-reference codes are sourced from official Skyrich documentation and are used for the battery finder code search mode:

| Skyrich SKU | Cross-Reference Code | Source |
|-------------|---------------------|--------|
| HJTX9-FP | YTX9-BS | Official Skyrich documentation |
| HJTX14H-FP | YTX14-BS | Official Skyrich documentation |
| HJTZ10S-FP | YTZ10S | Official Skyrich documentation |
| HJTZ14S-FPZ | YTZ14S | Official Skyrich documentation |
| HJTZ14S-FP | YTZ14S | Official Skyrich documentation |
| HJ51913-FP | 51913 | Official Skyrich documentation |
| HJTX20HQ-FP | YTX20HL | Official Skyrich documentation |
| HJTZ7S-FPZ | YTZ7S | Official Skyrich documentation |
| HJTX20CH-FP | YTX20CH | Official Skyrich documentation |
| HJ13L-FPZ | YTX13L | Official Skyrich documentation |
| HJT9B-FP | YT9B | Official Skyrich documentation |
| HJT7B-FPZ | YT7B | Official Skyrich documentation |

### Product Categories
All products are categorized as:
- **Type**: Motorcycle
- **Technology**: Lithium (LiFePO4)

These are based on official Skyrich product classifications.

### Missing Technical Specs
The following technical specifications are intentionally left as null/empty in the seed data and show "Doğrulanacak" (to be verified) on the frontend:

- **Voltage** (Voltaj) - e.g., 12V
- **Capacity** (Kapasite) - e.g., 15Ah
- **CCA** (Cold Cranking Amps) - e.g., 180A
- **Dimensions** (Boyutlar) - e.g., 150x87x105mm
- **Weight** (Ağırlık) - e.g., 0.7kg
- **Applications** (Uygulamalar) - Vehicle compatibility list

These fields require manual extraction from official Skyrich product pages before being added to production.

## Requires Manual Distributor Approval

The following content requires manual review and approval by the Skyrich Turkey distributor before being added to the public website:

### Performance Specifications
Before adding specific voltage, capacity, CCA, dimensions, or weight values:
1. Verify against official Skyrich product documentation
2. Cross-reference with multiple official sources if available
3. Confirm units of measurement are correct
4. Ensure no conflicting specifications exist

### Application/Compatibility Lists
Before adding vehicle compatibility lists:
1. Verify against official Skyrich compatibility charts
2. Confirm year ranges are accurate
3. Ensure make/model spellings match official documentation
4. Mark source confidence level in PRODUCT_SOURCE_MAP.md

### Marketing Copy
Before adding any marketing claims about performance advantages:
1. Source claim from official Skyrich marketing materials
2. Ensure claim is not exaggerated or misleading
3. Consider legal implications in Turkish market
4. Prefer conservative phrasing over aggressive claims

## Content Review Process

### For New Product Data
1. Check official Skyrich website (skyrichbattery.com, skyrichpower.com)
2. Extract only verifiable technical specifications
3. Document source URL and confidence level in PRODUCT_SOURCE_MAP.md
4. Use conservative phrasing for any advantages
5. Mark unverified fields as "Doğrulanacak"

### For Battery Finder Compatibility
1. Only use official Skyrich cross-reference codes
2. Do not invent vehicle compatibility without official source
3. Use WhatsApp support flow when compatibility is uncertain
4. Use language: "Önerilen eşleşme" (Recommended match) not "Kesin uyumlu" (Guaranteed compatible)
5. Include technical verification disclaimer

### For Marketing Copy
1. Avoid absolute claims (fastest, best, guaranteed)
2. Use comparative language where appropriate (lighter, more powerful)
3. Include source attribution for statistics
4. Provide context for performance claims
5. Update CONTENT_SAFETY_NOTES.md with any new claims

## Compliance Notes

### Turkish Advertising Law
- All performance claims must be verifiable
- Comparative claims require proof
- Environmental claims require certification
- Warranty terms must be clearly stated

### Consumer Protection
- No misleading omissions
- Clear pricing information (if applicable)
- Accurate product descriptions
- No false availability claims

### Brand Guidelines
- Use official Skyrich logo without modification
- Do not crop or alter official logo artwork
- Use approved brand colors and typography
- Maintain brand voice and tone

## Last Updated
- Date: 2026-05-11
- Phase: MASTER PHASE - Production-Grade Premium Polish
- Status: Content safety scan completed, no forbidden terms found in current implementation
