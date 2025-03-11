export const hsvToHex = (h: number, s: number, v: number): string => {
  // ESP32 uses 0-255 for all HSV components
  const hNorm = h / 255 * 360;
  const sNorm = s / 255;
  const vNorm = v / 255;

  let r: number, g: number, b: number;
  const i = Math.floor(hNorm / 60) % 6;
  const f = hNorm / 60 - i;
  const p = vNorm * (1 - sNorm);
  const q = vNorm * (1 - f * sNorm);
  const t = vNorm * (1 - (1 - f) * sNorm);

  switch (i) {
    case 0: r = vNorm; g = t; b = p; break;
    case 1: r = q; g = vNorm; b = p; break;
    case 2: r = p; g = vNorm; b = t; break;
    case 3: r = p; g = q; b = vNorm; break;
    case 4: r = t; g = p; b = vNorm; break;
    case 5: r = vNorm; g = p; b = q; break;
    default: r = 1; g = 1; b = 1; // Fallback white
  }

  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};