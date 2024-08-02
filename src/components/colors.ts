const xtermLevels = [0, 95, 135, 175, 215, 255];

export type RandomColorOptions = {
  allowBlack?: boolean;
  allowWhite?: boolean;
  allowGray?: boolean;
  maxAttempts?: number;
};

const randLevel = () => Math.floor(Math.random() * xtermLevels.length);

export default class Color {
  constructor(
    private readonly r: number,
    private readonly g: number,
    private readonly b: number
  ) {}

  public static randomXTermColor(options?: RandomColorOptions): Color {
    const allowBlack = options?.allowBlack ?? false;
    const allowWhite = options?.allowWhite ?? false;
    const allowGray = options?.allowGray ?? false;
    let maxAttempts = options?.maxAttempts ?? 10;
    if (maxAttempts < 0) {
      maxAttempts = 10;
    }
    for (let i = 0; i < maxAttempts; i++) {
      const r = xtermLevels[randLevel()];
      const g = xtermLevels[randLevel()];
      const b = xtermLevels[randLevel()];

      if (r === g && g === b) {
        if (!allowGray) {
          if (r === 0 && allowBlack) {
            return new Color(0, 0, 0);
          }

          if (r === 255 && allowWhite) {
            return new Color(255, 255, 255);
          }

          continue;
        }
      }

      return new Color(r, g, b);
    }

    throw new Error("too many attempts");
  }

  public toRGB(): string {
    return `rgb(${this.r},${this.g},${this.b})`;
  }

  public toHex(): string {
    return `#${this.r.toString(16).padStart(2, "0")}${this.g.toString(16).padStart(2, "0")}${this.b.toString(16).padStart(2, "0")}`
  }
}
