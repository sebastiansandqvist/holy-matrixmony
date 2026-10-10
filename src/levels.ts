export const exampleLevel = `
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
#########################`.trim();

const EntityType = {
  Player: "player",
  Wall: "wall",
  Piece: "piece",
  Goal: "goal",
  // None: "none",
} as const;

type EntityType = (typeof EntityType)[keyof typeof EntityType];

type ParsedEntity = {
  entity: EntityType;
  x: number;
  y: number;
  ax: number;
  ay: number;
};

const entityByChar: Record<string, Pick<ParsedEntity, "entity">> = {
  "@": { entity: "player" },
  "#": { entity: "wall" },
  p: { entity: "piece" },
  g: { entity: "goal" },
};

export function parseLevel(level: string) {
  const entities: ParsedEntity[] = [];
  const lines = level.split("\n");
  for (const [y, line] of lines.entries()) {
    for (const [x, char] of line.split("").entries()) {
      const parsed = entityByChar[char];
      if (parsed) {
        entities.push({ ...parsed, x, y, ax: x, ay: y });
      }
    }
  }
  return {
    level: {
      height: lines.length,
      width: lines[0]!.length,
    },
    entities,
  };
}

const example = parseLevel(exampleLevel);

const alphabet = "0123456789abcdefghikjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~_";

function toOneBase64(position: number) {
  return alphabet[position];
}

function toTwoBase64(position: number) {
  const one = Math.floor(position / 64);
  const two = position % 64;
  return `${alphabet[one]}${alphabet[two]}`;
}

function fromOneBase64(char: string) {
  return alphabet.indexOf(char);
}

function fromTwoBase64([one, two]: [string, string]) {
  const a = alphabet.indexOf(one) * 64;
  const b = alphabet.indexOf(two);
  return a + b;
}

export function decode(input: string) {
  const width = fromOneBase64(input[0]!);
  const height = fromOneBase64(input[1]!);
  const [wallsRaw, goalsRaw, piecesRaw, playersRaw] = input.slice(2).split("-");
  const inputEntities = [
    { entity: "wall" as const, input: wallsRaw },
    { entity: "goal" as const, input: goalsRaw },
    { entity: "piece" as const, input: piecesRaw },
    { entity: "player" as const, input: playersRaw },
  ];

  const simpleEntities: Pick<ParsedEntity, "entity" | "x" | "y">[] = [];
  // implied walls
  {
    for (let i = 0; i < width; i++) {
      simpleEntities.push({ entity: "wall", x: i, y: 0 });
      simpleEntities.push({ entity: "wall", x: i, y: height - 1 });
    }
    for (let i = 1; i < height - 1; i++) {
      simpleEntities.push({ entity: "wall", x: 0, y: i });
      simpleEntities.push({ entity: "wall", x: width - 1, y: i });
    }
  }

  for (const { entity, input } of inputEntities) {
    for (let i = 0; i < input!.length; i += 2) {
      const one = input![i]!;
      const two = input![i + 1]!;
      const pos = fromTwoBase64([one, two]);
      const x = pos % width;
      const y = Math.floor(pos / width);
      simpleEntities.push({ entity: entity, x, y });
    }
  }

  const entities = simpleEntities.map((entity) => ({
    ...entity,
    ax: entity.x,
    ay: entity.y,
  }));

  return {
    level: { width, height },
    entities,
  };
}

export function encode({ level, entities }: ReturnType<typeof parseLevel>) {
  const level1D = entities
    .filter(({ x, y }) => {
      if (x === 0) return false;
      if (y === 0) return false;
      if (x === level.width - 1) return false;
      if (y === level.height - 1) return false;
      return true;
    })
    .map(({ x, y, entity }) => ({
      entity,
      position: x + y * level.width,
    }));
  const walls = level1D.filter(({ entity }) => entity === "wall").map(({ position }) => position);
  const goals = level1D.filter(({ entity }) => entity === "goal").map(({ position }) => position);
  const pieces = level1D.filter(({ entity }) => entity === "piece").map(({ position }) => position);
  const players = level1D.filter(({ entity }) => entity === "player").map(({ position }) => position);

  // [w] [h] [w...]-[g...]-[p...]-[@...]
  return `
${toOneBase64(level.width)}
${toOneBase64(level.height)}
${walls.map(toTwoBase64).join("")}
-
${goals.map(toTwoBase64).join("")}
-
${pieces.map(toTwoBase64).join("")}
-
${players.map(toTwoBase64).join("")}
`
    .trim()
    .split("\n")
    .join("");
}
//
// export const exampleLevel2 = `
// ##########
// # p  @   #
// #    #   #
// #    ggg #
// ##########
// `.trim();
//
// console.log(parseLevel(exampleLevel2));
// console.log(encode(parseLevel(exampleLevel2)));
// console.log(decode(encode(parseLevel(exampleLevel2))));
