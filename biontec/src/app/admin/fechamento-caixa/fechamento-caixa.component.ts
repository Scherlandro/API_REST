import { Component } from '@angular/core';
import {PagamentoService} from "../../services/pagmentos.service";
import {Pagamento} from "../../interfaces/pagamento";

@Component({
  selector: 'app-fechamento-caixa',
  templateUrl: './fechamento-caixa.component.html',
  styleUrls: ['./fechamento-caixa.component.css']
})
export class FechamentoCaixaComponent {
  dataConsulta: string = new Date().toISOString().split('T')[0];
  resumo: any[] = [];
  totalGeral: number = 0;

  constructor(private pagamentoService: PagamentoService) {}

  consultar() {
    this.pagamentoService.getFechamento(this.dataConsulta).subscribe(dados => {
      this.resumo = dados;
      this.totalGeral = dados.reduce((acc, obj:Pagamento) => acc + obj.valorPago, 0);
    });
  }
}
