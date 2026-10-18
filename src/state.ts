import { createBounds } from "./canvas";
import { decode, encode, exampleLevel, Level, parseLevel, campaign1, campaign2 } from "./levels";

const params = new URLSearchParams(window.location.search);
const levelQueryParam = params.get("level");
const mode = params.get('edit') ? 'edit' as const : levelQueryParam ? 'level' as const : 'campaign' as const;
const level = decode(levelQueryParam ?? encode(parseLevel(exampleLevel)))

export const state = {
  initialized: false,

  mode,
  elapsedSeconds: 0,
  bounds: createBounds(),
  initialLevel: structuredClone(level),
  level,
  won: false,
  history: [] as Level[],
  animations: new Map<number, { x: number; y: number }>(),

  campaign: [
     parseLevel(campaign1),
     parseLevel(campaign2)
  ],
  campaignIndex: 0,
};

export type State = typeof state;
