export const WEDDING_DATE_ISO = "2026-06-19T18:00:00";

export function getWeddingTimestamp() {
    return new Date(WEDDING_DATE_ISO).getTime();
}

export function isWeddingStartedServer(now = Date.now()) {
    return now >= getWeddingTimestamp();
}
