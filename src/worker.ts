import { decode } from "friendly-pow/base64";
import { base64 } from "friendly-pow/wasm/optimized.wrap";
import { getWasmSolver } from "friendly-pow/api/wasm";
import { getJSSolver } from "friendly-pow/api/js";
import { SOLVER_TYPE_JS, SOLVER_TYPE_WASM } from "friendly-pow/constants";
import { Solver, DonePartMessage, ProgressPartMessage, MessageToWorker } from "./types";

if (!Uint8Array.prototype.slice) {
  Object.defineProperty(Uint8Array.prototype, "slice", {
    value: function (begin: number, end: number) {
      return new Uint8Array(Array.prototype.slice.call(this, begin, end));
    },
  });
}

// Not technically correct, but it makes TS happy..
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
declare let self: Worker;

(self as any).ASC_TARGET = 0;

// 1 for JS, 2 for WASM
let solverType: 1 | 2;

// Puzzle consisting of zeroes
let setSolver: (s: Solver) => void;
const solver: Promise<Solver> = new Promise((resolve) => (setSolver = resolve));
let hasStarted = false;

self.onerror = (evt: any) => {
  self.postMessage({
    type: "error",
    message: JSON.stringify(evt),
  });
};

self.onmessage = async (evt: any) => {
  const data: MessageToWorker = evt.data;
  try {
    /**
     * Compile the WASM and setup the solver.
     * If WASM support is not present, it uses the JS version instead.
     */
    if (data.type === "solver") {
      if (data.forceJS) {
        solverType = SOLVER_TYPE_JS;
        const s = await getJSSolver();
        setSolver(s);
      } else {
        try {
          solverType = SOLVER_TYPE_WASM;
          const module = WebAssembly.compile(decode(base64));
          const s = await getWasmSolver(await module);
          setSolver(s);
        } catch (e: any) {
          console.log(
            "FriendlyCaptcha failed to initialize WebAssembly, falling back to Javascript solver: " + e.toString()
          );
          solverType = SOLVER_TYPE_JS;
          const s = await getJSSolver();
          setSolver(s);
        }
      }
      self.postMessage({
        type: "ready",
        solver: solverType,
      });
    } else if (data.type === "start") {
      if (hasStarted) {
        return;
      }
      hasStarted = true;
      const solve = await solver;

      self.postMessage({
        type: "started",
      });

      let totalH = 0;
      const starts = data.puzzleSolverInputs;
      const solutionBuffer = new Uint8Array(8 * data.n);

      // In the case of 4 workers, the first worker will solve puzzle
      // 0, 4, 8, 12 etc
      for (let puzNum = data.startIndex; puzNum < starts.length; puzNum += data.numWorkers) {
        let solution!: Uint8Array;

        // We loop over a uint32 to find as solution, it is technically possible (but extremely unlikely - only possible with very high difficulty) that
        // there is no solution, here we loop over one byte further up too in case that happens.
        for (let b = 0; b < 256; b++) {
          starts[puzNum][123] = b;
          const [s, hash] = solve(starts[puzNum], data.threshold);
          if (hash.length === 0) {
            // This means 2^32 puzzles were evaluated, which takes a while in a browser!
            // As we try 256 times, this is not fatal
            console.warn("FC: Internal error or no solution found");
            totalH += Math.pow(2, 32) - 1;
            continue;
          }
          solution = s;
          break;
        }
        const view = new DataView(solution.slice(-4).buffer);
        const h = view.getUint32(0, true);
        totalH += h;

        solutionBuffer.set(solution.slice(-8), puzNum * 8); // The last 8 bytes are the solution nonce
        self.postMessage({
          type: "progress",
          h: h,
        } as ProgressPartMessage);
      }

      const doneMessage: DonePartMessage = {
        type: "done",
        solution: solutionBuffer,
        totalH: totalH,
        startIndex: data.startIndex,
      };

      self.postMessage(doneMessage);
    }
  } catch (e) {
    setTimeout(() => {
      throw e;
    });
  }
};
