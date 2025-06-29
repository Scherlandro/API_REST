import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard.ts";
import {ErrorComponent} from "./utils/error/error.component";

const routes: Routes = [
/*  {path: '',component: HomeComponent },
  { path:'usuarios', canActivate:[AuthGuard],  component: UsuarioComponent },
  { path:'user-demo/:id',canActivate:[AuthGuard], component: UserDemoComponent },
  {path: 'clientes', canActivate:[AuthGuard], component: ClientesComponent},
  {path: 'produtos', canActivate:[AuthGuard],  component: ProductsComponent},
  {path: 'vendas', canActivate:[AuthGuard],  component: CheckoutComponent},
  {path: 'busca', canActivate:[AuthGuard],  component: ShoppingCartComponent },
  {path: 'login', component: LoginComponent},*/
  {
    path: '', loadChildren: () => import('./public/public.module')
      .then(m => m.PublicModule)
  },
  {
    path: 'admin', loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule), canActivate:[AuthGuard]
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
