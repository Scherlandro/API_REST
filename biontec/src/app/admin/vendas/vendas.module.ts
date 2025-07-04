import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CDeleteComponent } from './c-delete/c-delete.component';
import { CEditComponent } from './c-edit/c-edit.component';
import { VendasRoutingModule } from './vendas-routing.module';


@NgModule({
  declarations: [
    CEditComponent,
    CDeleteComponent
  ],
  imports: [
    CommonModule,
    VendasRoutingModule,
    FormsModule
  ]
})
export class VendasModule { }
