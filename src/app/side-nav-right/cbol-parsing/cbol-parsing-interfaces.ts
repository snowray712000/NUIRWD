import { Observable } from 'rxjs';
export interface IEventVerseChanged {
  changed$: Observable<{ book: number, chap: number, verse: number }>;
}
