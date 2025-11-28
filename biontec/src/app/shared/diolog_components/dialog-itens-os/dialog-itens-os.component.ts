import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {catchError, of, Subject, takeUntil} from 'rxjs';
import {ItensOsService} from "../../../services/itens-os.service";
import {ProductService} from "../../../services/product.service";
import {iProduto} from "../../../interfaces/product";
import {iItensOS} from "../../../interfaces/itens-os";
import {TokenService} from "../../../services/token.service";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-dialog-editor-itens-os',
  templateUrl: './dialog-itens-os.component.html',
  styleUrls: ['./dialog-itens-os.component.css']
})
export class DialogItensOSComponent implements OnInit {
  isChange!: boolean;
  destroy$ = new Subject<void>();
  produtos: iProduto[] = [];
  produtoFiltered: iProduto[] = [];
  produtoControl: FormControl;
  quantidadeControl: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public itensOS: iItensOS,
    private tokenServer: TokenService,
    public dialogRef: MatDialogRef<DialogItensOSComponent>,
    private itensOsService: ItensOsService,
    private prodService: ProductService
  ) {
    this.produtoControl = new FormControl(null, [Validators.required]);
    this.quantidadeControl = new FormControl(null, [Validators.required, Validators.min(1)]); // Validação para quantidade
  }


  ngOnInit(): void {
    this.listarProdutos();
  //  this.configurarAutocomplete();

    if (this.itensOS.codProduto) {
      this.isChange = true;
      this.preencherCamposEdicao();
    }

  }


  listarProdutos() {
    this.prodService.getTodosProdutos()
      .pipe( catchError(error => {
        if (error === 'Session Expired') {
          this.onError('Sua sessão expirou!');
          this.tokenServer.clearTokenExpired();
        }
          return of([]);
        })
      )
      .subscribe((res: iProduto[]) => {
        this.produtos = res;
        this.produtoFiltered = res;
      });
  }
/*

  configurarAutocomplete(): void {
    // Configura o filtro em tempo real
    this.produtoControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.nomeProduto),
        map(nome => nome ? this.filtrarProdutos(nome) : this.produtos.slice())
      )
      .subscribe(produtosFiltrados => {
        this.produtoFiltered = produtosFiltrados;
      });
  }

  filtrarProdutos(nome: string): iProduto[] {
    const filterValue = nome.toLowerCase();
    return this.produtos.filter(produto =>
      produto.nomeProduto.toLowerCase().includes(filterValue)
    );
  }
*/

   filterProdutos(event: Event): void {
     const input = event.target as HTMLInputElement;
     const valor = input.value;

     if (valor) {
       this.produtoFiltered = this.produtos.filter(p =>
         p.nomeProduto.toLowerCase().includes(valor.toLowerCase()));
     } else {
       this.produtoFiltered = this.produtos.slice();
     }
   }

     onProdutoSelecionado(produto: iProduto): void {
       if (produto) {
         this.updateItemFields(produto);
       }
     }

  displayPd(produto: iProduto): string {
    return produto ? produto.nomeProduto : '';
  }

  onError(message: string): void {
    console.error(message);
  }

  onCancel(): void {
    this.dialogRef.close();
  }


  save(item: iItensOS) {
    if (this.produtoControl.valid && this.quantidadeControl.valid) {

      if (this.isChange && item.idItensDaOS) {
        this.itensOsService.editItem(item)
          .pipe(takeUntil(this.destroy$)
          ).subscribe({
          next: (i) => {
            this.dialogRef.close(i);
          },
          error: (err) => {
            this.onError('Erro ao atualizar a OS');
            console.error(err);
          }
        });
      } else {
        this.itensOsService.adicionarItem(item).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (i) => {
            this.dialogRef.close(i);
          },
          error: (err) => {
            this.onError('Erro ao adicionar item');
            console.error(err);
          }
        });
      }
    }
  }

  preencherCamposEdicao(): void {
    // Encontrar o produto correspondente ao código
    const produto = this.produtos.find(p => p.codProduto === this.itensOS.codProduto);
    if (produto) {
      this.produtoControl.setValue(produto);
      this.updateItemFields(produto);
    }
  }

  // Função para atualizar os campos do itensOS com base no produto selecionado
  updateItemFields(produto: iProduto) {
    this.itensOS.codProduto = produto.codProduto;
    this.itensOS.descricao = produto.nomeProduto;
    this.itensOS.valorUnitario = produto.valorVenda;
    this.updateTotal(); // Atualiza o total
  }


  // Função para atualizar o total com base no preço de venda e quantidade
  updateTotal() {
    if (this.itensOS.valorUnitario && this.itensOS.quantidade) {
      this.itensOS.total = this.itensOS.valorUnitario * this.itensOS.quantidade;
    } else {
      this.itensOS.total = 0;
    }
  }


  formatter(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL' }).format(value);
  }

  // Método que valida se o botão "Salvar" deve ser habilitado
  isSaveButtonDisabled(): boolean {
    return !(this.produtoControl.valid && this.quantidadeControl.valid);
  }

}

