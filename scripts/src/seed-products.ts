/**
 * Safe production seed script for approved Skyrich SKUs.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." pnpm --filter @workspace/scripts run seed:products
 *
 * Behavior:
 * - Upserts by modelCode (unique constraint). Existing rows are updated.
 * - Never duplicates.
 * - Only seeds the 12 approved public SKUs.
 * - Leaves unverified specs null/empty so the frontend shows "Doğrulanacak".
 * - Sets active=true for all approved SKUs.
 * - Sets featured=true only for 3 selected homepage items.
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { batteriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const { Pool } = pg;

const APPROVED_SKUS = [
  {
    modelCode: "HJTX9-FP",
    name: "Skyrich HJTX9-FP Lityum Akü",
    description: "Yüksek performanslı lityum motosiklet aküsü.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTX9-FP.webp",
    sortOrder: 1,
    featured: false,
  },
  {
    modelCode: "HJTX14H-FP",
    name: "Skyrich HJTX14H-FP Lityum Akü",
    description: "Yüksek performanslı lityum motosiklet aküsü.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTX14H-FP.webp",
    sortOrder: 2,
    featured: true,
  },
  {
    modelCode: "HJTZ10S-FP",
    name: "Skyrich HJTZ10S-FP Lityum Akü",
    description: "Yüksek performanslı lityum motosiklet aküsü.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTZ10S-FP.webp",
    sortOrder: 3,
    featured: false,
  },
  {
    modelCode: "HJTZ14S-FPZ",
    name: "Skyrich HJTZ14S-FPZ Lityum Akü",
    description: "Yüksek performanslı lityum motosiklet aküsü.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTZ14S-FPZ.webp",
    sortOrder: 4,
    featured: true,
  },
  {
    modelCode: "HJTZ14S-FP",
    name: "Skyrich HJTZ14S-FP Lityum Akü",
    description: "Yüksek performanslı lityum motosiklet aküsü.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTZ14S-FP.webp",
    sortOrder: 5,
    featured: false,
  },
  {
    modelCode: "HJ51913-FP",
    name: "Skyrich HJ51913-FP Lityum Akü",
    description: "Yüksek performanslı lityum motosiklet aküsü.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJ51913-FP.webp",
    sortOrder: 6,
    featured: false,
  },
  {
    modelCode: "HJTX20HQ-FP",
    name: "Skyrich HJTX20HQ-FP Lityum Akü",
    description: "Yüksek performanslı lityum motosiklet aküsü.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTX20HQ-FP.webp",
    sortOrder: 7,
    featured: false,
  },
  {
    modelCode: "HJTZ7S-FPZ",
    name: "Skyrich HJTZ7S-FPZ Lityum Akü",
    description: "Yüksek performanslı lityum motosiklet aküsü.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTZ7S-FPZ.webp",
    sortOrder: 8,
    featured: false,
  },
  {
    modelCode: "HJTX20CH-FP",
    name: "Skyrich HJTX20CH-FP Lityum Akü",
    description: "Yüksek performanslı lityum motosiklet aküsü.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJTX20CH-FP.webp",
    sortOrder: 9,
    featured: false,
  },
  {
    modelCode: "HJ13L-FPZ",
    name: "Skyrich HJ13L-FPZ Lityum Akü",
    description: "Yüksek performanslı lityum motosiklet aküsü.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJ13L-FPZ.webp",
    sortOrder: 10,
    featured: false,
  },
  {
    modelCode: "HJT9B-FP",
    name: "Skyrich HJT9B-FP Lityum Akü",
    description: "Yüksek performanslı lityum motosiklet aküsü.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJT9B-FP.webp",
    sortOrder: 11,
    featured: true,
  },
  {
    modelCode: "HJT7B-FPZ",
    name: "Skyrich HJT7B-FPZ Lityum Akü",
    description: "Yüksek performanslı lityum motosiklet aküsü.",
    type: "Motorcycle",
    technology: "Lithium",
    imageUrl: "/images/products/HJT7B-FPZ.webp",
    sortOrder: 12,
    featured: false,
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

  for (const sku of APPROVED_SKUS) {
    const existing = await db
      .select()
      .from(batteriesTable)
      .where(eq(batteriesTable.modelCode, sku.modelCode));

    if (existing.length > 0) {
      const row = existing[0];
      const needsUpdate =
        row.name !== sku.name ||
        row.description !== sku.description ||
        row.type !== sku.type ||
        row.technology !== sku.technology ||
        row.imageUrl !== sku.imageUrl ||
        row.sortOrder !== sku.sortOrder ||
        row.featured !== sku.featured ||
        row.active !== true;

      if (needsUpdate) {
        await db
          .update(batteriesTable)
          .set({
            name: sku.name,
            description: sku.description,
            type: sku.type,
            technology: sku.technology,
            imageUrl: sku.imageUrl,
            sortOrder: sku.sortOrder,
            featured: sku.featured,
            active: true,
          })
          .where(eq(batteriesTable.modelCode, sku.modelCode));
        updated++;
        console.log(`  Updated: ${sku.modelCode}`);
      } else {
        skipped++;
        console.log(`  Skipped (no change): ${sku.modelCode}`);
      }
    } else {
      await db.insert(batteriesTable).values({
        modelCode: sku.modelCode,
        name: sku.name,
        description: sku.description,
        type: sku.type,
        technology: sku.technology,
        imageUrl: sku.imageUrl,
        sortOrder: sku.sortOrder,
        featured: sku.featured,
        active: true,
      });
      created++;
      console.log(`  Created: ${sku.modelCode}`);
    }
  }

  console.log("\nDone.");
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
