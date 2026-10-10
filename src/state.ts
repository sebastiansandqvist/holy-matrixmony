import { createBounds } from "./canvas";
import { exampleLevel, parseLevel, encode, decode } from "./levels";

export const state = {
  elapsedSeconds: 0,
  bounds: createBounds(),
  level: decode(encode(parseLevel(exampleLevel))),
  won: false,
};

export type State = typeof state;
