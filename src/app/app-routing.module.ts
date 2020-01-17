import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OneVerseComponent } from './one-verse/one-verse.component';


const routes: Routes = [
  { path: 'bible/:book/:ichap/:isec', component: OneVerseComponent },
  { path: 'bible/:book/:ichap', component: OneVerseComponent },
  { path: 'bible/:book', component: OneVerseComponent },
  { path: 'bible', component: OneVerseComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
