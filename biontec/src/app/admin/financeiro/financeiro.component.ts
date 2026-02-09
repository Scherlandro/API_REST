import {Component, OnInit} from '@angular/core';
import {ContasReceberService} from "../../services/contas-receber.service";

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.css']
})
export class FinanceiroComponent implements OnInit {
  listaAtrasados: any[] = [];
  totalAtrasado: number = 0;

  constructor(private contasReceberService: ContasReceberService) {}

  ngOnInit() {
    this.carregarRelatorio();
  }

  carregarRelatorio() {
    this.contasReceberService.getInadimplentes().subscribe(dados => {
      this.listaAtrasados = dados;
      this.totalAtrasado = dados.reduce((acc, item) => acc + item.valorParcela, 0);
    });
  }

  calcularDias(dataVencimento: any) {

  }
}
