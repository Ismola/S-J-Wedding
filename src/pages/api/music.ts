import type { APIRoute } from "astro";
import { getMusicCollection, type MusicEntry } from "@src/lib/mongodb";

export const prerender = false;

const headers = {
    "Content-Type": "application/json; charset=utf-8",
};

export const GET: APIRoute = async () => {
    try {
        const collection = await getMusicCollection();
        const requests = await collection
            .find({}, { projection: { _id: 0 } })
            .sort({ createdAt: -1 })
            .toArray();

        return new Response(JSON.stringify(requests), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Error loading music requests", error);

        return new Response(
            JSON.stringify({ message: "No se pudieron obtener las canciones." }),
            {
                status: 500,
                headers,
            },
        );
    }
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        const guestName = `${data?.guestName ?? ""}`.trim();
        const songTitle = `${data?.songTitle ?? ""}`.trim();
        const artist = `${data?.artist ?? ""}`.trim();

        if (!guestName || !songTitle) {
            return new Response(
                JSON.stringify({ message: "El nombre y la canción son obligatorios." }),
                {
                    status: 400,
                    headers,
                },
            );
        }

        const entry: MusicEntry = {
            id: Number(data?.id) || Date.now(),
            guestName,
            songTitle,
            artist,
            createdAt:
                typeof data?.createdAt === "string"
                    ? data.createdAt
                    : new Date().toISOString(),
        };

        const collection = await getMusicCollection();
        await collection.insertOne(entry);

        return new Response(JSON.stringify({ ok: true, entry }), {
            status: 201,
            headers,
        });
    } catch (error) {
        console.error("Error saving music request", error);

        return new Response(
            JSON.stringify({ message: "No se pudo guardar la canción." }),
            {
                status: 500,
                headers,
            },
        );
    }
};
