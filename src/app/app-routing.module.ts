import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouterState } from '@angular/router';
import { OneVerseComponent } from './one-verse/one-verse.component';
import { VersionParellelComponent } from './version-parellel/version-parellel.component';

// Ref: 為何用 hash # 舊方法, 而不用新方法, https://blog.csdn.net/gaomingyangc/article/details/79756564
// 因為, refresh 後, 會 404, 除非去改 server 端.
const urlDefault = 'bible/Ro1:1-5.太3:1';
// const urlDefault = 'bible/Ro1:1-2,3-5,2:1-3:1.太3:1', pathMatch: 'full'; // qsb-api 還沒修好
const routes: Routes = [
  { path: '', redirectTo: urlDefault, pathMatch: 'full' },
  { path: 'bible/:book/:ichap/:isec', component: OneVerseComponent },
  { path: 'bible/:book/:ichap', component: OneVerseComponent },
  { path: 'bible/:description', component: VersionParellelComponent },
  { path: 'bible', component: OneVerseComponent },
  { path: '**', redirectTo: urlDefault },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
