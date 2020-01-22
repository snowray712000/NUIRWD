import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OneVerseComponent } from './one-verse/one-verse.component';


const routes: Routes = [
  { path: '', redirectTo: 'bible/Ro', pathMatch: 'full' },
  { path: 'bible/:book/:ichap/:isec', component: OneVerseComponent },
  { path: 'bible/:book/:ichap', component: OneVerseComponent },
  { path: 'bible/:book', component: OneVerseComponent },
  { path: 'bible', component: OneVerseComponent },
  { path: '**', redirectTo: 'bible/Ro' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
