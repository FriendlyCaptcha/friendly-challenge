import { encode } from "friendly-pow/base64";
import {
  getRunningHTML,
  getReadyHTML,
  getDoneHTML,
  updateProgressBar,
  findParentFormElement,
  executeOnceOnFocusInEvent,
  getErrorHTML,
  getFetchingHTML,
  injectStyle,
  getExpiredHTML,
} from "./dom";
import { isHeadless } from "./headless";
import { DoneMessage } from "./types";
import { Puzzle, decodeBase64Puzzle, getPuzzle } from "./puzzle";
import { Localization, localizations } from "./localization";
import { WorkerGroup } from "./workergroup";

const PUZZLE_ENDPOINT_URL = "https://api.friendlycaptcha.com/api/v1/puzzle";

export interface WidgetInstanceOptions {
  /**
   * Don't set this to true unless you want to see what the experience is like for people using very old browsers.
   * This does not increase security.
   */
  forceJSFallback: boolean;
  startMode: "auto" | "focus" | "none";
  puzzleEndpoint: string;
  language: keyof typeof localizations | Localization;
  solutionFieldName: "frc-captcha-solution";

  sitekey: string;

  readyCallback: () => any;
  startedCallback: () => any;
  doneCallback: (solution: string) => any;
  errorCallback: (error: any) => any;
}

export class WidgetInstance {
  private puzzle?: Puzzle;

  private workerGroup: WorkerGroup = new WorkerGroup();

  /**
   * The root element of this widget instance.
   * Warning: it is undefined after `destroy()` has been called.
   */
  private e!: HTMLElement & { friendlyChallengeWidget?: WidgetInstance };

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
    this.opts = Object.assign(
      {
        forceJSFallback: false,
        startMode: "focus",
        puzzleEndpoint: element.dataset["puzzleEndpoint"] || PUZZLE_ENDPOINT_URL,
        startedCallback: () => 0,
        readyCallback: () => 0,
        doneCallback: () => 0,
        errorCallback: () => 0,
        sitekey: element.dataset["sitekey"] || "",
        language: element.dataset["lang"] || "en",
        solutionFieldName: element.dataset["solutionFieldName"] || "frc-captcha-solution",
      },
      options
    );
    this.e = element;
    this.e.friendlyChallengeWidget = this;

    // Load language
    if (typeof this.opts.language === "string") {
      let l = (localizations as any)[this.opts.language.toLowerCase()];
      if (l === undefined) {
        console.error('FriendlyCaptcha: language "' + this.opts.language + '" not found.');
        // Fall back to English
        l = localizations.en;
      }
      this.lang = l;
    } else {
      // We assign to a copy of the English language localization, so that any missing values will be English
      this.lang = Object.assign(Object.assign({}, localizations.en), this.opts.language);
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
    this.initWorkerGroup();

    if (forceStart) {
      this.start();
    } else if (
      this.e.dataset["start"] !== "none" &&
      (this.opts.startMode === "focus" || this.e.dataset["start"] === "focus")
    ) {
      const form = findParentFormElement(this.e);
      if (form) {
        executeOnceOnFocusInEvent(form, () => this.start());
      } else {
        console.log("FriendlyCaptcha div seems not to be contained in a form, autostart will not work");
      }
    }
  }

  /**
   * Add a listener to the button that calls `this.start` on click.
   */
  private makeButtonStart() {
    const b = this.e.querySelector("button");
    if (b) {
      b.addEventListener("click", (e) => this.start(), { once: true, passive: true });
      b.addEventListener("touchstart", (e) => this.start(), { once: true, passive: true });
    }
  }

  private onWorkerError(e: any) {
    this.hasBeenStarted = false;
    this.needsReInit = true;
    this.e.innerHTML = getErrorHTML(this.opts.solutionFieldName, this.lang, "Background worker error " + e.message);
    this.makeButtonStart();

    // Just out of precaution
    this.opts.forceJSFallback = true;
  }

