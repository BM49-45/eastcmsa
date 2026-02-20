import clientPromise from "@/lib/mongodb";

const DB_NAME = "eastcmsa";
const COLLECTION = "contents";

export const contentService = {
  // 1️⃣ Get all content
  getAllContent: async () => {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const contents = await db.collection(COLLECTION).find().toArray();
    return contents.map(item => ({ ...item, _id: item._id.toString() }));
  },

  // 2️⃣ Get content by ID
  getContentById: async (id) => {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");
    const content = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    return content ? { ...content, _id: content._id.toString() } : null;
  },

  // 3️⃣ Create new content
  createContent: async (data) => {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const result = await db.collection(COLLECTION).insertOne({
      ...data,
      views: 0,
      likes: 0,
      downloads: 0,
      createdAt: new Date(),
    });
    return { ...data, _id: result.insertedId.toString() };
  },

  // 4️⃣ Update content
  updateContent: async (id, data) => {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
    return await contentService.getContentById(id);
  },

  // 5️⃣ Delete content
  deleteContent: async (id) => {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { ObjectId } = await import("mongodb");
    await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
    return true;
  }
};
