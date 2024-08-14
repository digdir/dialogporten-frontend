type RGB = { r: number; g: number; b: number };

function generateHashCode(str: string): number {
  return str.split('').reduce((hash, char) => {
    return char.charCodeAt(0) + ((hash << 5) - hash);
  }, 0);
}

function hashCodeToHexColor(hash: number): string {
  return (hash & 0x00ffffff).toString(16).toUpperCase().padStart(6, '0');
}

function luminance(hexCode: string): number {
  const { r, g, b } = hexToRgb(hexCode);
  const [lR, lG, lB] = [r, g, b].map((v) => {
    const normalized = v / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return lR * 0.2126 + lG * 0.7152 + lB * 0.0722;
}

function hexToRgb(hex: string): RGB {
  const bigint = Number.parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
}

function adjustToDarkerColor(hexCode: string): string {
  const { r, g, b } = hexToRgb(hexCode);
  const rNew = Math.floor(r * 0.5);
  const gNew = Math.floor(g * 0.5);
  const bNew = Math.floor(b * 0.5);
  return rgbToHex(rNew, gNew, bNew);
}

function adjustToLighterColor(hexCode: string): string {
  const { r, g, b } = hexToRgb(hexCode);
  const rNew = Math.min(255, Math.floor(r + (255 - r) * 0.5));
  const gNew = Math.min(255, Math.floor(g + (255 - g) * 0.5));
  const bNew = Math.min(255, Math.floor(b + (255 - b) * 0.5));
  return rgbToHex(rNew, gNew, bNew);
}

export function fromStringToColor(
  name: string,
  profile: 'light' | 'dark',
): { backgroundColor: string; foregroundColor: string } {
  const hash = generateHashCode(name);
  let hexColor = hashCodeToHexColor(hash);
  const bgLuminance = luminance(hexColor);

  if (profile === 'light' && bgLuminance <= 0.7) {
    hexColor = adjustToLighterColor(hexColor);
  }

  if (profile === 'dark' && bgLuminance > 0.1) {
    hexColor = adjustToDarkerColor(hexColor);
  }

  return {
    backgroundColor: `#${hexColor}`,
    foregroundColor: profile === 'light' ? '#000000' : '#ffffff',
  };
}
