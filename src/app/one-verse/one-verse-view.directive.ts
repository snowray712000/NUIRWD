import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appOneVerseView]'
})
export class OneVerseViewDirective {

  constructor(public viewRef: ViewContainerRef) { }

}
