import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

async function initializeDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes("users")) {
      await db.createCollection("users");
      console.log("✅ Users collection created");
    }

    if (!collectionNames.includes("contents")) {
      await db.createCollection("contents");
      console.log("✅ Contents collection created");
    }

    if (!collectionNames.includes("activities")) {
      await db.createCollection("activities");
      console.log("✅ Activities collection created");
    }

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("contents").createIndex({ title: 1 });
    await db.collection("activities").createIndex({ time: -1 });

    console.log("✅ Indexes created");

    // Check if admin user exists
    const adminExists = await db.collection("users").findOne({ email: "admin@eastcmsa.com" });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await db.collection("users").insertOne({
        email: "admin@eastcmsa.com",
        password: hashedPassword,
        name: "Admin",
        role: "admin",
        createdAt: new Date()
      });
      console.log("✅ Admin user created");
    } else {
      console.log("✅ Admin user already exists");
    }

    console.log("🎉 Database initialization complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase();