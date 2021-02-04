import { base64 } from 'friendly-pow/wasm/optimized.wrap';
import { decode, encode } from 'friendly-pow/base64';
import { getRunningHTML, getReadyHTML, getDoneHTML, updateProgressBar, findParentFormElement, executeOnceOnFocusInEvent, getErrorHTML, getFetchingHTML, injectStyle, getExpiredHTML } from './dom';
// @ts-ignore
import workerString from '../dist/worker.min.js';
import { DoneMessage, ProgressMessage } from './types';
import { Puzzle, decodeBase64Puzzle, getPuzzle } from './puzzle';
import { Localization, localizations } from './localization';

const PUZZLE_ENDPOINT_URL = "https://friendlycaptcha.com/api/v1/puzzle";
const URL = window.URL || window.webkitURL;

export interface WidgetInstanceOptions {
    forceJSFallback: boolean;
    startMode: "auto" | "focus" | "none";
    puzzleEndpoint: string;
    language: "en" | "de" | "nl" | Localization;
    solutionFieldName: "frc-captcha-solution";

    readyCallback: () => any;
    startedCallback: () => any;
    doneCallback: (solution: string) => any;
    errorCallback: (error: any) => any;
}

export class WidgetInstance {
    private worker: Worker | null = null;
    private puzzle?: Puzzle;

    /**
     * The root element of this widget instance.
     * Warning: it is undefined after `destroy()` has been called.
     */
    private e!: HTMLElement;

    /**
     * The captcha has been succesfully solved.
     */
    public valid = false;
    private opts: WidgetInstanceOptions;

    /**
     * Some errors may cause a need for the (worker) to be reinitialized. If this is
     * true `init` will be called again when start is called.
     */
    private needsReInit = false;

    /**
     * Start() has been called at least once ever.
     */
    private hasBeenStarted = false;

    private hasBeenDestroyed = false;

    private lang: Localization;

    constructor(element: HTMLElement, options: Partial<WidgetInstanceOptions> = {}) {
        this.opts = Object.assign({
            forceJSFallback: false,
            startMode: "focus",
            puzzleEndpoint: PUZZLE_ENDPOINT_URL,
            startedCallback: () => 0,
            readyCallback: () => 0,
            doneCallback: () => 0,
            errorCallback: () => 0,
            language: element.dataset["lang"] || "en",
            solutionFieldName: element.dataset["solutionFieldName"] || "frc-captcha-solution"
        }, options);
        this.e = element;
        
        // Load language
        if (typeof this.opts.language === "string") {
            let l = (localizations as any)[this.opts.language.toLowerCase()];
            if (l === undefined) {
                console.error("FriendlyCaptcha: language \""+this.opts.language+"\"not found.");
                // Fall back to English
                l = localizations.en;
            }
            this.lang = l;
        } else {
            // We assign to a copy of the English language localization, so that any missing values will be English
            this.lang = Object.assign(Object.assign({}, localizations.en), this.opts.language)
        }

        element.innerText = this.lang.text_init;
        injectStyle();
        this.init(this.opts.startMode === "auto" || this.e.dataset["start"] === "auto");
    }

    public init(forceStart?: boolean) {
        if (this.hasBeenDestroyed) {
            console.error("FriendlyCaptcha widget has been destroyed using destroy(), it can not be used anymore.");
            return;
        }
        this.initWorker();
        this.setupSolver();

        if (forceStart) {
            this.start();
        } else if (this.e.dataset["start"] !== "none" && (this.opts.startMode === "focus" || this.e.dataset["start"] === "focus")) {
            const form = findParentFormElement(this.e);
            if (form) {
                executeOnceOnFocusInEvent(form, () => {
                    if (!this.hasBeenStarted) {
                        this.start();
                    }
                });
            } else {
                console.log("FriendlyCaptcha div seems not to be contained in a form, autostart will not work");
            }
        }
    }

