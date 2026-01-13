import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { A11yModule } from "@angular/cdk/a11y";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HighchartsChartModule } from "highcharts-angular";
import { AppMaterialModule } from "../shared/app-material/app-material.module";
import { AdminRoutingModule } from './admin-routing.module';
import { AheaderComponent } from './aheader/aheader.component';
import {FuncionariosComponent} from "./funcionarios/funcionarios.component";
import { ClientesComponent } from "./clientes/clientes.component";
import { ContabilidadeComponent } from './contabilidade/contabilidade.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { MenuComponent } from './menu/menu.component';
import { OrdemDeServiceComponent } from "./ordem-de-service/ordem-de-service.component";
import { ProductsComponent } from "./products/products.component";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { VendaComponent } from "./vendas/vendas.component";
import { CarrinhoDeComprasComponent } from './carrinho-de-compras/carrinho-de-compras.component';
import { NfeComponent } from './nfe/nfe.component';
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    MenuComponent,
    AheaderComponent,
    UsuariosComponent,
    FuncionariosComponent,
    ClientesComponent,
    ProductsComponent,
    ContabilidadeComponent,
    VendaComponent,
    OrdemDeServiceComponent,
    CarrinhoDeComprasComponent,
    NfeComponent,
  ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        AppMaterialModule,
        ReactiveFormsModule,
        A11yModule,
        FormsModule,
        HighchartsChartModule,
        SharedModule
    ],
})
export class AdminModule { }
