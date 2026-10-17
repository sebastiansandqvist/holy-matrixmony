import { keyboard } from "@spud.gg/api";
import { scaleAndObserveCanvasSize } from "./canvas";
import { gameLoop } from "./gameLoop";
import { render, update, fixedUpdate } from "./gameplay";
import { state } from "./state";
import { encode, exampleLevel, parseLevel } from "./levels";

if (state.isEditorMode) {
  const getUrl = () => {
    const encoded = encode(parseLevel(editor.value));
    const url = window.location.origin;
    return `${url}?level=${encoded}`;
  };

  const updateUrlText = () => {
    output.value = getUrl();
  };


  // editor
  const editor = document.createElement("textarea");
  editor.style.width = "90vw";
  editor.style.height = "80vh";
  document.body.appendChild(editor);
  editor.value = exampleLevel;
  editor.onchange = updateUrlText;

  // output
  const output = document.createElement("input");
  output.style.width = "90vw";
  document.body.appendChild(output);
  updateUrlText();

  // button
  const openButton = document.createElement("button");
  openButton.textContent = "Open";
  document.body.appendChild(openButton);
  openButton.onclick = () => {
    window.open(getUrl());
  };

} else {
  keyboard.listen();
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: false })!;
  scaleAndObserveCanvasSize(ctx, state.bounds);

  gameLoop({ ctx, state, update, fixedUpdate, render });
  console.log(state.level);
}
