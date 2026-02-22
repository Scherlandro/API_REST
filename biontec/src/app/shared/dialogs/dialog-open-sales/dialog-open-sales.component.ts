import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { iItensVd } from 'src/app/interfaces/itens-vd';
import { ItensVdService } from 'src/app/services/itens-vd.service';
import {FormControl, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {IFuncionario} from "../../../interfaces/funcionario";
import {ICliente} from "../../../interfaces/cliente";
import {FaseVenda, iVendas} from "../../../interfaces/vendas";
import {iProduto} from "../../../interfaces/product";
import {catchError, delay, first, startWith} from "rxjs/operators";
import {ProductService} from "../../../services/product.service";
import {FuncionarioService} from "../../../services/funcionario.service";
import {ClienteService} from "../../../services/cliente.service";
import {VendasService} from "../../../services/vendas.service";
import {TokenService} from "../../../services/token.service";
import {NotificationMgsService} from "../../../services/notification-mgs.service";
import {ErrorDiologComponent} from "../error-diolog/error-diolog.component";

@Component({
  selector: 'app-dialog-editor-itvd',
  templateUrl: './dialog-open-sales.component.html',
  styleUrls: ['./dialog-open-sales.component.css']
})
export class DialogOpenSalesComponent implements OnInit {

  destroy$ = new Subject<void>();
  venda!: iVendas;
  itensVd!: iItensVd;
  cliente$!: ICliente;
  tagVd: boolean;
  tagItemVd: boolean;
  fase: FaseVenda;
  vendaSelecionada!: iVendas;
  funcionarioControl = new FormControl('', [Validators.required]);
  funcionarioFilted!: Observable<IFuncionario[]>;
  clientesFiltradvenda!: Observable<ICliente[]>;
  clienteControl = new FormControl('', [Validators.required]);
  statusOsFiltradvenda!: Observable<any>;
  statusOsControl = new FormControl('', [Validators.required]);

  produtvenda: iProduto[] = [];
  produtoFiltered: iProduto[] = [];
  produtoControl: FormControl;
  quantidadeControl: FormControl;

  clientes: ICliente[] = [];
  itensVd$: iItensVd[] = [];
  etapa = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialogRef: MatDialogRef<DialogOpenSalesComponent>,
    public notificationMsg: NotificationMgsService,
    private tokenServer: TokenService,
    public vendaServices: VendasService,
    public dialog: MatDialog,
    private clienteService: ClienteService,
    private funcionarioService: FuncionarioService,
    private ItensVdService: ItensVdService,
    private productService: ProductService
  ) {
    this.venda = data as any;
    if (!this.venda.cliente) {
      this.venda.cliente = {} as ICliente;
    }
    this.tagVd = data.tagVd;
    this.tagItemVd = data.tagItemVd;
    this.fase = data.fase;

    this.produtoControl = new FormControl();
    this.quantidadeControl = new FormControl(
      this.itensVd?.qtdVendidas || 1,      [Validators.required, Validators.min(1)]
    );

    console.log('Dados em OpenSales ', data)
  }


  ngOnInit(): void {
    if (this.data) {
      this.fase = this.data.fase;
      this.venda = this.data.venda;
      this.itensVd = this.data.itensVd;
      if (!this.venda.cliente) {
        this.venda.cliente = {} as ICliente;
      }
      this.updateTotal();
    }
    this.listarProdutvenda();
    this.setupAutocompleteFilters();
    this.clienteControl.setValue(this.venda?.cliente.nomeCliente || '');
    this.funcionarioControl.setValue(this.venda?.nomeFuncionario || '');
    if (this.itensVd && this.itensVd.qtdVendidas) {
      // emitEvent: false evita que o subscribe abaixo seja disparado desnecessariamente na inicialização
      this.quantidadeControl.setValue(this.itensVd.qtdVendidas, { emitEvent: false });
    }

    this.quantidadeControl.valueChanges.subscribe(novoValor => {
      // Verifica se o valor é válido antes de atribuir
      if (this.venda?.itensVd) {
        this.venda.itensVd.qtdVendidas = novoValor;
        this.updateTotal();
      }
    });
    // Se estiver editando, força o cálculo inicial do total
    if (this.tagItemVd) {
      this.updateTotal();
    }
  }

  ngOnDestroy() {
    // this.destroy$.next();
    this.destroy$.complete();
  }

  // =============== Autocomplete for multiple elements ==================
 setupAutocompleteFilters() {
    this.funcionarioFilted = this.funcionarioControl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(value =>
        typeof value === 'string' && value.length >= 1
          ? this.funcionarioService.getFuncionarioPorNome(value)
          : of([])
      ),
      catchError(() => of([])),
      takeUntil(this.destroy$)
    );

    this.clientesFiltradvenda = this.clienteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(value =>
        typeof value === 'string' && value.length >= 1
          ? this.clienteService.getClientePorNome(value)
          : of([])
      ),
      catchError(() => of([])),
      takeUntil(this.destroy$)
    );
  }

  selecionarCliente(): void {
    this.dialogRef.close(this.clientes);
  }

  listarProdutvenda() {
    this.productService.getTodosProdutos().pipe(
      first(),delay(1000),
      catchError(error => {
        if(this.verificarSeccao(error))
        this.tokenServer.clearTokenExpired();
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe((produtvenda: iProduto[]) => {
      this.produtvenda = produtvenda;
      this.produtoFiltered = produtvenda;
    });
  }

  filterProdutvenda(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.produtoFiltered = this.produtvenda.filter(p =>
      p.nomeProduto.toLowerCase().includes(valor)
    );
  }

  onProdutoSelecionado(produto: iProduto): void {
    if (produto) {
      this.itensVd.codProduto = produto.codProduto;
      this.itensVd.descricao = produto.nomeProduto;
      this.itensVd.valVenda = produto.valorVenda;
      this.updateTotal();
    }
  }

  updateTotal() {
    const qtd = Number(this.itensVd.qtdVendidas);
    const valor = Number(this.itensVd.valVenda);
    this.itensVd.valorParcial = qtd * valor || 0;
  }

  formatarDataParaBackend(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${pad(date.getDate())}/` +
      `${pad(date.getMonth() + 1)}/` +
      `${date.getFullYear()} ` +
      `${pad(date.getHours())}:` +
      `${pad(date.getMinutes())}:` +
      `${pad(date.getSeconds())}`;
  }


  iniciarVd(venda: iVendas) {
    const clienteSelecionado: any = this.clienteControl.value;
    const funcionarioSelecionado: any = this.funcionarioControl.value;

    if (!clienteSelecionado || typeof clienteSelecionado === 'string') {
      this.onError('Por favor, selecione um cliente da lista (clique na opção).');
      return;
    }

    if (!funcionarioSelecionado || typeof funcionarioSelecionado === 'string') {
      this.onError('Por favor, selecione um atendente da lista.');
      return;
    }

    console.log('dados Venda ', venda)
    const vendaParaCriar: any = {
      idVenda: null,
      cliente: this.clienteControl.value,
      idFuncionario: funcionarioSelecionado.id_funcionario,
      nomeFuncionario: funcionarioSelecionado.nomeFuncionario,
      dtVenda: this.formatarDataParaBackend(new Date()),
      itensVd: [],
      qtdDeParcelas: 0,
      subtotal: 0,
      desconto: 0,
      totalgeral: 0,
      formasDePagamento: ""
    };

    console.log('Enviando para o banco:', vendaParaCriar);

 this.vendaServices.addVenda(vendaParaCriar).subscribe({
      next: (vendaCriada) => {
        this.notificationMsg.success('Venda iniciada com sucesso!');
        this.dialogRef.close(vendaCriada);
      },
      error: (err) => {
        this.onError('Erro ao criar a Venda no servidor');
        console.error(err);
      }
    });

  }

  save(venda: iVendas) {
    console.log('ClienteControl ', this.clienteControl.value ,
      'funcionario', this.funcionarioControl.value)
    /*  if (this.clienteControl.invalid || this.funcionarioControl.invalid) {
         this.onError('Preencha todvenda venda campvenda obrigatórivenda');
         return;
       }*/

    const cliente: any = this.clienteControl.value;
    const funcionario: any = this.funcionarioControl.value;
    const dataAtual = new Date();
    const statusOs: any = this.statusOsControl.value

    if (cliente && typeof cliente === 'object') {
      venda.cliente.id_cliente = cliente.id_cliente;
      venda.cliente.nomeCliente = cliente.nomeCliente;
    }

    if (funcionario && typeof funcionario === 'object') {
      venda.idFuncionario = funcionario.id_funcionario;
      venda.nomeFuncionario = funcionario.nomeFuncionario;
    }

    venda.dtVenda = venda.dtVenda || dataAtual.toISOString();
    venda.dtVenda = dataAtual.toISOString();
    venda.totalgeral = venda.totalgeral || 0;
    //venda.status = typeof statusVd === 'object' ? statusVd : statusVd;
    venda.itensVd = this.itensVd;


    console.log(' Vd antes de enviar:', venda,'Id da Venda',
      venda.idVenda);

    if (!venda.idVenda) {
      this.vendaServices.addVenda(venda).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (vendaCriada) => {
            this.dialogRef.close(vendaCriada);
          },
          error: (err) => {
            this.onError('Erro ao criar a Venda');
            console.error(err);
          }
        });
    } else {
      this.vendaServices.updateVd(venda).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (vendaAtualizada) => {
            this.dialogRef.close(vendaAtualizada);
          },
          error: (err) => {
            this.onError('Erro ao atualizar a Venda');
            console.error(err);
          }
        });
    }

  }

  addItem() {
    const produtoSelecionado = this.produtoControl.value;
    if ( this.produtoControl.invalid || this.quantidadeControl.invalid) {
      this.onError("Selecione o produto e uma quantidade válida.");
      return;
    }
    const novoItem: iItensVd = {
      idItensVd: null as any, // item novo sempre inicia com 0
      codVenda: this.venda.idVenda ?? 0,
      codProduto: String(produtoSelecionado.codProduto),
      descricao: String(produtoSelecionado.nomeProduto),
      valCompra: Number(produtoSelecionado.valorCompra),
      valVenda: Number(produtoSelecionado.valorVenda),
      qtdVendidas: Number(this.quantidadeControl.value),
      descPorUnidade: 0,
      valorParcial: Number(produtoSelecionado.valorVenda) * Number(this.quantidadeControl.value),
      dtRegistro: ""
    };

  if(novoItem.idItensVd == null || novoItem.codVenda !== 0){
      this.ItensVdService.createElements(novoItem).subscribe({
        next: (itemCriado) => {
          this.notificationMsg.warn('Item adicionado!');
          // FECHE PASSANDO O ITEM CRIADO
          this.dialogRef.close(itemCriado);
         // this.venda.itensVd.push(novoItem); // só para UI
          this.updateTotal();
        },
        error: (err) => this.onError("Erro ao salvar item")
      });
    }
    this.voltar();
  //  this.dialogRef.close();
    /* limpa venda campvenda
    this.produtoControl.reset();*/
  }

  editarItem(itensVd: iItensVd) {
    const dto = {
      idItensVd: itensVd.idItensVd,
      codVenda: itensVd.codVenda,
      codProduto: itensVd.codProduto,
      descricao: itensVd.descricao,
      valCompra: itensVd.valCompra,
      valVenda: itensVd.valVenda,
      qtdVendidas: itensVd.qtdVendidas,
      descPorUnidade: itensVd.descPorUnidade,
      valorParcial: itensVd.valVenda * itensVd.qtdVendidas,
      dtRegistro: itensVd.dtRegistro,
      fotoProduto: itensVd.fotoProduto,
      highlighted: itensVd.highlighted

    };

    this.ItensVdService.editElement(dto).subscribe({
      next: (res) => this.dialogRef.close(res),
      error: (err) => console.error("Erro detalhado:", err)
    });
  }


  removeItem(item: iItensVd) {
    const index = this.itensVd$.indexOf(item);
    if (index >= 0) {
      this.itensVd$.splice(index, 1);
    }
  }

  displayCli(cliente: ICliente): string {
    return cliente ? cliente.nomeCliente : '';
  }

  displayStatus(status: string): string {
    return status ? status : '';
  }

  displayFunc(func: IFuncionario): string {
    return func ? func.nomeFuncionario : '';
  }

  displayPd(produto: iProduto): string {
    return produto ? produto.nomeProduto : '';
  }


  verificarSeccao(error:any){
    if (error === 'Session Expired')
      this.onError('Sua sessão expirou!');
    return of([])
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
    this.onCancel();
  }

  onCancel() {
    this.voltar();
    this.dialogRef.close();
  }

  voltar(): void {
    if (this.etapa === 2) {
      this.etapa = 1;
    }
  }

  formatter(value: number): string {
    return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);
  }
  // Método que valida se o botão "Salvar" deve ser habilitado

  isSaveButtonDisabled(): boolean {
    // Se for edição de item (Fase 4), não precisamos validar o produtoControl (pois ele nem aparece)
    if (this.fase === 'editarItemVd') {
      return !this.quantidadeControl.valid;
    }
    // Se for inclusão (Fase 3), validamos ambos
    return !(this.produtoControl.valid && this.quantidadeControl.valid);
  }
  /* isSaveButtonDisabled(): boolean {
    return !(this.produtoControl.valid && this.quantidadeControl.valid);
  }*/


  formatarData(dataString: string): Date {
    return new Date(dataString);
  }

}
