"use server"

let db;
const dbConnect = async () => {
  if (db) return db;
  try {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.V1,
        deprecationError: true,
      },
    });
    // db = client.db("business-management");
    db = client.db("inventify");
    await client.db("admin").command({ ping: 1 });
    return db;
  } catch (e) {
    console.log("dbConnect error", e);
  }
};

export default dbConnect;
