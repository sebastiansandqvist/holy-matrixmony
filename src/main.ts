/*
  main.ts is the main entry point for your game.
*/

import { scaleAndObserveCanvasSize } from "./canvas";
import { gameLoop } from "./gameLoop";
import { render, update, fixedUpdate } from "./gameplay";
import { state } from "./state";
import './levels';
import { keyboard } from "@spud.gg/api";

keyboard.listen();

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d", { alpha: false })!;
scaleAndObserveCanvasSize(ctx, state.bounds);

gameLoop({ ctx, state, update, fixedUpdate, render });
