import { decode } from "friendly-pow/base64";
import { difficultyToThreshold } from "friendly-pow/encoding";
import { NUMBER_OF_PUZZLES_OFFSET, PUZZLE_DIFFICULTY_OFFSET, PUZZLE_EXPIRY_OFFSET } from "friendly-pow/puzzle";

export interface Puzzle {
    signature: string;
    base64: string;
    buffer: Uint8Array; // input puzzle
    threshold: number; // Related to difficulty
    n: number; // Amount of puzzles to solve
    expiry: number; // Expiry in milliseconds from now
}

export function decodeBase64Puzzle(base64Puzzle: string): Puzzle {
    const parts = base64Puzzle.split(".");
    const puzzle = parts[1];
    const arr = decode(puzzle);
    return {
        signature: parts[0],
        base64: puzzle,
        buffer: arr,
        n: arr[NUMBER_OF_PUZZLES_OFFSET],
        threshold: difficultyToThreshold(arr[PUZZLE_DIFFICULTY_OFFSET]),
        expiry: arr[PUZZLE_EXPIRY_OFFSET] * 300000,
    }
}

export async function getPuzzle(url: string, siteKey: string): Promise<string> {
    const response = await fetchAndRetryWithBackoff(url + "?sitekey=" + siteKey, {headers: [["x-frc-client", "0.1.0"]]}, 2);
    if (response.ok) {
        const json = await response.json();
        return json.data.puzzle;
    } else {
        throw Error(`Failure in getting puzzle: ${response.status} ${response.statusText}`);
    }
}

/**
 * Retries given request with exponential backoff (starting with 100ms delay, multiplying by 4 every time)
 * @param url Request (can be string url) to fetch
 * @param opts Options for fetch
 * @param n Number of times to attempt before giving up.
 */
export async function fetchAndRetryWithBackoff(url: RequestInfo, opts: RequestInit, n: number): Promise<Response> {
    let time = 500;
    return fetch(url, opts).catch(async (error) => {
        if (n === 1) throw error;
        await new Promise(r => setTimeout(r, time));
        time *= 4;
        return fetchAndRetryWithBackoff(url, opts, n - 1);
    });
}
