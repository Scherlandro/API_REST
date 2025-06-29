import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendasRoutingModule } from './vendas-routing.module';
import { CIndexComponent } from './c-index/c-index.component';
import { CEditComponent } from './c-edit/c-edit.component';
import { CAddComponent } from './c-add/c-add.component';
import { CDeleteComponent } from './c-delete/c-delete.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CIndexComponent,
    CEditComponent,
   /* CAddComponent,*/
    CDeleteComponent
  ],
  imports: [
    CommonModule,
    VendasRoutingModule,
    FormsModule
  ]
})
export class VendasModule { }
