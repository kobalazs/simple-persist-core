export interface Middleware<I, O> {
  encode: (value: I) => O;
  decode: (value: O | undefined | null) => I;
}
