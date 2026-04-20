import { MongoClient } from "mongodb";

export type AllergyEntry = {
    id?: number;
    name: string;
    allergy: string;
    createdAt: string;
};

const mongoUri = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGO_DB_NAME ?? "sj_wedding";

type GlobalWithMongo = typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as GlobalWithMongo;

function createMongoClient() {
    const client = new MongoClient(mongoUri);
    return client.connect();
}

export async function getAllergiesCollection() {
    if (!globalForMongo._mongoClientPromise) {
        globalForMongo._mongoClientPromise = createMongoClient();
    }

    const client = await globalForMongo._mongoClientPromise;
    return client.db(dbName).collection<AllergyEntry>("allergies");
}
