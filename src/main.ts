/*
  main.ts is the main entry point for your game.
*/

import { scaleAndObserveCanvasSize } from "./canvas";
import { gameLoop } from "./gameLoop";
import { render, update, fixedUpdate } from "./gameplay";
import { state } from "./state";
import "./levels";
import { keyboard } from "@spud.gg/api";
import { decode, encode, parseLevel } from "./levels";

const levelQueryParam = new URLSearchParams(window.location.search).get("level");

if (levelQueryParam) {
  keyboard.listen();
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: false })!;
  scaleAndObserveCanvasSize(ctx, state.bounds);

  gameLoop({ ctx, state, update, fixedUpdate, render });
  state.level = decode(levelQueryParam);
  console.log(state.level);
} else {
  // editor
  const editor = document.createElement("textarea");
  editor.style.width = "90vw";
  editor.style.height = "80vh";
  const output = document.createElement("output");
  document.body.appendChild(editor);
  document.body.appendChild(output);

  //   editor.value = `
  // ##########
  // # p  @   #
  // #    #   #
  // #    ggg #
  // ##########`.trim();

  editor.value = `
#########################
#                       #
#                       #
#                       #
#  @                    #
#                       #
#     p p p   #         #
#             #    g    #
#                 ggg   #
#                       #
#                       #
#                       #
#########################
`.trim();

  const updateUrlText = () => {
    const encoded = encode(parseLevel(editor.value));
    const url = window.location.origin;
    output.textContent = `${url}?level=${encoded}`;
  };

  updateUrlText();

  editor.onchange = updateUrlText;
}
