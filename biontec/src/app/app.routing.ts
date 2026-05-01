import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import {AuthGuard} from "./guards/auth.guard.ts";
import {ErrorComponent} from "./utils/error/error.component";
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./public/public.module')
      .then(m => m.PublicModule)
  },
  {
    path: 'admin', loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule), canActivate:[authGuard]
  },
  {
    path: 'auth', loadChildren: () => import('./auth/auth.module')
      .then(m => m.AuthModule)
  },

  { path: '**', component: ErrorComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouting { }



/*
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { ErrorComponent } from "./utils/error/error.component";

 *** renomear o .ts de app.routing.ts para app.routes.ts ***
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    component: ErrorComponent
  }
];
 */
