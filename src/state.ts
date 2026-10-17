import { createBounds } from "./canvas";
import { decode, encode, exampleLevel, Level, parseLevel } from "./levels";

const params = new URLSearchParams(window.location.search);
const levelQueryParam = params.get("level");
const level = decode(levelQueryParam ?? encode(parseLevel(exampleLevel)))
const mode = params.get('edit') ? 'edit' as const : levelQueryParam ? 'level' as const : 'campaign' as const;

export const state = {
  mode,
  elapsedSeconds: 0,
  bounds: createBounds(),
  initialLevel: structuredClone(level),
  level,
  won: false,
  history: [] as Level[],
  animations: new Map<number, { x: number; y: number }>(),
  campaign: [],
};

export type State = typeof state;
