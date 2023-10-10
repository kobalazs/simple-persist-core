export interface Middleware<I, O> {
  onSet: (value: I) => O;
  onGet: (value: O | undefined | null) => I;
}
