export function forceArray<A>(data: A | Array<A> | undefined): Array<A> {
  data = data || [];
  return Array.isArray(data) ? data : [data];
}
