import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuComponent } from './menu/menu.component';
import { AheaderComponent } from './aheader/aheader.component';
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {AppMaterialModule} from "../shared/app-material/app-material.module";
import {MatSidenavModule} from "@angular/material/sidenav";
import {ClientesComponent} from "./clientes/clientes.component";
import {UsuariosComponent} from "./usuarios/usuarios.component";
import {ProductsComponent} from "./products/products.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatPaginatorModule} from "@angular/material/paginator";
import {A11yModule} from "@angular/cdk/a11y";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatSortModule} from "@angular/material/sort";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { ContabilidadeComponent } from './contabilidade/contabilidade.component';
import {HighchartsChartModule} from "highcharts-angular";
import {VendaComponent} from "./vendas/vendas.component";
import {CAddComponent} from "./vendas/c-add/c-add.component";
import {OrdemDeServiceComponent} from "./ordem-de-service/ordem-de-service.component";


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
    OrdemDeServiceComponent
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
