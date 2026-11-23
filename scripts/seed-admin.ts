import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { adminUsers } from "../src/db/schema";

async function main() {
  const name = process.env.ADMIN_SEED_NAME ?? "Administrator";
  const email = (process.env.ADMIN_SEED_EMAIL ?? "admin@citumang.local").toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD ?? "citumang123";

  const passwordHash = await bcrypt.hash(password, 12);
  const [existing] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(adminUsers)
      .set({ name, passwordHash, active: true, updatedAt: new Date() })
      .where(eq(adminUsers.id, existing.id));
    console.log(`Updated admin: ${email}`);
  } else {
    await db.insert(adminUsers).values({ name, email, passwordHash });
    console.log(`Created admin: ${email}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
