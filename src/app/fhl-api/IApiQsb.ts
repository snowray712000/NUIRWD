import { Observable } from 'rxjs';
import { QsbArgs, QsbResult } from './ApiQsb';
export interface IApiQsb {
  queryQsbAsync(args: QsbArgs): Observable<QsbResult>;
}
