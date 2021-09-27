import { Puzzle } from "./puzzle";
import { getPuzzleSolverInputs } from "friendly-pow/puzzle";
import { createDiagnosticsBuffer } from "friendly-pow/diagnostics";
import { ReadyMessage, DoneMessage, DonePartMessage, ProgressMessage, ProgressPartMessage } from "./types";
// @ts-ignore
import workerString from "../dist/worker.min.js";

export class WorkerGroup {

  private workers: Worker[] = [];
  private numPuzzles: number = 0;
  private startTime: number = 0;
  private progress: number = 0;
  private totalHashes: number = 0;
  private puzzleSolverInputs: Uint8Array[] = [];
  private solutionBuffer: Uint8Array = new Uint8Array(0);
  // initialize some value, so ts is happy
  private solverType: 1 | 2 = 1;

  private readyCount: number = 0;
  private startCount: number = 0;
  private doneCount: number = 0;

  public progressCallback: (p:ProgressMessage) => any = () => {};
  public readyCallback: () => any = () => {};
  public startedCallback: () => any = () => {};
  public doneCallback: (d:DoneMessage) => any = () => {};
  public errorCallback: (e:any) => any = () => {};

  public init() {
    if (this.workers.length > 0) {
      for (var i=0; i < this.workers.length; i++) {
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

    for (var i=0; i<4; i++) {
      this.workers[i] = new Worker(URL.createObjectURL(workerBlob));
      this.workers[i].onerror = (e: ErrorEvent) => this.errorCallback(e);

      this.workers[i].onmessage = (e: any) => {
        const data = e.data;
        if (!data) return;
        if (data.type === "progress") {
          this.progress++;
          this.totalHashes += (data as ProgressPartMessage).h;
          this.progressCallback({
            n: this.numPuzzles,
            h: this.totalHashes,
            t: (Date.now() - this.startTime) / 1000,
            i: this.progress,
          });
        } else if (data.type === "ready") {
          console.log("ready");
          this.readyCount++;
          this.solverType = (data as ReadyMessage).solver;
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
          console.log("Solution Buffer length: ", this.solutionBuffer.length);
          for (var i=(data as DonePartMessage).startIndex; i<this.puzzleSolverInputs.length; i+=this.workers.length) {
            console.log("Range: from ", i*8, " to ", i*8+8);
            this.solutionBuffer.set((data as DonePartMessage).solution.subarray(i*8, i*8+8), i*8);
          }
          // We are done, when all workers are done
          if (this.doneCount == this.workers.length) {
            let totalTime = (Date.now() - this.startTime) / 1000;
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
      }
    }
  }

  public setupSolver(forceJS = false) {
    for (var i=0; i<this.workers.length; i++) {
      this.workers[i].postMessage({ type: "solver", data: {forceJS: forceJS} });
    }
  }

  public start(puzzle: Puzzle) {
    this.puzzleSolverInputs = getPuzzleSolverInputs(puzzle.buffer, puzzle.n);
    this.solutionBuffer = new Uint8Array(8 * puzzle.n);
    this.numPuzzles = puzzle.n;

    for (var i=0; i<this.workers.length; i++) {
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
    for (var i=0; i<this.workers.length; i++) {
      this.workers[i].terminate();
    }
    this.workers = [];
  }

}