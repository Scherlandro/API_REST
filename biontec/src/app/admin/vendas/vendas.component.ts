import {animate, state, style, transition, trigger} from "@angular/animations";
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {expand, of, timeout} from "rxjs";
import {catchError, delay, first} from "rxjs/operators";
import {DialogOpenSalesComponent} from "src/app/shared/diolog_components/dialog-open-sales/dialog-open-sales.component";
import {iItensVd} from "../../interfaces/itens-vd";
import {FaseVenda, iVendas} from "../../interfaces/vendas";
import {ItensVdService} from "../../services/itens-vd.service";
import {VendasService} from "../../services/vendas.service";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";
import {TokenService} from "../../services/token.service";
import {NotificationMgsService} from "../../services/notification-mgs.service";
import {iPagamento} from "../../interfaces/pagamento";
import {DialogPagamentosComponent} from "../../shared/diolog_components/dialog-pagamentos/dialog-pagamentos.component";


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

  @ViewChild('tableVd') tableVendas!: MatTable<any>;
  @ViewChild('tableItensVd') tableItensOS!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  displayedColumnsVd: string[] = ['nome_cliente', 'dt_venda', 'total_geral', 'opicao'];
  tbSourceVd$: MatTableDataSource<iVendas>;
  tbSourceItensVd$: MatTableDataSource<iItensVd>;
  tbData: any;
  displayedColumns: string[] = ['codigo', 'descricao', 'preco', 'qtd', 'soma', 'imagem', 'opicoes'];

  fase!: FaseVenda;
  venda!: iVendas;
  vendaControl = new FormControl();
  produtControl = new FormControl();
  itensVdFiltered: iItensVd[] = [];
  itensVd: iItensVd[] = [];


  constructor(
    private vendasService: VendasService,
    private itensVdService: ItensVdService,
    private tokenServer: TokenService,
    public notificationMsg: NotificationMgsService,
    public dialog: MatDialog,
  ) {
    this.tbSourceVd$ = new MatTableDataSource();
    this.tbSourceItensVd$ = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.listarVenda();
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
        this.tbSourceVd$.data = data;
        this.tbSourceVd$.paginator = this.paginator;
        this.spiner = false;
      });
  }

  toggleRow(element: any) {
    // Fechar todas as outras linhas expandidas
    this.tbSourceVd$.data.forEach((item:any) => {
      if (item !== element && item.isExpanded) {
        item.isExpanded = false;
      }
    });
    // Alternar o estado da linha clicada
    element.isExpanded = !element.isExpanded;

    if (element.isExpanded && element.itensVd) {
      var soma = 0;
      for (var i = 0; i < element.itensVd.length; i++) {
        soma += element.itensVd.map((p: iItensVd) => p.valorParcial)[i];
      }
      element.totalgeral = soma;
      this.tbSourceItensVd$.data = element.itensVd.map((item: iItensVd) => ({
        ...item,
        valVenda: item.valVenda,
        valorParcial: item.valorParcial
      }));
      this.updateVd(element);
    }
  }

   updateVd(vd: iVendas) {
    this.vendasService.updateVd(vd)
      .subscribe({
        next: (vdAtualizada) => {
          this.tbData?.close(vdAtualizada);
        },
        error: (err) => {
          this.onError('Erro ao atualizar a Venda');
          console.error(err);
        }
      });
    //  this.tbData.splice(this.ruwSelec, 1);
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

  openNewVd() {
    this.executarFluxoVenda('newVd');
  }

  editarVd(elementVd: iVendas) {
    this.executarFluxoVenda('editarVd', elementVd);
  }

  adicionarItenVd(elementVd: iVendas) {
    this.executarFluxoVenda('addItemVd', elementVd);
  }

  editarItemVd(elementItem: iItensVd) {

    this.executarFluxoVenda('editarItemVd', null, elementItem);
  }

  executarFluxoVenda(fase: FaseVenda, elementMain?: any, elementItem?: any) {
    let tagVd: boolean;
    let tagItemVd: boolean;

    switch (fase) {
      case 'newVd':
        tagVd = true;
        tagItemVd = false;
        break;
      case 'editarVd':
        tagVd = true;
        tagItemVd = false;
        break;
      case 'addItemVd':
        tagVd = true;
        tagItemVd = true;
        break;
      case 'editarItemVd':
        tagVd = false;
        tagItemVd = true;
        break;
      default:
        tagVd = false;
        tagItemVd = false;
    }

    const vdBase = {
      idVenda: elementMain?.idVenda || 0,
      nomeCliente: elementMain?.nomeCliente || '',
      dtVenda: elementMain?.dtVenda || new Date().toISOString(),
      ...elementMain // Mantém outras propriedades existentes
    };

    const itemBase = {
      idItensDaVd: elementItem?.idItensDaVd || 0,
      codProduto: elementItem?.codProduto || '',
      descricao: elementItem?.descricao || '',
      qtdVendidas: elementItem?.qtdVendidas || 1,
      valVenda: elementItem?.valVenda || 0,
      valorParcial: elementItem?.valorParcial || 0,
      total: elementItem?.total || 0,
      ...elementItem
    };

  const dialogRef =  this.dialog.open(DialogOpenSalesComponent, {
      data: {
        fase: fase,
        tagVd: tagVd,
        tagItemVd: tagItemVd,
        venda: {
          ...vdBase,
          itensVd: itemBase
        },
        itensVd: itemBase
      }
    });

     dialogRef.afterClosed().subscribe(res=>{
       if(res){
         if (fase === 'newVd') {
           // Adiciona a nova venda ao início da lista
           this.tbSourceVd$.data = [res, ...this.tbSourceVd$.data];
           this.notificationMsg.success('Venda iniciada com sucesso!');
         } else if (fase === 'addItemVd' || fase === 'editarItemVd') {
           // Se o retorno for um item ou venda atualizada,
           // recarregue a venda específica ou a lista
           this.listarVenda();
         }
       }
     });

     /*
     // Exemplo de lógica para atualizar apenas os itens daquela venda sem dar refresh na página toda
dialogRef.afterClosed().subscribe(novoItem => {
  if (novoItem && fase === 'addItemVd') {
    const venda = this.tbSourceVd$.data.find(v => v.idVenda === novoItem.codVenda);
    if (venda) {
      if (!venda.itensVd) venda.itensVd = [];
      venda.itensVd = [...venda.itensVd, novoItem];

      // Atualiza a fonte de dados da tabela interna que está visível
      this.tbSourceItensVd$.data = [...venda.itensVd];

      // Força o Material a ver a mudança na tabela principal
      this.tbSourceVd$.data = [...this.tbSourceVd$.data];
    }
  }
});
      */

  }

  deleteVd(eventVd: iVendas) {
    this.notificationMsg.openConfirmDialog('Tem certeza em REMOVER esta Venda?')
      .afterClosed().subscribe(res => {
      if (res) {
        this.vendasService.delete(eventVd.idVenda).subscribe({
          next: () => {
            this.tbSourceVd$.data = this.tbSourceVd$.data.filter(vd => vd.idVenda !== eventVd.idVenda);
            this.notificationMsg.warn('Deletado com sucesso!');
          },
          error: () => this.onError('Erro ao deletar no servidor')
        });
      }
    });
  }


  deleteElement(item: iItensVd) {
    this.notificationMsg.openConfirmDialog('Tem certeza em REMOVER este item ?')
      .afterClosed().subscribe(res => {
        if (!res) return;
        this.itensVdService.deleteItensVd(item).subscribe({
          next: () => {
          const vendaPai = this.tbSourceVd$.data.find(vd => vd.idVenda === item.codVenda);
          if (vendaPai && vendaPai?.itensVd) {

            vendaPai.itensVd = vendaPai.itensVd.filter((i:any) => i.idItensVd !== item.idItensVd);
            vendaPai.totalgeral = vendaPai.itensVd.reduce(
              (acc: number, cur:iItensVd)=> acc + (cur.valorParcial || 0), 0);

              this.tbSourceVd$.data = [...this.tbSourceVd$.data];
              this.tbSourceItensVd$.data = [...vendaPai.itensVd];
            }
          this.notificationMsg.warn('Item removido!');
        },
          error: (err)=> this.onError('Erro ao remover o item')
        });
      });
  }

  finalizarVenda(venda: any) {

    const novoPagamento: iPagamento = {
      valorPago: venda.totalgeral,
      formaPagamento: venda.formasDePagamento,
      origemId: venda.idVenda, // ID retornado após salvar a venda
      tipoOrigem: 'VENDA',
      status: 1
    }
      this.dialog.open(DialogPagamentosComponent, {

        //width: 'auto',*/
        data: {
            ...novoPagamento,
        }
      });
  }


}
