import {animate, state, style, transition, trigger} from "@angular/animations";
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {expand, of, timeout} from "rxjs";
import {catchError, delay, first} from "rxjs/operators";
import {DialogOpenSalesComponent} from "src/app/shared/dialogs/dialog-open-sales/dialog-open-sales.component";
import {iItensVd} from "../../interfaces/itens-vd";
import {FaseVenda, iVendas} from "../../interfaces/vendas";
import {ItensVdService} from "../../services/itens-vd.service";
import {VendasService} from "../../services/vendas.service";
import {ErrorDiologComponent} from "../../shared/dialogs/error-diolog/error-diolog.component";
import {TokenService} from "../../services/token.service";
import {NotificationMgsService} from "../../services/notification-mgs.service";
import {iPagamento} from "../../interfaces/pagamento";
import {DialogPagamentosComponent} from "../../shared/dialogs/dialog-pagamentos/dialog-pagamentos.component";


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
    this.adapterFilterPredicate();
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
    // Se não houver elemento, sai do método e não faz nada.
    if (!element) return;
    // Fechar todas as outras linhas expandidas
    this.tbSourceVd$.data.forEach((item:any) => {
    //  if (item !== element && item.isExpanded) {
      if (item !== element) item.isExpanded = false;
    });
    // Alternar o estado da linha clicada
    element.isExpanded = !element.isExpanded;

    if (element.isExpanded ) {
      // Cálculo simplificado usando a função que criamos
      const novaSoma = this.calcularTotalVenda(element);

      // Só atualiza no servidor se o total mudou de fato
      if (element.totalgeral !== novaSoma) {
        element.totalgeral = novaSoma;
        this.updateVd(element);
      }

     // this.tbSourceItensVd$.data = [...element.itensVdDTO];
    }


/*    if (element.isExpanded && element.itensVdDTO) {
      const novaSoma = this.calcularTotalVenda(element);
      var soma = 0;
      for (var i = 0; i < element.itensVdDTO.length; i++) {
        soma += element.itensVdDTO.map((p: iItensVd) => p.valorParcial)[i];
      }
      element.totalgeral = soma;
      this.tbSourceItensVd$.data = element.itensVdDTO.map((item: iItensVd) => ({
        ...item,
        valVenda: item.valVenda,
        valorParcial: item.valorParcial
      }));

      this.updateVd(element);
    }*/
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

  adapterFilterPredicate(){
    // Customização do filtro para acessar propriedades aninhadas e buscas profundas de campos
      this.tbSourceVd$.filterPredicate = (data: iVendas, filter: string) => {
        const searchTerms = filter.toLowerCase();

        // Campos do Cliente
        const nome = data.cliente?.nomeCliente?.toLowerCase() || '';
        const cpf = data.cliente?.cpf?.toLowerCase() || '';
        const cnpj = data.cliente?.cnpj?.toLowerCase() || '';

        // Campos da Venda
        const idVenda = data.idVenda?.toString() || '';
        const funcionario = data.nomeFuncionario?.toLowerCase() || '';

        // Retorna verdadeiro se o termo de busca estiver em QUALQUER um desses campos
        return nome.includes(searchTerms) ||
          cpf.includes(searchTerms) ||
          cnpj.includes(searchTerms) ||
          idVenda.includes(searchTerms) ||
          funcionario.includes(searchTerms);
      };
    }

  aplicarFiltro(valor: string) {
    const filterValue = valor ? valor.toString().trim().toLowerCase() : '';
    this.tbSourceVd$.filter = filterValue;
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

  calcularTotalVenda(venda: any): number {
    const itens = venda.itensVdDTO || venda.itensVd || [];
    if (itens.length === 0) return 0;
    return itens.reduce((acc: number, item: any) => acc + (item.valorParcial || 0), 0);
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
      cliente: elementMain?.cliente || null,
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

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // 1. Recarrega os dados para garantir que temos a lista de itens atualizada do banco
        this.vendasService.getAllSales().subscribe(vendasAtualizadas => {
          this.tbSourceVd$.data = vendasAtualizadas;

          // 2. Localiza a venda que foi alterada (usando o codVenda do item retornado ou o id da venda)
          const idVendaAlterada = res.codVenda || res.idVenda;
          const vendaNoArray = this.tbSourceVd$.data.find(v => v.idVenda === idVendaAlterada);

          if (vendaNoArray) {
            // 3. Calcula o novo total com os itens que acabaram de chegar
            const novoTotal = this.calcularTotalVenda(vendaNoArray);
            vendaNoArray.totalgeral = novoTotal;

            // 4. SALVA NO BANCO IMEDIATAMENTE (O passo que estava faltando!)
            this.vendasService.updateVd(vendaNoArray).subscribe({
              next: () => {
                this.notificationMsg.success('Total da venda atualizado no servidor!');
                // Abre a linha para o usuário ver o resultado
                this.toggleRow(vendaNoArray);
              },
              error: () => this.onError('O item foi salvo, mas o total da venda não pôde ser atualizado.')
            });
          }
        });
      }
    });

  /*   dialogRef.afterClosed().subscribe(res=> {
       if (res) {
         if (fase === 'newVd') {
           // Adiciona a nova venda ao início da lista
           this.tbSourceVd$.data = [res, ...this.tbSourceVd$.data];
           this.notificationMsg.success('Venda iniciada com sucesso!');
         } else if (fase === 'addItemVd' || fase === 'editarItemVd') {
           this.vendasService.getAllSales().subscribe(data => {
             this.tbSourceVd$.data = data;

             // Se quisermos manter a linha que o usuário estava editando aberta e somada:
             const vendaEditada = this.tbSourceVd$.data.find(v => v.idVenda === (res.codVenda || res.idVenda));
             if (vendaEditada) {
               vendaEditada.totalgeral = this.calcularTotalVenda(vendaEditada);
               this.toggleRow(vendaEditada); // Abre a linha com o novo valor
             }
             //  this.listarVenda();
           });
         }
       }
     })*/
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
    this.notificationMsg.openConfirmDialog('Tem certeza em REMOVER este item?')
      .afterClosed().subscribe(res => {
      if (!res) return;

      this.itensVdService.deleteItensVd(item).subscribe({
        next: () => {
          const vendaPai = this.tbSourceVd$.data.find(vd => vd.idVenda === item.codVenda);

          if (vendaPai) {
            // Remove o item da lista local
            vendaPai.itensVd = vendaPai.itensVd.filter((i: any) => i.idItensVd !== item.idItensVd);

            // Recalcula o total
            vendaPai.totalgeral = this.calcularTotalVenda(vendaPai);

            // SALVA A VENDA COM O NOVO TOTAL (Importante!)
            this.vendasService.updateVd(vendaPai).subscribe(() => {
              this.tbSourceVd$.data = [...this.tbSourceVd$.data];
              this.notificationMsg.warn('Item removido e venda atualizada!');
            });
          }
        },
        error: (err) => this.onError('Erro ao remover o item')
      });
    });
  }

/*
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
  }*/

  finalizarOperacao(origem: iVendas) {

    const novoPagamento: iPagamento = {
      origemId: origem.idVenda,
      pagador: origem.cliente,
      tipoOrigem: 'VENDA',
      status: 1,
      dtPagamento: origem.dtVenda,
      valorPago: origem.totalgeral,
      formaPagamento: origem.formasDePagamento
    }
      this.dialog.open(DialogPagamentosComponent, {
        data: { ...novoPagamento }
      });
  }



}
