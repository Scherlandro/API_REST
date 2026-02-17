import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {iServiceOrder} from "../interfaces/service-order";
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class OrdemDeServicosService {

  private baseUrl: string = environment.API_PATH +'api/service-orders';
  constructor(private http: HttpClient) {}

  getAll(): Observable<iServiceOrder[]> {
    return this.http.get<iServiceOrder[]>(this.baseUrl+ '/all');
  }

  getStatus(termo: string): Observable<string[]> {
    const listaStatus = [
      'OS_em_Andamento',
      'OS_Autorizada_Aberta',
      'OS_Autorizada_Fechada',
      'OS_Não_Autorizada_Aberta',
      'OS_Não_Autorizada_Fechada'
    ];
    const filtrados = listaStatus.filter(s =>
      s.toLowerCase().includes(termo.toLowerCase())
    );
    return of(filtrados); // Retorna como Observable
  }

  getById(id: number): Observable<iServiceOrder> {
    return this.http.get<iServiceOrder>(`${this.baseUrl}/findOSById/${id}`);
  }

  create(order: iServiceOrder): Observable<iServiceOrder> {
    console.log('Criando os', order);
    return this.http.post<iServiceOrder>(this.baseUrl, order);
  }

  update( order: iServiceOrder): Observable<iServiceOrder> {
  console.log('Chegou no service', order);
    return this.http.put<iServiceOrder>(this.baseUrl, order);
  }

  search(params: any): Observable<iServiceOrder[]> {
    return this.http.get<iServiceOrder[]>(this.baseUrl + '/search', { params });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`);
  }

}
