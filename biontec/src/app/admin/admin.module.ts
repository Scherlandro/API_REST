import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { A11yModule } from "@angular/cdk/a11y";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HighchartsChartModule } from "highcharts-angular";
import { AppMaterialModule } from "../shared/app-material/app-material.module";
import { AdminRoutingModule } from './admin-routing.module';
import { AheaderComponent } from './aheader/aheader.component';
import { ClientesComponent } from "./clientes/clientes.component";
import { ContabilidadeComponent } from './contabilidade/contabilidade.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { MenuComponent } from './menu/menu.component';
import { OrdemDeServiceComponent } from "./ordem-de-service/ordem-de-service.component";
import { ProductsComponent } from "./products/products.component";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { CAddComponent } from "./vendas/c-add/c-add.component";
import { CIndexComponent } from "./vendas/c-index/c-index.component";
import { VendaComponent } from "./vendas/vendas.component";


@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    MenuComponent,
    AheaderComponent,
    UsuariosComponent,
    ClientesComponent,
    ProductsComponent,
    ContabilidadeComponent,
    VendaComponent,
    CAddComponent,
    OrdemDeServiceComponent,
    CIndexComponent,
  ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        AppMaterialModule,
        ReactiveFormsModule,
        A11yModule,
        FormsModule,
        HighchartsChartModule
    ],

 // exports:[ErrorDiologComponent]
})
export class AdminModule { }
