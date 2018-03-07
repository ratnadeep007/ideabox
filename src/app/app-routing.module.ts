import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NewComponent } from './new/new.component';
import { IdeaComponent } from './idea/idea.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'idea/:id',
    component: IdeaComponent
  },
  {
    path: 'new',
    component: NewComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
