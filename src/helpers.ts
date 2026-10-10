import { lerp } from "@spud.gg/api/util";

export function decay(currentX: number, targetX: number, speed: number, dt: number) {
  const t = 1 - Math.exp(-speed * dt);
  return lerp(currentX, targetX, t);
}
