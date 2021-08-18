import { decode } from "friendly-pow/base64";
import { base64 } from "friendly-pow/wasm/optimized.wrap";
import { getWasmSolver } from "friendly-pow/api/wasm";
import { getJSSolver } from "friendly-pow/api/js";
import { SOLVER_TYPE_JS, SOLVER_TYPE_WASM } from "friendly-pow/constants";
import { Solver, StartMessage, DonePartMessage, ProgressPartMessage } from "./types";

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

    /**
     * Compile the WASM and setup the solver.
     * If WASM support is not present, it uses the JS version instead.
     */
    if (type === "solver") {
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
        } catch (e) {
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
    } else if (type === "start") {
      if (hasStarted) {
        return;
      }
      hasStarted = true;
      const solve = await solver;

      self.postMessage({
        type: "started",
      });
      let totalH = 0;
      const starts = (data as StartMessage).puzzleSolverInputs;
      const solutionBuffer = new Uint8Array(8 * (data as StartMessage).n);
      // Note: var instead of const for IE11 compat
      for (var i = (data as StartMessage).startIndex; i < starts.length; i+=(data as StartMessage).numWorkers) {
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
        totalH += h;

        solutionBuffer.set(solution.slice(-8), i * 8); // The last 8 bytes are the solution nonce
        self.postMessage({
          type: "progress",
          h: h
        } as ProgressPartMessage);
      }
      const doneMessage: DonePartMessage = {
        type: "done",
        solution: solutionBuffer,
        startIndex: (data as StartMessage).startIndex,
      };

      self.postMessage(doneMessage);
    }
  } catch (e) {
    setTimeout(() => {
      throw e;
    });
  }
};
