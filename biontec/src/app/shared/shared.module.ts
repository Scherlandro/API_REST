import { A11yModule } from "@angular/cdk/a11y";
import { CommonModule } from '@angular/common';
import {LOCALE_ID, NgModule} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormsModule } from "@angular/forms";
import { AppMaterialModule } from "./app-material/app-material.module";
import { ConfirmDiologComponent } from "./diolog_components/confirm-diolog/confirm-diolog.component";
import { DialogOpenSalesComponent } from "./diolog_components/dialog-open-sales/dialog-open-sales.component";
import { DialogLoginComponent } from "./diolog_components/dialog-login/dialog-login.component";
import { DialogOpenOsComponent } from "./diolog_components/dialog-open-os/dialog-open-os.component";
import { DialogProdutoComponent } from "./diolog_components/dialog-produto/dialog-produto.component";
import { DialogUsuarioComponent } from "./diolog_components/dialog-usuario/dialog-usuario.component";
import {DialogFuncionarioComponent} from "./diolog_components/dialog-funcionario/dialog-funcionario.component";
import {DialogClienteComponent} from "./diolog_components/dialog-cliente/dialog-cliente.component";
import { ErrorDiologComponent } from "./diolog_components/error-diolog/error-diolog.component";
import {CurrencyBRLPipe} from "./pipes/currency-brl.pipe";
import {DateLocalPipe} from "./pipes/date-local.pipe";
import { DialogContasReceberComponent } from './diolog_components/dialog-contas-receber/dialog-contas-receber.component';
import { DialogPagamentosComponent } from './diolog_components/dialog-pagamentos/dialog-pagamentos.component';
import { DialogParcelamentosComponent } from './diolog_components/dialog-parcelamentos/dialog-parcelamentos.component';
import { DialogPixComponent } from './diolog_components/dialog-pix/dialog-pix.component';


registerLocaleData(localePt);

@NgModule({
  declarations: [
   ErrorDiologComponent,
    ConfirmDiologComponent,
    DialogUsuarioComponent,
    DialogFuncionarioComponent,
    DialogClienteComponent,
    DialogLoginComponent,
    DialogProdutoComponent,
    DialogOpenSalesComponent,
    DialogOpenOsComponent,
    DialogOpenSalesComponent,
    CurrencyBRLPipe,
    DateLocalPipe,
    DialogContasReceberComponent,
    DialogPagamentosComponent,
    DialogParcelamentosComponent,
    DialogPixComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    A11yModule,
    FormsModule
  ],
  exports: [
    CurrencyBRLPipe,
    DateLocalPipe
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
})
export class SharedModule { }