  private initWorkerGroup() {
    this.workerGroup.progressCallback = (progress) => {
      updateProgressBar(this.e, progress);
    };
    this.workerGroup.readyCallback = () => {
      this.e.innerHTML = getReadyHTML(this.opts.solutionFieldName, this.lang);
      this.makeButtonStart();
      this.opts.readyCallback();
    };
    this.workerGroup.startedCallback = () => {
      this.e.innerHTML = getRunningHTML(this.opts.solutionFieldName, this.lang);
      this.opts.startedCallback();
    };
    this.workerGroup.doneCallback = (data) => {
      const solutionPayload = this.handleDone(data);
      this.opts.doneCallback(solutionPayload);
      const callback = this.e.dataset["callback"];
      if (callback) {
        (window as any)[callback](solutionPayload);
      }
    };
    this.workerGroup.errorCallback = (e) => {
      this.onWorkerError(e);
    };

    this.workerGroup.init();
    this.workerGroup.setupSolver(this.opts.forceJSFallback);
  }

  private expire() {
    this.hasBeenStarted = false;
    this.e.innerHTML = getExpiredHTML(this.opts.solutionFieldName, this.lang);
    this.makeButtonStart();
  }

  public async start() {
    if (this.hasBeenDestroyed) {
      console.error("Can not start FriendlyCaptcha widget which has been destroyed");
      return;
    }

    if (this.hasBeenStarted) {
      console.warn("Can not start FriendlyCaptcha widget which has already been started");
      return;
    }

    const sitekey = this.opts.sitekey || this.e.dataset["sitekey"];
    if (!sitekey) {
      console.error("FriendlyCaptcha: sitekey not set on frc-captcha element");
      this.e.innerHTML = getErrorHTML(
        this.opts.solutionFieldName,
        this.lang,
        "Website problem: sitekey not set",
        false
      );
      return;
    }

    if (isHeadless()) {
      this.e.innerHTML = getErrorHTML(
        this.opts.solutionFieldName,
        this.lang,
        "Browser check failed, try a different browser",
        false,
        true
      );
      return;
    }

    if (this.needsReInit) {
      this.needsReInit = false;
      this.init(true);
      return;
    }

    this.hasBeenStarted = true;

    try {
      this.e.innerHTML = getFetchingHTML(this.opts.solutionFieldName, this.lang);
      this.puzzle = decodeBase64Puzzle(await getPuzzle(this.opts.puzzleEndpoint, sitekey, this.lang));
      setTimeout(() => this.expire(), this.puzzle.expiry - 30000); // 30s grace
    } catch (e: any) {
      this.hasBeenStarted = false;
      this.e.innerHTML = getErrorHTML(this.opts.solutionFieldName, this.lang, e.message);
      this.makeButtonStart();
      const code = "error_getting_puzzle";

      this.opts.errorCallback({ code, description: e.toString(), error: e });
      const callback = this.e.dataset["callback-error"];
      if (callback) {
        (window as any)[callback](this);
      }
      return;
    }

    this.workerGroup.start(this.puzzle);
  }

  /**
   * This is to be called when the puzzle has been succesfully completed.
   * Here the hidden field gets updated with the solution.
   * @param data message from the webworker
   */
  private handleDone(data: DoneMessage) {
    this.valid = true;
    const puzzleSolutionMessage = `${this.puzzle!.signature}.${this.puzzle!.base64}.${encode(data.solution)}.${encode(
      data.diagnostics
    )}`;
    this.e.innerHTML = getDoneHTML(this.opts.solutionFieldName, this.lang, puzzleSolutionMessage, data);
    // this.worker = null; // This literally crashes very old browsers..
    this.needsReInit = true;

    return puzzleSolutionMessage;
  }

  /**
   * Cleans up the widget entirely, removing any DOM elements and terminating any background workers.
   * After it is destroyed it can no longer be used for any purpose.
   */
  public destroy() {
    this.workerGroup.terminateWorkers();
    this.needsReInit = false;
    this.hasBeenStarted = false;
    if (this.e) {
      this.e.remove();
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
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

    this.workerGroup.terminateWorkers();
    this.needsReInit = false;
    this.hasBeenStarted = false;
    this.init(this.opts.startMode === "auto" || this.e.dataset["start"] === "auto");
  }
}
