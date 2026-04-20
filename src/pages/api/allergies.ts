import type { APIRoute } from "astro";
import { getAllergiesCollection, type AllergyEntry } from "@src/lib/mongodb";

export const prerender = false;

const headers = {
    "Content-Type": "application/json; charset=utf-8",
};

export const GET: APIRoute = async () => {
    try {
        const collection = await getAllergiesCollection();
        const allergies = await collection
            .find({}, { projection: { _id: 0 } })
            .sort({ createdAt: -1 })
            .toArray();

        return new Response(JSON.stringify(allergies), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Error loading allergies", error);

        return new Response(
            JSON.stringify({ message: "No se pudieron obtener las alergias." }),
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
        const name = `${data?.name ?? ""}`.trim();
        const allergy = `${data?.allergy ?? ""}`.trim();

        if (!name || !allergy) {
            return new Response(
                JSON.stringify({ message: "El nombre y la alergia son obligatorios." }),
                {
                    status: 400,
                    headers,
                },
            );
        }

        const entry: AllergyEntry = {
            id: Number(data?.id) || Date.now(),
            name,
            allergy,
            createdAt:
                typeof data?.createdAt === "string"
                    ? data.createdAt
                    : new Date().toISOString(),
        };

        const collection = await getAllergiesCollection();
        await collection.insertOne(entry);

        return new Response(JSON.stringify({ ok: true, entry }), {
            status: 201,
            headers,
        });
    } catch (error) {
        console.error("Error saving allergy", error);

        return new Response(
            JSON.stringify({ message: "No se pudo guardar la alergia." }),
            {
                status: 500,
                headers,
            },
        );
    }
};
