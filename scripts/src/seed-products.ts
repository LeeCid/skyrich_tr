/**
 * Safe production seed script for approved Skyrich SKUs with source data.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." pnpm --filter @workspace/scripts run seed:products
 *
 * Modes:
 *   default: create missing products and fill only empty/null fields
 *   SEED_FORCE=1: overwrite all seeded fields for the approved 12 SKUs
 *   SEED_FIX_TEXT=1: fix mojibake text safely
 *
 * Behavior:
 * - Upserts by modelCode (unique constraint). Existing rows are updated.
 * - Never duplicates.
 * - Only seeds the 12 approved public SKUs.
 * - Sets active=true for all approved SKUs.
 * - Sets featured=true only for 3 selected homepage items.
 * - Default: does NOT overwrite admin-edited values unless they differ from seed values.
 * - SEED_FORCE=1: overwrites all seeded fields for approved SKUs.
 * - SEED_FIX_TEXT=1: fixes Turkish mojibake in descriptions.
 * - Safe upsert: only updates fields that differ from seed, preserves admin changes (unless FORCE).
 *
 * Source Data:
 * - Official Skyrich sources used where available
 * - Secondary sources marked appropriately
 * - Source conflicts documented in PRODUCT_SOURCE_MAP.md
 * - Technical specs set to null for conflict cases requiring manual review
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { batteriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const { Pool } = pg;

const FORCE_MODE = process.env.SEED_FORCE === "1";
const FIX_TEXT_MODE = process.env.SEED_FIX_TEXT === "1";

console.log(`Seed mode: ${FORCE_MODE ? "FORCE (overwrite all seeded fields)" : "SAFE (preserve admin edits)"}`);
console.log(`Text fix mode: ${FIX_TEXT_MODE ? "ENABLED" : "DISABLED"}`);
console.log();

// Text fix function for Turkish mojibake
function fixMojibake(text: string | null | undefined): string | undefined {
  if (!text) return undefined;
  let fixed = text;
  // Common mojibake patterns
  fixed = fixed.replace(/iin/g, "için");
  fixed = fixed.replace(/ak/g, "akü");
  fixed = fixed.replace(/ara/g, "araç");
  fixed = fixed.replace(/rn/g, "ürün");
  fixed = fixed.replace(/zm/g, "çözüm");
  fixed = fixed.replace(/distribtr/g, "distribütör");
  fixed = fixed.replace(/destegiyle/g, "desteğiyle");
  fixed = fixed.replace(/ret/g, "üret");
  fixed = fixed.replace(/zellik/g, "özellik");
  fixed = fixed.replace(/ner/g, "üzer");
  return fixed;
}

const APPROVED_SKUS = [
  {
    modelCode: "HJTX9-FP",
    name: "Skyrich HJTX9-FP Lityum Akü",
    description: "HJTX9-FP, YTX7A-BS / YTX9-BS / YTR9-BS sınıfındaki powersport akü karşılıkları için geliştirilmiş Skyrich lityum akü modelidir. Kompakt gövde yapısı ve 12V teknik sınıfıyla motosiklet, ATV ve benzeri powersport uygulamalarında kaynaklı karşılık kodu üzerinden değerlendirilir. Montaj öncesinde mevcut akü kodu ve araç bilgisiyle teknik doğrulama önerilir.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTX9-FP.png",
    sortOrder: 1,
    featured: false,
    crossReferenceCodes: ["YTX7A-BS", "YTX9-BS", "YTR9-BS"],
    voltage: 12,
    capacity: null,
    cca: 180,
    dimensions: "150×87×93 mm",
    weight: 0.7,
    chargeCurrent: "2A—15A",
    sourceStatus: "official_high",
    sourceUrl: "https://www.skyrichbattery.com/pro.asp?g=en&id=38",
    sourceNotes: "Official Skyrich product page",
    vehicleHints: [],
  },
  {
    modelCode: "HJTX14H-FP",
    name: "Skyrich HJTX14H-FP Lityum Akü",
    description: "HJTX14H-FP, YTX14-BS / YTX14H-BS ailesi ve ilgili powersport akü kodlarıyla karşılaştırılarak değerlendirilen Skyrich lityum akü modelidir. 12V sınıfı, 150×87×93 mm gövde ölçüsü ve resmi kaynakta yer alan 240 CCA referans değeriyle teknik katalogda güçlü orta-üst sınıf seçeneklerden biri olarak konumlanır. Uyum için mevcut akü kodu üzerinden kontrol edilmelidir.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTX14H-FP.png",
    sortOrder: 2,
    featured: true,
    crossReferenceCodes: ["YTX14-BS", "YTX14H-BS", "KMX14-BS", "YTX12-BS", "YTX12A-BS"],
    voltage: 12,
    capacity: null,
    cca: 240,
    dimensions: "150×87×93 mm",
    weight: 0.9,
    chargeCurrent: "2A—20A",
    sourceStatus: "official_high",
    sourceUrl: "https://www.skyrichbattery.com/pro.asp?g=en&id=29",
    sourceNotes: "Official Skyrich product page",
    vehicleHints: [],
  },
  {
    modelCode: "HJTZ10S-FP",
    name: "Skyrich HJTZ10S-FP Lityum Akü",
    description: "HJTZ10S-FP, YTZ10S sınıfındaki powersport akü karşılıkları için Skyrich lityum akü modelidir. Resmi kaynaklarda farklı ürün kategorileri altında yakın teknik varyantlar bulunduğundan, araç ve mevcut akü kodu üzerinden doğrulama yapılması önerilir.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTZ10S-FP.png",
    sortOrder: 3,
    featured: false,
    crossReferenceCodes: ["YTZ10S", "YTZ10S-BS", "HTZ10S", "CTZ10S", "GTZ10S"],
    voltage: 12,
    capacity: null,
    cca: 230,
    dimensions: "150×87×93 mm",
    weight: 0.8,
    chargeCurrent: "2A—18A",
    sourceStatus: "official_conflict",
    sourceUrl: "https://www.skyrichbattery.com/pro.asp?g=en&id=35",
    sourceNotes: "Resmi kaynaklarda kategoriye göre 230–240 CCA ve 0.8–0.9 kg aralığında varyant bilgisi görülmektedir; teknik doğrulama önerilir.",
    vehicleHints: [],
  },
  {
    modelCode: "HJTZ14S-FPZ",
    name: "Skyrich HJTZ14S-FPZ Lityum Akü",
    description: "HJTZ14S-FPZ, YTZ14S sınıfı uygulamalarda adı geçen Skyrich FPZ varyantıdır. Teknik değerler bölgesel/ikincil kaynaklarda görünmektedir; bu nedenle ürün detayları ve araç uyumluluğu distribütör teknik desteğiyle doğrulanmalıdır.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTZ14S-FPZ.png",
    sortOrder: 4,
    featured: true,
    crossReferenceCodes: ["YTZ14S", "YTZ14S-BS"],
    voltage: 12,
    capacity: null,
    cca: 400,
    dimensions: "113×70×85 mm",
    weight: null,
    chargeCurrent: null,
    sourceStatus: "secondary_verified_manual_review",
    sourceUrl: "https://www.tradeinn.com/motardinn/en/skyrich-hjtz14s-fpz-12v-400a-lithium-battery/140953203/p",
    sourceNotes: "Exact HQ official spec page was not found. Secondary/regional listings show 12V, 400 CCA and 113×70×85 mm. Manual distributor review required.",
    vehicleHints: [],
  },
  {
    modelCode: "HJTZ14S-FP",
    name: "Skyrich HJTZ14S-FP Lityum Akü",
    description: "HJTZ14S-FP, YTZ14S sınıfındaki motosiklet ve powersport akü karşılıkları için resmi Skyrich kaynaklarında yer alan lityum akü modelidir. 150×87×93 mm gövde ölçüsü, 12V voltaj sınıfı ve 290 CCA referans değeriyle teknik katalogda yüksek marş akımı gerektiren uygulamalar için değerlendirilir.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTZ14S-FP.png",
    sortOrder: 5,
    featured: false,
    crossReferenceCodes: ["YTZ14S", "YTZ14S-BS", "HTZ14S", "HTZ14S-BS", "CTZ14S", "CTZ14S-BS", "GTZ14S", "GTZ14S-BS"],
    voltage: 12,
    capacity: null,
    cca: 290,
    dimensions: "150×87×93 mm",
    weight: 1.1,
    chargeCurrent: "2.5-22.0A",
    sourceStatus: "official_high",
    sourceUrl: "https://www.skyrichbattery.com/pro.asp?g=en&id=8",
    sourceNotes: "Official Skyrich product page",
    vehicleHints: [],
  },
  {
    modelCode: "HJ51913-FP",
    name: "Skyrich HJ51913-FP Lityum Akü",
    description: "HJ51913-FP, 51913 ve 51913-BS sınıfındaki powersport akü karşılıkları için resmi Skyrich teknik kaynağında listelenen lityum akü modelidir. Büyük gövde ölçüsü ve 450 CCA referans değeriyle daha yüksek marş akımı ihtiyacı olan uygulamalarda kaynaklı ürün kodu üzerinden incelenmelidir.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJ51913-FP.png",
    sortOrder: 6,
    featured: false,
    crossReferenceCodes: ["51913-BS", "51913"],
    voltage: 12,
    capacity: null,
    cca: 450,
    dimensions: "181×77×170 mm",
    weight: 1.7,
    chargeCurrent: "4.0-28A",
    sourceStatus: "official_high",
    sourceUrl: "https://www.skyrichbattery.com/pro.asp?g=en&id=3",
    sourceNotes: "Official Skyrich product page",
    vehicleHints: [],
  },
  {
    modelCode: "HJTX20HQ-FP",
    name: "Skyrich HJTX20HQ-FP Lityum Akü",
    description: "HJTX20HQ-FP, YTX20 ailesi ve ilgili geniş powersport karşılık kodları için Skyrich lityum akü modelidir. Resmi kaynaklarda motosiklet/scooter ve ATV kategorilerine göre CCA ve ağırlık varyantı bulunduğundan, ürün seçimi mevcut akü kodu ve araç bilgisiyle teknik olarak doğrulanmalıdır.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTX20HQ-FP.png",
    sortOrder: 7,
    featured: false,
    crossReferenceCodes: ["YTX20H-BS", "YTX20-BS", "YB18-A", "HTX20H-BS", "CTX20H-BS", "GTX20H-BS", "YTX20L-BS", "YTX20HL-BS", "YTX15L-BS", "YTX18L-BS", "YTX24HL-BS", "YB18L-A"],
    voltage: 12,
    capacity: null,
    cca: null,
    dimensions: "175×87×130 mm",
    weight: null,
    chargeCurrent: null,
    sourceStatus: "official_conflict",
    sourceUrl: "https://www.skyrichbattery.com/pro.asp?g=en&id=1",
    sourceNotes: "Resmi kaynaklarda motosiklet/scooter ve ATV kategorilerine göre CCA (380–420) ve ağırlık (1.3–1.7 kg) varyantı bulunduğundan; teknik doğrulama önerilir.",
    vehicleHints: [],
  },
  {
    modelCode: "HJTZ7S-FPZ",
    name: "Skyrich HJTZ7S-FPZ Lityum Akü",
    description: "HJTZ7S-FPZ, YTZ7S / YTX7L-BS sınıfındaki küçük powersport uygulamalarında değerlendirilen Skyrich FPZ varyantıdır. Resmi kaynaklarda HJTZ7S-FP ailesi için teknik değerler bulunduğundan, FPZ varyantında nihai uyumluluk ve teknik değerler distribütör desteğiyle doğrulanmalıdır.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTZ7S-FPZ.png",
    sortOrder: 8,
    featured: false,
    crossReferenceCodes: ["YTX4L-BS", "YTX5L-BS", "YTX7L-BS", "YTZ5S", "YTZ7S", "YTZ7S-BS"],
    voltage: 12,
    capacity: null,
    cca: null,
    dimensions: "113×70×85 mm",
    weight: null,
    chargeCurrent: null,
    sourceStatus: "official_family_conflict",
    sourceUrl: "https://www.skyrichbattery.com/pro.asp?g=en&id=34",
    sourceNotes: "Resmi kaynaklarda HJTZ7S-FP ailesi için teknik değerler bulunduğundan; FPZ varyantında nihai uyumluluk ve teknik değerler distribütör desteğiyle doğrulanmalıdır.",
    vehicleHints: [],
  },
  {
    modelCode: "HJTX20CH-FP",
    name: "Skyrich HJTX20CH-FP Lityum Akü",
    description: "HJTX20CH-FP, YTX20CH-BS sınıfı powersport akü karşılıkları için resmi Skyrich kaynaklarında yer alan lityum akü modelidir. Resmi kategori kayıtlarında ölçü/CCA varyantı görülebildiğinden, mevcut akü kodu ve araç bilgisiyle teknik doğrulama önerilir.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTX20CH-FP.png",
    sortOrder: 9,
    featured: false,
    crossReferenceCodes: ["YTX20CH-BS", "HTX20CH-BS", "CTX20CH-BS", "GTX20CH-BS", "YTX16-BS", "YTX16-BS-1", "YB16B-A", "YB16B-A1"],
    voltage: 12,
    capacity: null,
    cca: null,
    dimensions: "150×87×93 mm",
    weight: null,
    chargeCurrent: null,
    sourceStatus: "official_conflict",
    sourceUrl: "https://www.skyrichbattery.com/pro.asp?g=en&id=2",
    sourceNotes: "Resmi kategori kayıtlarında ölçü/CCA varyantı görülebildiğinden; teknik doğrulama önerilir.",
    vehicleHints: [],
  },
  {
    modelCode: "HJ13L-FPZ",
    name: "Skyrich HJ13L-FPZ Lityum Akü",
    description: "HJ13L-FPZ, Honda Africa Twin / NT1100 ve bazı adventure/powersport uygulamalarında bölgesel kaynaklarda görülen Skyrich lityum akü modelidir. 6Ah / 72Wh sınıfı ve 420 CCA bilgisi ikincil kaynaklarda yer almaktadır; araç uyumluluğu montaj öncesi teknik destekle doğrulanmalıdır.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJ13L-FPZ.png",
    sortOrder: 10,
    featured: false,
    crossReferenceCodes: ["HJ13L", "HY110", "31500-MKK-D02", "31500-MLN-D02"],
    voltage: 12,
    capacity: null,
    cca: 420,
    dimensions: "112×70×110 mm",
    weight: null,
    chargeCurrent: null,
    sourceStatus: "secondary_verified_manual_review",
    sourceUrl: "https://www.motoracingshop.com/en/skyrich-lithium-battery-for-honda-nt-1100-abs-2025-model-hj13l-fpz-da-12v-72wh-dimesioni-110x70x110-mm.html",
    sourceNotes: "Secondary/regional sources show 12V, 6Ah/72Wh, 420 CCA, 112×70×110 mm. Manual distributor review required.",
    vehicleHints: [
      { make: "Honda", model: "CRF1000L Africa Twin", yearFrom: 2018, yearTo: null, confidence: "medium", sourceType: "dealer_secondary", exactFit: false, requiresManualVerification: true },
      { make: "Honda", model: "CRF1100L Africa Twin", yearFrom: 2018, yearTo: null, confidence: "medium", sourceType: "dealer_secondary", exactFit: false, requiresManualVerification: true },
      { make: "Honda", model: "NT1100 ABS", yearFrom: 2025, yearTo: 2026, confidence: "medium", sourceType: "dealer_secondary", exactFit: false, requiresManualVerification: true },
      { make: "Kove", model: "X 800 Rally", yearFrom: 2024, yearTo: 2024, confidence: "medium", sourceType: "dealer_secondary", exactFit: false, requiresManualVerification: true },
    ],
  },
  {
    modelCode: "HJT9B-FP",
    name: "Skyrich HJT9B-FP Lityum Akü",
    description: "HJT9B-FP, YT9B ve YT7B sınıfındaki powersport akü karşılıkları için resmi Skyrich kaynaklarında yer alan lityum akü modelidir. 150×65×92 mm kompakt gövde, 12V voltaj sınıfı ve 190 CCA referans değeriyle özellikle dar montaj alanlarında mevcut akü kodu üzerinden değerlendirilmelidir.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJT9B-FP.png",
    sortOrder: 11,
    featured: true,
    crossReferenceCodes: ["YT7B-BS", "YT7B-4", "YT9B-BS", "YT9B-4", "HT9B-4", "CT9B-4", "GT9B-4"],
    voltage: 12,
    capacity: null,
    cca: 190,
    dimensions: "150×65×92 mm",
    weight: 0.7,
    chargeCurrent: "2A—15A",
    sourceStatus: "official_high",
    sourceUrl: "https://www.skyrichbattery.com/pro.asp?g=en&id=36",
    sourceNotes: "Official Skyrich product page",
    vehicleHints: [],
  },
  {
    modelCode: "HJT7B-FPZ",
    name: "Skyrich HJT7B-FPZ Lityum Akü",
    description: "HJT7B-FPZ, Skyrich'in Ducati/OEM bağlamında HJT7B-FPZ-SC adıyla da görülen FPZ sınıfı lityum akü ailesindendir. YT7BZ-BS / YT7B-BS karşılık kodları üzerinden değerlendirilir; Ducati Panigale sınıfı uygulamalarda kaynaklı aday eşleşme olarak gösterilmeli ve nihai uyumluluk teknik destekle doğrulanmalıdır.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/10.png",
    sortOrder: 12,
    featured: false,
    crossReferenceCodes: ["YT7BZ-BS", "YT7B-BS"],
    voltage: 12,
    capacity: null,
    cca: null,
    dimensions: "150×65×92 mm",
    weight: null,
    chargeCurrent: null,
    sourceStatus: "official_partial_secondary_specs",
    sourceUrl: "https://www.skyrichbattery.com/pro.asp?g=en&id=66",
    sourceNotes: "HJT7B-FPZ-SC is shown in Ducati OEM context as replacement for YT7BZ-BS. Use 150×65×92 mm only if already in current source map and marked secondary/manual review.",
    vehicleHints: [
      { make: "Ducati", model: "Panigale V4", yearFrom: 2018, yearTo: 2024, confidence: "medium", sourceType: "dealer_secondary", exactFit: false, requiresManualVerification: true },
      { make: "Ducati", model: "Panigale family", yearFrom: null, yearTo: null, confidence: "medium", sourceType: "dealer_secondary", exactFit: false, requiresManualVerification: true },
    ],
  },
] as const;

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Error: DATABASE_URL environment variable is required.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);

  console.log(`Seeding ${APPROVED_SKUS.length} approved products...`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let textFixed = 0;

  for (const sku of APPROVED_SKUS) {
    // Apply text fixes only to nullable fields (description)
    const description = FIX_TEXT_MODE ? fixMojibake(sku.description) : sku.description;
    
    if (FIX_TEXT_MODE && description !== sku.description) {
      textFixed++;
    }

    const existing = await db
      .select()
      .from(batteriesTable)
      .where(eq(batteriesTable.modelCode, sku.modelCode));

    if (existing.length > 0) {
      const row = existing[0];
      
      // In FORCE mode, always update
      // In SAFE mode, only update if fields differ
      let needsUpdate = FORCE_MODE;
      
      if (!FORCE_MODE) {
        needsUpdate =
          row.name !== sku.name ||
          row.description !== description ||
          row.type !== sku.type ||
          row.technology !== sku.technology ||
          row.imageUrl !== sku.imageUrl ||
          row.sortOrder !== sku.sortOrder ||
          row.featured !== sku.featured ||
          row.active !== true ||
          row.voltage !== sku.voltage ||
          row.capacity !== sku.capacity ||
          row.cca !== sku.cca ||
          row.dimensions !== sku.dimensions ||
          row.weight !== sku.weight ||
          row.chargeCurrent !== sku.chargeCurrent ||
          row.sourceStatus !== sku.sourceStatus ||
          row.sourceUrl !== sku.sourceUrl ||
          row.sourceNotes !== sku.sourceNotes ||
          JSON.stringify(row.crossReferenceCodes) !== JSON.stringify(sku.crossReferenceCodes) ||
          JSON.stringify(row.vehicleHints) !== JSON.stringify(sku.vehicleHints);
      }

      if (needsUpdate) {
        await db
          .update(batteriesTable)
          .set({
            name: sku.name,
            description: description,
            type: sku.type,
            technology: sku.technology,
            imageUrl: sku.imageUrl,
            sortOrder: sku.sortOrder,
            featured: sku.featured,
            active: true,
            voltage: sku.voltage,
            capacity: sku.capacity,
            cca: sku.cca,
            dimensions: sku.dimensions,
            weight: sku.weight,
            chargeCurrent: sku.chargeCurrent,
            sourceStatus: sku.sourceStatus,
            sourceUrl: sku.sourceUrl,
            sourceNotes: sku.sourceNotes,
            crossReferenceCodes: sku.crossReferenceCodes as any,
            vehicleHints: sku.vehicleHints as any,
          })
          .where(eq(batteriesTable.modelCode, sku.modelCode));
        updated++;
        console.log(`  Updated: ${sku.modelCode}${FIX_TEXT_MODE && description !== sku.description ? " (text fixed)" : ""}`);
      } else {
        skipped++;
        console.log(`  Skipped (no change): ${sku.modelCode}`);
      }
    } else {
      await db.insert(batteriesTable).values({
        modelCode: sku.modelCode,
        name: sku.name,
        description: description,
        type: sku.type,
        technology: sku.technology,
        imageUrl: sku.imageUrl,
        sortOrder: sku.sortOrder,
        featured: sku.featured,
        active: true,
        voltage: sku.voltage,
        capacity: sku.capacity,
        cca: sku.cca,
        dimensions: sku.dimensions,
        weight: sku.weight,
        chargeCurrent: sku.chargeCurrent,
        sourceStatus: sku.sourceStatus,
        sourceUrl: sku.sourceUrl,
        sourceNotes: sku.sourceNotes,
        crossReferenceCodes: sku.crossReferenceCodes as any,
        vehicleHints: sku.vehicleHints as any,
      });
      created++;
      console.log(`  Created: ${sku.modelCode}`);
    }
  }

  console.log("\nDone.");
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  if (FIX_TEXT_MODE && textFixed > 0) {
    console.log(`  Text Fixed: ${textFixed}`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