    /**
     * Compile the WASM and send the compiled module to the webworker. 
     * If WASM support is not present, it tells the webworker to initialize the JS solver instead.
     */
    private async setupSolver() {
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

    /**
     * Add a listener to the button that calls `this.start` on click.
     */
    private makeButtonStart() {
        const b = this.e.querySelector("button");
        if (b) {
            b.addEventListener("click", (e) => this.start(), {once: true, passive: true});
            b.addEventListener("touchstart", (e) => this.start(), {once: true, passive: true});
        }
    }

    private onWorkerError(e: any) {
        this.needsReInit = true;
        this.e.innerHTML = getErrorHTML(this.opts.solutionFieldName, this.lang, "Background worker error " + e.message);
        this.makeButtonStart();

        // Just out of precaution
        this.opts.forceJSFallback = true;
    }

    private initWorker() {
        if (this.worker) this.worker.terminate();

        const workerBlob = new Blob([workerString] as any, { type: "text/javascript" });
        this.worker = new Worker(URL.createObjectURL(workerBlob));
        this.worker.onerror = (e: ErrorEvent) => this.onWorkerError(e);

        this.worker.onmessage = (e: any) => {
            if (this.hasBeenDestroyed) return;

            const data = e.data;
            if (!data) return;
            if (data.type === "progress") {
                updateProgressBar(this.e, data as ProgressMessage);
            } else if (data.type === "ready") {
                this.e.innerHTML = getReadyHTML(this.opts.solutionFieldName, this.lang);
                this.makeButtonStart();
                this.opts.readyCallback();
            } else if (data.type === "started") {
                this.e.innerHTML = getRunningHTML(this.opts.solutionFieldName, this.lang);
                this.opts.startedCallback();
            } else if (data.type === "done") {
                const solutionPayload = this.handleDone(data);
                this.opts.doneCallback(solutionPayload);
                const callback = this.e.dataset["callback"];
                if (callback) {
                    (window as any)[callback](this);
                }
            } else if (data.type === "error") {
                this.onWorkerError(data);
            }
        };
    }

    private expire() {
        this.e.innerHTML = getExpiredHTML(this.opts.solutionFieldName, this.lang);
        this.makeButtonStart();
    }

    public async start() {
        if (this.hasBeenDestroyed) {
            console.error("Can not start FriendlyCaptcha widget which has been destroyed")
            return;
        }

        this.hasBeenStarted = true;
        const sitekey = this.e.dataset["sitekey"];
        if (!sitekey) {
            console.error("FriendlyCaptcha: sitekey not set on frc-captcha element");
            this.e.innerHTML = getErrorHTML(this.opts.solutionFieldName, this.lang, "Website problem: sitekey not set", false);
            return;
        }

        if (this.needsReInit) {
            this.needsReInit = false;
            this.init(true);
            return;
        }

        try {
            this.e.innerHTML = getFetchingHTML(this.opts.solutionFieldName, this.lang);
            this.puzzle = decodeBase64Puzzle(await getPuzzle(this.opts.puzzleEndpoint, sitekey));
            setTimeout(() => this.expire(), this.puzzle.expiry - 30000); // 30s grace
        } catch(e) {
            this.e.innerHTML = getErrorHTML(this.opts.solutionFieldName, this.lang, e.toString());
            this.makeButtonStart();
            const code = "error_getting_puzzle";

            this.opts.errorCallback({code, description: e.toString(), error: e});
            const callback = this.e.dataset["callback-error"];
            if (callback) {
                (window as any)[callback](this);
            }
            return;
        }
        this.worker!.postMessage({type: "start", buffer: this.puzzle!.buffer, n: this.puzzle!.n, threshold: this.puzzle!.threshold});
    }

    /**
     * This is to be called when the puzzle has been succesfully completed.
     * Here the hidden field gets updated with the solution.
     * @param data message from the webworker
     */
    private handleDone(data: DoneMessage) {
        this.valid = true;
        const puzzleSolutionMessage = `${this.puzzle!.signature}.${this.puzzle!.base64}.${encode(data.solution)}.${encode(data.diagnostics)}`;
        this.e.innerHTML = getDoneHTML(this.opts.solutionFieldName, this.lang, puzzleSolutionMessage, data);
        if (this.worker) this.worker.terminate();
        // this.worker = null; // This literally crashes very old browsers..
        this.needsReInit = true;
        
        return puzzleSolutionMessage;
    }

    /**
     * Cleans up the widget entirely, removing any DOM elements and terminating any background workers.
     * After it is destroyed it can no longer be used for any purpose.
     */
    public destroy() {
        if (this.worker) this.worker.terminate();
        this.worker = null;
        this.needsReInit = false;
        this.hasBeenStarted = false;
        if (this.e) {
            this.e.remove();
            delete this.e;
        }
        this.hasBeenDestroyed = true;
    }

    /**
     * Resets the widget to the initial state.
     * This is useful in situations where the page does not refresh when you submit and the form may be re-submitted again
     */
    public reset() {
        if (this.hasBeenDestroyed) {
            console.error("FriendlyCaptcha widget has been destroyed, it can not be used anymore");
            return;
        }

        if (this.worker) this.worker.terminate();
        this.worker = null;
        this.needsReInit = false;
        this.hasBeenStarted = false;
        this.init(this.opts.startMode === "auto" || this.e.dataset["start"] === "auto");
    }
}
