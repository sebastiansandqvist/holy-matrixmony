import type { State } from "./state";
import { keyboard, gamepads, Button } from "@spud.gg/api";
import { decay } from "./helpers";

function updateLevel(state: State) {
  state.level = structuredClone(state.campaign[state.campaignIndex]!);
  state.initialLevel = structuredClone(state.campaign[state.campaignIndex]!);
  state.history = [];
}

export function fixedUpdate(state: State, dt: number) {
  if (!state.initialized) {
    if (state.mode === "campaign") {
      updateLevel(state);
    }
    state.initialized = true;
  }

  const motion = gamepads.singlePlayer.leftStick.motion();
  const players = state.level.entities.filter(({ entity }) => entity === "player");
  const walls = state.level.entities.filter(({ entity }) => entity === "wall");

  const attempted = { x: 0, y: 0 };
  const movement = {
    left:
      keyboard.justPressed("ArrowLeft") ||
      keyboard.justPressed("w") ||
      gamepads.singlePlayer.justPressed(Button.DpadLeft) ||
      motion.justMoved.Left,
    right:
      keyboard.justPressed("ArrowRight") ||
      keyboard.justPressed("d") ||
      gamepads.singlePlayer.justPressed(Button.DpadRight) ||
      motion.justMoved.Right,
    up:
      keyboard.justPressed("ArrowUp") ||
      keyboard.justPressed("w") ||
      gamepads.singlePlayer.justPressed(Button.DpadUp) ||
      motion.justMoved.Up,
    down:
      keyboard.justPressed("ArrowDown") ||
      keyboard.justPressed("s") ||
      gamepads.singlePlayer.justPressed(Button.DpadDown) ||
      motion.justMoved.Down,
  };

  if (movement.left) attempted.x -= 1;
  if (movement.right) attempted.x += 1;
  if (movement.down) attempted.y += 1;
  if (movement.up) attempted.y -= 1;

  if (keyboard.justPressed("r") || gamepads.singlePlayer.justPressed(Button.Select)) {
    state.level = structuredClone(state.initialLevel);
    state.history = [];
  }

  if (keyboard.justPressed("u") || gamepads.singlePlayer.justPressed(Button.North)) {
    const historyItem = state.history.pop();
    if (historyItem) {
      state.level = historyItem;
    }
  }

  let valid = true;

  for (const player of players) {
    const potentialPlayerX = player.x + attempted.x;
    const potentialPlayerY = player.y + attempted.y;

    for (const wall of walls) {
      if (potentialPlayerX === wall.x && potentialPlayerY === wall.y) {
        valid = false;
      }
    }
  }

  if (valid && (attempted.x != 0 || attempted.y != 0)) {
    state.history.push(structuredClone(state.level));

    players.forEach((player) => {
      player.x += attempted.x;
      player.y += attempted.y;

      // check for new connected pieces
      const cardinalDirs = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ];
      for (const dir of cardinalDirs) {
        const neighborX = player.x + dir.x;
        const neighborY = player.y + dir.y;
        const neighbor = state.level.entities.find(({ x, y }) => x === neighborX && y === neighborY);
        if (neighbor && neighbor.entity === "piece") {
          neighbor.entity = "player";
        }
      }
    });
  }

  const goals = state.level.entities.filter(({ entity }) => entity === "goal");
  const won = goals.every((goal) => players.find(({ x, y }) => x === goal.x && y === goal.y));
  if (won && state.mode === "campaign") {
    // TODO: transition to win animation
    state.campaignIndex++;
    updateLevel(state);
  }

  keyboard.clearInputs();
  gamepads.clearInputs();
}

export function update(state: State, dt: number) {
  for (const entity of state.level.entities) {
    const animation = state.animations.get(entity.id);
    if (animation) {
      animation.x = decay(animation.x, entity.x, 20, dt);
      animation.y = decay(animation.y, entity.y, 20, dt);
    } else {
      state.animations.set(entity.id, { x: entity.x, y: entity.y });
    }
  }
}

export function render(state: State, ctx: CanvasRenderingContext2D) {
  const { width, height } = state.bounds;
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "white";

  // draw level
  {
    const gridPixelSize = 20;

    for (const entity of state.level.entities) {
      const location = state.animations.get(entity.id) ?? entity;
      const x = location.x * gridPixelSize;
      const y = location.y * gridPixelSize;

      const EntityToColorMap = {
        player: "green",
        wall: "white",
        piece: "blue",
        goal: "red",
      } as const;

      ctx.fillStyle = EntityToColorMap[entity.entity];
      ctx.fillRect(x, y, gridPixelSize, gridPixelSize);
    }

    const players = state.level.entities.filter(({ entity }) => entity === "player");
    const goals = state.level.entities.filter(({ entity }) => entity === "goal");
    const won = goals.every((goal) => players.find(({ x, y }) => x === goal.x && y === goal.y));
    if (won) {
      ctx.font = "100px sans-serif";
      ctx.fillText("you win!", 100, 100);
    }
  }
}
