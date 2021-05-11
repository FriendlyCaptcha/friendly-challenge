export type Solver = (puzzleBuffer: Uint8Array, threshold: number, n?: number) => Uint8Array[];

export type InitMessage = WasmInitMessage | JSInitMessage;

export interface WasmInitMessage {
  type: "module";
  module: WebAssembly.Module;
}

export interface JSInitMessage {
  type: "js";
  module: WebAssembly.Module;
}

export interface StartMessage {
  type: "start";
  buffer: Uint8Array;
  threshold: number;
  /**
   * Number of puzzles to be solved.
   */
  n: number;
}

export interface ProgressMessage {
  type: "progress";
  /**
   * Number of solutions to be found in total
   */
  n: number;
  /**
   * Number of hashes it took to find this solution
   */
  h: number;
  /**
   * Time this solution took in seconds
   */
  t: number;
  /**
   * This is the i'th solution.
   */
  i: number;
}

export interface DoneMessage {
  type: "done";
  solution: Uint8Array;
  /**
   * Total number of hashes that were required
   */
  h: number;
  /**
   * Total time it took in seconds
   */
  t: number;
  diagnostics: Uint8Array;
  solver: 1 | 2;
}
