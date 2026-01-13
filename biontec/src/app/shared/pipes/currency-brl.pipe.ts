import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyBRL'
})
export class CurrencyBRLPipe implements PipeTransform {

  transform(valor: any): string {
    if (valor === null || valor === undefined) return "R$ 0,00";

    let numero: number;

    if (typeof valor === 'number') {
      numero = valor;
    } else {
      const stringValor = String(valor)
        .replace(/[^\d,.-]/g, '')
        .replace(',', '.');
      numero = parseFloat(stringValor);
    }

    if (isNaN(numero)) return "R$ 0,00";

    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
