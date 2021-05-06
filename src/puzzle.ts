import { decode } from "friendly-pow/base64";
import { difficultyToThreshold } from "friendly-pow/encoding";
import { NUMBER_OF_PUZZLES_OFFSET, PUZZLE_DIFFICULTY_OFFSET, PUZZLE_EXPIRY_OFFSET } from "friendly-pow/puzzle";
import { Localization } from "./localization";

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

export async function getPuzzle(url: string, siteKey: string, lang: Localization): Promise<string> {
    const urls = url.split(",");
    for (let i = 0; i < urls.length; i++) {
        try {
            const response = await fetchAndRetryWithBackoff(url + "?sitekey=" + siteKey, {headers: [["x-frc-client", "js-0.8.6"]], mode: 'cors'}, 2);
            if (response.ok) {
                const json = await response.json();
                return json.data.puzzle;
            } else {
                let json;
                try {
                    json = await response.json();
                } catch(e) {
                    /* Do nothing */
                }

                if (json && json.errors && json.errors[0] === "endpoint_not_enabled") {
                    throw Error(`Endpoint not allowed (${response.status})`);
                }
                
                if (i === urls.length-1) {
                    throw Error(`Response status ${response.status} ${response.statusText}`)
                }
            }
        }
        catch(e) {
            console.error("[FriendlyCaptcha]:", e)
            throw Error(`${lang.text_fetch_error} <a style="text-decoration: underline; font-size: 0.9em;" href="${url}">${url}</a>`);
        }
    }
    // This code should never be reached.
    throw Error(`Internal error`);
}

/**
 * Retries given request with exponential backoff (starting with 1000ms delay, multiplying by 4 every time)
 * @param url Request (can be string url) to fetch
 * @param opts Options for fetch
 * @param n Number of times to attempt before giving up.
 */
export async function fetchAndRetryWithBackoff(url: RequestInfo, opts: RequestInit, n: number): Promise<Response> {
    let time = 1000;
    return fetch(url, opts).catch(async (error) => {
        if (n === 0) throw error;
        await new Promise(r => setTimeout(r, time));
        time *= 4;
        return fetchAndRetryWithBackoff(url, opts, n - 1);
    });
}
