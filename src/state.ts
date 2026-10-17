import { createBounds } from "./canvas";
import { exampleLevel, parseLevel, encode, decode, Level } from "./levels";

export const state = {
  elapsedSeconds: 0,
  bounds: createBounds(),
  level: decode(encode(parseLevel(exampleLevel))),
  won: false,
  history: [] as Level[],
  animations: new Map<number, { x: number; y: number }>(),
};

export type State = typeof state;
