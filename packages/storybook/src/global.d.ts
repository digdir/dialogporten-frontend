declare module 'get-contrast' {
  type Options = {
    ignoreAlpha: boolean;
  };

  export function ratio(colorOne: string, colorTwo: string, options?: Options): string;
  export function score(colorOne: string, colorTwo: string, options?: Options): string;
  export function isAccessible(colorOne: string, colorTwo: string, options?: Options): boolean;
  export function isNotTransparent(color: string, options?: Options): boolean;
}
