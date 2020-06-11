export function linq_sum<T>(users: T[], fnA?: (a: T) => number): number {
  if (fnA === undefined) {
    return (users as unknown[] as number[]).reduce((ty, u) => ty + u, 0);
  } else {
    return users.reduce((oa, u) => oa + fnA(u), 0);
  }
}
