import { createBounds } from "./canvas";
import { decode, encode, exampleLevel, Level, parseLevel } from "./levels";

const levelQueryParam = new URLSearchParams(window.location.search).get("level");
const level = decode(levelQueryParam ?? encode(parseLevel(exampleLevel)));

export const state = {
  isEditorMode: !levelQueryParam,
  elapsedSeconds: 0,
  bounds: createBounds(),
  initialLevel: structuredClone(level),
  level,
  won: false,
  history: [] as Level[],
  animations: new Map<number, { x: number; y: number }>(),
};

export type State = typeof state;
