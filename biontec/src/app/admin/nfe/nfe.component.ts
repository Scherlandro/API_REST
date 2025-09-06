import { Component } from '@angular/core';
import {NfeService} from "../../services/nfe-service.service";

@Component({
  selector: 'app-nfe',
  templateUrl: './nfe.component.html',
  styleUrls: ['./nfe.component.css']
})
export class NfeComponent {
  nfesPendentes: any[] = [];
  resultadoProcessamento: string = '';
  usuario: string = 'usuario_teste';
  dataReferencia: Date = new Date();

  constructor(private nfeService: NfeService) { }

  ngOnInit(): void {
    this.carregarNfesPendentes();
  }

  carregarNfesPendentes(): void {
    this.nfeService.getNfesPendentes().subscribe(
      data => this.nfesPendentes = data,
      error => console.error('Erro ao carregar NF-es:', error)
    );
  }

  processarNfe(idNfe: number): void {
    this.nfeService.processarNfe(idNfe, this.usuario).subscribe(
      resultado => {
        this.resultadoProcessamento = resultado;
        this.carregarNfesPendentes();
      },
      error => this.resultadoProcessamento = `Erro: ${error.message}`
    );
    console.log('this.resultadoProcessamento', this.resultadoProcessamento);
  }

  processarLote(): void {
    this.nfeService.processarLote(this.dataReferencia, this.usuario).subscribe(
      resultado => {
        this.resultadoProcessamento = resultado;
        this.carregarNfesPendentes();
      },
      error => this.resultadoProcessamento = `Erro: ${error.message}`
    );
  }

  calcularImposto(idNfe: number): void {
    this.nfeService.calcularImposto(idNfe).subscribe(
      imposto => alert(`Imposto calculado: R$ ${imposto.toFixed(2)}`),
      error => alert(`Erro ao calcular imposto: ${error.message}`)
    );
  }
}
