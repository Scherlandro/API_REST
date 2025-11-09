// currency-brl.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyBrl'
})
export class CurrencyBrlPipe implements PipeTransform {
  transform(value: number | string): string {
    const numero = typeof value === 'string' ? parseFloat(value) : value;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

/*  exemplo para html:  <td mat-cell *matCellDef="let elementVd"> {{elementVd.preco | currencyBrl}} </td>*/
}
