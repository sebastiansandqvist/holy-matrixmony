import type { State } from "./state";
import { keyboard } from "@spud.gg/api";
import { decay } from "./helpers";

export function fixedUpdate(state: State, dt: number) {
  const players = state.level.entities.filter(({ entity }) => entity === "player");
  const walls = state.level.entities.filter(({ entity }) => entity === "wall");

  const attempted = { x: 0, y: 0 };

  if (keyboard.justPressed("ArrowLeft")) {
    attempted.x -= 1;
  }

  if (keyboard.justPressed("ArrowRight")) {
    attempted.x += 1;
  }

  if (keyboard.justPressed("ArrowDown")) {
    attempted.y += 1;
  }

  if (keyboard.justPressed("ArrowUp")) {
    attempted.y -= 1;
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

  if (valid) {
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

  // win
  {
    const players = state.level.entities.filter(({ entity }) => entity === "player");
    const goals = state.level.entities.filter(({ entity }) => entity === "goal");
    state.won = goals.every((goal) => players.find(({ x, y }) => x === goal.x && y === goal.y));
  }

  keyboard.clearInputs();
}

export function update(state: State, dt: number) {
  for (const entity of state.level.entities) {
    entity.ax = decay(entity.ax, entity.x, 20, dt);
    entity.ay = decay(entity.ay, entity.y, 20, dt);
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
      const x = entity.ax * gridPixelSize;
      const y = entity.ay * gridPixelSize;

      const EntityToColorMap = {
        player: "green",
        wall: "white",
        piece: "blue",
        goal: "red",
      } as const;

      ctx.fillStyle = EntityToColorMap[entity.entity];
      ctx.fillRect(x, y, gridPixelSize, gridPixelSize);
    }

    if (state.won) {
      ctx.font = "100px sans-serif";
      ctx.fillText("you win!", 100, 100);
    }
  }
}
