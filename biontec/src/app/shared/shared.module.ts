import { A11yModule } from "@angular/cdk/a11y";
import { CommonModule } from '@angular/common';
import {LOCALE_ID, NgModule} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormsModule } from "@angular/forms";
import { AppMaterialModule } from "./app-material/app-material.module";
import { ConfirmDiologComponent } from "./dialogs/confirm-diolog/confirm-diolog.component";
import { DialogOpenSalesComponent } from "./dialogs/dialog-open-sales/dialog-open-sales.component";
import { DialogLoginComponent } from "./dialogs/dialog-login/dialog-login.component";
import { DialogOpenOsComponent } from "./dialogs/dialog-open-os/dialog-open-os.component";
import { DialogProdutoComponent } from "./dialogs/dialog-produto/dialog-produto.component";
import { DialogUsuarioComponent } from "./dialogs/dialog-usuario/dialog-usuario.component";
import {DialogFuncionarioComponent} from "./dialogs/dialog-funcionario/dialog-funcionario.component";
import {DialogClienteComponent} from "./dialogs/dialog-cliente/dialog-cliente.component";
import { ErrorDiologComponent } from "./dialogs/error-diolog/error-diolog.component";
import {CurrencyBRLPipe} from "./pipes/currency-brl.pipe";
import {DateLocalPipe} from "./pipes/date-local.pipe";
import { DialogContasReceberComponent } from './dialogs/dialog-contas-receber/dialog-contas-receber.component';
import { DialogPagamentosComponent } from './dialogs/dialog-pagamentos/dialog-pagamentos.component';
import { DialogParcelamentosComponent } from './dialogs/dialog-parcelamentos/dialog-parcelamentos.component';
import { DialogPixComponent } from './dialogs/dialog-pix/dialog-pix.component';


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
