import { base64 } from 'friendly-pow/wasm/optimized.wrap';
import { decode, encode } from 'friendly-pow/base64';
import { getRunningHTML, getReadyHTML, getDoneHTML, updateProgressBar, findParentFormElement, executeOnceOnFocusInEvent, getErrorHTML, getFetchingHTML } from './dom';
// @ts-ignore
import workerString from '../dist/frc-worker.js';
import { DoneMessage, ProgressMessage } from './types';
import { Puzzle, decodeBase64Puzzle, getPuzzle } from './puzzle';

const PUZZLE_ENDPOINT_URL = "https://dev.friendlycaptcha.com/api/v1/puzzle";
const URL = window.URL || window.webkitURL;

export interface FriendlyCaptchaOptions {
    forceJSFallback: boolean;
    startMode: "auto" | "focus" | "none";
    puzzleEndpoint: string;

    startedCallback: () => any,
    readyCallback: () => any,
    doneCallback: (solution: string) => any,
    errorCallback: (error: any) => any,
}

export class FriendlyCaptcha {
    private worker: Worker | null = null;
    private puzzle?: Puzzle;
    private element: HTMLElement;

    public valid: boolean = false;
    private opts: FriendlyCaptchaOptions;

    private needsReInit = false;

    constructor(element: HTMLElement, options: Partial<FriendlyCaptchaOptions> = {}) {
        this.opts = Object.assign({
            forceJSFallback: false,
            startMode: "focus",
            puzzleEndpoint: PUZZLE_ENDPOINT_URL,
            startedCallback: () => 0,
            readyCallback: () => 0,
            doneCallback: () => 0,
            errorCallback: () => 0,
        }, options);
        this.element = element;
        element.innerText = "FriendlyCaptcha initializing..";
    }

    public init(forceStart?: boolean) {
        this.initWorker();
        this.setupSolver();

        if (forceStart || this.opts.startMode === "auto") {
            this.start();
        } else if (this.opts.startMode === "focus") {
            const form = findParentFormElement(this.element);
            if (form) {
                executeOnceOnFocusInEvent(form, () => {this.start()});
            } else {
                console.log("FriendlyCaptcha div seems not to be contained in a form, autostart will not work");
            }
        }
    }

    async setupSolver() {
        if (this.opts.forceJSFallback) {
            this.worker!.postMessage({type: "js"});
            return;
        }
        try {
            const module = WebAssembly.compile(decode(base64));
            this.worker!.postMessage({type: "module", module: await module});
        } catch (e) {
            console.log("FriendlyCaptcha failed to initialize WebAssembly, falling back to Javascript solver: " + e.toString());
            this.worker!.postMessage({type: "js"});
        }
    }

    private makeButtonStart() {
        const b = this.element.querySelector("button")
        b?.addEventListener("click", (e) => this.start(), {once: true, passive: true})
        b?.addEventListener("touchstart", (e) => this.start(), {once: true, passive: true})
    }

    private onWorkerError(e: any) {
        this.needsReInit = true;
        this.element.innerHTML = getErrorHTML("Background worker error " + e.message);
        this.makeButtonStart();
        this.opts.forceJSFallback = true;
    }

    private initWorker() {
        const workerBlob = new Blob([workerString] as any, { type: "text/javascript" });
        this.worker = new Worker(URL.createObjectURL(workerBlob));
        this.worker.onerror = (e: ErrorEvent) => this.onWorkerError(e);
        this.worker.onmessage = (e: any) => {
            const data = e.data;
            if (!data) return;
            if (data.type === "progress") {
                updateProgressBar(this.element, data as ProgressMessage);
            } else if (data.type === "ready") {
                this.element.innerHTML = getReadyHTML();
                this.makeButtonStart();
                this.opts.readyCallback();
            } else if (data.type === "started") {
                this.element.innerHTML = getRunningHTML();
                this.opts.startedCallback();
            } else if (data.type === "done") {
                const solutionPayload = this.handleDone(data);
                this.opts.doneCallback(solutionPayload);
                const callback = this.element.dataset["callback"];
                if (callback) {
                    (window as any)[callback](this);
                }
            } else if (data.type === "error") {
                this.onWorkerError(data);
            } else {
                console.log("Received: " + JSON.stringify(data))
            }
        }
    }

    public async start() {
        const sitekey = this.element.dataset["sitekey"];
        if (!sitekey) {
            console.error("FriendlyCaptcha: sitekey not set on frc-captcha element");
            this.element.innerHTML = getErrorHTML("Website problem: sitekey not set", false)
            return;
        }

        if (this.needsReInit) {
            this.needsReInit = false;
            this.init(true);
            return;
        }

        try {
            this.element.innerHTML = getFetchingHTML()
            this.puzzle = decodeBase64Puzzle(await getPuzzle(this.opts.puzzleEndpoint, sitekey));
        } catch(e) {
            this.element.innerHTML = getErrorHTML(e);
            this.makeButtonStart();
            const code = "error_getting_puzzle";

            this.opts.errorCallback({code, description: e.toString()})
            const callback = this.element.dataset["callback-error"];
            if (callback) {
                (window as any)[callback](this);
            }
            return;
        }
        this.worker!.postMessage({type: "start", buffer: this.puzzle!.buffer, n: this.puzzle!.n, threshold: this.puzzle!.threshold});
    }

    private handleDone(data: DoneMessage) {
        this.valid = true;
        const puzzleSolutionMessage = `${this.puzzle!.signature}.${this.puzzle!.base64}.${encode(data.solution)}.${encode(data.diagnostics)}`;
        this.element.innerHTML = getDoneHTML(puzzleSolutionMessage, data);
        return puzzleSolutionMessage;
    }
}
