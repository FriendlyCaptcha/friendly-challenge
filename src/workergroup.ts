import { Puzzle } from "./puzzle";
import { getPuzzleSolverInputs } from "friendly-pow/puzzle";
import { createDiagnosticsBuffer } from "friendly-pow/diagnostics";
import { DoneMessage, ProgressMessage, MessageFromWorker, SolverMessage } from "./types";
// @ts-ignore
import workerString from "../dist/worker.min.js";

// Defensive init to make it easier to integrate with Gatsby and friends.
let URL: any;
if (typeof window !== "undefined") {
  URL = window.URL || window.webkitURL;
}

export class WorkerGroup {

  private workers: Worker[] = [];
  private numPuzzles = 0;
  private startTime = 0;
  private progress = 0;
  private totalHashes = 0;
  private puzzleSolverInputs: Uint8Array[] = [];
  private solutionBuffer: Uint8Array = new Uint8Array(0);
  // initialize some value, so ts is happy
  private solverType: 1 | 2 = 1;

  private readyCount = 0;
  private startCount = 0;
  private doneCount = 0;

  public progressCallback: (p: ProgressMessage) => any = () => 0;
  public readyCallback: () => any = () => 0;
  public startedCallback: () => any = () => 0;
  public doneCallback: (d: DoneMessage) => any = () => 0;
  public errorCallback: (e: any) => any = () => 0;

  public init() {
    if (this.workers.length > 0) {
      for (let i=0; i < this.workers.length; i++) {
        this.workers[i].terminate();
      }
    }

    this.progress = 0;
    this.totalHashes = 0;
    
    this.readyCount = 0;
    this.startCount = 0;
    this.doneCount = 0;

    // Setup four workers for now - later we could calculate this depending on the device
    this.workers = new Array(4);
    const workerBlob = new Blob([workerString] as any, { type: "text/javascript" });

    for (let i=0; i<this.workers.length; i++) {
      this.workers[i] = new Worker(URL.createObjectURL(workerBlob));
      this.workers[i].onerror = (e: ErrorEvent) => this.errorCallback(e);

      this.workers[i].onmessage = (e: any) => {
        const data: MessageFromWorker = e.data;
        if (!data) return;
        if (data.type === "progress") {
          this.progress++;
          this.totalHashes += data.h;
          this.progressCallback({
            n: this.numPuzzles,
            h: this.totalHashes,
            t: (Date.now() - this.startTime) / 1000,
            i: this.progress,
          });
        } else if (data.type === "ready") {
          this.readyCount++;
          this.solverType = data.solver;
          // We are ready, when all workers are ready
          if (this.readyCount == this.workers.length) {
            this.readyCallback();
          }
        } else if (data.type === "started") {
          this.startCount++;
          // We started, when the first worker starts working
          if (this.startCount == 1) {
            this.startTime = Date.now();
            this.startedCallback();
          }
        } else if (data.type === "done") {
          this.doneCount++;
          for (let i=data.startIndex; i<this.puzzleSolverInputs.length; i+=this.workers.length) {
            this.solutionBuffer.set(data.solution.subarray(i*8, i*8+8), i*8);
          }
          // We are done, when all workers are done
          if (this.doneCount == this.workers.length) {
            const totalTime = (Date.now() - this.startTime) / 1000;
            this.doneCallback({
              solution: this.solutionBuffer,
              h: this.totalHashes,
              t: totalTime,
              diagnostics: createDiagnosticsBuffer(this.solverType, totalTime),
              solver: this.solverType
            });
          }
        } else if (data.type === "error") {
          this.errorCallback(data);
        }
      };
    }
  }

  public setupSolver(forceJS = false) {
    const msg: SolverMessage = { type: "solver", forceJS: forceJS };
    for (let i=0; i<this.workers.length; i++) {
      this.workers[i].postMessage(msg);
    }
  }

  public start(puzzle: Puzzle) {
    this.puzzleSolverInputs = getPuzzleSolverInputs(puzzle.buffer, puzzle.n);
    this.solutionBuffer = new Uint8Array(8 * puzzle.n);
    this.numPuzzles = puzzle.n;

    for (let i=0; i<this.workers.length; i++) {
      this.workers[i].postMessage({
        type: "start",
        puzzleSolverInputs: this.puzzleSolverInputs,
        threshold: puzzle.threshold,
        n: puzzle.n,
        numWorkers: this.workers.length,
        startIndex: i,
      });
    }
  }

  public terminateWorkers() {
    if (this.workers.length == 0) return;
    for (let i=0; i<this.workers.length; i++) {
      this.workers[i].terminate();
    }
    this.workers = [];
  }

}