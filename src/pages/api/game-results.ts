import type { APIRoute } from "astro";
import { getGameResultsCollection, type GameResultEntry } from "@src/lib/mongodb";
import { isWeddingStartedServer } from "@src/lib/wedding-date";

export const prerender = false;

const headers = {
    "Content-Type": "application/json; charset=utf-8",
};

export const GET: APIRoute = async () => {
    try {
        const collection = await getGameResultsCollection();
        const ranking = await collection
            .find({}, { projection: { _id: 0 } })
            .sort({ correctAnswers: -1 })
            .limit(20000)
            .toArray();

        return new Response(JSON.stringify(ranking), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Error loading game ranking", error);

        return new Response(
            JSON.stringify({ message: "No se pudo cargar el ranking." }),
            {
                status: 500,
                headers,
            },
        );
    }
};

export const POST: APIRoute = async ({ request }) => {
    try {
        if (!isWeddingStartedServer()) {
            return new Response(
                JSON.stringify({ message: "El juego aun no esta disponible." }),
                {
                    status: 403,
                    headers,
                },
            );
        }

        const data = await request.json();
        const playerName = `${data?.playerName ?? ""}`.trim();
        const correctAnswers = Number(data?.correctAnswers);
        const totalQuestions = Number(data?.totalQuestions);
        const mistakes = Array.isArray(data?.mistakes) ? data.mistakes : [];

        if (!playerName) {
            return new Response(
                JSON.stringify({ message: "El nombre del jugador es obligatorio." }),
                {
                    status: 400,
                    headers,
                },
            );
        }

        if (!Number.isFinite(correctAnswers) || !Number.isFinite(totalQuestions)) {
            return new Response(
                JSON.stringify({ message: "Puntuacion invalida." }),
                {
                    status: 400,
                    headers,
                },
            );
        }

        if (playerName.length > 60 || correctAnswers < 0 || totalQuestions < 1) {
            return new Response(
                JSON.stringify({ message: "Los datos enviados no son validos." }),
                {
                    status: 400,
                    headers,
                },
            );
        }

        if (correctAnswers > totalQuestions) {
            return new Response(
                JSON.stringify({ message: "La puntuacion es inconsistente." }),
                {
                    status: 400,
                    headers,
                },
            );
        }

        const entry: GameResultEntry = {
            id: Number(data?.id) || Date.now(),
            playerName,
            correctAnswers,
            totalQuestions,
            mistakes,
            createdAt:
                typeof data?.createdAt === "string"
                    ? data.createdAt
                    : new Date().toISOString(),
        };

        const collection = await getGameResultsCollection();
        await collection.insertOne(entry);

        return new Response(JSON.stringify({ ok: true, entry }), {
            status: 201,
            headers,
        });
    } catch (error) {
        console.error("Error saving game result", error);

        return new Response(
            JSON.stringify({ message: "No se pudo guardar el resultado." }),
            {
                status: 500,
                headers,
            },
        );
    }
};
