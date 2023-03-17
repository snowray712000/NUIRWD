import Enumerable from "linq";
import { VerCache } from "./VerCache";


export class VerGetDisplayName {
  main(na: string): string {
    const r1 = VerCache.s.getValue();
    const r2 = Enumerable.from(r1.record).firstOrDefault(a1 => a1.book == na);
    if (r2 == undefined) { return na; }
    return r2.cname;
  }
}
