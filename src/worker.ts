import { getPuzzleSolverInputs } from "friendly-pow/puzzle";
import { getWasmSolver } from "friendly-pow/api/wasm";
import { getJSSolver } from "friendly-pow/api/js";
import { createDiagnosticsBuffer } from "friendly-pow/diagnostics";
import { SOLVER_TYPE_JS, SOLVER_TYPE_WASM } from "friendly-pow/constants";
import { Solver, StartMessage, DoneMessage, ProgressMessage } from "./types";

if (!Uint8Array.prototype.slice) {
  Object.defineProperty(Uint8Array.prototype, "slice", {
    value: function (begin: number, end: number) {
      return new Uint8Array(Array.prototype.slice.call(this, begin, end));
    },
  });
}

// Not technically correct, but it makes TS happy..
// @ts-ignore
declare var self: Worker;

(self as any).ASC_TARGET = 0;

// 1 for JS, 2 for WASM
let solverType: 1 | 2;

// Puzzle consisting of zeroes
let setSolver: (s: Solver) => void;
let solver: Promise<Solver> = new Promise((resolve) => (setSolver = resolve));
let hasStarted = false;

self.onerror = (evt: any) => {
  self.postMessage({
    type: "error",
    message: JSON.stringify(evt),
  });
};

self.onmessage = async (evt: any) => {
  const data = evt.data;
  const type = data.type;
  try {
    if (type === "module") {
      const s = await getWasmSolver(data.module);
      self.postMessage({
        type: "ready",
        solver: SOLVER_TYPE_WASM,
      });
      solverType = SOLVER_TYPE_WASM;
      setSolver(s);
    } else if (type === `js`) {
      const s = await getJSSolver();
      self.postMessage({
        type: "ready",
        solver: SOLVER_TYPE_JS,
      });
      solverType = SOLVER_TYPE_JS;
      setSolver(s);
    } else if (type === "start") {
      if (hasStarted) {
        return;
      }
      hasStarted = true;
      const solve = await solver;

      self.postMessage({
        type: "started",
      });
      let solverStartTime = Date.now();
      let totalH = 0;
      const starts = getPuzzleSolverInputs((data as StartMessage).buffer, (data as StartMessage).n);
      const solutionBuffer = new Uint8Array(8 * (data as StartMessage).n);
      // Note: var instead of const for IE11 compat
      for (var i = 0; i < starts.length; i++) {
        const startTime = Date.now();
        let solution!: Uint8Array;
        for (var b = 0; b < 256; b++) {
          // In the very unlikely case no solution is found we should try again
          starts[i][123] = b;
          const [s, hash] = solve(starts[i], (data as StartMessage).threshold);
          if (hash.length === 0) {
            // This should be very small in probability unless you set the difficulty much too high.
            // Also this means 2^32 puzzles were evaluated, which takes a while in a browser!
            // As we try 256 times, this is not fatal
            console.warn("FC: Internal error or no solution found");
            continue;
          }
          solution = s;
          break;
        }
        const view = new DataView(solution.slice(-4).buffer);
        const h = view.getUint32(0, true);
        const t = (Date.now() - startTime) / 1000;
        totalH += h;

        solutionBuffer.set(solution.slice(-8), i * 8); // The last 8 bytes are the solution nonce
        self.postMessage({
          type: "progress",
          n: data.n,
          h: h,
          t: t,
          i: i,
        } as ProgressMessage);
      }
      const totalTime = (Date.now() - solverStartTime) / 1000;
      const doneMessage: DoneMessage = {
        type: "done",
        solution: solutionBuffer,
        h: totalH,
        t: totalTime,
        diagnostics: createDiagnosticsBuffer(solverType, totalTime),
        solver: solverType,
      };

      self.postMessage(doneMessage);
    }
  } catch (e) {
    setTimeout(() => {
      throw e;
    });
  }
};
