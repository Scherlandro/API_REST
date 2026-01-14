import {animate, state, style, transition, trigger} from "@angular/animations";
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {expand, of, timeout} from "rxjs";
import {catchError, delay, first} from "rxjs/operators";
import {DialogItensVdComponent} from "src/app/shared/diolog_components/dialog-itensvd/dialog-itensvd.component";
import {iItensVd} from "../../interfaces/itens-vd";
import {iVendas} from "../../interfaces/vendas";
import {ItensVdService} from "../../services/itens-vd.service";
import {VendasService} from "../../services/vendas.service";
import {DialogOpenSalesComponent} from "../../shared/diolog_components/dialog-open-sales/dialog-open-sales.component";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";
import {TokenService} from "../../services/token.service";
import {b2n} from "@kurkle/color";
import {iProduto} from "../../interfaces/product";
import {iServiceOrder} from "../../interfaces/service-order";
import {DialogOpenOsComponent} from "../../shared/diolog_components/dialog-open-os/dialog-open-os.component";
import {iItensOS} from "../../interfaces/itens-os";
import {NotificationMgsService} from "../../services/notification-mgs.service";


@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VendaComponent implements OnInit {
  spiner = false;
  isSearching= false;

  @ViewChild(MatTable) tableVendas!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  displayedColumnsVd: string[] = ['nome_cliente', 'dt_venda', 'total_geral', 'opicao'];
  tbSourceVd$: MatTableDataSource<iVendas>;
  tbSourceItensVd$: MatTableDataSource<iItensVd>;
  displayedColumns: string[] = ['codigo', 'descricao', 'preco', 'qtd', 'soma', 'data', 'imagem', 'opicoes'];

  vendaControl = new FormControl();
  produtControl = new FormControl();
  itensVdFiltered: iItensVd[] = [];
  itensVd: iItensVd[] = [];


  constructor(
    private vendasService: VendasService,
    private itensVdService: ItensVdService,
    private tokenServer: TokenService,
    public notificationMsg: NotificationMgsService,
    public dialog: MatDialog
  ) {
    this.tbSourceVd$ = new MatTableDataSource();
    this.tbSourceItensVd$ = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.listarVenda();
  }

  formatarDadosVendas(vendas: iVendas[]): iVendas[] {
    return vendas.map(venda => ({
      ...venda,
      totalgeral: this.formatarReal(venda.totalgeral)
    }));
  }

  listarVenda() {
    this.spiner = true;
    this.vendasService.getAllSales()
      .pipe(first(), delay(2000),catchError(error => {
        if (error === 'Session Expired')
        this.onError('Sua sessão expirou!');
        this.tokenServer.clearTokenExpired();
        return of([])
      }))
      .subscribe((data: iVendas[]) => {
        const dadosFormatados = this.formatarDadosVendas(data);
        this.tbSourceVd$.data = dadosFormatados;
        this.tbSourceVd$.paginator = this.paginator;
        this.spiner = false;
      });
  }

  toggleRow(element: any) {
    console.log('ID da Venda selecionada ==> ', element.idVenda);
    // Fechar todas as outras linhas expandidas
    this.tbSourceVd$.data.forEach((item:any) => {
      if (item !== element && item.isExpanded) {
        item.isExpanded = false;
      }
    });
    // Alternar o estado da linha clicada
    element.isExpanded = !element.isExpanded;
    // Se a linha foi expandida, carregar os dados
    if (element.isExpanded) {
      var soma = 0;
      for (var i = 0; i < element.itensVd.length; i++) {
        soma += element.itensVd.map((p: iItensVd) => p.valorParcial)[i];
      }
      element.totalgeral = soma;
      element.totalgeral = this.formatarReal(soma);
      this.tbSourceItensVd$.data = element.itensVd.map((item: iItensVd) => ({
        ...item,
        // Formata os valores individuais
        valVenda: this.formatarReal(item.valVenda),
        valorParcial: this.formatarReal(item.valorParcial)
      }));
    }
  }

  // Método para formatar valores para Real brasileiro
  formatarReal(valor: number | string): string {
    // Converte para número se for string
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;

    // Formata para Real brasileiro
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }


  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.tbSourceVd$.filter = valor;
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }


  editarVd(element: iVendas) {
    this.openDilogItenVd(element);
  }


  openDilogItenVd(vd: iVendas, item?: iItensVd) {
    const isEdit = !!item;
    const isNovaVD = !vd.itensVd; // nova venda recém criada

    const emptyItem: iItensVd = {
      idItensVd: 0,
      codVenda: vd.idVenda ?? 0,
      codProduto: '',
      descricao: '',
      valCompra: 0,
      valVenda: 0,
      qtdVendidas: 1,
      descPorUnidade: 0,
      valorParcial: 0,
      dtRegistro: '',
      fotoProduto: ''
    };

    const itens = isEdit ? item : emptyItem;

       this.dialog.open(DialogItensVdComponent, {
        data: {
          modoNew: isNovaVD ? 'adicionar' : 'editar',
          modo: isEdit ? 'editar' : 'adicionar',
          ...vd,
          itensVd: { ...itens, codVD: vd.idVenda }
        }
      });
  }

  openDilogVd(eventVd: iVendas) {

    const dialogRef = this.dialog.open(DialogOpenSalesComponent, {
      width: '300px',
      data: eventVd === null ? {
        idVenda: null,
        dtVenda: '',
        nomeFuncionario: '',
        nomeCliente: '',
        subtotal: null,
        desconto: null,
        totalgeral: null,
        formasDePagamento: "",
        qtdDeParcelas: null,
      } : {
        idVenda: eventVd.idVenda,
        dtVenda: eventVd.dtVenda,
        nomeFuncionario: eventVd.nomeFuncionario,
        nomeCliente: eventVd.nomeCliente,
        dt_venda: eventVd.dtVenda,
        subtotal: eventVd.subtotal,
        desconto: eventVd.desconto,
        totalgeral: eventVd.totalgeral,
        formasDePagamento: eventVd.formasDePagamento,
        qtdDeParcelas: eventVd.qtdDeParcelas,
      } });
  }
  deleteVd(eventVd: iVendas) {
    this.notificationMsg.openConfirmDialog('Tem certeza em REMOVER esta OS?')
      .afterClosed().subscribe(res => {
      if (res) {
        this.vendasService.delete(eventVd.idVenda).subscribe({
          next: () => {
            // Filtra o array removendo o item deletado
            this.tbSourceVd$.data = this.tbSourceVd$.data.filter(vd => vd.idVenda !== eventVd.idVenda);
            this.notificationMsg.warn('Deletado com sucesso!');
          },
          error: () => this.onError('Erro ao deletar no servidor')
        });
      }
    });
  }



}
