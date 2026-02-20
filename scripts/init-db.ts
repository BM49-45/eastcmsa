import { getDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

async function initializeDatabase() {
  const db = await getDatabase();

  // Users collection indexes
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("users").createIndex({ createdAt: -1 });

  // Sessions collection indexes
  await db.collection("sessions").createIndex({ sessionToken: 1 }, { unique: true });
  await db.collection("sessions").createIndex({ expires: 1 }, { expireAfterSeconds: 0 });

  // Create default admin
  const admin = await db.collection("users").findOne({ email: "admin@eastcmsa.com" });
  if (!admin) {
    const hashed = await bcrypt.hash("admin123", 12);
    await db.collection("users").insertOne({
      name: "Admin",
      email: "admin@eastcmsa.com",
      password: hashed,
      role: "admin",
      emailVerified: true,
      receiveUpdates: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Admin created");
  }

  console.log("✅ Database initialized");
}

if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase };
