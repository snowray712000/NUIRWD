import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouterState } from '@angular/router';
import { OneVerseComponent } from './one-verse/one-verse.component';
import { VersionParellelComponent } from './version-parellel/version-parellel.component';


const routes: Routes = [
  { path: '', redirectTo: 'bible/Ro1:1-2,3-5,2:1-3:1.太3:1', pathMatch: 'full' },
  { path: 'bible/:book/:ichap/:isec', component: OneVerseComponent },
  { path: 'bible/:book/:ichap', component: OneVerseComponent },
  { path: 'bible/:description', component: VersionParellelComponent },
  { path: 'bible', component: OneVerseComponent },
  { path: '**', redirectTo: 'bible/Ro1:1-2,3-5,2:1-3:1.太3:1' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
