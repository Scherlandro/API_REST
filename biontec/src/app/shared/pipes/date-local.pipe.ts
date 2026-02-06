import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateLocalBR'
})
export class DateLocalPipe implements PipeTransform {

  transform(value: any): string | null {
    if (!value) return null;

    let dateObj: Date;

    if (typeof value === 'string' && value.includes('/')) {

      const [data, hora] = value.split(' ');
      const [dia, mes, ano] = data.split('/');

     const [h, m, s] = hora ? hora.split(':') : [0, 0, 0];
      dateObj = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(h), Number(m), Number(s));
    } else {
      dateObj = new Date(value);
    }

    if (isNaN(dateObj.getTime())) return value;

    const dp = new DatePipe('pt-BR');
    return dp.transform(dateObj, 'dd/MM/yyyy');
  }
}
