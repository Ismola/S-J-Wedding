import { MongoClient } from "mongodb";
import { getEnv } from "./env";

export type AllergyEntry = {
    id?: number;
    name: string;
    allergy: string;
    createdAt: string;
};

export type MusicEntry = {
    id?: number;
    guestName: string;
    songTitle: string;
    artist?: string;
    createdAt: string;
};

const env = getEnv();
const mongoUri = env.MONGO_URI;
const dbName = env.MONGO_DB_NAME;

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

export async function getMusicCollection() {
    if (!globalForMongo._mongoClientPromise) {
        globalForMongo._mongoClientPromise = createMongoClient();
    }

    const client = await globalForMongo._mongoClientPromise;
    return client.db(dbName).collection<MusicEntry>("music_requests");
}