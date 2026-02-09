import {Component, Input, OnInit} from '@angular/core';
import {Pagamento} from "../../interfaces/pagamento";
import {PagamentoService} from "../../services/pagmentos.service";

@Component({
  selector: 'app-pagamento-lista',
  templateUrl: './pagamento-lista.component.html',
  styleUrls: ['./pagamento-lista.component.css']
})

export class PagamentoListaComponent implements OnInit {
  @Input() origemId!: number;
  @Input() tipoOrigem: string = 'VENDA';

  pagamentos: Pagamento[] = [];

  constructor(private service: PagamentoService) {}

  ngOnInit(): void {
    this.carregarPagamentos();
  }

  carregarPagamentos() {
    this.service.buscarPorOrigem(this.origemId, this.tipoOrigem)
      .subscribe(dados => this.pagamentos = dados);
  }

  getLabelStatus(status: number) {
    const labels = ['Pendente', 'Confirmado', 'Cancelado'];
    return labels[status] || 'Desconhecido';
  }

  estornar(idPagamento: any) {

  }
}
