import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppMaterialModule} from "./app-material/app-material.module";
import {A11yModule} from "@angular/cdk/a11y";
import {FormsModule} from "@angular/forms";
import {ErrorDiologComponent} from "./diolog_components/error-diolog/error-diolog.component";
import {DialogLoginComponent} from "./diolog_components/dialog-login/dialog-login.component";
import {DialogClienteComponent} from "./diolog_components/dialog-cliente/dialog-cliente.component";
import {DialogProdutoComponent} from "./diolog_components/dialog-produto/dialog-produto.component";
import {DialogUsuarioComponent} from "./diolog_components/dialog-usuario/dialog-usuario.component";
import {ConfirmDiologComponent} from "./diolog_components/confirm-diolog/confirm-diolog.component";
import { DialogOpenSalesComponent } from './diolog_components/dialog-open-sales/dialog-open-sales.component';
import {DialogOpenOsComponent} from "./diolog_components/dialog-open-os/dialog-open-os.component";



@NgModule({
  declarations: [
   ErrorDiologComponent,
    ConfirmDiologComponent,
    DialogClienteComponent,
    DialogUsuarioComponent,
    DialogLoginComponent,
    DialogProdutoComponent,
    DialogOpenSalesComponent,
    DialogOpenOsComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    A11yModule,
    FormsModule
  ],
  exports:[]
})
export class SharedModule { }
