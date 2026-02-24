import { Program, AnchorProvider } from "@coral-xyz/anchor";
import type { Nullgraph } from "./nullgraph_types";
import idl from "./nullgraph.json";
import { PROGRAM_ID } from "./constants";

export type NullGraphProgram = Program<Nullgraph>;

export function getProgram(provider: AnchorProvider): NullGraphProgram {
  return new Program(idl as Nullgraph, provider);
}

export { idl };
